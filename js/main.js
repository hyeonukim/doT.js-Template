/**
 * Main.js - Core application logic for the Interactive Quiz Builder
 * Handles event setup, answer checking, and feedback
 */

// Multiple Choice Question Events
function setupMultipleChoiceEvents() {
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            // Clear previous selections
            options.forEach(opt => opt.classList.remove('selected'));
            
            // Select current option
            option.classList.add('selected');
            
            // Check the radio button
            const radio = option.querySelector('input[type="radio"]');
            radio.checked = true;
        });
    });
}

// Hotspot Question Events
function setupHotspotEvents() {
    const hotspots = document.querySelectorAll('.hotspot');
    
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', () => {
            // Clear previous selections
            hotspots.forEach(hs => hs.classList.remove('selected'));
            
            // Select current hotspot
            hotspot.classList.add('selected');
        });
    });
}

// Drag and Drop Question Events
function setupDragDropEvents() {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropTargets = document.querySelectorAll('.drop-target');
    
    // Setup drag items
    dragItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.dataset.id);
            item.classList.add('dragging');
        });
        
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
    });
    
    // Setup drop targets
    dropTargets.forEach(target => {
        // Prevent default to allow drop
        target.addEventListener('dragover', (e) => {
            e.preventDefault();
            target.classList.add('drag-over');
        });
        
        target.addEventListener('dragleave', () => {
            target.classList.remove('drag-over');
        });
        
        target.addEventListener('drop', (e) => {
            e.preventDefault();
            target.classList.remove('drag-over');
            
            // Get dragged item id
            const itemId = e.dataTransfer.getData('text/plain');
            const draggedItem = document.querySelector(`.drag-item[data-id="${itemId}"]`);
            
            // Clear any previous item in this target
            const existingItem = target.querySelector('.dropped-item');
            if (existingItem) {
                existingItem.remove();
            }
            
            // Create a copy of the dragged item inside the target
            const clonedItem = document.createElement('div');
            clonedItem.classList.add('dropped-item');
            clonedItem.textContent = draggedItem.textContent;
            clonedItem.dataset.id = itemId;
            target.appendChild(clonedItem);
            
            // Hide the original item (optional)
            // draggedItem.style.visibility = 'hidden';
        });
    });
}

// Check the answer based on current question type
function checkAnswer() {
    const questionContainer = document.querySelector('.question-container');
    const questionType = questionContainer.dataset.type;
    const questionId = questionContainer.dataset.id;
    const feedbackElement = document.getElementById('feedback');
    
    let isCorrect = false;
    let feedbackMessage = '';
    
    // Find the current question data
    const currentQuestion = questionData[currentQuestionType].find(q => q.id === questionId);
    
    switch(questionType) {
        case 'multiple-choice':
            isCorrect = checkMultipleChoiceAnswer(currentQuestion);
            break;
        case 'hotspot':
            isCorrect = checkHotspotAnswer(currentQuestion);
            break;
        case 'drag-drop':
            isCorrect = checkDragDropAnswer(currentQuestion);
            break;
    }
    
    // Display feedback
    feedbackElement.style.display = 'block';
    
    if (isCorrect) {
        feedbackElement.innerHTML = '<p>✓ Correct! Good job!</p>';
        feedbackElement.className = 'feedback-correct';
    } else {
        feedbackElement.innerHTML = '<p>✗ Incorrect. Try again or check the answer.</p>';
        feedbackElement.className = 'feedback-incorrect';
    }
}

// Check multiple choice answers
function checkMultipleChoiceAnswer(question) {
    const selectedOption = document.querySelector('input[type="radio"]:checked');
    
    if (!selectedOption) return false;
    
    const selectedIndex = parseInt(selectedOption.value);
    const correctIndex = question.correctAnswer;
    
    // Update UI to show correct/incorrect
    const options = document.querySelectorAll('.option');
    
    options.forEach((option, index) => {
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex && selectedIndex !== correctIndex) {
            option.classList.add('incorrect');
        }
    });
    
    return selectedIndex === correctIndex;
}

