document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.querySelector('.game-area');
    const car = document.querySelector('.car');
    const road = document.querySelector('.road');
    const startScreen = document.querySelector('.start-screen');
    const startButton = document.getElementById('start-button');
    const gameOverScreen = document.querySelector('.game-over-screen');
    const restartButton = document.getElementById('restart-button');
    const scoreElement = document.getElementById('score');
    const finalScoreElement = document.getElementById('final-score');
    const laneMarkers = document.querySelectorAll('.lane-marker');
    const carWidth = 50;
    const roadWidth = 300;
    const roadLeft = (gameArea.clientWidth - roadWidth) / 2;
    let carLeft = roadLeft + (roadWidth - carWidth) / 2;
    car.style.left = `${carLeft}px`;
    const obstacles = [];
    let gameInterval;
    let score = 0;

    gameOverScreen.style.display = 'none';

    const createObstacle = () => {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        const obstacleLeft = roadLeft + Math.random() * (roadWidth - carWidth);
        obstacle.style.left = `${obstacleLeft}px`;
        gameArea.appendChild(obstacle);
        obstacles.push(obstacle);
    };

    const moveCar = (e) => {
        const key = e.key;
        if (key === 'ArrowLeft' && carLeft > roadLeft) {
            carLeft -= 10;
        } else if (key === 'ArrowRight' && carLeft < roadLeft + roadWidth - carWidth) {
            carLeft += 10;
        }
        car.style.left = `${carLeft}px`;
    };

    const moveObstacles = () => {
        obstacles.forEach((obstacle, index) => {
            let obstacleTop = parseInt(window.getComputedStyle(obstacle).getPropertyValue('top'));
            if (obstacleTop > gameArea.clientHeight) {
                obstacle.remove();
                obstacles.splice(index, 1);
                score++; // Tambah skor saat menghindari rintangan
                scoreElement.textContent = score;
            } else {
                obstacle.style.top = `${obstacleTop + 5}px`;
            }

            // Check for collision
            const carRect = car.getBoundingClientRect();
            const obstacleRect = obstacle.getBoundingClientRect();
            if (!(carRect.right < obstacleRect.left || 
                  carRect.left > obstacleRect.right || 
                  carRect.bottom < obstacleRect.top || 
                  carRect.top > obstacleRect.bottom)) {
                clearInterval(gameInterval);
                gameOver();
            }
        });
    };

    const moveLaneMarkers = () => {
        laneMarkers.forEach(marker => {
            let markerTop = parseInt(window.getComputedStyle(marker).getPropertyValue('top'));
            if (markerTop > gameArea.clientHeight) {
                marker.style.top = `-100px`;
            } else {
                marker.style.top = `${markerTop + 5}px`;
            }
        });
    };

    const gameLoop = () => {
        moveLaneMarkers();
        moveObstacles();
        if (Math.random() < 0.02) {
            createObstacle();
        }
    };

    const gameOver = () => {
        finalScoreElement.textContent = score; // Tampilkan skor terakhir di layar Game Over
        gameOverScreen.style.display = 'flex';
        document.removeEventListener('keydown', moveCar);
    };

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        document.addEventListener('keydown', moveCar);
        gameInterval = setInterval(gameLoop, 20);
    });

    restartButton.addEventListener('click', () => {
        gameOverScreen.style.display = 'none';
        location.reload(); // Restart the game by reloading the page
    });
});

// Deklarasi audio untuk musik latar belakang
const backgroundMusic = document.getElementById('background-music');

// Event listener untuk tombol Mulai Game
document.getElementById('start-button').addEventListener('click', function() {
    startGame(); // Memulai permainan
});

// Fungsi untuk memulai permainan
function startGame() {
    // Memulai musik latar belakang
    backgroundMusic.play();

    // Reset logika permainan dan inisialisasi permainan di sini
    console.log(`Memulai permainan dengan level ${currentLevel}`);

    // Mulai menghasilkan halangan
    startObstacles();
}

// Fungsi untuk mengakhiri permainan
function gameOver() {
    // Menghentikan musik latar belakang
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Mengatur ulang waktu musik ke awal

    // Tampilkan layar game over
    document.querySelector('.game-over-screen').style.display = 'flex';
    document.getElementById('final-score').textContent = currentScore;

    // Hentikan menghasilkan halangan
    clearInterval(obstacleInterval);
}

let currentLevel = 1; // Level awal
let obstacleSpeed = 2; // Kecepatan awal halangan (jumlah pixel per frame)
let obstacleInterval = 1500; // Interval awal antara munculnya halangan (dalam milidetik)

