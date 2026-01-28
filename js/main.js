document.addEventListener("DOMContentLoaded", () => {
    // 1. REVEAL ON SCROLL
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 2. PAGE TRANSITIONS
    const links = document.querySelectorAll("a");
    links.forEach(link => {
        const href = link.getAttribute("href");
        if (href && href.includes(".html") && !href.startsWith("http")) {
            link.addEventListener("click", e => {
                e.preventDefault();
                document.body.style.opacity = "0";
                setTimeout(() => { window.location.href = href; }, 400);
            });
        }
    });
});

// 3. DUST PARTICLE PHYSICS (Settles at bottom)
const canvas = document.getElementById("dust-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.groundY = canvas.height - (Math.random() * 15); // The "floor"
        this.y = this.groundY; 
        this.radius = Math.random() * 1.2 + 0.3;
        this.alpha = Math.random() * 0.5;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = 0;
    }

    update(mouse) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        // If mouse moves near, dust rises
        if (dist < 100) {
            this.vy -= (100 - dist) * 0.02; // Lift
            this.vx += dx * 0.01; // Horizontal push
        }

        // Gravity / Settling
        this.y += this.vy;
        this.vy += 0.1; // Gravity constant
        this.x += this.vx;
        this.vx *= 0.95; // Friction

        // Stay on ground
        if (this.y > this.groundY) {
            this.y = this.groundY;
            this.vy = 0;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(0, 0, 0, ${this.alpha})`; // Black dust on white bg
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

for(let i=0; i<150; i++) particles.push(new Particle());

const mouse = { x: -1000, y: -1000 };
window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update(mouse);
        p.draw();
    });
    requestAnimationFrame(animate);
}
animate();

// 4. BACK TO TOP LOGIC
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        // Show button after scrolling down 500px
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}