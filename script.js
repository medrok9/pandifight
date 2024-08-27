const centerCircle = document.getElementById('center-circle');
const dot = document.getElementById('dot');
const healthBar = document.getElementById('health');

let health = 100;
const maxHealth = 100;
const healRate = 5; // Heal per 50 ms
const damageRate = 5; // Damage per 50 ms
const healRadius = 30; // Smaller radius of the center circle
const dotSize = 30; // Size of the dot cursor
const pushStrength = 2; // Reduced strength of the push effect

let gameStarted = false;
let collisionInterval;
let pushInterval;

// Update health bar
function updateHealthBar() {
    health = Math.max(0, Math.min(maxHealth, health)); // Clamp health between 0 and maxHealth
    healthBar.style.width = `${health}%`;

    if (health <= 0) {
        alert('Game Over!');
        health = maxHealth; // Reset health
        updateHealthBar();
        clearInterval(collisionInterval); // Stop checking collision
        clearInterval(pushInterval); // Stop pushing effect
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

    const deltaX = dotCenterX - circleCenterX;
    const deltaY = dotCenterY - circleCenterY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    if (distance <= healRadius) {
        health += healRate;
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

// Apply a gradual push effect to keep the dot outside of the center circle
function applyPushEffect() {
    if (!gameStarted) return;

    const dotRect = dot.getBoundingClientRect();
    const circleRect = centerCircle.getBoundingClientRect();

    const dotCenterX = dotRect.left + dotRect.width / 2;
    const dotCenterY = dotRect.top + dotRect.height / 2;
    const circleCenterX = circleRect.left + circleRect.width / 2;
    const circleCenterY = circleRect.top + circleRect.height / 2;

    const deltaX = dotCenterX - circleCenterX;
    const deltaY = dotCenterY - circleCenterY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    if (distance < healRadius) {
        // Calculate push vector
        const pushX = (deltaX / distance) * pushStrength;
        const pushY = (deltaY / distance) * pushStrength;

        // Update dot's position to apply the push effect
        let newLeft = parseFloat(dot.style.left) - pushX;
        let newTop = parseFloat(dot.style.top) - pushY;

        // Prevent the dot from moving out of bounds
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;

        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft + dotSize > containerWidth) newLeft = containerWidth - dotSize;
        if (newTop + dotSize > containerHeight) newTop = containerHeight - dotSize;

        dot.style.left = `${newLeft}px`;
        dot.style.top = `${newTop}px`;
    }
}

// Start the game after a delay
function startGame() {
    gameStarted = true;
    collisionInterval = setInterval(checkCollision, 50); // Check collision every 50 ms
    pushInterval = setInterval(applyPushEffect, 10); // Apply push effect every 10 ms
}

// Initialize game
document.addEventListener('mousemove', moveDot);

// Start the game 5 seconds after the page loads
setTimeout(startGame, 5000);
