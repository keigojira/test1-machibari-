const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const balloons = [];
const needles = [];
let score = 0;
let gameActive = false;

class Balloon {
    constructor(x, speed) {
        this.x = canvas.height;
        this.y = y;
        this.speed = speed;
        this.radius = 20;
        this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
    }

    move() {
        this.y -= this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    isPopped(needle) {
        return Math.hypot(this.x - needle.x, this.y - needle.y) < this.radius;
    }
}

class Needle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 50;
    }

    move() {
        this.y -= this.speed;
    }

    draw() {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x - 2, this.y, 4, 10);
    }
}

function spawnBalloon() {
    if (!gameActive) return;
    let x = Math.random() * (canvas.width - 40) + 20;
    let speed = Math.random() * 2 + 1;
    balloons.push(new Balloon(x, speed));
    setTimeout(spawnBalloon, Math.random() * 1500 + 500);
}

function shootNeedle(event) {
    if (!gameActive) return;
    let x = event.offsetX;
    let y = canvas.height - 10;
    needles.push(new Needle(x, y));
}

function updateGame() {
    if (!gameActive) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    balloons.forEach(balloon => balloon.move());
    needles.forEach(needle => needle.move());

    balloons.forEach(balloon => balloon.draw());
    needles.forEach(needle => needle.draw());

    for (let i = balloons.length - 1; i >= 0; i--) {
        for (let j = needles.length - 1; j >= 0; j--) {
            if (balloons[i].isPopped(needles[j])) {
                balloons.splice(i, 1);
                needles.splice(j, 1);
                score++;
                document.getElementById("score").textContent = `スコア: ${score}`;
                break;
            }
        }
    }

    balloons.forEach((balloon, i) => {
        if (balloon.y + balloon.radius < 0) balloons.splice(i, 1);
    });

    needles.forEach((needle, i) => {
        if (needle.y < 0) needles.splice(i, 1);
    });

    requestAnimationFrame(updateGame);
}

function startGame() {
    score = 0;
    document.getElementById("score").textContent = `スコア: 0`;
    balloons.length = 0;
    needles.length = 0;
    gameActive = true;
    spawnBalloon();
    updateGame();

    setTimeout(() => {
        gameActive = false;
        alert(`ゲーム終了！スコア: ${score}`);
    }, 30000);
}

canvas.addEventListener("click", shootNeedle);
