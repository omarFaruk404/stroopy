document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // --- 2. Fade-in Observer ---
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // --- 3. Auto Carousel Logic ---
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }

    function startSlide() {
        slideInterval = setInterval(nextSlide, 5000); 
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startSlide();
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            goToSlide(parseInt(e.target.dataset.slide));
            resetInterval();
        });
    });

    startSlide();

    // --- 4. Horizontal Scroll & Internal Panel Animations ---
    const scrollWrapper = document.getElementById('flavours-scroll-wrapper');
    const track = document.getElementById('flavours-track');
    const panels = document.querySelectorAll('.flavour-panel');
    
    if(panels.length > 0) {
        const numPanels = panels.length;
        const maxTranslatePercentage = ((numPanels - 1) / numPanels) * 100;

        function updateHorizontalScroll() {
            if (!scrollWrapper || !track) return;

            const rect = scrollWrapper.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const start = rect.top; 
            const scrollableDistance = rect.height - viewportHeight;
            
            let scrollProgress = 0;

            if (start <= 0 && start >= -scrollableDistance) {
                scrollProgress = Math.abs(start) / scrollableDistance;
                const translateValue = scrollProgress * maxTranslatePercentage;
                track.style.transform = `translate3d(-${translateValue}%, 0, 0)`;
            } else if (start > 0) {
                track.style.transform = `translate3d(0%, 0, 0)`;
                scrollProgress = 0;
            } else if (start < -scrollableDistance) {
                track.style.transform = `translate3d(-${maxTranslatePercentage}%, 0, 0)`;
                scrollProgress = 1;
            }

            const currentPanelFloat = scrollProgress * (numPanels - 1);
            const activeIndex = Math.round(currentPanelFloat);

            panels.forEach((panel, index) => {
                if (index === activeIndex) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        }

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateHorizontalScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        updateHorizontalScroll();
    }


    // --- 5. Feature Image Scroll Rotation ---
    const featureImg = document.querySelector('.feature-center img');
    
    if (featureImg) {
        // Use requestAnimationFrame for smooth, lag-free performance
        let isScrolling = false;

        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    // Get the image's current position relative to the viewport
                    const rect = featureImg.getBoundingClientRect();
                    const imgCenterY = rect.top + (rect.height / 2);
                    const viewportCenterY = window.innerHeight / 2;
                    
                    // Calculate how far the image center is from the screen center
                    const distanceFromCenter = imgCenterY - viewportCenterY;
                    
                    // Convert distance to degrees. 
                    // Tweak the '10' higher for slower rotation, or lower for faster rotation.
                    const rotationDegrees = distanceFromCenter / 10;
                    
                    // Apply the rotation
                    featureImg.style.transform = `rotate(${rotationDegrees}deg)`;
                    
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
    }
});