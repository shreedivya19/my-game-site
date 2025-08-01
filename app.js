// Gaming Website JavaScript

// Game data
const gamesData = [
    {
        "title": "Space Invaders",
        "genre": "Arcade",
        "image": "space-game.jpg",
        "description": "Classic space shooting game"
    },
    {
        "title": "Puzzle Quest",
        "genre": "Puzzle",
        "image": "puzzle-game.jpg",
        "description": "Mind-bending puzzle challenges"
    },
    {
        "title": "Racing Thunder",
        "genre": "Racing",
        "image": "racing-game.jpg",
        "description": "High-speed racing action"
    },
    {
        "title": "RPG Adventure",
        "genre": "RPG",
        "image": "rpg-game.jpg",
        "description": "Epic fantasy adventure"
    },
    {
        "title": "Platform Hero",
        "genre": "Platform",
        "image": "platform-game.jpg",
        "description": "Jump and run adventure"
    },
    {
        "title": "Card Master",
        "genre": "Card",
        "image": "card-game.jpg",
        "description": "Strategic card battles"
    }
];

// Navigation functionality
class Navigation {
    constructor() {
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav__link');
        
        this.init();
    }

    init() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Close mobile menu
                this.navMenu.classList.remove('active');
                
                // Handle smooth scrolling
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Particle system for hero section
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particles');
        this.particles = [];
        this.particleCount = 50;
        
        if (this.container) {
            this.init();
        }
    }

    init() {
        this.createParticles();
        this.animateParticles();
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Random animation delay
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    animateParticles() {
        setInterval(() => {
            this.particles.forEach(particle => {
                if (Math.random() > 0.98) {
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.top = Math.random() * 100 + '%';
                }
            });
        }, 100);
    }
}

