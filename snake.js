// snake.js

// Board settings
let blockSize = 20;
const rows = 30;
const cols = 30;
let board;
let context;

// Score and multiplier
let score = 0;
let mult = 1;
let hp = 3;
let gameOver = false;

// Snake settings
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;
let velocityX = 0;
let velocityY = 0;
const snakeBody = [];

// Food and other items
let foodX, foodY, bonusfoodX, bonusfoodY;
let poisonX, poisonY, deathX, deathY, goldX, goldY, copX, copY, hpX, hpY;

// Utility functions
const gE = id => document.getElementById(id);
const gEs = cls => document.getElementsByClassName(cls);

// Initialize the game
window.onload = function() {
  board = gE("board");
  context = board.getContext("2d");
  placeFood();
  setIntervals();
  document.addEventListener("keyup", changeDirection);
  displayAttempts();
  checkHighScore();
  drawLegend();
};

function setIntervals() {
  setInterval(update, 100);
  setInterval(updateHP, 1);
  setInterval(updateButtons, 10);
  setInterval(placeCopper, 666);
  setInterval(placeOtherFood, 1500);
  setInterval(placeObstacle, 1000);
  setInterval(placeGold, 2000);
  setInterval(scoreDeath, 10);
  setInterval(placeHP, 1000);
}

function restart() {
  saveAttempt(score); // Save the score before restarting
  location.reload();
}

function extraInfo() {
  document.querySelectorAll(".extra").forEach(x => {
    x.style.display = (x.style.display === "block" || x.style.display === "inline-block") ? "none" : "block";
  });
}

function checkHighScore() {
  const highScore = localStorage.getItem('highScore');
  if (highScore) {
    gE("bestscore").style.display = 'block';
    gE("bestscore").innerHTML = 'Personal Best: ' + highScore;
  }
}

function updateHP() {
  gE("health").innerHTML = 'Health: ' + hp;
}

function updateButtons() {
  gE("whar").style.display = gameOver ? 'inline' : 'none';
}

function scoreDeath() {
  if (score < 0) {
    gameOver = true;
    alert("Pay attention to your score.");
    score = 0;
  }
}

function update() {
  if (gameOver) return;

  if (hp <= 0) {
    gameOver = true;
    hp = 3;
    alert("Watch your lives.");
  }

  context.fillStyle = "black";
  context.fillRect(0, 0, board.width, board.height);
  drawItems();
  updateSnake();

  // Game over conditions
  if (snakeX < 0 || snakeX > cols * blockSize || snakeY < 0 || snakeY > rows * blockSize) {
    hp--;
    resetSnakePosition();
  }

  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
      while (snakeBody.length > 1) {
        snakeBody.pop();
      }
      hp--;
    }
  }
}

function drawItems() {
  drawRect(foodX, foodY, "lime");
  drawRect(copX, copY, "#b87333");
  drawRect(bonusfoodX, bonusfoodY, "orange");
  drawRect(poisonX, poisonY, "purple");
  drawRect(deathX, deathY, "red");
  drawRect(goldX, goldY, "gold");
  drawRect(hpX, hpY, "pink");
}

function drawRect(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x, y, blockSize, blockSize);
}

