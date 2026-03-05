document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. CANVAS PARTICLE NETWORK
    // ============================================================
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(true); }

        reset(randomY = false) {
            this.x = Math.random() * canvas.width;
            this.y = randomY ? Math.random() * canvas.height : canvas.height + 10;
            this.vx = (Math.random() - 0.5) * 0.25;
            this.vy = (Math.random() - 0.5) * 0.25;
            this.radius = Math.random() * 1.5 + 0.4;
            this.opacity = Math.random() * 0.45 + 0.08;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 255, 218, ${this.opacity})`;
            ctx.fill();
        }
    }

    const PARTICLE_COUNT = 70;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

    function drawConnections() {
        const maxDist = 115;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.14;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(100, 255, 218, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // ============================================================
    // 2. CUSTOM CURSOR
    // ============================================================
    const cursorInner = document.getElementById('cursor-inner');
    const cursorOuter = document.getElementById('cursor-outer');

    if (cursorInner && cursorOuter) {
        let mouseX = 0, mouseY = 0;
        let outerX = 0, outerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorInner.style.left = mouseX + 'px';
            cursorInner.style.top  = mouseY + 'px';
        });

        // Smooth lagging outer ring
        (function lerpCursor() {
            outerX += (mouseX - outerX) * 0.11;
            outerY += (mouseY - outerY) * 0.11;
            cursorOuter.style.left = outerX + 'px';
            cursorOuter.style.top  = outerY + 'px';
            requestAnimationFrame(lerpCursor);
        })();

        // Expand ring on hover
        document.querySelectorAll('a, button, .tab-btn, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOuter.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOuter.classList.remove('hover'));
        });

        // Shrink on click
        document.addEventListener('mousedown', () => cursorOuter.classList.add('clicking'));
        document.addEventListener('mouseup',   () => cursorOuter.classList.remove('clicking'));

        // Hide cursor when it leaves the window
        document.addEventListener('mouseleave', () => {
            cursorInner.style.opacity = '0';
            cursorOuter.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursorInner.style.opacity = '1';
            cursorOuter.style.opacity = '1';
        });
    }

    // ============================================================
    // 3. SCROLL PROGRESS BAR
    // ============================================================
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop  = document.documentElement.scrollTop;
            const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
        }, { passive: true });
    }

    // ============================================================
    // 4. NAVBAR SHRINK ON SCROLL
    // ============================================================
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    // ============================================================
    // 5. SCROLL REVEAL (IntersectionObserver)
    // ============================================================
    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el     = entry.target;
            const parent = el.parentElement;
            const isGrid = parent.classList.contains('projects-grid') ||
                           parent.classList.contains('edu-container');

            if (isGrid) {
                const siblings = [...parent.querySelectorAll('.reveal')];
                const idx = siblings.indexOf(el);
                setTimeout(() => el.classList.add('visible'), idx * 110);
            } else {
                el.classList.add('visible');
            }

            revealObserver.unobserve(el);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -55px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    // ============================================================
    // 6. PROJECT CARD SPOTLIGHT (mouse-follow glow)
    // ============================================================
    document.querySelectorAll('.project-card').forEach(card => {
        const spotlight = document.createElement('div');
        spotlight.className = 'spotlight';
        card.appendChild(spotlight);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            spotlight.style.left = (e.clientX - rect.left) + 'px';
            spotlight.style.top  = (e.clientY - rect.top)  + 'px';
        });
    });

    // ============================================================
    // 7. EXPERIENCE TABS
    // ============================================================
    const tabs     = document.querySelectorAll('.tab-btn');
    const panels   = document.querySelectorAll('.job-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t   => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const target = document.querySelector(tab.getAttribute('data-target'));
            if (target) target.classList.add('active');
        });
    });

    // ============================================================
    // 8. TYPEWRITER EFFECT
    // ============================================================
    const typedEl = document.getElementById('typewriter-text');
    if (typedEl) {
        const text = "I am a Data-driven Finance Professional with 5+ years of experience in Data Engineering and Quantitative Modeling. I leverage SQL, Python, and AWS to automate financial reporting and assess the health of complex initiatives.";
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                typedEl.textContent += text.charAt(i++);
                setTimeout(typeWriter, 28);
            }
        }
        setTimeout(typeWriter, 1400);
    }

    // ============================================================
    // 9. MOBILE MENU
    // ============================================================
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks   = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.classList.replace('fa-times', 'fa-bars');
            });
        });
    }

});
