//board
var blockSize = 20;
let rows = prompt("Length?", "20");
let cols = prompt("Width?", "20");;
var board;
var context;

//score
var score = 0;
var mult = 1;
//other
var poisonX;
var poisonY;
var deathX;
var deathY;
var goldX;
var goldY;
var hp = 3;
function gE(id){
  return document.getElementById(id);
}
function gEs(cls){
  return document.getElementsByClassName(cls);
}

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

function getHighScore() {
  // Get Item from LocalStorage or highScore === 0
  var highScore = localStorage.getItem('highScore') || 0;

  // If the user has more points than the currently stored high score then
  if (score > highScore) {
    // Set the high score to the users' current points
    highScore = parseInt(score);
    // Store the high score
    localStorage.setItem('highScore', highScore);
  }

  // Return the high score
  return highScore;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateHighScore() {
  gE("bestscore").innerHTML = 'Personal Best:' + localStorage.highScore;
}
function updateHP(){
  gE("hp").innerHTML = 'Health: ' + hp;
}
  window.onload = function(){
  board = gE("board");
  board.height = rows * blockSize;
  board.width = cols * blockSize;
  context = board.getContext("2d"); //used for drawing on the board
  placeFood();
  setInterval(placeOtherFood, 1500);
  placePoison();
  setInterval(placeObstacle, 1000);
  setInterval(placeGold, 2000)
  document.addEventListener("keyup", changeDirection);
  setInterval(update, 1000 / 10)
  setInterval(updateButtons, 1000 / 100);
  setInterval(getHighScore, 1000/10);
  setInterval(updateHighScore, 1000/10);
  setInterval(scoreDeath, 1000/100);
  setInterval(updateHP, 1)
  }
function updateButtons(){
  if (gameOver === false){
gE("whar").style.display = 'none';
} else {
gE("whar").style.display = 'inline';
}
}
function scoreDeath(){
  if (score < 0){
    gameOver = true;
    alert("Pay attention to your score.")
    score = 0;
  }
}
function update() {
  if (gameOver) {
    return;
  }
  
  
  
  if (hp <= 0){
    gameOver = true;
    hp = 3;
    alert("Watch your lives.")
  };
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
  context.fillStyle = "gold";
  context.fillRect(goldX, goldY, blockSize, blockSize);

  if (snakeX == foodX && snakeY == foodY) {
    snakeBody.push([foodX, foodY]);
    score = score + 1*mult
    gE("score").innerHTML = 'Score:' + score;
    placeFood();
  }
  if (snakeX == bonusfoodX && snakeY == bonusfoodY) {
    snakeBody.push([bonusfoodX, bonusfoodY]);
    score = score + 1*mult
    score = score + 1*mult
    gE("score").innerHTML = 'Score:' + score;
    placeOtherFood();
  }
  if (snakeX == poisonX && snakeY == poisonY) {
    snakeBody.pop([poisonX, poisonY]);
    score = score - 1*mult
    gE("score").innerHTML = 'Score:' + score;
    placePoison();
  }

  if (snakeX == goldX && goldY == snakeY) {
   goldThing();
  }
  async function goldThing(){
    mult = 2;
    gE("mult").innerHTML = 'Multiplier:' + mult;
    placeGold()
    sleep(10000)
    .then(() => mult = 1)
    .then(() => gE("mult").innerHTML = 'Multiplier:' + mult)

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
  hp = hp - 1;
  
  }
  if (bonusfoodX == poisonX && bonusfoodY == poisonY && foodX == poisonX && foodY == poisonY) {
    placePoison();
    placeOtherFood();
    placeFood();
  }
  if (bonusfoodX == poisonX && bonusfoodY == poisonY && foodX == poisonX && foodY == poisonY && deathX == poisonX && deathY == poisonY) {
    placePoison();
    placeOtherFood();
    placeFood();
    placeObstacle();
  }
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  if (bonusfoodX == goldX && bonusfoodY == goldY && foodX == goldX && foodY == goldY && deathX == goldX && deathY == goldY && poisonX == goldX && poisonY == goldY) {
    placePoison();
    placeOtherFood();
    placeFood();
    placeObstacle();
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
    hp = hp - 1;
    snakeY = 32;
    snakeX = 32;
    velocityX = 0;
    velocityY = 0
  }

  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
      hp = hp - 1;
      snakeX = 32;
      snakeY = 32;
      velocityX = 0;
      velocityY = 0;
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
  } else if (e.code == "KeyS" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.code == "KeyA" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.code == "KeyD" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  } else if (e.code == "KeyW" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
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
function placeGold() {
  goldX = Math.floor(Math.random() * cols) * blockSize;
  goldY = Math.floor(Math.random() * rows) * blockSize;
}