// Ball Catcher Game
class BallCatcherGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.startButton = document.getElementById('startGame');
        this.resetButton = document.getElementById('resetGame');
        
        // Game state
        this.gameRunning = false;
        this.score = 0;
        this.lives = 3;
        this.gameSpeed = 60;
        
        // Game objects
        this.paddle = {
            x: this.canvas.width / 2 - 40,
            y: this.canvas.height - 20,
            width: 80,
            height: 10,
            speed: 6
        };
        
        this.balls = [];
        this.ballSpawnRate = 0.02;
        this.keys = {};
        this.mouseX = 0;
        
        this.init();
    }

    init() {
        // Button event listeners
        if (this.startButton) {
            this.startButton.addEventListener('click', () => this.startGame());
        }
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this.resetGame());
        }
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePause();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse controls
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
        });
        
        // Initial draw
        this.draw();
    }

    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.startButton.textContent = 'Pause';
            this.gameLoop();
        } else {
            this.togglePause();
        }
    }

    togglePause() {
        this.gameRunning = !this.gameRunning;
        this.startButton.textContent = this.gameRunning ? 'Pause' : 'Resume';
        if (this.gameRunning) {
            this.gameLoop();
        }
    }

    resetGame() {
        this.gameRunning = false;
        this.score = 0;
        this.lives = 3;
        this.balls = [];
        this.paddle.x = this.canvas.width / 2 - 40;
        this.startButton.textContent = 'Start Game';
        this.updateUI();
        this.draw();
    }

    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.draw();
        
        setTimeout(() => {
            requestAnimationFrame(() => this.gameLoop());
        }, 1000 / this.gameSpeed);
    }

    update() {
        // Update paddle position
        if (this.keys['ArrowLeft'] && this.paddle.x > 0) {
            this.paddle.x -= this.paddle.speed;
        }
        if (this.keys['ArrowRight'] && this.paddle.x < this.canvas.width - this.paddle.width) {
            this.paddle.x += this.paddle.speed;
        }
        
        // Mouse control
        if (this.mouseX > 0) {
            this.paddle.x = this.mouseX - this.paddle.width / 2;
            this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, this.paddle.x));
        }
        
        // Spawn balls
        if (Math.random() < this.ballSpawnRate) {
            this.balls.push({
                x: Math.random() * (this.canvas.width - 20),
                y: -20,
                radius: 10,
                speed: 2 + Math.random() * 2,
                color: this.getRandomColor()
            });
        }
        
        // Update balls
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const ball = this.balls[i];
            ball.y += ball.speed;
            
            // Check collision with paddle
            if (this.checkCollision(ball, this.paddle)) {
                this.balls.splice(i, 1);
                this.score += 10;
                continue;
            }
            
            // Remove balls that fell off screen
            if (ball.y > this.canvas.height) {
                this.balls.splice(i, 1);
                this.lives--;
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }
        
        this.updateUI();
    }

    checkCollision(ball, paddle) {
        return ball.x + ball.radius > paddle.x &&
               ball.x - ball.radius < paddle.x + paddle.width &&
               ball.y + ball.radius > paddle.y &&
               ball.y - ball.radius < paddle.y + paddle.height;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#262838';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw paddle
        this.ctx.fillStyle = '#00d4ff';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        
        // Add paddle glow effect
        this.ctx.shadowColor = '#00d4ff';
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        this.ctx.shadowBlur = 0;
        
        // Draw balls
        this.balls.forEach(ball => {
            this.ctx.beginPath();
            this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = ball.color;
            this.ctx.fill();
            
            // Add ball glow effect
            this.ctx.shadowColor = ball.color;
            this.ctx.shadowBlur = 5;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
        
        // Game over screen
        if (this.lives <= 0) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#ff0080';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 20);
            
            this.ctx.fillStyle = '#00d4ff';
            this.ctx.font = '16px Arial';
            this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
        }
    }

    getRandomColor() {
        const colors = ['#00d4ff', '#ff0080', '#00ff88', '#ff4444', '#ffaa00'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateUI() {
        if (this.scoreElement) this.scoreElement.textContent = this.score;
        if (this.livesElement) this.livesElement.textContent = this.lives;
    }

    gameOver() {
        this.gameRunning = false;
        this.startButton.textContent = 'Start Game';
    }
}

// Games Gallery
class GamesGallery {
    constructor() {
        this.container = document.getElementById('games-grid');
        if (this.container) {
            this.init();
        }
    }

    init() {
        this.renderGames();
    }

    renderGames() {
        this.container.innerHTML = '';
        
        gamesData.forEach((game, index) => {
            const gameCard = this.createGameCard(game, index);
            this.container.appendChild(gameCard);
        });
    }

    createGameCard(game, index) {
        const card = document.createElement('div');
        card.className = 'game-card';
        
        // Create different colored backgrounds for variety
        const backgrounds = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
        ];
        
        card.innerHTML = `
            <div class="game-card__image" style="background: ${backgrounds[index % backgrounds.length]}">
                <span style="font-size: 3rem; opacity: 0.8;">${this.getGameIcon(game.genre)}</span>
            </div>
            <div class="game-card__content">
                <h3 class="game-card__title">${game.title}</h3>
                <span class="game-card__genre">${game.genre}</span>
                <p class="game-card__description">${game.description}</p>
                <button class="game-card__play" data-game="${game.title}">
                    Play Now
                </button>
            </div>
        `;
        
        // Add event listener for play button
        const playButton = card.querySelector('.game-card__play');
        playButton.addEventListener('click', () => {
            this.playGame(game.title);
        });
        
        return card;
    }

    getGameIcon(genre) {
        const icons = {
            'Arcade': '🚀',
            'Puzzle': '🧩',
            'Racing': '🏎️',
            'RPG': '⚔️',
            'Platform': '🏃',
            'Card': '🃏'
        };
        return icons[genre] || '🎮';
    }

    playGame(gameName) {
        // Create a modal or notification for game launch
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-family: Arial, sans-serif;
        `;
        
        modal.innerHTML = `
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 2rem; border-radius: 12px; text-align: center; border: 2px solid #00d4ff; box-shadow: 0 0 30px rgba(0, 212, 255, 0.3);">
                <h2 style="color: #00d4ff; margin-bottom: 1rem;">🎮 ${gameName}</h2>
                <p style="margin-bottom: 1.5rem; color: #ccc;">Game loading... In a real implementation, this would launch the game!</p>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #00d4ff; color: #1a1a2e; border: none; padding: 0.5rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-close after 3 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 3000);
    }
}

// Utility functions
function scrollToGames() {
    const gamesSection = document.getElementById('games');
    if (gamesSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = gamesSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Scroll animations
function handleScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Header background change on scroll
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(26, 26, 46, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        // Hide/show header on scroll
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = window.scrollY;
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Navigation();
    new ParticleSystem();
    new BallCatcherGame();
    new GamesGallery();
    
    // Initialize scroll effects
    handleScrollAnimations();
    handleHeaderScroll();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Add event listener for hero CTA button
    const heroButton = document.querySelector('.hero__cta');
    if (heroButton) {
        heroButton.addEventListener('click', scrollToGames);
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add some extra interactive effects
document.addEventListener('mousemove', throttle((e) => {
    const particles = document.querySelectorAll('.particle');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    particles.forEach((particle, index) => {
        const speed = (index % 5 + 1) * 0.5;
        const x = mouseX * speed;
        const y = mouseY * speed;
        
        particle.style.transform = `translate(${x}px, ${y}px)`;
    });
}, 50));

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'H' to go to home
    if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.altKey && !e.target.matches('input, textarea')) {
        document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
    }
    // Press 'G' to go to games
    if (e.key.toLowerCase() === 'g' && !e.ctrlKey && !e.altKey && !e.target.matches('input, textarea')) {
        scrollToGames();
    }
});

console.log('🎮 GameHub loaded successfully! Press H for Home, G for Games');