function updateSnake() {
  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;
  drawRect(snakeX, snakeY, "blue");

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }

  for (let i = 0; i < snakeBody.length; i++) {
    drawRect(snakeBody[i][0], snakeBody[i][1], "blue");
  }

  // Check for collisions with food and other items
  if (snakeX === foodX && snakeY === foodY) {
    snakeBody.push([foodX, foodY]);
    score += 1 * mult;
    gE("score").innerHTML = 'Score: ' + score;
    placeFood();
  }

  if (snakeX === hpX && snakeY === hpY) {
    hp += 1 * mult;
    placeHP();
  }

  if (snakeX === bonusfoodX && snakeY === bonusfoodY) {
    snakeBody.push([bonusfoodX, bonusfoodY]);
    score += 2 * mult;
    gE("score").innerHTML = 'Score: ' + score;
    placeOtherFood();
  }

  if (snakeX === poisonX && snakeY === poisonY) {
    snakeBody.pop([poisonX, poisonY]);
    score -= 1 * mult;
    gE("score").innerHTML = 'Score: ' + score;
    placePoison();
  }

  if (snakeX === copX && snakeY === copY) {
    score += 50 / mult;
    gE("score").innerHTML = 'Score: ' + score;
    placeCopper();
  }

  if (snakeX === goldX && snakeY === goldY) {
    goldThing();
  }

  if (snakeX === deathX && snakeY === deathY) {
    hp -= 1;
  }

  async function goldThing() {
    mult = 2;
    gE("mult").innerHTML = 'Multiplier: ' + mult;
    placeGold();
    await sleep(10000);
    mult = 1;
    gE("mult").innerHTML = 'Multiplier: ' + mult;
  }
}

function resetSnakePosition() {
  snakeX = blockSize * 5;
  snakeY = blockSize * 5;
  velocityX = 0;
  velocityY = 0;
}

// Event listeners and placement functions
function changeDirection(e) {
  if (e.code === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.code === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.code === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.code === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  } else if (e.code === "KeyS" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.code === "KeyA" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.code === "KeyD" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  } else if (e.code === "KeyW" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.code === "Space") {
    blockChanger();
  }
}

function blockChanger() {
  const key = prompt("Key?", "");
  if (key === "What in the?") {
    blockSize = parseInt(prompt("Block Size?", "20"), 10);
  } else {
    alert("Wrong.");
    blockSize = 20;
  }
}

function placeFood() {
  foodX = getRandomPosition(cols);
  foodY = getRandomPosition(rows);
}

function placeOtherFood() {
  bonusfoodX = getRandomPosition(cols);
  bonusfoodY = getRandomPosition(rows);
}

function placePoison() {
  poisonX = getRandomPosition(cols);
  poisonY = getRandomPosition(rows);
}

function placeObstacle() {
  deathX = getRandomPosition(cols);
  deathY = getRandomPosition(rows);
}

function placeGold() {
  goldX = getRandomPosition(cols);
  goldY = getRandomPosition(rows);
}

function placeHP() {
  hpX = getRandomPosition(cols);
  hpY = getRandomPosition(rows);
}

function placeCopper() {
  copX = getRandomPosition(cols);
  copY = getRandomPosition(rows);
}

function getRandomPosition(max) {
  return Math.floor(Math.random() * max) * blockSize;
}

function saveAttempt(score) {
  const attempts = JSON.parse(localStorage.getItem('attempts')) || [];
  attempts.push({ score: score, date: new Date().toLocaleString() });
  localStorage.setItem('attempts', JSON.stringify(attempts));
  displayAttempts();
}

function displayAttempts() {
  const attempts = JSON.parse(localStorage.getItem('attempts')) || [];
  const attemptList = gE('attemptList');
  const waitingMessage = gE('waiting');

  attemptList.innerHTML = '';

  if (attempts.length > 0) {
    waitingMessage.style.display = 'none';
    attempts.slice(-5).forEach(attempt => {
      const li = document.createElement('li');
      li.textContent = `${attempt.date}: ${attempt.score}`;
      attemptList.appendChild(li);
    });
  } else {
    waitingMessage.style.display = 'block';
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function drawLegend() {
  const legendItems = [
    { id: 'legend-snake', color: 'blue' },
    { id: 'legend-food', color: 'lime' },
    { id: 'legend-bonusfood', color: 'orange' },
    { id: 'legend-poison', color: 'purple' },
    { id: 'legend-death', color: 'red' },
    { id: 'legend-gold', color: 'gold' },
    { id: 'legend-hp', color: 'pink' }
  ];

  legendItems.forEach(item => {
    const canvas = gE(item.id);
    const context = canvas.getContext('2d');
    context.fillStyle = item.color;
    context.fillRect(0, 0, canvas.width, canvas.height);
  });
}