// Fungsi untuk mengatur level berdasarkan tombol yang ditekan
function setLevel(level) {
    currentLevel = level;
    document.getElementById('current-level').textContent = currentLevel;

    // Sesuaikan kesulitan halangan berdasarkan level
    switch (level) {
        case 1:
            obstacleSpeed = 2;
            obstacleInterval = 1500;
            break;
        case 2:
            obstacleSpeed = 3;
            obstacleInterval = 1200;
            break;
        case 3:
            obstacleSpeed = 4;
            obstacleInterval = 1000;
            break;
        default:
            obstacleSpeed = 2;
            obstacleInterval = 1500;
    }
}

// Event listener untuk tombol level
document.querySelectorAll('.level-button').forEach(button => {
    button.addEventListener('click', function() {
        setLevel(parseInt(button.dataset.level));
    });
});

// Event listener untuk tombol Mulai Game
document.getElementById('start-button').addEventListener('click', function() {
    startGame(); // Memulai permainan
});

// Fungsi untuk memulai permainan
function startGame() {
    // Reset logika permainan dan inisialisasi permainan di sini
    console.log(`Memulai permainan dengan level ${currentLevel}`);

    // Mulai menghasilkan halangan
    startObstacles();
}

// Fungsi untuk memulai menghasilkan halangan
function startObstacles() {
    setInterval(function() {
        createObstacle();
    }, obstacleInterval);
}

// Fungsi untuk membuat halangan baru
function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = `${Math.random() * (window.innerWidth - 50)}px`; // Posisi horizontal acak
    obstacle.style.animationDuration = `${Math.random() * 2 + 1}s`; // Durasi animasi acak
    document.body.appendChild(obstacle);

    moveObstacle(obstacle);
}

// Fungsi untuk menggerakkan halangan
function moveObstacle(obstacle) {
    let obstacleInterval = setInterval(function() {
        const bottomPosition = parseInt(window.getComputedStyle(obstacle).getPropertyValue('bottom'));

        // Cek tabrakan dengan mobil
        if (bottomPosition > 0 && bottomPosition < 100 && obstacle.style.left === document.querySelector('.car').style.left) {
            gameOver();
        }

        obstacle.style.bottom = `${bottomPosition - obstacleSpeed}px`;

        // Hapus halangan saat melewati layar
        if (bottomPosition <= -100) {
            obstacle.remove();
            clearInterval(obstacleInterval);
        }
    }, 20);
}

// Fungsi untuk mengakhiri permainan
function gameOver() {
    // Tampilkan layar game over
    document.querySelector('.game-over-screen').style.display = 'flex';
    document.getElementById('final-score').textContent = currentScore;

    // Hentikan menghasilkan halangan
    clearInterval(obstacleInterval);
}

// Fungsi untuk mengupdate skor dan memeriksa kapan harus meningkatkan level
function updateScore(score) {
    document.getElementById('score').textContent = score;

    // Periksa apakah skor mencapai atau melebihi 20 untuk meningkatkan level
    if (score >= 20 && currentLevel === 1) {
        setLevel(2);
    } else if (score >= 40 && currentLevel === 2) {
        setLevel(3);
    }
}

// Contoh penggunaan fungsi updateScore
let currentScore = 0; // Skor awal
updateScore(currentScore);

// script.js

const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');

// Event listener untuk tombol "Beliok Kiri"
leftButton.addEventListener('click', function() {
    moveLeft(); // Panggil fungsi untuk menggerakkan mobil ke kiri
});

// Event listener untuk tombol "Beliok Kanan"
rightButton.addEventListener('click', function() {
    moveRight(); // Panggil fungsi untuk menggerakkan mobil ke kanan
});

// Fungsi untuk menggerakkan mobil ke kiri
function moveLeft() {
    // Logika untuk menggerakkan mobil ke kiri
    // Misalnya, mengubah posisi mobil ke kiri
    const car = document.querySelector('.car');
    const currentLeft = parseInt(window.getComputedStyle(car).getPropertyValue('left'));
    const newLeft = currentLeft - 10; // Atur perubahan posisi
    car.style.left = `${newLeft}px`;
}

// Fungsi untuk menggerakkan mobil ke kanan
function moveRight() {
    // Logika untuk menggerakkan mobil ke kanan
    // Misalnya, mengubah posisi mobil ke kanan
    const car = document.querySelector('.car');
    const currentLeft = parseInt(window.getComputedStyle(car).getPropertyValue('left'));
    const newLeft = currentLeft + 10; // Atur perubahan posisi
    car.style.left = `${newLeft}px`;
}



