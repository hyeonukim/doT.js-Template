// Compile templates
const templates = {
    multipleChoice: doT.template(document.getElementById('multiple-choice-template').text),
    hotspot: doT.template(document.getElementById('hotspot-template').text),
    dragDrop: doT.template(document.getElementById('drag-drop-template').text)
};

// Sample question data
const questionData = {
    multipleChoice: [
        {
            id: 'mc1',
            questionText: 'What is the capital of France?',
            options: ['London', 'Berlin', 'Paris', 'Madrid'],
            correctAnswer: 2
        },
        {
            id: 'mc2',
            questionText: 'Which planet is known as the Red Planet?',
            options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
            correctAnswer: 1
        },
        {
            id: 'mc3',
            questionText: 'Which HTML tag is used to create a hyperlink?',
            options: ['<link>', '<a>', '<href>', '<url>'],
            correctAnswer: 1
        }
    ],
    
    hotspot: [
        {
            id: 'hs1',
            questionText: 'Identify the HTML element that creates the largest heading.',
            svgContent: `
                <!-- HTML elements SVG -->
                <rect x="50" y="50" width="300" height="40" fill="#e0e0e0" stroke="#333"/>
                <text x="200" y="75" text-anchor="middle" font-family="monospace">&lt;h1&gt;Heading 1&lt;/h1&gt;</text>
                
                <rect x="50" y="100" width="300" height="40" fill="#e0e0e0" stroke="#333"/>
                <text x="200" y="125" text-anchor="middle" font-family="monospace">&lt;h2&gt;Heading 2&lt;/h2&gt;</text>
                
                <rect x="50" y="150" width="300" height="40" fill="#e0e0e0" stroke="#333"/>
                <text x="200" y="175" text-anchor="middle" font-family="monospace">&lt;p&gt;Paragraph&lt;/p&gt;</text>
                
                <rect x="50" y="200" width="300" height="40" fill="#e0e0e0" stroke="#333"/>
                <text x="200" y="225" text-anchor="middle" font-family="monospace">&lt;div&gt;Division&lt;/div&gt;</text>
            `,
            hotspots: [
                { x: 200, y: 70, correct: true, feedback: "Correct! The h1 element creates the largest heading in HTML." },
                { x: 200, y: 120, correct: false, feedback: "The h2 element creates the second largest heading." },
                { x: 200, y: 170, correct: false, feedback: "The p element creates a paragraph, not a heading." },
                { x: 200, y: 220, correct: false, feedback: "The div element is a generic container, not a heading." }
            ]
        }
    ],
    
    dragDrop: [
        {
            id: 'dd1',
            questionText: 'Match each CSS property with its category.',
            draggables: [
                { text: 'margin' },
                { text: 'color' },
                { text: 'font-size' },
                { text: 'transition' }
            ],
            dropTargets: [
                { label: 'Layout', match: 0 },
                { label: 'Visual', match: 1 },
                { label: 'Typography', match: 2 },
                { label: 'Animation', match: 3 }
            ]
        }
    ]
};

// Current state
let currentQuestionType = 'multipleChoice';
let currentQuestionIndex = 0;

// Function to render a question
function renderQuestion(type, index) {
    const questionContainer = document.getElementById('quiz-container');
    const questionData = getCurrentQuestion(type, index);
    
    // Clear previous question
    questionContainer.innerHTML = '';
    
    // Render new question based on type
    switch(type) {
        case 'multipleChoice':
            questionContainer.innerHTML = templates.multipleChoice(questionData);
            setupMultipleChoiceEvents();
            break;
        case 'hotspot':
            questionContainer.innerHTML = templates.hotspot(questionData);
            setupHotspotEvents();
            break;
        case 'dragDrop':
            questionContainer.innerHTML = templates.dragDrop(questionData);
            setupDragDropEvents();
            break;
    }
    
    // Reset feedback area
    const feedback = document.getElementById('feedback');
    feedback.style.display = 'none';
    feedback.className = '';
    feedback.innerHTML = '';
}

// Get current question data
function getCurrentQuestion(type, index) {
    return questionData[type][index];
}

// Initialize question type buttons
function initQuestionTypeButtons() {
    document.getElementById('mc-btn').addEventListener('click', () => {
        setActiveQuestionType('multipleChoice');
    });
    
    document.getElementById('hotspot-btn').addEventListener('click', () => {
        setActiveQuestionType('hotspot');
    });
    
    document.getElementById('drag-btn').addEventListener('click', () => {
        setActiveQuestionType('dragDrop');
    });
}

// Set active question type
function setActiveQuestionType(type) {
    currentQuestionType = type;
    currentQuestionIndex = 0;
    
    // Update active button
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    switch(type) {
        case 'multipleChoice':
            document.getElementById('mc-btn').classList.add('active');
            break;
        case 'hotspot':
            document.getElementById('hotspot-btn').classList.add('active');
            break;
        case 'dragDrop':
            document.getElementById('drag-btn').classList.add('active');
            break;
    }
    
    renderQuestion(currentQuestionType, currentQuestionIndex);
}

// Initialize control buttons
function initControlButtons() {
    document.getElementById('new-question').addEventListener('click', () => {
        // Get next question index, with wrap-around
        currentQuestionIndex = (currentQuestionIndex + 1) % questionData[currentQuestionType].length;
        renderQuestion(currentQuestionType, currentQuestionIndex);
    });
    
    document.getElementById('check-answer').addEventListener('click', () => {
        checkAnswer();
    });
    
    document.getElementById('show-answer').addEventListener('click', () => {
        showAnswer();
    });
}

// Initialize the templates
function initTemplates() {
    initQuestionTypeButtons();
    initControlButtons();
    renderQuestion(currentQuestionType, currentQuestionIndex);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initTemplates);