document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Sticky Header Logic
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('shadow-md');
            header.classList.replace('bg-white/90', 'bg-white/95');
        } else {
            header.classList.remove('shadow-md');
            header.classList.replace('bg-white/95', 'bg-white/90');
        }
    });

    // Mobile Menu Toggle Logic
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        const isClosed = mobileMenu.classList.contains('translate-x-full');

        if (isClosed) {
            mobileMenu.classList.remove('translate-x-full');
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            mobileMenu.classList.add('translate-x-full');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));

    // Hero Section Slideshow Logic
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            heroSlides[currentSlide].classList.replace('opacity-100', 'opacity-0');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.replace('opacity-0', 'opacity-100');
        }, 5000); // Change image every 5 seconds
    }

    // Web3Forms AJAX Form Submission
    const forms = document.querySelectorAll('form[action="https://api.web3forms.com/submit"]');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Find or create success message container
            let successMsg = form.parentElement.querySelector('#form-success') || form.querySelector('.form-success-msg');
            if (!successMsg) {
                successMsg = document.createElement('div');
                successMsg.className = 'form-success-msg hidden bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-start gap-3';
                successMsg.innerHTML = '<i data-lucide="check-circle-2" class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"></i><div><h4 class="font-bold">Message sent successfully!</h4><p class="text-sm">Thank you for your interest. A representative will contact you shortly.</p></div>';
                form.insertBefore(successMsg, form.firstChild);
                if (window.lucide) lucide.createIcons();
            }

            const formData = new FormData(form);
            const object = {};
            formData.forEach((value, key) => { object[key] = value });
            const json = JSON.stringify(object);

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async (response) => {
                    if (response.status == 200) {
                        successMsg.classList.remove('hidden');
                        form.reset();
                    } else {
                        console.error('Submission failed', response);
                    }
                })
                .catch(error => {
                    console.error(error);
                })
                .finally(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    });
});
