window.onload = init;

var map;
var ctxMap;

var pl;
var ctxPl;

var emenyCvs;
var ctxEnemy;

var stats;
var ctxStats;

var drawBtn;
var clearBtn;

var gameWidth = 800;
var gameHeight = 500;

var background = new Image();
background.src = 'img/bg.png';

var background1 = new Image();
background1.src = 'img/bg.png';

var tiles = new Image();
tiles.src = 'img/player.png';

var player; 
var enemies = [];

var isPlaying;
var health;

var mapX = 0;
var map1X = gameWidth;

var mouseX;
var mouseY;

var mouseControl = true;

var spawnInterval;
var spawnTime = 5000;
var spawnAmount = 20;

var requstAnimFrame = window.requstAnimationFrame ||
						window.webkitRequestAnimationFrame ||
        				window.mozRequestAnimationFrame    ||
        				window.oRequestAnimationFrame      ||
       					window.msRequestAnimationFrame;

function init(){
	map = document.getElementById("map");
	ctxMap = map.getContext("2d");

	map.width = gameWidth;
	map.height = gameHeight;

	pl = document.getElementById("player");
	ctxPl = pl.getContext("2d");

	enemyCvs = document.getElementById("enemy");
	ctxEnemy = enemyCvs.getContext("2d");

	stats = document.getElementById("stats");
	ctxStats = stats.getContext("2d");
	
	
	pl.width = gameWidth;
	pl.height = gameHeight;

	enemyCvs.width = gameWidth;
	enemyCvs.height = gameHeight;

	stats.width = gameWidth;
	stats.height = gameHeight;

	ctxStats.fillStyle = "#3D3D3D";
	ctxStats.font ="bold 15pt Arial";

	drawBtn = document.getElementById("drawBtn");
	clearBtn = document.getElementById("clearBtn");

	drawBtn.addEventListener("click", drawRect, false);
	clearBtn.addEventListener("click", clearRect, false);

	player = new Player;

	resetHealth();

	
	starLoop();
	
	document.addEventListener("mousemove", mouseMove, false);
	document.addEventListener("click", mouuseClick, false);
	document.addEventListener("keydown", checkKeyDown, false);
	document.addEventListener("keyup", checkKeyUp, false);
}

function mouseMove(e){
	if (!mouseControl){ 
		return;
	}
	mouseX = e.pageX - map.offsetLeft;;
	mouseY = e.pageY - map.offsetTop;
	player.drawX = mouseX-player.width/2;
	player.drawY = mouseY-player.width/2;
	document.getElementById("gameName").innerHTML = "X: "+mouseX+" Y: "+mouseY;
}

function mouuseClick(e){
	if (!mouseControl){
		return;
	}

	document.getElementById("gameName").innerHTML = "Clicked"
}

function resetHealth(){
	health = 100;
}

function spawnEnemy(count){
	for(var i = 0; i < count; i++) {
		enemies[i] = new Enemy();
	}
}

function startCreatingEnemies(){
	stopCreatingEnemies();
	spawnInterval = setInterval(function(){spawnEnemy(spawnAmount)},spawnTime);
}

function stopCreatingEnemies(){
	clearInterval(spawnInterval);
}


function loop(){
	if(isPlaying){
		draw();
		update();
		requstAnimFrame(loop);
	}
}

function starLoop(){
	isPlaying = true;
	loop();
	startCreatingEnemies();
}

function stopLoop(){
	isPlaying = false;

}

function draw(){
	player.draw();

	clearCtxEnemy();

	for(var i = 0; i < enemies.length; i++){
		enemies[i].draw();
	}
}

function update(){
	moveBg();
	drawBg();
	player.update();
	updateStats();

	for(var i = 0; i < enemies.length; i++){
		enemies[i].update();
	}
}

function moveBg(){
	var vel =4;
	mapX -= 4;
	map1X -= 4;
	if (mapX=gameWidth<0) mapX = gameWidth-5;
	if (map1X=gameWidth<0) map1X = gameWidth-5;
}

