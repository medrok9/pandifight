const centerCircle = document.getElementById('center-circle');
const dot = document.getElementById('dot');
const healthBar = document.getElementById('health');
const courier = document.getElementById('courier');

let health = 100;
let healing = false;
const maxHealth = 100;
const healRate = 0.5; // Heal per ms
const damageRate = 0.1; // Damage per ms

function updateHealthBar() {
    healthBar.style.width = `${health}%`;
    if (health <= 0) {
        health = 0;
        alert('Game Over!');
        health = maxHealth; // Reset for replay
        updateHealthBar();
    }
}

function moveCourier() {
    const edge = ['top', 'bottom', 'left', 'right'];
    const randomEdge = edge[Math.floor(Math.random() * edge.length)];
    switch (randomEdge) {
        case 'top':
            courier.style.top = '0px';
            courier.style.left = `${Math.random() * window.innerWidth}px`;
            break;
        case 'bottom':
            courier.style.top = `${window.innerHeight - 20}px`;
            courier.style.left = `${Math.random() * window.innerWidth}px`;
            break;
        case 'left':
            courier.style.left = '0px';
            courier.style.top = `${Math.random() * window.innerHeight}px`;
            break;
        case 'right':
            courier.style.left = `${window.innerWidth - 20}px`;
            courier.style.top = `${Math.random() * window.innerHeight}px`;
            break;
    }
}

function checkCollision() {
    const dotRect = dot.getBoundingClientRect();
    const circleRect = centerCircle.getBoundingClientRect();

    const isInside = !(dotRect.right < circleRect.left ||
                        dotRect.left > circleRect.right ||
                        dotRect.bottom < circleRect.top ||
                        dotRect.top > circleRect.bottom);

    if (isInside) {
        health = Math.min(maxHealth, health + healRate);
        healing = true;
    } else {
        health -= damageRate;
        healing = false;
    }
    updateHealthBar();
}

function moveDot(event) {
    dot.style.left = `${event.clientX - 10}px`;
    dot.style.top = `${event.clientY - 10}px`;
}

document.addEventListener('mousemove', moveDot);

setInterval(() => {
    moveCourier();
}, 5000);

setInterval(checkCollision, 50);
