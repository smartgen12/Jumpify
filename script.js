// === إعدادات اللعبة ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

// === متغيرات اللعبة ===
let gameRunning = false;
let score = 0;
let gameSpeed = 5;
let gravity = 0.5;
let isJumping = false;
let isSliding = false;
let slideTimer = 0;

// === شخصيات اللعبة ===
const runner = {
    x: 100,
    y: 200,
    width: 40,
    height: 60,
    speedY: 0,
    color: '#00ffff',
    originalHeight: 60,
    draw() {
        // رسم الشخصية
        ctx.fillStyle = this.color;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;

        // تأثير توهج
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    },
    jump() {
        if (isJumping || isSliding) return;
        this.speedY = -12;
        isJumping = true;
    },
    slide() {
        if (isJumping || isSliding) return;
        this.height = this.originalHeight / 2;
        this.y += this.originalHeight / 2;
        isSliding = true;
        slideTimer = 60; // 60 frame ~ 1 second
    },
    update() {
        // تطبيق الجاذبية
        this.y += this.speedY;
        this.speedY += gravity;

        // العودة إلى الأرض
        if (this.y > 200) {
            this.y = 200;
            this.speedY = 0;
            isJumping = false;
        }

        // إنهاء الانحناء
        if (isSliding) {
            slideTimer--;
            if (slideTimer <= 0) {
                this.height = this.originalHeight;
                this.y -= this.originalHeight / 2;
                isSliding = false;
            }
        }
    }
};

// === عوائق اللعبة ===
const obstacles = [];
let obstacleTimer = 0;

function createObstacle() {
    const types = ['tall', 'short', 'moving'];
    const type = types[Math.floor(Math.random() * types.length)];
    const height = type === 'tall' ? 60 : 40;
    const y = canvas.height - height - 20;

    obstacles.push({
        x: canvas.width,
        y: y,
        width: 30,
        height: height,
        speed: gameSpeed,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        passed: false
