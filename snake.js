(() => {
  //board
  const blockSize = 20;
  const rows = 30;
  const cols = 30;
  let room = 0;
  let board;
  let context;
  let choosing = Math.floor(Math.random() * 4) + 1;
  //score
  let score = 0;
  let mult = 1;
  //other
  const Epsilon = 8.362748564939345849255739375;
  let poisonX;
  let poisonY;
  let portalX;
  let portalY;
  let portalX2;
  let portalY2;
  let blackHoleX;
  let blackHoleY;
  let neutronX;
  let neutronY;
  let goldX;
  let goldY;
  let hpX;
  let hpY;
  let hp = 3;
  const d = document;
  const gE = function (id) {
    return d.getElementById(id);
  };
  const gEs = function (cls) {
    return d.getElementsByClassName(cls);
  };

  //snake heads
  let snakeX = blockSize * 5;
  let snakeY = blockSize * 5;
  let velocityX = 0;
  let velocityY = 0;

  let snakeBody = [];
  //food
  let foodX;
  let foodY;
  let gameOver = false;

  function getHighScore() {
    // Get Item from LocalStorage or highScore === 0
    let highScore = localStorage.getItem("highScore") || 0;

    // If the user has more points than the currently stored high score then
    if (score > highScore) {
      // Set the high score to the users' current points
      highScore = parseInt(score);
      // Store the high score
      localStorage.setItem("highScore", highScore);
    }

    // Return the high score
    return highScore;
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function updateHighScore() {
    gE("bestscore").innerHTML = "Personal Best:" + localStorage.highScore;
  }
  function updateHP() {
    gE("health").innerHTML = "Health: " + hp;
  }

  window.onload = function () {
    board = gE("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); 
    //used for drawing on the board
    placeFood();
    placePoison();
    setPortals();
    blackHole();
    setInterval(() => {
      if (room == 1 && blackHoleX <= 500 && blackHoleX >= -500) {
        blackHoleX += Math.random() < 0.5 ? 1 - Math.random() * 2 : 1;
      } else {
        blackHoleX -= Math.random() < 0.5 ? 1 + Math.random() * 2 : 1;
      }
      if (room == 1 && blackHoleY <= 500 && blackHoleY >= -500) {
        blackHoleY += Math.random() < 0.5 ? 1 - Math.random() * 2 : 1;
      } else {
        blackHoleY -= Math.random() < 0.5 ? 1 + Math.random() * 2 : 1;
      }
    }, 70);
    Neutron();

    setInterval(reset, 1000000);
    setInterval(placeGold, 2000);
    d.addEventListener("keyup", changeDirection);
    setInterval(update, 1000 / 10);
    setInterval(updateButtons, 1000 / 100);
    setInterval(getHighScore, 1000 / 10);
    setInterval(updateHighScore, 1000 / 10);
    setInterval(updateHP, 1);
    setInterval(placeHP, 1000);
  };
  function updateButtons() {
    if (gameOver === false) {
      gE("whar").style.display = "none";
    } else {
      gE("whar").style.display = "inline";
    }
  }
  function update() {
    if (room == 0) {
      gE("room").innerHTML = "Lobby";
    } else if (room == 1) {
      gE("room").innerHTML = "Outer Space";
    } else if (room == 2) {
      gE("room").innerHtml = "Maze of the Garden";
    } else {
      gE("room").innerHTML = "Unnamed room"
    }
    if (gameOver) {
      return;
    }

    if (hp <= 0) {
      gameOver = true;
      hp = 3;
      alert("Watch your lives.");
    }
    if (room == 0) {
      context.fillStyle = "black";
      context.fillRect(0, 0, board.width, board.height);
      context.fillStyle = "#292727";
      context.fillRect(portalX, portalY, blockSize, blockSize);
      context.fillStyle = "lime";
      context.fillRect(foodX, foodY, blockSize, blockSize);
      context.fillStyle = "purple";
      context.fillRect(poisonX, poisonY, blockSize, blockSize);
      context.fillStyle = "pink";
      context.fillRect(hpX, hpY, blockSize, blockSize);
      portalX = 580;
      portalY = 280;
    } else if (room == 1) {
      context.fillStyle = "#131313";
      context.fillRect(0, 0, board.width, board.height);
      context.fillStyle = "black";
      context.fillRect(portalX, portalY, blockSize, blockSize);
      context.fillStyle = "#658700";
      context.fillRect(portalX2, portalY2, blockSize, blockSize);
      context.fillStyle = "red";
      context.fillRect(foodX, foodY, blockSize, blockSize);
      context.fillStyle = "#212122";
      context.fillRect(blackHoleX, blackHoleY, blockSize, blockSize);
      context.fillStyle = "#00ffff";
      context.fillRect(neutronX, neutronY, blockSize, blockSize);
      portalX = 0;
      portalY = 280;
      portalX2 = 580;
      portalY2 = 280;
    } else if (room == 2) {
      context.fillStyle = "#7aa300";
      context.fillRect(0, 0, board.width, board.height);
      context.fillStyle = "#658700";
      context.fillRect(portalX2, portalY2, blockSize, blockSize);
      context.fillStyle = "red";
      context.fillRect(foodX, foodY, blockSize, blockSize);
      context.fillStyle = "#212122";
      context.fillRect(blackHoleX, blackHoleY, blockSize, blockSize);
      context.fillStyle = "#00ffff";
      context.fillRect(neutronX, neutronY, blockSize, blockSize);
      portalX2 = 0;
      portalY2 = 280;
      let wallArray = [];
      let wall = class {
        constructor(Xpos, Ypos) {
          if (!isNaN(Xpos) && !isNaN(Ypos)) {
            context.fillStyle = "black";
            context.fillRect(Xpos, Ypos, blockSize, blockSize);
            wallArray[wallArray.length] = [Xpos, Ypos];
          } else {
            return;
          }
        }
      };
      if (choosing == 1) {
        new wall(40, 20);
        new wall(60, 20);
        new wall(80, 20);
        new wall(100, 20);
        new wall(120, 20);
        console.log(1);
      } else if (choosing == 2) {
        new wall(60, 0);
        new wall(60, 20);
        new wall(60, 40);
        new wall(60, 60);
        new wall(60, 80);
        new wall(60, 100);
        new wall(60, 120);
        new wall(60, 140);
        new wall(60, 160);
        new wall(60, 180);
        new wall(60, 200);
        new wall(60, 220);
        new wall(60, 240);
        new wall(120, 0);
        new wall(120, 20);
        new wall(120, 80);
        new wall(140, 80);
        new wall(160, 80);
        new wall(140, 20);
        new wall(160, 20);
        new wall(120, 100);
        new wall(120, 120);
        new wall(120, 140);
        new wall(120, 160);
        new wall(120, 180);
        new wall(120, 200);
        new wall(120, 220);
        new wall(120, 240);
        console.log(2);
      } else if (choosing == 3) {
        new wall(20, 20);
        new wall(20, 40);
        new wall(40, 40);
        console.log(3);
      } else if (choosing == 4) {
        new wall(20, 20);
        new wall(40, 20);
        new wall(40, 40);
        new wall(60, 40);
        new wall(60, 60);
        console.log(4);
      }
      for (var i = 0; i < wallArray.length; ++i) {
        var Xpos = wallArray[i][0];
        var Ypos = wallArray[i][1];
        if (snakeX == Xpos && snakeY == Ypos) {
          console.log("it works");
        }
      }
    }

    if (snakeX == portalX && snakeY == portalY && room == 0) {
      room = 1;
      while (snakeBody.length > 0) {
        snakeBody.pop();
      }
      blackHole();
      velocityX = 0;
      velocityY = 0;
      snakeX = 20;
      snakeY = 280;
    } else if (snakeX == portalX && snakeY == portalY && room == 1) {
      room = 0;
      while (snakeBody.length > 0) {
        snakeBody.pop();
      }

      velocityX = 0;
      velocityY = 0;
      snakeX = 560;
      snakeY = 280;
    } else if (snakeX == portalX2 && snakeY == portalY2 && room == 1) {
      room = 2;
      while (snakeBody.length > 0) {
        snakeBody.pop();
      }

      velocityX = 0;
      velocityY = 0;
      snakeX = 20;
      snakeY = 280;
    } else if (snakeX == portalX2 && snakeY == portalY2 && room == 2) {
      room = 1;
      while (snakeBody.length > 0) {
        snakeBody.pop();
      }
      choosing = Math.floor(Math.random() * 4) + 1;
      velocityX = 0;
      velocityY = 0;
      snakeX = 560;
      snakeY = 280;
    }
    if (snakeX == foodX && snakeY == foodY) {
      snakeBody.push([foodX, foodY]);
      score = score + 1 * mult;
      gE("score").innerHTML = "Score:" + score;
      placeFood();
    }
    if (snakeX == hpX && snakeY == hpY) {
      if (!hp === 3) {
        if (mult >= 2) {
          hp += 1.5;
        } else {
          hp++;
        }
        placeHP();
      } else {
        score++;
      }
    }

    if (snakeX == poisonX && snakeY == poisonY) {
      snakeBody.pop([poisonX, poisonY]);
      score = score - 1 * mult;
      gE("score").innerHTML = "Score:" + score;
      placePoison();
      sleep(100).then(() => {
        score = score - 1 * mult;
        gE("score").innerHTML = "Score:" + score;
      });
      sleep(100).then(() => {
        score = score - 1 * mult;
        gE("score").innerHTML = "Score:" + score;
      });
      sleep(100).then(() => {
        score = score - 1 * mult;
        gE("score").innerHTML = "Score:" + score;
      });
    }

    if (snakeX == goldX && goldY == snakeY) {
      goldThing();
    }
    const difference = Math.abs(blackHoleX - snakeX);
    const differencetwo = Math.abs(blackHoleY - snakeY);
    if (difference < Epsilon && differencetwo < Epsilon && room == 1) {
      gameOver = true;
      alert("Avoid the black hole.");
    }
    async function goldThing() {
      mult = 2;
      gE("mult").innerHTML = "Multiplier:" + mult;
      placeGold();
      sleep(10000)
        .then(() => (mult = 1))
        .then(() => (gE("mult").innerHTML = "Multiplier:" + mult))
        .catch((err) => {
          console.log(err);
        });
    }

    if (foodX == poisonX && foodY == poisonY) {
      placePoison();
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

    if (
      snakeX < 0 ||
      snakeX > cols * blockSize ||
      snakeY < 0 ||
      snakeY > rows * blockSize
    ) {
      hp = hp - 1;
      snakeY = 40;
      snakeX = 40;
      velocityX = 0;
      velocityY = 0;
    }

    for (let i = 0; i < snakeBody.length; i++) {
      if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
        if (!hp < 1) {
          snakeBody.pop(snakeBody.length);
        } else {
          hp++;
        }
      }
    }
  }
  function blockChanger() {
    let i = prompt("Key?", "");
    if (i == "goof only") {
      let w = prompt("Block Size?", "20");
      blockSize = w;
    } else if (i != "goof only") {
      alert("nope");
      blockSize = 20;
    } else if (i == null) {
      blockSize = 20;
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
    } else if (e.code == "Space") {
      blockChanger();
    }
  }

  function placeFood() {
    //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
  }

  function blackHole() {
    blackHoleX = Math.floor(Math.random() * cols) * blockSize;
    blackHoleY = Math.floor(Math.random() * rows) * blockSize;
  }
  function Neutron() {
    neutronX = Math.floor(Math.random() * cols) * blockSize;
    neutronY = Math.floor(Math.random() * rows) * blockSize;
  }
  function setPortals() {
    portalX = 580;
    portalY = 280;
    portalX2 = 580;
    portalY2 = 280;
  }
  function placePoison() {
    poisonX = Math.floor(Math.random() * cols) * blockSize;
    poisonY = Math.floor(Math.random() * rows) * blockSize;
  }
  function placeGold() {
    goldX = Math.floor(Math.random() * cols) * blockSize;
    goldY = Math.floor(Math.random() * rows) * blockSize;
  }
  function placeHP() {
    hpX = Math.floor(Math.random() * cols) * blockSize;
    hpY = Math.floor(Math.random() * rows) * blockSize;
  }
  function reset() {
    placeGold();
    placePoison();
    setPortals();
    Neutron();
    placeFood();
    placeHP();
    blackHole();
  }
})();
 
