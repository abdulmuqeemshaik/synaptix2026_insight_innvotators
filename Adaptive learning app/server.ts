import express from 'express';
import { createServer as createViteServer } from 'vite';
import * as xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const USERS_FILE = path.join(DATA_DIR, 'users.xlsx');

// Initialize users.xlsx if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet([]);
  xlsx.utils.book_append_sheet(wb, ws, 'Users');
  const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  fs.writeFileSync(USERS_FILE, buf);
}

// API Routes

// 1. User Authentication
app.post('/api/login', (req, res) => {
  const { email, userId } = req.body;
  
  if (!email || !userId) {
    return res.status(400).json({ error: 'Email and User ID are required' });
  }

  try {
    const buf = fs.readFileSync(USERS_FILE);
    const wb = xlsx.read(buf, { type: 'buffer' });
    const ws = wb.Sheets['Users'];
    const users: any[] = xlsx.utils.sheet_to_json(ws);

    let user = users.find(u => u.email === email && u.userId === userId);

    if (!user) {
      // Register new user
      user = { email, userId, registeredAt: new Date().toISOString() };
      users.push(user);
      
      const newWs = xlsx.utils.json_to_sheet(users);
      wb.Sheets['Users'] = newWs;
      const outBuf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
      fs.writeFileSync(USERS_FILE, outBuf);
    }

    res.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Save Results
app.post('/api/results', (req, res) => {
  const { userId, results, summary } = req.body;
  
  if (!userId || !results || !summary) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  try {
    const resultFile = path.join(DATA_DIR, `results_${userId}.xlsx`);
    
    const wb = xlsx.utils.book_new();
    
    // Summary Sheet
    const summaryWs = xlsx.utils.json_to_sheet([summary]);
    xlsx.utils.book_append_sheet(wb, summaryWs, 'Summary');
    
    // Detailed Results Sheet
    const resultsWs = xlsx.utils.json_to_sheet(results);
    xlsx.utils.book_append_sheet(wb, resultsWs, 'Detailed Results');
    
    const outBuf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    fs.writeFileSync(resultFile, outBuf);

    res.json({ success: true, message: 'Results saved successfully' });
  } catch (error) {
    console.error('Save results error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Get User Results
app.get('/api/results/:userId', (req, res) => {
  const { userId } = req.params;
  const resultFile = path.join(DATA_DIR, `results_${userId}.xlsx`);
  
  if (!fs.existsSync(resultFile)) {
    return res.status(404).json({ error: 'Results not found' });
  }

  try {
    const buf = fs.readFileSync(resultFile);
    const wb = xlsx.read(buf, { type: 'buffer' });
    const summaryWs = wb.Sheets['Summary'];
    const resultsWs = wb.Sheets['Detailed Results'];
    
    const summary = xlsx.utils.sheet_to_json(summaryWs)[0];
    const results = xlsx.utils.sheet_to_json(resultsWs);
    
    res.json({ summary, results });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Admin: Get All Users
app.get('/api/admin/users', (req, res) => {
  try {
    const buf = fs.readFileSync(USERS_FILE);
    const wb = xlsx.read(buf, { type: 'buffer' });
    const ws = wb.Sheets['Users'];
    const users = xlsx.utils.sheet_to_json(ws);
    
    // Check result status for each user
    const usersWithStatus = users.map((u: any) => {
      const resultFile = path.join(DATA_DIR, `results_${u.userId}.xlsx`);
      return {
        ...u,
        hasCompletedAssessment: fs.existsSync(resultFile)
      };
    });
    
    res.json({ users: usersWithStatus });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Admin: Download Results Excel
app.get('/api/admin/download/:userId', (req, res) => {
  const { userId } = req.params;
  const resultFile = path.join(DATA_DIR, `results_${userId}.xlsx`);
  
  if (!fs.existsSync(resultFile)) {
    return res.status(404).send('File not found');
  }
  
  res.download(resultFile, `results_${userId}.xlsx`);
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
