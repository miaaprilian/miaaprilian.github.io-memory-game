document.addEventListener("DOMContentLoaded", () => {
    const board = document.querySelector(".board");
    const startButton = document.querySelector("button");
    const movesCounter = document.querySelector(".moves");
    const timerDisplay = document.querySelector(".timer");
    const winMessage = document.querySelector(".win");
    const gameOverMessage = document.querySelector(".game-over");


    const bgMusic = document.getElementById("bg-music");
    const flipSound = document.getElementById("flip-sound");
    const winSound = document.getElementById("win-sound");
    const victorySound = document.getElementById("victory-sound");
    const loseSound = document.getElementById("lose-sound");

    const symbols = ["🍎", "🍌", "🍇", "🍉", "🍍", "🥭", "🍒", "🍓"];
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timer;
    let seconds = 0;
    let gameStarted = false;
    let timeLimit = 60; // batas waktu

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startGame() {
        board.innerHTML = "";
        flippedCards = [];
        moves = 0;
        seconds = timeLimit;
        matchedPairs = 0;
        gameStarted = true;
        movesCounter.textContent = "0 moves";
        timerDisplay.textContent = `Time : ${seconds} sec`;
        winMessage.style.display = "none";
        gameOverMessage.style.display = "none";

        
        const container = document.getElementById("confetti-container");
        container.innerHTML = "";

        clearInterval(timer);
        timer = setInterval(() => {
            seconds--;
            timerDisplay.textContent = `Time : ${seconds} sec`;

            if (seconds <= 0) {
                clearInterval(timer);
                endGameOver();
            }
        }, 1000);

        // Mainkan musik latar
        bgMusic.currentTime = 0;
        bgMusic.volume = 0.5;
        bgMusic.play();

        cards = [...symbols, ...symbols];
        shuffle(cards);

        cards.forEach((symbol) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.symbol = symbol;
            card.innerHTML = `
                <div class="card-front"></div>
                <div class="card-back">${symbol}</div>
            `;
            card.addEventListener("click", () => flipCard(card));
            board.appendChild(card);
        });
    }

    function flipCard(card) {
        if (!gameStarted || flippedCards.length >= 2 || card.classList.contains("flipped")) return;

        // Suara flip
        flipSound.currentTime = 0;
        flipSound.play();

        card.classList.add("flipped");
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            movesCounter.textContent = `${moves} moves`;

            let firstCard = flippedCards[0];
            let secondCard = flippedCards[1];

            if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
                matchedPairs++;
                flippedCards = [];

                if (matchedPairs === symbols.length) {
                    clearInterval(timer);
                    setTimeout(() => {
                        showWinScreen();
                    }, 500);
                }
            } else {
                setTimeout(() => {
                    firstCard.classList.remove("flipped");
                    secondCard.classList.remove("flipped");
                    flippedCards = [];
                }, 1000);
            }
        }
    }

    function showWinScreen() {
        gameStarted = false;
        winMessage.style.display = "flex";
        bgMusic.pause();

        // Mainkan suara
        winSound.currentTime = 0;
        winSound.play();

        victorySound.currentTime = 0;
        victorySound.play();

        launchConfetti();

        // Tambah tombol restart
        addRestartButton(winMessage);
    }

    function endGameOver() {
        gameStarted = false;
        bgMusic.pause();
        gameOverMessage.style.display = "flex";

        // Efek shake
        gameOverMessage.classList.add("shake");

        // Suara kalah
        loseSound.currentTime = 0;
        loseSound.play();

        // Efek kaca pecah
        launchGlassCrack();

        // Hapus shake setelah selesai
        setTimeout(() => {
            gameOverMessage.classList.remove("shake");
        }, 2000);

        // Tambah tombol restart
        addRestartButton(gameOverMessage);
    }

    function addRestartButton(container) {
        // Hapus tombol lama biar tidak numpuk
        const oldBtn = container.querySelector(".restart-btn");
        if (oldBtn) oldBtn.remove();

        const btn = document.createElement("button");
        btn.textContent = "Restart Game";
        btn.classList.add("restart-btn");
        btn.style.marginTop = "20px";
        btn.style.padding = "10px 20px";
        btn.style.fontSize = "16px";
        btn.style.borderRadius = "8px";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
        btn.style.background = "#ff3b3b";
        btn.style.color = "white";
        btn.style.fontWeight = "bold";
        btn.style.boxShadow = "0 0 10px rgba(255,0,0,0.7)";

        btn.addEventListener("click", startGame);
        container.appendChild(btn);
    }

    function launchConfetti() {
        const container = document.getElementById("confetti-container");
        container.innerHTML = "";

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement("div");
            confetti.classList.add("confetti");

            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.top = "-10px";

            const colors = ["#ff0", "#0f0", "#0ff", "#f0f", "#f00", "#00f"];
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = 2 + Math.random() * 3 + "s";

            container.appendChild(confetti);
        }
    }

    function launchGlassCrack() {
        const container = document.getElementById("confetti-container");
        container.innerHTML = "";

        for (let i = 0; i < 20; i++) {
            const crack = document.createElement("div");
            crack.classList.add("glass-crack");
            crack.style.left = Math.random() * 100 + "vw";
            crack.style.top = Math.random() * 100 + "vh";
            crack.style.width = "2px";
            crack.style.height = "100px";
            crack.style.backgroundColor = "white";
            crack.style.transform = `rotate(${Math.random() * 360}deg)`;
            crack.style.opacity = 0.6;
            container.appendChild(crack);
        }
    }

    startButton.addEventListener("click", startGame);
});
