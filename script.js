const centerCircle = document.getElementById('center-circle');
const dot = document.getElementById('dot');
const healthBar = document.getElementById('health');

let health = 100;
const maxHealth = 100;
const healRate = 20; // Heal per 50 ms
const damageRate = 20; // Damage per 50 ms
const healRadius = 50; // Radius of the center circle
const dotSize = 30; // Size of the dot cursor
const pushStrength = 5; // Strength of the push effect

let gameStarted = false;
let collisionInterval;
let courierInterval;
let pushInterval;

// Update health bar
function updateHealthBar() {
    healthBar.style.width = `${health}%`;
    if (health <= 0) {
        health = 0;
        alert('Game Over!');
        health = maxHealth; // Reset health
        updateHealthBar();
        clearInterval(collisionInterval); // Stop checking collision
        clearInterval(courierInterval); // Stop courier movement
        clearInterval(pushInterval); // Stop pushing effect
    } else if (health > maxHealth) {
        health = maxHealth; // Prevent health from exceeding maxHealth
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

// Apply gentle push effect to the cursor
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

    // Apply push effect if outside the healing radius
    if (distance > healRadius) {
        const pushX = deltaX / distance * pushStrength;
        const pushY = deltaY / distance * pushStrength;
        dot.style.left = `${parseFloat(dot.style.left) + pushX}px`;
        dot.style.top = `${parseFloat(dot.style.top) + pushY}px`;
    }
}

// Move courier to a random edge of the screen
function moveCourier() {
    if (!gameStarted) return;

    const edges = ['top', 'bottom', 'left', 'right'];
    const edge = edges[Math.floor(Math.random() * edges.length)];

    switch (edge) {
        case 'top':
            dot.style.top = `0px`;
            dot.style.left = `${Math.random() * (window.innerWidth - dotSize)}px`;
            break;
        case 'bottom':
            dot.style.top = `${window.innerHeight - dotSize}px`;
            dot.style.left = `${Math.random() * (window.innerWidth - dotSize)}px`;
            break;
        case 'left':
            dot.style.left = `0px`;
            dot.style.top = `${Math.random() * (window.innerHeight - dotSize)}px`;
            break;
        case 'right':
            dot.style.left = `${window.innerWidth - dotSize}px`;
            dot.style.top = `${Math.random() * (window.innerHeight - dotSize)}px`;
            break;
    }
}

// Start the game after a delay
function startGame() {
    gameStarted = true;
    collisionInterval = setInterval(checkCollision, 50); // Check collision every 50 ms
    courierInterval = setInterval(moveCourier, 5000); // Move courier every 5 seconds
    pushInterval = setInterval(applyPushEffect, 50); // Apply push effect every 50 ms
}

// Initialize game
document.addEventListener('mousemove', moveDot);

// Start the game 5 seconds after the page loads
setTimeout(startGame, 5000);
