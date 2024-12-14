const timerElement = document.getElementById("timer");
const previewButton = document.getElementById("preview-btn");
const startGameButton = document.getElementById("start-game-btn");
const canvas = document.getElementById("snake-game");
const ctx = canvas.getContext("2d");

// Timer Logic
function updateTimer() {
    const now = new Date();
    const newYear = new Date("January 1, 2025 00:00:00");
    const timeDifference = newYear - now;

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDifference / 1000) % 60);

    timerElement.innerHTML = `
        ${days.toString().padStart(2, "0")}D : 
        ${hours.toString().padStart(2, "0")}H : 
        ${minutes.toString().padStart(2, "0")}M : 
        ${seconds.toString().padStart(2, "0")}S
    `;

    if (timeDifference <= 0) {
        clearInterval(interval);
        triggerCelebration();
    }
}

// Celebration Logic
function triggerCelebration() {
    timerElement.innerHTML = "🎉 Happy New Year 2025! 🥳";
    document.body.style.background = "linear-gradient(to bottom, #ff7e5f, #feb47b)";
    confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// Snake Game Variables
const box = 20;
let snake = [];
let direction = "RIGHT";
let food = {};
let gameInterval;
let isGameOver = false;

function generateFood() {
    let isOnSnake;

    do {
        // Generate random coordinates for food
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box,
        };

        // Check if food overlaps with the snake
        isOnSnake = snake.some(segment => segment.x === food.x && segment.y === food.y);

    } while (isOnSnake); // Regenerate food if it's on the snake
}

// Reset Game
function resetGame() {
    snake = [{ x: box * 5, y: box * 5 }];
    direction = "RIGHT";
    generateFood();
    isGameOver = false;
    startGame();
}

// Start Game
function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    gameInterval = setInterval(drawSnake, 150);
}

// Draw Snake and Food
function drawSnake() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each segment of the snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeStyle = "#2E7D32";
        ctx.strokeRect(segment.x, segment.y, box, box);
    });

    // Draw the food
    ctx.fillStyle = "#f00";
    ctx.fillRect(food.x, food.y, box, box);

    // Calculate the next position of the snake's head
    const head = { ...snake[0] };

    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
        snake.push({...snake[snake.length - 1]});
        generateFood();
    } else {
        snake.pop();
    }

    // Check for wall collision or self collision
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height ||
        snake.some((seg) => seg.x === head.x && seg.y === head.y)
    ) {
        gameOver();
        return;
    }

    // Add the new head to the front of the snake
    snake.unshift(head);
}

// Game Over Logic
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "30px Roboto";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
}

// Prevent page from scrolling when using arrow keys
window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }
});

// Control Directions
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Preview Button Logic
previewButton.addEventListener("click", triggerCelebration);

// Start Game Button Logic
startGameButton.addEventListener("click", resetGame);

// Timer Interval
const interval = setInterval(updateTimer, 1000);