function Player(){
	this.srcX = 0;
	this.srcY = 0;
	this.drawX = 0;
	this.drawY = 0;
	this.width = 40;
	this.height = 35;
	this.speed = 3;

	this.isUp = false;
	this.isDown = false;
	this.isRight = false;
	this.isLeft = false;

	this.speed = 5;
}

function Enemy(){
	this.srcX = 0;
	this.srcY = 70;
	this.drawX = Math.floor(Math.random() * gameWidth) + gameWidth;
	this.drawY = Math.floor(Math.random() * gameHeight);
	this.width = 78;
	this.height = 44;

	this.speed = 8;
}

Enemy.prototype.draw = function(){
	
	ctxEnemy.drawImage(tiles,this.srcX,this.srcY,this.width,this.height,
		this.drawX,this.drawY,this.width,this.height)
}
Enemy.prototype.update = function(){
	this.drawX -= 7;
	if(this.drawX + this.width < 0){
		this.destroy();
	}
}
Enemy.prototype.destroy = function(){
	enemies.splice(enemies.indexOf(this), 1);
}

Player.prototype.draw = function(){
	clearCtxPlayer();
	ctxPl.drawImage(tiles,this.srcX,this.srcY,this.width,this.height,
		this.drawX,this.drawY,this.width,this.height)
}

Player.prototype.update = function(){
if (health <= 0) {
	resetHealth();
}

	if (this.drawX < 0) this.drawX = 0;
	if (this.drawX > gameWidth - this.width) this.drawX = gameWidth - this.width;
	if (this.drawY < 0) this.drawY = 0;
	if (this.drawY > gameHeight - this.height) this.drawY = gameHeight - this.height;
	
	for(var i = 0; i < enemies.length; i++){
		if(this.drawX >= enemies[i].drawX &&
			this.drawY >= enemies[i].drawY &&
			this.drawX <= enemies[i].drawX + enemies[i].width &&
			this.drawY <= enemies[i].drawY + enemies[i].height){
			health--;
		}
	}

	this.chooseDir();

}

Player.prototype.chooseDir = function(){
	if (this.isUp) 
		this.drawY -= this.speed;
	if (this.isDown) 
		this.drawY += this.speed;
	if (this.isRight) 
		this.drawX += this.speed;
	if (this.isLeft) 
		this.drawX -= this.speed;
	
}

function checkKeyDown(e){
	var keyID = e.keyCode || e.which;
	var keyChar = String.fromCharCode(keyID);

	if (keyChar == "W") {
		player.isUp = true;
		e.preventDefault()
	}
	if (keyChar == "S") {
		player.isDown = true;
		e.preventDefault()
	}
	if (keyChar == "D") {
		player.isRight = true;
		e.preventDefault()
	}
	if (keyChar == "A") {
		player.isLeft = true;
		e.preventDefault()
	}
}
function checkKeyUp(e){
	var keyID = e.keyCode || e.which;
	var keyChar = String.fromCharCode(keyID);

	if (keyChar == "W") {
		player.isUp = false;
		e.preventDefault()
	}
	if (keyChar == "S") {
		player.isDown = false;
		e.preventDefault()
	}
	if (keyChar == "D") {
		player.isRight = false;
		e.preventDefault()
	}
	if (keyChar == "A") {
		player.isLeft = false;
		e.preventDefault()
	}
}





function drawRect(){
	ctxMap.fillStyle = "#3D3D3D";
	ctxMap.fillRect(10,10,100,100);
}

function clearRect(){
	ctxMap.clearRect(0,0,800,500);
}

function clearCtxPlayer(){
	ctxPl.clearRect(0,0,gameWidth,gameHeight);
}
function clearCtxEnemy(){
	ctxEnemy.clearRect(0,0,gameWidth,gameHeight);
}

function updateStats(){
	ctxStats.clearRect(0,0,gameWidth,gameHeight);
	ctxStats.fillText("Health: " + health, 20, 20);
}

function drawBg(){
	ctxMap.clearRect(0,0,gameWidth,gameHeight);
	ctxMap.drawImage(background,0,0,800, 500,
		mapX,0,gameWidth,gameHeight);
	ctxMap.drawImage(background1,0,0,800, 500,
		map1X,0,gameWidth,gameHeight)
}

