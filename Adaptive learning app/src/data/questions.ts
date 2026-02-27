export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Section = 'Aptitude' | 'Logical Reasoning' | 'Verbal' | 'Coding';

export interface Question {
  id: string;
  section: Section;
  difficulty: Difficulty;
  text: string;
  options: string[];
  correctAnswer: string;
}

export const questions: Question[] = [
  // Aptitude - Easy
  { id: 'a-e-1', section: 'Aptitude', difficulty: 'Easy', text: 'What is 15% of 200?', options: ['20', '30', '40', '50'], correctAnswer: '30' },
  { id: 'a-e-2', section: 'Aptitude', difficulty: 'Easy', text: 'If a train travels 60 km in 1 hour, how far will it travel in 2.5 hours?', options: ['120 km', '150 km', '180 km', '200 km'], correctAnswer: '150 km' },
  { id: 'a-e-3', section: 'Aptitude', difficulty: 'Easy', text: 'Solve: 8 + 2 * 5', options: ['50', '18', '20', '15'], correctAnswer: '18' },
  
  // Aptitude - Medium
  { id: 'a-m-1', section: 'Aptitude', difficulty: 'Medium', text: 'A shopkeeper sells an item for $120, making a 20% profit. What was the cost price?', options: ['$90', '$100', '$110', '$115'], correctAnswer: '$100' },
  { id: 'a-m-2', section: 'Aptitude', difficulty: 'Medium', text: 'The average of 5 numbers is 20. If one number is removed, the average becomes 18. What is the removed number?', options: ['22', '24', '26', '28'], correctAnswer: '28' },
  { id: 'a-m-3', section: 'Aptitude', difficulty: 'Medium', text: 'A can do a piece of work in 10 days and B in 15 days. How long will they take working together?', options: ['5 days', '6 days', '8 days', '12 days'], correctAnswer: '6 days' },
  
  // Aptitude - Hard
  { id: 'a-h-1', section: 'Aptitude', difficulty: 'Hard', text: 'A vessel contains 60 liters of milk. 6 liters are drawn out and replaced with water. This process is repeated twice more. How much milk is left?', options: ['43.74 L', '45.5 L', '48 L', '50.2 L'], correctAnswer: '43.74 L' },
  { id: 'a-h-2', section: 'Aptitude', difficulty: 'Hard', text: 'In a 100m race, A beats B by 10m and C by 13m. In a race of 180m, B will beat C by:', options: ['5.4m', '6m', '7.2m', '8m'], correctAnswer: '6m' },
  { id: 'a-h-3', section: 'Aptitude', difficulty: 'Hard', text: 'Find the unit digit of 7^105.', options: ['1', '3', '7', '9'], correctAnswer: '7' },

  // Logical Reasoning - Easy
  { id: 'l-e-1', section: 'Logical Reasoning', difficulty: 'Easy', text: 'Find the next number in the series: 2, 4, 6, 8, ...', options: ['10', '12', '14', '16'], correctAnswer: '10' },
  { id: 'l-e-2', section: 'Logical Reasoning', difficulty: 'Easy', text: 'If A is the brother of B, and B is the sister of C, how is A related to C?', options: ['Brother', 'Sister', 'Cousin', 'Uncle'], correctAnswer: 'Brother' },
  { id: 'l-e-3', section: 'Logical Reasoning', difficulty: 'Easy', text: 'Which word does not belong?', options: ['Apple', 'Banana', 'Carrot', 'Mango'], correctAnswer: 'Carrot' },

  // Logical Reasoning - Medium
  { id: 'l-m-1', section: 'Logical Reasoning', difficulty: 'Medium', text: 'Look at this series: 36, 34, 30, 28, 24, ... What number should come next?', options: ['20', '22', '23', '26'], correctAnswer: '22' },
  { id: 'l-m-2', section: 'Logical Reasoning', difficulty: 'Medium', text: 'If "CAT" is coded as "3120", how is "DOG" coded?', options: ['4157', '4147', '4158', '4167'], correctAnswer: '4157' },
  { id: 'l-m-3', section: 'Logical Reasoning', difficulty: 'Medium', text: 'Pointing to a photograph, a man said, "I have no brother or sister but that man\'s father is my father\'s son." Whose photograph was it?', options: ['His own', 'His son\'s', 'His father\'s', 'His nephew\'s'], correctAnswer: 'His son\'s' },

  // Logical Reasoning - Hard
  { id: 'l-h-1', section: 'Logical Reasoning', difficulty: 'Hard', text: 'Six people are sitting in a circle facing the center. A is between B and C. D is between E and F. B is to the immediate right of E. Who is to the immediate right of C?', options: ['A', 'D', 'E', 'F'], correctAnswer: 'F' },
  { id: 'l-h-2', section: 'Logical Reasoning', difficulty: 'Hard', text: 'In a certain code language, "123" means "bright little boy", "145" means "tall big boy" and "637" means "beautiful little flower". Which digit means "bright"?', options: ['1', '2', '3', '4'], correctAnswer: '2' },
  { id: 'l-h-3', section: 'Logical Reasoning', difficulty: 'Hard', text: 'A clock is set right at 8 a.m. The clock gains 10 minutes in 24 hours. What will be the true time when the clock indicates 1 p.m. on the following day?', options: ['12:48 p.m.', '12:50 p.m.', '1:10 p.m.', '1:12 p.m.'], correctAnswer: '12:48 p.m.' },

  // Verbal - Easy
  { id: 'v-e-1', section: 'Verbal', difficulty: 'Easy', text: 'Choose the synonym for "Happy".', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correctAnswer: 'Joyful' },
  { id: 'v-e-2', section: 'Verbal', difficulty: 'Easy', text: 'Identify the noun in the sentence: "The quick brown fox jumps over the lazy dog."', options: ['quick', 'brown', 'fox', 'jumps'], correctAnswer: 'fox' },
  { id: 'v-e-3', section: 'Verbal', difficulty: 'Easy', text: 'Choose the correct spelling.', options: ['Recieve', 'Receive', 'Receve', 'Resieve'], correctAnswer: 'Receive' },

  // Verbal - Medium
  { id: 'v-m-1', section: 'Verbal', difficulty: 'Medium', text: 'Choose the antonym for "Obscure".', options: ['Hidden', 'Clear', 'Dark', 'Confusing'], correctAnswer: 'Clear' },
  { id: 'v-m-2', section: 'Verbal', difficulty: 'Medium', text: 'Fill in the blank: "She is good ___ mathematics."', options: ['in', 'at', 'with', 'about'], correctAnswer: 'at' },
  { id: 'v-m-3', section: 'Verbal', difficulty: 'Medium', text: 'What is the meaning of the idiom "Bite the bullet"?', options: ['To eat quickly', 'To face a difficult situation bravely', 'To be angry', 'To give up'], correctAnswer: 'To face a difficult situation bravely' },

  // Verbal - Hard
  { id: 'v-h-1', section: 'Verbal', difficulty: 'Hard', text: 'Choose the word most similar in meaning to "Ephemeral".', options: ['Eternal', 'Transient', 'Solid', 'Luminous'], correctAnswer: 'Transient' },
  { id: 'v-h-2', section: 'Verbal', difficulty: 'Hard', text: 'Identify the grammatical error: "Neither the manager nor the employees was aware of the change."', options: ['Neither', 'nor', 'was', 'aware'], correctAnswer: 'was' },
  { id: 'v-h-3', section: 'Verbal', difficulty: 'Hard', text: 'Which word best completes the sentence: "The politician\'s speech was so ___ that the audience was completely captivated."', options: ['Mundane', 'Soporific', 'Riveting', 'Pedestrian'], correctAnswer: 'Riveting' },

  // Coding - Easy
  { id: 'c-e-1', section: 'Coding', difficulty: 'Easy', text: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Text Machine Language', 'Hyperlink and Text Markup Language', 'Home Tool Markup Language'], correctAnswer: 'Hyper Text Markup Language' },
  { id: 'c-e-2', section: 'Coding', difficulty: 'Easy', text: 'Which symbol is used for single-line comments in JavaScript?', options: ['//', '/*', '<!--', '#'], correctAnswer: '//' },
  { id: 'c-e-3', section: 'Coding', difficulty: 'Easy', text: 'What is the output of `console.log(typeof [])` in JavaScript?', options: ['array', 'object', 'list', 'undefined'], correctAnswer: 'object' },

  // Coding - Medium
  { id: 'c-m-1', section: 'Coding', difficulty: 'Medium', text: 'What is the time complexity of binary search?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(log n)' },
  { id: 'c-m-2', section: 'Coding', difficulty: 'Medium', text: 'Which of the following is NOT a valid HTTP method?', options: ['GET', 'POST', 'FETCH', 'DELETE'], correctAnswer: 'FETCH' },
  { id: 'c-m-3', section: 'Coding', difficulty: 'Medium', text: 'In Python, what does the `yield` keyword do?', options: ['Returns a value and exits the function', 'Pauses execution and returns a generator', 'Throws an exception', 'Imports a module'], correctAnswer: 'Pauses execution and returns a generator' },

  // Coding - Hard
  { id: 'c-h-1', section: 'Coding', difficulty: 'Hard', text: 'What is the worst-case time complexity of Quicksort?', options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(log n)'], correctAnswer: 'O(n^2)' },
  { id: 'c-h-2', section: 'Coding', difficulty: 'Hard', text: 'Which design pattern ensures a class has only one instance and provides a global point of access to it?', options: ['Factory', 'Observer', 'Singleton', 'Decorator'], correctAnswer: 'Singleton' },
  { id: 'c-h-3', section: 'Coding', difficulty: 'Hard', text: 'In React, what is the primary purpose of the `useMemo` hook?', options: ['To fetch data from an API', 'To memoize a callback function', 'To memoize an expensive computation', 'To manage global state'], correctAnswer: 'To memoize an expensive computation' },
];