// Check hotspot answers
function checkHotspotAnswer(question) {
    const selectedHotspot = document.querySelector('.hotspot.selected');
    
    if (!selectedHotspot) return false;
    
    const isCorrect = selectedHotspot.getAttribute('data-correct') === 'true';
    
    // Update UI to show correct/incorrect
    const hotspots = document.querySelectorAll('.hotspot');
    
    hotspots.forEach(hotspot => {
        if (hotspot.getAttribute('data-correct') === 'true') {
            hotspot.classList.add('correct');
        } else if (hotspot === selectedHotspot && !isCorrect) {
            hotspot.classList.add('incorrect');
        }
    });
    
    // Show feedback for selected hotspot
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.innerHTML = `<p>${selectedHotspot.getAttribute('data-feedback')}</p>`;
    
    return isCorrect;
}

// Check drag and drop answers
function checkDragDropAnswer(question) {
    const dropTargets = document.querySelectorAll('.drop-target');
    let correctCount = 0;
    let totalTargets = dropTargets.length;
    
    dropTargets.forEach(target => {
        const droppedItem = target.querySelector('.dropped-item');
        
        if (!droppedItem) return;
        
        const itemId = parseInt(droppedItem.dataset.id);
        const correctMatch = parseInt(target.dataset.match);
        
        if (itemId === correctMatch) {
            target.classList.add('correct');
            correctCount++;
        } else {
            target.classList.add('incorrect');
        }
    });
    
    return correctCount === totalTargets;
}

// Show the answer for current question
function showAnswer() {
    const questionContainer = document.querySelector('.question-container');
    const questionType = questionContainer.dataset.type;
    const questionId = questionContainer.dataset.id;
    
    // Find the current question data
    const currentQuestion = questionData[currentQuestionType].find(q => q.id === questionId);
    
    switch(questionType) {
        case 'multiple-choice':
            showMultipleChoiceAnswer(currentQuestion);
            break;
        case 'hotspot':
            showHotspotAnswer(currentQuestion);
            break;
        case 'drag-drop':
            showDragDropAnswer(currentQuestion);
            break;
    }
    
    // Display feedback
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.style.display = 'block';
    feedbackElement.innerHTML = '<p>The correct answer is shown above.</p>';
    feedbackElement.className = '';
}

// Show multiple choice answer
function showMultipleChoiceAnswer(question) {
    const options = document.querySelectorAll('.option');
    const correctIndex = question.correctAnswer;
    
    options.forEach((option, index) => {
        option.classList.remove('selected', 'correct', 'incorrect');
        
        if (index === correctIndex) {
            option.classList.add('correct');
            option.querySelector('input[type="radio"]').checked = true;
        }
    });
}

// Show hotspot answer
function showHotspotAnswer(question) {
    const hotspots = document.querySelectorAll('.hotspot');
    
    hotspots.forEach(hotspot => {
        hotspot.classList.remove('selected', 'correct', 'incorrect');
        
        if (hotspot.getAttribute('data-correct') === 'true') {
            hotspot.classList.add('correct');
            hotspot.classList.add('selected');
        }
    });
}

// Show drag and drop answer
function showDragDropAnswer(question) {
    const dropTargets = document.querySelectorAll('.drop-target');
    
    dropTargets.forEach((target, targetIndex) => {
        // Clear previous classes and content
        target.classList.remove('correct', 'incorrect');
        const existingItem = target.querySelector('.dropped-item');
        if (existingItem) {
            existingItem.remove();
        }
        
        // Get correct match for this target
        const correctMatch = parseInt(target.dataset.match);
        const correctItem = question.draggables[correctMatch];
        
        // Create correct item
        const correctElement = document.createElement('div');
        correctElement.classList.add('dropped-item');
        correctElement.textContent = correctItem.text;
        correctElement.dataset.id = correctMatch;
        
        // Add to target
        target.appendChild(correctElement);
        target.classList.add('correct');
    });
}