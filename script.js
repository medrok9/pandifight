const centerCircle = document.getElementById('center-circle');
const dot = document.getElementById('dot');
const healthBar = document.getElementById('health');

let health = 100;
const maxHealth = 100;
const healRate = 0.5; // Heal per ms
const damageRate = 0.1; // Damage per ms
const healRadius = 50; // Radius of the center circle
const dotSize = 30; // Size of the dot cursor

let gameStarted = false;

// Update health bar
function updateHealthBar() {
    healthBar.style.width = `${health}%`;
    if (health <= 0) {
        health = 0;
        alert('Game Over!');
        health = maxHealth; // Reset for replay
        updateHealthBar();
    }
}

// Check collision between dot and center circle
function checkCollision() {
    const dotRect = dot.getBoundingClientRect();
    const circleRect = centerCircle.getBoundingClientRect();

    const dotCenterX = dotRect.left + dotRect.width / 2;
    const dotCenterY = dotRect.top + dotRect.height / 2;
    const circleCenterX = circleRect.left + circleRect.width / 2;
    const circleCenterY = circleRect.top + circleRect.height / 2;

    const distance = Math.sqrt(Math.pow(dotCenterX - circleCenterX, 2) + Math.pow(dotCenterY - circleCenterY, 2));

    if (distance <= healRadius) {
        health = Math.min(maxHealth, health + healRate);
    } else {
        health -= damageRate;
    }
    updateHealthBar();
}

// Move the dot based on mouse position
function moveDot(event) {
    if (!gameStarted) return; // Only move dot if game has started
    dot.style.left = `${event.clientX - dotSize / 2}px`;
    dot.style.top = `${event.clientY - dotSize / 2}px`;
}

// Start the game after a delay
function startGame() {
    gameStarted = true;
    setInterval(checkCollision, 50); // Check collision periodically
}

// Initialize game
document.addEventListener('mousemove', moveDot);

// Start the game 5 seconds after the page loads
setTimeout(startGame, 5000);
