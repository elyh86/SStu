// Vertical Scroll JavaScript

// Canvas Background Animation - Enhanced
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouseX = 0;
let mouseY = 0;
let hue = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.hue = Math.random() * 60;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
            const force = (200 - distance) / 200;
            this.x -= dx * force * 0.05;
            this.y -= dy * force * 0.05;
            this.size = Math.min(this.size + 0.5, 8);
        } else {
            this.size = Math.max(this.size - 0.1, 1);
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${15 + this.hue}, 80%, 60%, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCanvas() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    hue += 0.5;

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                const opacity = (1 - distance / 120) * 0.3;
                ctx.strokeStyle = `hsla(${15 + hue}, 80%, 60%, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });
    });

    drawGeometricShapes();

    requestAnimationFrame(animateCanvas);
}

function drawGeometricShapes() {
    const time = Date.now() * 0.001;
    
    ctx.save();
    ctx.translate(canvas.width * 0.8, canvas.height * 0.3);
    ctx.rotate(time * 0.3);
    ctx.beginPath();
    ctx.moveTo(0, -50);
    ctx.lineTo(43, 25);
    ctx.lineTo(-43, 25);
    ctx.closePath();
    ctx.strokeStyle = `hsla(${15 + hue}, 80%, 60%, 0.1)`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    
    ctx.save();
    ctx.translate(canvas.width * 0.2, canvas.height * 0.7);
    ctx.rotate(-time * 0.2);
    ctx.strokeRect(-30, -30, 60, 60);
    ctx.strokeStyle = `hsla(${15 + hue + 30}, 80%, 60%, 0.08)`;
    ctx.lineWidth = 2;
    ctx.restore();
}

animateCanvas();

// Dynamic nav color based on section background
const nav = document.querySelector('.nav');
const workSection = document.querySelector('.work');
const aboutSection = document.querySelector('.about');

const updateNavTheme = () => {
    const workRect = workSection.getBoundingClientRect();
    const aboutRect = aboutSection.getBoundingClientRect();
    const navInWork = workRect.top <= 100 && workRect.bottom >= 100;
    const navInAbout = aboutRect.top <= 100 && aboutRect.bottom >= 100;
    
    if (navInWork || navInAbout) {
        nav.classList.add('nav-light');
        nav.classList.remove('nav-dark');
    } else {
        nav.classList.add('nav-dark');
        nav.classList.remove('nav-light');
    }
};

window.addEventListener('scroll', updateNavTheme);
updateNavTheme(); // Initial check

// Navigation active state on scroll
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.3 });

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Scroll progress indicator
const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = `${scrollPercent}%`;
});

// Work filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const workItems = document.querySelectorAll('.work-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.textContent.toLowerCase();
        
        workItems.forEach(item => {
            const categories = item.querySelectorAll('.work-cat');
            const cats = Array.from(categories).map(cat => cat.textContent.toLowerCase());
            
            if (filter === 'all') {
                item.style.display = 'flex';
            } else {
                const hasCat = cats.some(cat => cat.includes(filter));
                item.style.display = hasCat ? 'flex' : 'none';
            }
        });
    });
});

// Work item hover effects
const workItemsList = document.querySelectorAll('.work-item');

workItemsList.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const index = item.querySelector('.work-index');
        index.style.transform = 'translateX(10px)';
    });
    
    item.addEventListener('mouseleave', () => {
        const index = item.querySelector('.work-index');
        index.style.transform = 'translateX(0)';
    });
});

// Custom cursor
const body = document.body;

let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    body.style.setProperty('--cursor-x', cursorX + 'px');
    body.style.setProperty('--cursor-y', cursorY + 'px');
});

const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    body::before {
        content: '';
        position: fixed;
        top: var(--cursor-y, 0);
        left: var(--cursor-x, 0);
        width: 20px;
        height: 20px;
        border: 2px solid #ff6b35;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: width 0.3s ease, height 0.3s ease;
    }
    
    body::after {
        content: '';
        position: fixed;
        top: var(--cursor-y, 0);
        left: var(--cursor-x, 0);
        width: 6px;
        height: 6px;
        background: #ff6b35;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
    }
    
    body:hover::before {
        width: 40px;
        height: 40px;
    }
`;
document.head.appendChild(cursorStyle);

if ('ontouchstart' in window) {
    cursorStyle.textContent = '';
}

// Counter animation for stats
const statValues = document.querySelectorAll('.stat-value');

const animateCounter = (el) => {
    const text = el.textContent;
    const target = parseInt(text.replace('+', ''));
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);
        
        el.textContent = current + '+';
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    };
    
    requestAnimationFrame(updateCounter);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            statValues.forEach(stat => animateCounter(stat));
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutUnique = document.querySelector('.about-unique');
if (aboutUnique) {
    statsObserver.observe(aboutUnique);
}

// Skills matrix hover effects
const skillItems = document.querySelectorAll('.skill-matrix-item');

skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const dots = item.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            setTimeout(() => {
                dot.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    dot.style.transform = 'scale(1)';
                }, 200);
            }, index * 50);
        });
    });
});

// Scroll reveal animations
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    // Parallax for floating text in hero
    const floatingText = document.querySelectorAll('.float-text');
    floatingText.forEach((text, index) => {
        const speed = (index + 1) * 0.05;
        text.style.transform = `translateY(${scrollY * speed}px)`;
    });
});

// Text scramble effect for hero lines
const heroLines = document.querySelectorAll('.hero-line');

heroLines.forEach(line => {
    const dataText = line.getAttribute('data-text');
    const chars = dataText.split('');
    
    line.addEventListener('mouseenter', () => {
        let iterations = 0;
        const interval = setInterval(() => {
            line.textContent = chars.map((char, i) => {
                if (i < iterations) {
                    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
                return char;
            }).join('');
            
            iterations++;
            if (iterations >= chars.length + 5) {
                clearInterval(interval);
                line.textContent = dataText;
            }
        }, 30);
    });
});

console.log('Syntax Studio © 2026 - Vertical Scroll Portfolio');
