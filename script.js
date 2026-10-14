// إعدادات كانفس
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// حالة اللعبة
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    speedX: 3,
    speedY: -5,
    gravity: 0.2,
    jumpForce: -10
};

// جسيمات أثر الكرة
const trailParticles = [];
const maxTrailLength = 20;

// جسيمات الخلفية
const bgParticles = [];
for (let i = 0; i < 100; i++) {
    bgParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 0.3,
        size: Math.random() * 1.5,
        direction: Math.random() * Math.PI * 2
    });
}

// عوائق (مثال: مستطيلات)
const obstacles = [
    { x: 200, y: 400, width: 50, height: 100 },
    { x: 400, y: 300, width: 50, height: 150 }
];

// تحديث جسيمات أثر الكرة
function updateTrail() {
    trailParticles.push({ x: ball.x, y: ball.y, alpha: 1, size: ball.radius / 2 });
    if (trailParticles.length > maxTrailLength) {
        trailParticles.shift();
    }
    for (let i = 0; i < trailParticles.length; i++) {
        trailParticles[i].alpha *= 0.9;
        trailParticles[i].size *= 0.95;
    }
}

// تحديث جسيمات الخلفية
function updateBackground() {
    bgParticles.forEach(p => {
        p.x += Math.cos(p.direction) * p.speed;
        p.y += Math.sin(p.direction) * p.speed;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
    });
}

// تحديث حركة الكرة
function updateBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    ball.speedY += ball.gravity;

    // ارتداد عن الحافات
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.speedX *= -1;
    }
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.speedY *= -0.8; // ارتداد
    }
}

// رسم جسيمات الخلفية
function drawBackground() {
    ctx.fillStyle = 'rgba(10, 20, 40, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(100, 200, 255, 0.3)';
    bgParticles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// رسم عوائق مع تأثير التوهج
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.shadowColor = '#ff00ff';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#800080';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        ctx.shadowBlur = 0;
    });
}

// رسم أثر الكرة
function drawTrail() {
    trailParticles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// رسم الكرة
function drawBall() {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

// loop الرئيسية
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateBall();
    updateTrail();
    updateBackground();

    drawBackground();
    drawObstacles();
    drawTrail();
    drawBall();

    requestAnimationFrame(gameLoop);
}

// بدء اللعبة
gameLoop();

// التحكم في الحركة (مثال: قفز عند الضغط على مساحة)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        ball.speedY = ball.jumpForce;
    }
});
