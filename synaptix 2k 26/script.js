// Question Bank with difficulty ratings (1-10) and topics
const questionBank = [
    // Logic (Difficulty 1-3)
    { id: 1, topic: 'logic', difficulty: 2, content: "If all roses are flowers and some flowers fade quickly, which statement must be true?", options: ["All roses fade quickly", "Some roses fade quickly", "No roses fade quickly", "Some flowers are roses"], correct: 3 },
    { id: 2, topic: 'logic', difficulty: 3, content: "Complete the sequence: 2, 6, 12, 20, ?", options: ["28", "30", "32", "24"], correct: 1 },
    { id: 3, topic: 'logic', difficulty: 1, content: "If A is taller than B, and B is taller than C, who is the shortest?", options: ["A", "B", "C", "Cannot determine"], correct: 2 },
    
    // Math (Difficulty 4-6)
    { id: 4, topic: 'math', difficulty: 4, content: "What is the derivative of f(x) = 3x² + 2x?", options: ["6x + 2", "6x² + 2", "3x + 2", "6x"], correct: 0 },
    { id: 5, topic: 'math', difficulty: 6, content: "A train travels 360km in 4 hours. How long will it take to travel 810km at the same speed?", options: ["8 hours", "9 hours", "7.5 hours", "10 hours"], correct: 1 },
    { id: 6, topic: 'math', difficulty: 5, content: "If log₂(x) = 5, what is x?", options: ["25", "10", "32", "64"], correct: 2 },
    
    // Verbal (Difficulty 3-7)
    { id: 7, topic: 'verbal', difficulty: 3, content: "Choose the synonym for 'Ephemeral':", options: ["Eternal", "Temporary", "Complex", "Ancient"], correct: 1 },
    { id: 8, topic: 'verbal', difficulty: 7, content: "Which word best fits: 'The professor's _______ lecture put half the class to sleep.'", options: ["animated", "soporific", "concise", "riveting"], correct: 1 },
    { id: 9, topic: 'verbal', difficulty: 5, content: "Identify the analogy: Book is to Author as?", options: ["Song is to Singer", "Painting is to Museum", "Food is to Chef", "Both A and C"], correct: 3 },
    
    // Spatial (Difficulty 6-9)
    { id: 10, topic: 'spatial', difficulty: 6, content: "How many faces does a dodecahedron have?", options: ["12", "20", "10", "8"], correct: 0 },
    { id: 11, topic: 'spatial', difficulty: 8, content: "If you rotate a cube 90° on X-axis then 90° on Y-axis, how many planes changed?", options: ["2", "3", "1", "0"], correct: 1 },
    { id: 12, topic: 'spatial', difficulty: 9, content: "Which net folds into a tetrahedron?", options: ["3 triangles", "4 triangles", "4 squares", "3 squares"], correct: 1 },
    
    // Advanced Mixed (Difficulty 8-10)
    { id: 13, topic: 'math', difficulty: 9, content: "What is the sum of the infinite series 1/2 + 1/4 + 1/8 + ...?", options: ["1", "2", "0.5", "Infinity"], correct: 0 },
    { id: 14, topic: 'logic', difficulty: 8, content: "In a group of 50 people, 30 speak French, 20 speak German, and 10 speak both. How many speak neither?", options: ["10", "20", "30", "0"], correct: 0 },
    { id: 15, topic: 'verbal', difficulty: 10, content: "What is the meaning of 'sesquipedalian'?", options: ["Ancient", "Concerned with long words", "Six-footed", "Temporary"], correct: 1 }
];

// State Management
let currentState = {
    questionIndex: 0,
    abilityEstimate: 50, // 0-100
    currentDifficulty: 5,
    topicScores: { logic: 50, math: 50, verbal: 50, spatial: 50 },
    history: [],
    streak: 0,
    startTime: null,
    currentQuestion: null
};

let chartInstance = null;

// Initialize Lucide icons
lucide.createIcons();

function startAssessment() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('assessment-screen').classList.remove('hidden');
    currentState.startTime = Date.now();
    loadNextQuestion();
    startTimer();
}

