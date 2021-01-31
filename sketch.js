var canvasWidth = 640;
var canvasHeight = 480;

var player = 0;
var playerX = 300;
var playerY = 100;
var sprWidth = 64;
var sprHeight = 64;
var speed = 4;


var monster = 0;
var monsterX = 300;
var monsterY = 300;

var ghost = 0;
var ghostX = 100;
var ghostY = 100;

var golden = 0;
var goldenX = 100;
var goldenY = 100;


var projectile = 0;

var direction = 90;

var score = 0;

var song;



function preload() {
    var equip = localStorage.getItem("equipedSkin");
    var skins = localStorage.getItem("ownedSkins");
    if(equip === "devil" && skins.includes("devil")) {
        playerImg = loadImage("images/devil_egg.png");
    } else if(equip === "tophat" && skins.includes("tophat")) {
        playerImg = loadImage("images/tophat_egg.png");
    } else {
        playerImg = loadImage("images/egg.png")
    }
    bgImg = loadImage("images/egg_wars.png");
    monsterImg = loadImage("images/cenemy.png");
    ghostImg = loadImage("images/cenemy.png");
    projectileImg = loadImage("images/egg_shot.png");
    goldenImg = loadImage("images/g_chicken.png");
    //song = loadSound("music/Egg Wars Game Music.mp3", loaded);
    
    
}


function setup() {
    createCanvas(canvasWidth, canvasHeight);
    player = createSprite(playerX, playerY, sprWidth, sprHeight);
    player.addImage(playerImg, "images/egg.png");
    monster = createSprite(monsterX, monsterY, sprWidth, sprHeight);
    monster.addImage(monsterImg, "images/cenemy.png");
    ghost = createSprite(ghostX, ghostY, sprWidth, sprHeight);
    ghost.addImage(ghostImg, "images/cenemy.png");
    golden = createSprite(goldenX, goldenY, sprWidth, sprHeight);
    golden.addImage(goldenImg, "images/g_chicken.png");

    
    projectile = new Group();
    
    enemy = new Group();
    enemy.add(monster);
    enemy.add(ghost);
    
    player.setCollider("rectangle", 0, 0, 20, 20);
    monster.setCollider("rectangle", 0 , 0, 20, 20);
    ghost.setCollider("rectangle", 0, 0, 20, 20);
    golden.setCollider("rectangle", 0, 0, 40, 40);
    
    
    
    for (var i = 0; i < 20; i++) {
        var ang = random(360);
        var px = canvasWidth/2 + 10000 * ang;
         var py = canvasHeight/2 + 10000 * ang;
        createEnemy(px, py);
    }
    
}



//function loaded() {
    //song.play();
    //song.loop();
//}


function playerControls() {
    if (keyIsDown(RIGHT_ARROW)) {
        player.position.x += speed;
         if (player.position.x + sprWidth/2 > canvasWidth) { 
             player.position.x = canvasWidth - sprWidth/2; 
         }
    } else if (keyIsDown(LEFT_ARROW)) {
        player.position.x -= speed;
         if (player.position.x < 0 + sprWidth/2) { 
             player.position.x = 0 + sprWidth/2; 
         }
    } else if (keyIsDown(DOWN_ARROW)) {
        player.position.y += speed;
        if ( player.position.y + sprHeight/2> canvasHeight) {
            player.position.y = canvasHeight - sprHeight/2;
        }
          
    } else if (keyIsDown(UP_ARROW)) {
        player.position.y -= speed;
        if (player.position.y < 0 + sprHeight/2) { 
        player.position.y = 0 + sprHeight/2;
        }
         
    } else if (keyIsDown(87)) {
        player.position.y -= speed;
        if (player.position.y < 0 + sprHeight/2) { 
        player.position.y = 0 + sprHeight/2;
        }
    } else if (keyIsDown(65)) {
        player.position.x -= speed;
        if (player.position.x < 0 + sprWidth/2) { 
            player.position.x = 0 + sprWidth/2; 
        }
    } else if (keyIsDown(83)) {
        player.position.y += speed;
        if ( player.position.y + sprHeight/2> canvasHeight) {
            player.position.y = canvasHeight - sprHeight/2;  
        }
    } else if (keyIsDown(68)) {
    player.position.x += speed;
    if (player.position.x + sprWidth/2 > canvasWidth) { 
        player.position.x = canvasWidth - sprWidth/2; 
        }  
}
}

function enemyMovements() {
    direction += 2;
    monster.setSpeed(3, direction);
}

function collisions() {
    enemy.overlap(projectile, destroyOther);
    player.collide(enemy, gameOver);
    //player.collide(ghost, gameOver);
    //ghost.overlap(projectile, destroyOther);
}

function destroyOther (destroyed) {
    destroyed.remove();
    projectile.remove();
    score++;
}

function gameOver() {
    var highscore = localStorage.getItem("highscore");
    if(score >= highscore) {
        localStorage.setItem("highscore", score)
    }
    var previousBal = localStorage.getItem("coins");
    var toAdd;
    if(score <= 5) {
        toAdd = 2;
    } else if(score <=10) {
        toAdd = 4;
    } else {
        toAdd = 6;
    }
    var newBal = Number(previousBal) + toAdd;
    localStorage.setItem("coins", newBal);
    localStorage.setItem("score", score)
    window.location.href="lost.html";
    //alert("GAME OVER! Final Score: " + score);
    //window.location.reload();
    clearInterval(interval);
}

function mousePressed() {
    projectile = createSprite(player.position.x, player.position.y);
    projectile.addImage(projectileImg);
    projectile.attractionPoint(10+speed, mouseX, mouseY);
    projectile.setCollider("rectangle", 0, 0, 40, 40);
}

function createEnemy(x,y) {
    var newEnemy = createSprite(x,y);
    var attackImg = loadImage("images/cenemy.png");
    newEnemy.addImage(attackImg);
    newEnemy.setSpeed(2.5, random(500));
    newEnemy.setCollider("rectangle", 0, 0, 40, 40);
    enemy.add(newEnemy);
    newEnemy.attractionPoint(0.2, player.position.x, player.position.y);
    newEnemy.maxSpeed = 8;
    
}

function Cgolden() {
   console.log("This player has gotten the golden chicken.")
}



function draw() {
    background(bgImg);
    playerControls();
    drawSprites();
    collisions();
    enemyMovements();
    ghost.attractionPoint(0.2, player.position.x, player.position.y);
    ghost.maxSpeed = 6; 
    
    for(var i=0; i<enemy.length; i++) {
        var s = enemy[i];
        if (s.position.x < -40) s.position.x = canvasWidth +40;
        if (s.position.x > canvasWidth + 40) s.position.x = -40;
        if (s.position.y < -40) s.position.y = canvasHeight +40;
        if (s.position.y > canvasHeight + 40) s.position.y = -40;
    }
    
    if (score >= 20) {
        var highscore = localStorage.getItem("highscore");
    if(score >= highscore) {
        localStorage.setItem("highscore", score)
    }
    var previousCoins = localStorage.getItem("coins");
    var newBal = previousCoins + 10;
    localStorage.setItem("coins", newBal);
        localStorage.setItem("score", "20")
         alert("You Win! Final Score: " + score+". Nice job!");
        score = 0;
        window.location.reload();
        clearInterval(interval);
    }
    
        
    }





setInterval(draw, 10);