window.onload = init;

var map;
var ctxMap;

var pl;
var ctxPl;

var emenyCvs;
var ctxEnemy;

var drawBtn;
var clearBtn;

var gameWidth = 800;
var gameHeight = 500;

var background = new Image();
background.src = 'bg/bg.png';

var tiles = new Image();
tiles.src = 'bg/player.png';

var player = new Player;
var enemy = new Enemy;

var isPlaying;

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
	
	pl.width = gameWidth;
	pl.height = gameHeight;

	enemyCvs.width = gameWidth;
	enemyCvs.height = gameHeight;

	drawBtn = document.getElementById("drawBtn");
	clearBtn = document.getElementById("clearBtn");

	drawBtn.addEventListener("click", drawRect, false);
	clearBtn.addEventListener("click", clearRect, false);

	drawBg();
	starLoop();

	document.addEventListener("keydown", checkKeyDown, false);
	document.addEventListener("keyup", checkKeyUp, false);
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
}

function stopLoop(){
	isPlaying = false;

}

function draw(){
	player.draw();
	enemy.draw();
}

function update(){
	player.update();
	enemy.update();
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
	this.drawX = Math.floor(Math.random() * 10) + gameWidth;
	this.drawY = Math.floor(Math.random() * gameHeight);
	this.width = 78;
	this.height = 44;

	this.speed = 8;
}

Enemy.prototype.draw = function(){
	clearCtxEnemy();
	ctxEnemy.drawImage(tiles,this.srcX,this.srcY,this.width,this.height,
		this.drawX,this.drawY,this.width,this.height)
}
Enemy.prototype.update = function(){
	this.drawX -= 1;
	if(this.drawX<0){
		this.drawX = Math.floor(Math.random() * 10) + gameWidth;
		this.drawY = Math.floor(Math.random() * gameHeight);
	}
}

Player.prototype.draw = function(){
	clearCtxPlayer();
	ctxPl.drawImage(tiles,this.srcX,this.srcY,this.width,this.height,
		this.drawX,this.drawY,this.width,this.height)
}

Player.prototype.update = function(){
	if (this.drawX < 0) this.drawX = 0;
	if (this.drawX > gameWidth - this.width) this.drawX = gameWidth - this.width;
	if (this.drawY < 0) this.drawY = 0;
	if (this.drawY > gameHeight - this.height) this.drawY = gameHeight - this.height;
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

function drawBg(){
	ctxMap.drawImage(background,0,0,800, 500,
		0,0,gameWidth,gameHeight)
}