function startTimer() {
    setInterval(() => {
        const elapsed = Math.floor((Date.now() - currentState.startTime) / 1000);
        const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const secs = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById('timer').textContent = `${mins}:${secs}`;
    }, 1000);
}

function getNextQuestion() {
    // Adaptive logic: Select question close to current ability with some variance
    const targetDiff = Math.min(10, Math.max(1, Math.round(currentState.currentDifficulty)));
    const available = questionBank.filter(q => !currentState.history.some(h => h.id === q.id));
    
    if (available.length === 0) return null;
    
    // Find closest difficulty, preferring unused questions
    const scored = available.map(q => ({
        ...q,
        score: Math.abs(q.difficulty - targetDiff) + (Math.random() * 2) // Add randomness
    }));
    
    scored.sort((a, b) => a.score - b.score);
    return scored[0];
}

function loadNextQuestion() {
    if (currentState.questionIndex >= 15) {
        showResults();
        return;
    }

    currentState.currentQuestion = getNextQuestion();
    if (!currentState.currentQuestion) {
        showResults();
        return;
    }

    const q = currentState.currentQuestion;
    
    // Update UI
    document.getElementById('question-text').textContent = q.content;
    document.getElementById('topic-badge').textContent = q.topic.charAt(0).toUpperCase() + q.topic.slice(1);
    document.getElementById('progress-text').textContent = `Question ${currentState.questionIndex + 1}/15`;
    document.getElementById('progress-bar').style.width = `${(currentState.questionIndex / 15) * 100}%`;
    
    // Update difficulty indicator
    const diffContainer = document.getElementById('diff-indicator');
    diffContainer.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const dot = document.createElement('div');
        dot.className = 'difficulty-dot';
        if (i < q.difficulty) {
            dot.classList.add(q.difficulty > 7 ? 'high' : 'active');
        }
        diffContainer.appendChild(dot);
    }
    
    // Render options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'option-card bg-white/5 border border-white/20 rounded-xl p-4 flex items-center gap-3';
        btn.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold border border-white/20">${String.fromCharCode(65 + idx)}</div>
            <span class="flex-1">${opt}</span>
        `;
        btn.onclick = () => handleAnswer(idx, btn);
        optionsContainer.appendChild(btn);
    });
    
    updateStats();
}

function handleAnswer(selectedIndex, element) {
    const q = currentState.currentQuestion;
    const isCorrect = selectedIndex === q.correct;
    const timeTaken = (Date.now() - currentState.startTime) / 1000;
    
    // Visual feedback
    element.classList.add(isCorrect ? 'correct' : 'incorrect');
    document.querySelectorAll('.option-card').forEach((card, idx) => {
        card.style.pointerEvents = 'none';
        if (idx === q.correct) card.classList.add('correct');
    });
    
    // Update adaptive algorithm
    updateAdaptiveModel(isCorrect, q, timeTaken);
    
    // Store result
    currentState.history.push({
        id: q.id,
        correct: isCorrect,
        difficulty: q.difficulty,
        topic: q.topic,
        time: timeTaken
    });
    
    setTimeout(() => {
        currentState.questionIndex++;
        loadNextQuestion();
    }, 1000);
}

function updateAdaptiveModel(isCorrect, question, timeTaken) {
    const topic = question.topic;
    let diffChange = isCorrect ? 1.2 : -0.8;
    
    // Speed bonus/penalty
    if (timeTaken < 10) diffChange *= 1.1;
    if (timeTaken > 60) diffChange *= 0.9;
    
    // Update difficulty (bounded 1-10)
    currentState.currentDifficulty = Math.max(1, Math.min(10, currentState.currentDifficulty + diffChange));
    
    // Update ability estimates using ELO-like system
    const k = 20; // learning rate
    const expected = 1 / (1 + Math.pow(10, (question.difficulty - 50/10) / 2));
    const actual = isCorrect ? 1 : 0;
    const change = k * (actual - expected);
    
    currentState.abilityEstimate = Math.max(0, Math.min(100, currentState.abilityEstimate + change));
    currentState.topicScores[topic] += change * 1.5;
    
    currentState.streak = isCorrect ? currentState.streak + 1 : 0;
}

function updateStats() {
    document.getElementById('current-score').textContent = Math.round(currentState.abilityEstimate) + '%';
    document.getElementById('streak-counter').textContent = currentState.streak;
    
    const accuracy = currentState.history.length > 0 
        ? Math.round((currentState.history.filter(h => h.correct).length / currentState.history.length) * 100)
        : '--';
    document.getElementById('accuracy-rate').textContent = accuracy + (accuracy !== '--' ? '%' : '');
}

function showResults() {
    document.getElementById('assessment-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    
    // Calculate final metrics
    const correct = currentState.history.filter(h => h.correct).length;
    const finalScore = Math.round((correct / currentState.history.length) * 100) || 0;
    
    document.getElementById('final-score').textContent = finalScore + '%';
    
    // Generate description
    let desc = "";
    if (finalScore > 85) desc = "Outstanding performance! You've demonstrated exceptional mastery across multiple domains.";
    else if (finalScore > 70) desc = "Strong performance with good conceptual understanding. Focus on advanced topics.";
    else if (finalScore > 50) desc = "Solid foundation with room for improvement in specific areas.";
    else desc = "Basic understanding established. Recommended: focused practice in weaker topics.";
    
    document.getElementById('mastery-desc').textContent = desc;
    
    // Topic breakdown
    const breakdown = document.getElementById('topic-breakdown');
    breakdown.innerHTML = '';
    
    Object.entries(currentState.topicScores).forEach(([topic, score]) => {
        const normalized = Math.max(0, Math.min(100, Math.round(score)));
        const color = normalized > 70 ? 'text-green-400' : normalized > 40 ? 'text-yellow-400' : 'text-red-400';
        
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between py-2 border-b border-white/10';
        div.innerHTML = `
            <span class="capitalize text-slate-300">${topic}</span>
            <div class="flex items-center gap-3">
                <div class="w-24 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div class="h-full ${normalized > 70 ? 'bg-green-400' : normalized > 40 ? 'bg-yellow-400' : 'bg-red-400'}" style="width: ${normalized}%"></div>
                </div>
                <span class="font-mono ${color}">${normalized}%</span>
            </div>
        `;
        breakdown.appendChild(div);
    });
    
    // Generate recommendation
    const weakest = Object.entries(currentState.topicScores).sort((a,b) => a[1] - b[1])[0];
    const strongest = Object.entries(currentState.topicScores).sort((a,b) => b[1] - a[1])[0];
    document.getElementById('recommendation-text').textContent = 
        `Based on your performance, we recommend advanced ${strongest[0]} challenges while reviewing ${weakest[0]} fundamentals. You showed ${currentState.streak > 3 ? 'excellent consistency' : 'variable performance'} during the assessment.`;
    
    // Render Chart
    renderChart();
}

function renderChart() {
    const ctx = document.getElementById('competency-chart').getContext('2d');
    
    if (chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(currentState.topicScores).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
            datasets: [{
                label: 'Competency Level',
                data: Object.values(currentState.topicScores).map(s => Math.max(0, Math.min(100, s))),
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                borderColor: 'rgba(6, 182, 212, 1)',
                pointBackgroundColor: 'rgba(6, 182, 212, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(6, 182, 212, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: 'rgba(255, 255, 255, 0.7)' },
                    ticks: { display: false, max: 100, min: 0 }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function resetAssessment() {
    currentState = {
        questionIndex: 0,
        abilityEstimate: 50,
        currentDifficulty: 5,
        topicScores: { logic: 50, math: 50, verbal: 50, spatial: 50 },
        history: [],
        streak: 0,
        startTime: Date.now(),
        currentQuestion: null
    };
    
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}

function exportResults() {
    const data = {
        timestamp: new Date().toISOString(),
        scores: currentState.topicScores,
        overall: document.getElementById('final-score').textContent,
        history: currentState.history,
        recommendation: document.getElementById('recommendation-text').textContent
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adaptive-assessment-${Date.now()}.json`;
    a.click();
}