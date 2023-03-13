//board
var blockSize = 20;
var rows = 35;
var cols = 30;
var board;
var context;
//score
var score = 0;
//other
var poisonX;
var poisonY;
var deathX;
var deathY;
//snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

//food
var foodX;
var foodY;
var bonusfoodX;
var bonusfoodY;

var gameOver = false;

window.onload = function() {
  board = document.getElementById("board");
  board.height = rows * blockSize;
  board.width = cols * blockSize;
  context = board.getContext("2d"); //used for drawing on the board
  placeFood();
  placeOtherFood();
  placePoison();
  setInterval(placeObstacle, 1000);
  document.addEventListener("keyup", changeDirection);
  setInterval(update, 1000 / 10)
  setInterval(updateButtons, 1000 / 100);
}
function updateButtons(){
  if (gameOver === false){
document.getElementById("whar").style.display = 'none';
} else {
document.getElementById("whar").style.display = 'inline';
}
}
function update() {
  if (gameOver) {
    return;
  }
  
  
  
  
  context.fillStyle = "black";
  context.fillRect(0, 0, board.width, board.height);

  context.fillStyle = "lime";
  context.fillRect(foodX, foodY, blockSize, blockSize);
  context.fillStyle = "orange";
  context.fillRect(bonusfoodX, bonusfoodY, blockSize, blockSize);
  context.fillStyle = "purple";
  context.fillRect(poisonX, poisonY, blockSize, blockSize);
    context.fillStyle = "red";
  context.fillRect(deathX, deathY, blockSize, blockSize);

  if (snakeX == foodX && snakeY == foodY) {
    snakeBody.push([foodX, foodY]);
    score++
    document.getElementById("score").innerHTML = 'Score:' + score;
    placeFood();
  }
  if (snakeX == bonusfoodX && snakeY == bonusfoodY) {
    snakeBody.push([bonusfoodX, bonusfoodY]);
    score++
    score++
    document.getElementById("score").innerHTML = 'Score:' + score;
    placeOtherFood();
  }
  if (snakeX == poisonX && snakeY == poisonY) {
    snakeBody.pop([poisonX, poisonY]);
    score--
    document.getElementById("score").innerHTML = 'Score:' + score;
    placePoison();
  }
  if (bonusfoodX == foodX && bonusfoodY == foodY) {
    placeFood();
    placeOtherFood();
  }
  if (bonusfoodX == poisonX && bonusfoodY == poisonY) {
    placePoison();
    placeOtherFood();
  }
  if (foodX == poisonX && foodY == poisonY) {
    placePoison();
    placeFood();
  }
  if (snakeX == deathX && snakeY == deathY) {
  gameOver = true;
  alert("Try not to touch the obstacles.")
  }
  if (bonusfoodX == poisonX && bonusfoodY == poisonY && foodX == poisonX && foodY == poisonY) {
    placePoison();
    placeOtherFood();
    placeFood();
  }
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }

  context.fillStyle = "blue";
  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;
  context.fillRect(snakeX, snakeY, blockSize, blockSize);
  for (let i = 0; i < snakeBody.length; i++) {
    context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
  }

  //game over conditions
  if (snakeX < 0 || snakeX > cols * blockSize || snakeY < 0 || snakeY > rows * blockSize) {
    gameOver = true;
    alert("GG");
  }

  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
      gameOver = true;
      alert("GG");
    }
  }
}

function changeDirection(e) {
  if (e.code == "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.code == "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.code == "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.code == "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
}


function placeFood() {
  //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
  foodX = Math.floor(Math.random() * cols) * blockSize;
  foodY = Math.floor(Math.random() * rows) * blockSize;
}

function placeOtherFood() {
  //(0-1) * cols -> (0-19.9999) -> (0-19) * 25

  bonusfoodX = Math.floor(Math.random() * cols) * blockSize;
  bonusfoodY = Math.floor(Math.random() * rows) * blockSize;
}

function placePoison() {
  poisonX = Math.floor(Math.random() * cols) * blockSize;
  poisonY = Math.floor(Math.random() * rows) * blockSize;
}
function placeObstacle() {
  deathX = Math.floor(Math.random() * cols) * blockSize;
  deathY = Math.floor(Math.random() * rows) * blockSize;
}
