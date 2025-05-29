// ==========================================================
// Main JavaScript for Albert Duran Portfolio
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------------
    // Light Mode Toggle
    // ----------------------------------------------------------
    const body = document.body;
    const toggleButton = document.getElementById("dark-mode-toggle");
    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
            body.classList.toggle("light-mode");
            localStorage.setItem("light-mode", body.classList.contains("light-mode") ? "enabled" : "disabled");
        });
        if (localStorage.getItem("light-mode") === "enabled") {
            body.classList.add("light-mode");
        }
    }

    // ----------------------------------------------------------
    // Hero Title Typewriter Effect
    // ----------------------------------------------------------
    const title = document.getElementById("hero-title");
    let text = "ACCESS GRANTED... Welcome to the Matrix";
    let index = 0;
    function typeWriter() {
        if (index < text.length) {
            title.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();

    // ----------------------------------------------------------
    // Falling Matrix Code Effect
    // ----------------------------------------------------------
    const matrixBg = document.querySelector(".matrix-bg");
    if (matrixBg) {
        for (let i = 0; i < 50; i++) {
            const span = document.createElement("span");
            span.classList.add("matrix-code");
            span.innerHTML = Math.floor(Math.random() * 2);
            span.style.left = `${Math.random() * 100}vw`;
            span.style.animationDuration = `${Math.random() * 3 + 2}s`;
            matrixBg.appendChild(span);
        }
    }

    // ----------------------------------------------------------
    // Interactive Logo Animation
    // ----------------------------------------------------------
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            logo.classList.add('logo-animate');
            setTimeout(() => logo.classList.remove('logo-animate'), 700);
        });

        // Matrix Code Rain Burst on Logo Hover
        logo.addEventListener('mouseenter', () => {
            if (matrixBg) {
                for (let i = 0; i < 20; i++) {
                    const span = document.createElement("span");
                    span.classList.add("matrix-code");
                    span.innerHTML = Math.floor(Math.random() * 10);
                    span.style.left = Math.random() * 100 + "vw";
                    span.style.animationDuration = (Math.random() * 1.5 + 1) + "s";
                    span.style.opacity = 1;
                    matrixBg.appendChild(span);
                    setTimeout(() => matrixBg.removeChild(span), 1800);
                }
            }
        });
    }

    // ----------------------------------------------------------
    // Navbar Active Link Highlight on Scroll
    // ----------------------------------------------------------
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");
    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute("id");
            }
        });
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });

    // ----------------------------------------------------------
    // Animated Subtitle Typing after Title
    // ----------------------------------------------------------
    const subtitle = document.getElementById("hero-subtitle");
    if (subtitle) {
        const subtitleText = subtitle.textContent;
        subtitle.textContent = "";
        setTimeout(() => {
            let subIdx = 0;
            function typeSubtitle() {
                if (subIdx < subtitleText.length) {
                    subtitle.textContent += subtitleText.charAt(subIdx);
                    subIdx++;
                    setTimeout(typeSubtitle, 30);
                }
            }
            typeSubtitle();
        }, text.length * 100 + 400);
    }

    // ----------------------------------------------------------
    // Smooth Scroll with Offset for Fixed Header
    // ----------------------------------------------------------
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = document.querySelector('.header').offsetHeight || 80;
                const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset + 1;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ----------------------------------------------------------
    // TV scanline flicker effect
    // ----------------------------------------------------------
    const scanlines = document.querySelector('.scanlines');
    if (scanlines) {
        setInterval(() => {
            scanlines.style.opacity = 0.4 + Math.random() * 0.2;
        }, 120);
    }

    // ----------------------------------------------------------
    // Animated Project Hover Effect
    // ----------------------------------------------------------
    const projects = document.querySelectorAll(".project");
    projects.forEach(project => {
        project.addEventListener("mouseover", () => {
            project.style.transform = "scale(1.05)";
            project.style.boxShadow = "0 0 15px rgba(0, 255, 0, 0.7)";
        });
        project.addEventListener("mouseout", () => {
            project.style.transform = "scale(1)";
            project.style.boxShadow = "0 4px 12px rgba(0, 255, 0, 0.3)";
        });
    });

    // ----------------------------------------------------------
    // Project Modal Open/Close
    // ----------------------------------------------------------
    function openProject() {
        document.getElementById("project-modal").style.display = "block";
    }
    const closeBtn = document.querySelector(".close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            document.getElementById("project-modal").style.display = "none";
        });
    }

    // ==========================================================
    // Interactive Game Section - Avoid-the-Blocks Game
    // ==========================================================
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const startButton = document.getElementById("startGame");
    const exitButton = document.getElementById("exitGame");

    canvas.width = 600;
    canvas.height = 400;

    let player = { x: 275, y: 350, width: 50, height: 50, speed: 5 };
    let obstacles = [];
    let score = 0;
    let highScore = localStorage.getItem("highScore") || 0;
    let backgroundOffset = 0;
    let obstacleSpeed = 2.5;
    let spawnRate = 1200;
    let backgroundSpeed = 2;
    let gameActive = false;
    let obstacleInterval;

    // Movement Controls (No Page Scrolling)
    document.addEventListener("keydown", (event) => {
        if (gameActive) {
            if (event.key === "ArrowLeft" && player.x > 0) {
                player.x -= player.speed;
                event.preventDefault();
            }
            if (event.key === "ArrowRight" && player.x < canvas.width - player.width) {
                player.x += player.speed;
                event.preventDefault();
            }
        }
    });

    // Create Falling Code Blocks with Difficulty Scaling
    function createObstacle() {
        obstacles.push({
            x: Math.random() * (canvas.width - 30),
            y: 0,
            width: 30 + Math.floor(score / 25),
            height: 30 + Math.floor(score / 25),
            speed: obstacleSpeed
        });
    }

    // Start Game Logic
    startButton.addEventListener("click", () => {
        if (!gameActive) {
            gameActive = true;
            score = 0;
            obstacles = [];
            obstacleSpeed = 2.5;
            backgroundSpeed = 2;
            spawnRate = 1200;
            obstacleInterval = setInterval(createObstacle, spawnRate);
            gameLoop();
        }
    });

    // Exit Game Logic
    exitButton.addEventListener("click", () => {
        gameActive = false;
        clearInterval(obstacleInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        alert("Game Exited!");
    });

    // Increase Difficulty Every 25 Points
    function increaseDifficulty() {
        if (score % 25 === 0) {
            obstacleSpeed += 0.5;
            backgroundSpeed += 0.5;
            spawnRate -= 100;
            if (spawnRate < 600) spawnRate = 600;
            clearInterval(obstacleInterval);
            obstacleInterval = setInterval(createObstacle, spawnRate);
        }
    }

    // Game Loop
    function gameLoop() {
        if (!gameActive) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background Animation (Moves Faster Over Time)
        backgroundOffset += backgroundSpeed;
        ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
        ctx.fillRect(0, backgroundOffset % canvas.height, canvas.width, canvas.height);

        // Draw Player
        ctx.fillStyle = "#0f0";
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Draw & Move Obstacles
        obstacles.forEach((obs, index) => {
            obs.y += obs.speed;
            ctx.fillStyle = "#0f0";
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

            // Check Collision
            if (
                player.x < obs.x + obs.width &&
                player.x + player.width > obs.x &&
                player.y < obs.y + obs.height &&
                player.y + player.height > obs.y
            ) {
                if (score > highScore) {
                    localStorage.setItem("highScore", score);
                }
                alert(`Game Over! Score: ${score} | High Score: ${highScore}`);
                gameActive = false;
                clearInterval(obstacleInterval);
            }

            // Remove Obstacles & Increase Score
            if (obs.y > canvas.height) {
                obstacles.splice(index, 1);
                score++;
                increaseDifficulty();
            }
        });

        // Display Score
        ctx.fillStyle = "#0f0";
        ctx.font = "20px Courier New";
        ctx.fillText(`Score: ${score}`, 10, 30);
        ctx.fillText(`High Score: ${highScore}`, 10, 60);

        if (gameActive) requestAnimationFrame(gameLoop);
    }

    gameLoop();

    // ----------------------------------------------------------
    // Smooth Scroll for Project Buttons
    // ----------------------------------------------------------
    document.querySelectorAll(".project-button").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = button.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50,
                    behavior: "smooth"
                });
            }
        });
    });
});






