const canvas = document.getElementById('gameCanvas');
        const context = canvas.getContext('2d');
        const gameOverText = document.getElementById('gameOverText');
        const restartText = document.getElementById('restartText');

        const birdImage = new Image();
        birdImage.src = 'images/bird/chino.png';  // path ke gambar ikon

        const pipeNorthImage = new Image();
        pipeNorthImage.src = 'images/pipa/2.png';  // path ke gambar pipa atas

        const pipeSouthImage = new Image();
        pipeSouthImage.src = 'images/pipa/1.png';  // path ke gambar pipa bawah

        const scoreSound = document.getElementById('scoreSound');
        const gameOverSound = document.getElementById('gameOverSound');

        const bird = {
            x: 100,
            y: 300,
            width: 50,  // lebar ukuran ikon 
            height: 50,  // tinggi ukuran ikon
            gravity: 0.6,
            lift: -10,  // nilai lift untuk lompatan yang lebih rendah
            velocity: 0
        };

        let pipes = [];
        const pipeWidth = 80;  // ukuran lebar pipa
        const pipeGap = 300;  // jarak vertikal antar pipa
        let frameCount = 0;
        let score = 0;
        let gameOver = false;

        document.addEventListener('keydown', () => {
            if (gameOver) {
                resetGame();
            } else {
                bird.velocity = bird.lift;
            }
        });

        function drawBird() {
            context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
        }

        function drawPipes() {
            pipes.forEach(pipe => {
                context.drawImage(pipeNorthImage, pipe.x, 0, pipeWidth, pipe.top);
                context.drawImage(pipeSouthImage, pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
            });
        }

        function updateBird() {
            bird.velocity += bird.gravity;
            bird.y += bird.velocity;

            if (bird.y + bird.height > canvas.height || bird.y < 0) {
                gameOver = true;
                console.log('Game Over!');
                gameOverSound.play().catch(error => {
                    console.log('Error playing gameOverSound:', error);
                });
                showGameOverText();
            }
        }

        function updatePipes() {
            if (frameCount % 100 === 0) {  // mengatur frekuensi kemunculan pipa
                const topHeight = Math.random() * (canvas.height / 2);
                const bottomHeight = canvas.height - topHeight - pipeGap;
                pipes.push({ x: canvas.width, top: topHeight, bottom: bottomHeight });
            }

            pipes.forEach(pipe => {
                pipe.x -= 2;
            });

            pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
        }

        function checkCollision() {
            pipes.forEach(pipe => {
                if (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x &&
                    (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
                    gameOver = true;
                    console.log('Game Over!');
                    gameOverSound.play().catch(error => {
                        console.log('Error playing gameOverSound:', error);
                    });
                    showGameOverText();
                }

                if (pipe.x === bird.x) {
                    score++;
                    if (score % 10 === 0) {
                        scoreSound.play();
                    }
                }
            });
        }

        function resetGame() {
            bird.y = 300;
            bird.velocity = 0;
            pipes = [];
            score = 0;
            frameCount = 0;
            gameOver = false;
            hideGameOverText();
        }

        function drawScore() {
            context.fillStyle = 'black';
            context.font = '40px Arial';
            context.fillText(`Score: ${score}`, 20, 40);
        }

        function showGameOverText() {
            gameOverText.style.display = 'block';
            restartText.style.display = 'block';
        }

        function hideGameOverText() {
            gameOverText.style.display = 'none';
            restartText.style.display = 'none';
        }

        function gameLoop() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawBird();
            drawPipes();
            drawScore();
            if (gameOver) {
                // text "You're a Loser." dan instruksi "Press any key to kidnap." akan muncul dengan animasi
            } else {
                updateBird();
                updatePipes();
                checkCollision();
                frameCount++;
            }
            requestAnimationFrame(gameLoop);
        }

        gameLoop();