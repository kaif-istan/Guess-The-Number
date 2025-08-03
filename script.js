// Game state
let gameState = {
    randomNumber: Math.floor(Math.random() * 100) + 1,
    attempts: 0,
    maxAttempts: 10,
    previousGuesses: [],
    isGameActive: true
};

// DOM elements
const elements = {
    form: document.getElementById('guessForm'),
    input: document.getElementById('guessInput'),
    submitBtn: document.getElementById('submitBtn'),
    resetBtn: document.getElementById('resetBtn'),
    feedbackMessage: document.getElementById('feedbackMessage'),
    attemptsDisplay: document.getElementById('attempts'),
    remainingDisplay: document.getElementById('remaining'),
    guessesList: document.getElementById('guessesList'),
    confettiContainer: document.getElementById('confettiContainer')
};

// Initialize the game
function initGame() {
    updateDisplay();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    elements.form.addEventListener('submit', handleGuess);
    elements.resetBtn.addEventListener('click', resetGame);
    elements.input.addEventListener('input', handleInput);
    elements.input.addEventListener('keypress', handleKeyPress);
}

// Handle form submission
function handleGuess(e) {
    e.preventDefault();
    
    if (!gameState.isGameActive) return;
    
    const guess = parseInt(elements.input.value);
    
    if (validateGuess(guess)) {
        processGuess(guess);
    }
}

// Handle input changes
function handleInput(e) {
    const value = e.target.value;
    
    // Enable/disable submit button based on input
    if (value && !isNaN(value) && value >= 1 && value <= 100) {
        elements.submitBtn.disabled = false;
    } else {
        elements.submitBtn.disabled = true;
    }
}

// Handle key press
function handleKeyPress(e) {
    if (e.key === 'Enter' && !elements.submitBtn.disabled) {
        elements.submitBtn.click();
    }
}

// Validate guess
function validateGuess(guess) {
    if (isNaN(guess)) {
        showFeedback('Please enter a valid number!', 'error');
        return false;
    }
    
    if (guess < 1 || guess > 100) {
        showFeedback('Please enter a number between 1 and 100!', 'error');
        return false;
    }
    
    if (gameState.previousGuesses.includes(guess)) {
        showFeedback('You already guessed that number! Try something else.', 'error');
        return false;
    }
    
    return true;
}

// Process the guess
function processGuess(guess) {
    gameState.attempts++;
    gameState.previousGuesses.push(guess);
    
    // Clear input and focus
    elements.input.value = '';
    elements.input.focus();
    elements.submitBtn.disabled = true;
    
    // Update display
    updateDisplay();
    addGuessToDisplay(guess);
    
    // Check if correct
    if (guess === gameState.randomNumber) {
        handleWin();
    } else if (gameState.attempts >= gameState.maxAttempts) {
        handleLoss();
    } else {
        provideHint(guess);
    }
}

// Provide hint based on guess
function provideHint(guess) {
    let message, type;
    
    if (guess > gameState.randomNumber) {
        message = `Too high! Try a lower number.`;
        type = 'hint';
    } else {
        message = `Too low! Try a higher number.`;
        type = 'hint';
    }
    
    showFeedback(message, type);
}

// Handle win
function handleWin() {
    gameState.isGameActive = false;
    showFeedback(`🎉 Congratulations! You found the number in ${gameState.attempts} attempts!`, 'success');
    elements.input.disabled = true;
    elements.submitBtn.disabled = true;
    elements.resetBtn.style.display = 'block';
    
    // Trigger confetti animation
    createConfetti();
    
    // Add winning animation to the correct guess
    const correctGuessElement = document.querySelector(`[data-guess="${gameState.randomNumber}"]`);
    if (correctGuessElement) {
        correctGuessElement.classList.add('correct');
    }
}

// Handle loss
function handleLoss() {
    gameState.isGameActive = false;
    showFeedback(`😔 Game Over! The number was ${gameState.randomNumber}. Better luck next time!`, 'error');
    elements.input.disabled = true;
    elements.submitBtn.disabled = true;
    elements.resetBtn.style.display = 'block';
}

// Reset game
function resetGame() {
    gameState = {
        randomNumber: Math.floor(Math.random() * 100) + 1,
        attempts: 0,
        maxAttempts: 10,
        previousGuesses: [],
        isGameActive: true
    };
    
    // Reset UI
    elements.input.disabled = false;
    elements.submitBtn.disabled = true;
    elements.resetBtn.style.display = 'none';
    elements.guessesList.innerHTML = '';
    elements.input.focus();
    
    showFeedback('Ready to play? Enter your first guess!', '');
    updateDisplay();
}

// Update display
function updateDisplay() {
    elements.attemptsDisplay.textContent = gameState.attempts;
    elements.remainingDisplay.textContent = gameState.maxAttempts - gameState.attempts;
}

// Show feedback message
function showFeedback(message, type) {
    elements.feedbackMessage.textContent = message;
    elements.feedbackMessage.className = `feedback-message ${type}`;
    
    // Add animation
    elements.feedbackMessage.style.animation = 'none';
    elements.feedbackMessage.offsetHeight; // Trigger reflow
    elements.feedbackMessage.style.animation = 'pulse 0.6s ease';
}

// Add guess to display
function addGuessToDisplay(guess) {
    const guessElement = document.createElement('div');
    guessElement.className = 'guess-item';
    guessElement.textContent = guess;
    guessElement.setAttribute('data-guess', guess);
    
    // Add appropriate class based on guess
    if (guess === gameState.randomNumber) {
        guessElement.classList.add('correct');
    } else if (guess > gameState.randomNumber) {
        guessElement.classList.add('high');
    } else {
        guessElement.classList.add('low');
    }
    
    elements.guessesList.appendChild(guessElement);
}

// Create confetti animation
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#48bb78', '#ed8936', '#e53e3e'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            elements.confettiContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }, i * 100);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

// Add some fun easter egg - show the number in console for debugging
console.log('🎯 The secret number is:', gameState.randomNumber);
console.log('💡 You can check the console to see the number for testing!');