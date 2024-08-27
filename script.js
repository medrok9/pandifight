const centerCircle = document.getElementById('center-circle');
const dot = document.getElementById('dot');
const healthBar = document.getElementById('health');

const dotSize = 30; // Size of the dot cursor
const healRadius = 50; // Radius of the center circle
const pushStrength = 5; // Strength of the push effect
const flingInterval = 3000; // Interval for fling effect (3 seconds)
const gameDuration = 90 * 1000; // Game duration: 1 minute 30 seconds in milliseconds

let health = 100;
const maxHealth = 100;
const healRate = 5; // Heal per 50 ms
const damageRate = 5; // Damage per 50 ms

let gameStarted = false;
let collisionInterval;
let pushInterval;
let flingIntervalID;
let gameTimeoutID;
let isFlinging = false; // Flag to indicate flinging state

// Update health bar
function updateHealthBar() {
    health = Math.max(0, Math.min(maxHealth, health)); // Clamp health between 0 and maxHealth
    healthBar.style.width = `${health}%`;

    if (health <= 0) {
        endGame(); // Call the endGame function when health is 0 or below
    }
}

// End the game and redirect to Google
function endGame() {
    health = maxHealth; // Reset health (optional)
    updateHealthBar();
    clearInterval(collisionInterval); // Stop checking collision
    clearInterval(pushInterval); // Stop pushing effect
    clearInterval(flingIntervalID); // Stop fling effect

    // Redirect to Google
    window.location.href = 'https://www.google.com';
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
    if (!gameStarted || isFlinging) return; // Only move dot if game has started and it's not flinging

    dot.style.left = `${event.clientX - dotSize / 2}px`;
    dot.style.top = `${event.clientY - dotSize / 2}px`;
}

// Apply a smooth push effect to keep the dot outside of the center circle
function applyPushEffect() {
    if (!gameStarted || isFlinging) return; // Skip push effect if flinging

    const dotRect = dot.getBoundingClientRect();
    const circleRect = centerCircle.getBoundingClientRect();

    const dotCenterX = dotRect.left + dotRect.width / 2;
    const dotCenterY = dotRect.top + dotRect.height / 2;
    const circleCenterX = circleRect.left + circleRect.width / 2;
    const circleCenterY = circleRect.top + circleRect.height / 2;

    const deltaX = dotCenterX - circleCenterX;
    const deltaY = dotCenterY - circleCenterY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    if (distance < healRadius + dotSize / 2) {
        // Calculate push vector with adjusted strength
        const pushX = (deltaX / distance) * pushStrength;
        const pushY = (deltaY / distance) * pushStrength;

        // Update dot's position to apply the push effect
        let newLeft = parseFloat(dot.style.left) || 0;
        let newTop = parseFloat(dot.style.top) || 0;

        newLeft += pushX;
        newTop += pushY;

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

// Move the dot to a random edge of the screen
function flingToRandomEdge() {
    if (!gameStarted) return;

    isFlinging = true; // Set flag to indicate flinging is active

    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const edges = ['top', 'bottom', 'left', 'right'];
    const edge = edges[Math.floor(Math.random() * edges.length)];

    switch (edge) {
        case 'top':
            dot.style.top = `0px`;
            dot.style.left = `${Math.random() * (containerWidth - dotSize)}px`;
            break;
        case 'bottom':
            dot.style.top = `${containerHeight - dotSize}px`;
            dot.style.left = `${Math.random() * (containerWidth - dotSize)}px`;
            break;
        case 'left':
            dot.style.left = `0px`;
            dot.style.top = `${Math.random() * (containerHeight - dotSize)}px`;
            break;
        case 'right':
            dot.style.left = `${containerWidth - dotSize}px`;
            dot.style.top = `${Math.random() * (containerHeight - dotSize)}px`;
            break;
    }

    // Allow movement after fling
    setTimeout(() => {
        isFlinging = false;
    }, 50); // Short delay to ensure manual control is restored
}

// Start the game after a delay
function startGame() {
    gameStarted = true;

    // Initialize dot position in the center of the screen
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    dot.style.left = `${(containerWidth - dotSize) / 2}px`;
    dot.style.top = `${(containerHeight - dotSize) / 2}px`;

    collisionInterval = setInterval(checkCollision, 50); // Check collision every 50 ms
    pushInterval = setInterval(applyPushEffect, 10); // Apply push effect every 10 ms
    flingIntervalID = setInterval(flingToRandomEdge, flingInterval); // Fling to random edge every 3 seconds

    // Set a timeout for game duration duh
    gameTimeoutID = setTimeout(() => {
        // Send an internal message when time is up
        window.postMessage('TIME_UP', '*');
    }, gameDuration);
}

// Listen for internal messages
window.addEventListener('message', (event) => {
    if (event.data === 'TIME_UP') {
        // Redirect to example domain when the time is up
        window.location.href = 'https://www.example.com';
    }
});

// Initialize game
document.addEventListener('mousemove', moveDot);

// Start the game 5 seconds after the page loads
setTimeout(startGame, 1000);
