// Main JavaScript for Portfolio Website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-item');
    const sections = document.querySelectorAll('section[id]');
    const mobileCheckbox = document.getElementById('mobile-menu-checkbox');
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (mobileCheckbox.checked) {
                    mobileCheckbox.checked = false;
                }
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.pushState(null, null, targetId);
                
                // Update active nav item
                updateActiveNav(targetId);
            }
        });
    });
    
    // Update active nav item based on scroll position
    function updateActiveNav(targetId = null) {
        let current = '';
        const scrollPosition = targetId ? 
            document.querySelector(targetId).offsetTop : 
            window.scrollY + 150; // Adjust for header height
        
        // Find current section in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Add offset for better detection
            const sectionHeight = section.offsetHeight;
            const sectionId = '#' + section.getAttribute('id');
            
            if (
                scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight
            ) {
                current = sectionId;
            }
        });
        
        // Update active class on nav items
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
                
                // Scroll the active nav item into view if it's not visible
                const sidebar = document.querySelector('.sidebar');
                const sidebarRect = sidebar.getBoundingClientRect();
                const linkRect = link.getBoundingClientRect();
                
                if (linkRect.bottom > sidebarRect.bottom || linkRect.top < sidebarRect.top) {
                    link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
    }
    
    // Add scroll event listener for active section highlighting
    window.addEventListener('scroll', function() {
        updateActiveNav();
    });
    
    // Set initial active section on page load
    updateActiveNav();

    // Add scroll reveal animation
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };

    // Initial check for animations
    animateOnScroll();
    
    // Check on scroll for animations
    window.addEventListener('scroll', animateOnScroll);

    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top';
    backToTopButton.innerHTML = '↑';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopButton);

    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Back to top functionality
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
    
    // Close mobile menu when clicking on a nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (mobileCheckbox.checked) {
                mobileCheckbox.checked = false;
            }
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous errors
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            document.getElementById('form-message').textContent = '';
            document.getElementById('form-message').className = 'form-message';
            
            // Get form data
            const formData = new FormData(contactForm);
            const submitButton = document.getElementById('submit-button');
            const buttonText = submitButton.querySelector('.button-text');
            const buttonLoader = submitButton.querySelector('.button-loader');
            
            // Show loading state
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'inline-block';
            submitButton.disabled = true;
            
            // Client-side validation
            let isValid = true;
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Validate name
            if (name.length < 2) {
                document.getElementById('name-error').textContent = 'Name must be at least 2 characters long';
                isValid = false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById('email-error').textContent = 'Please enter a valid email address';
                isValid = false;
            }
            
            // Validate subject
            if (subject.length < 5) {
                document.getElementById('subject-error').textContent = 'Subject must be at least 5 characters long';
                isValid = false;
            }
            
            // Validate message
            if (message.length < 10) {
                document.getElementById('message-error').textContent = 'Message must be at least 10 characters long';
                isValid = false;
            }
            
            if (!isValid) {
                buttonText.style.display = 'inline-block';
                buttonLoader.style.display = 'none';
                submitButton.disabled = false;
                return;
            }
            
            // Submit form data via AJAX
            fetch('process_contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Reset form on success
                if (data.message) {
                    contactForm.reset();
                    const messageElement = document.getElementById('form-message');
                    messageElement.textContent = data.message;
                    messageElement.className = 'form-message success';
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        messageElement.textContent = '';
                        messageElement.className = 'form-message';
                    }, 5000);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                const messageElement = document.getElementById('form-message');
                messageElement.textContent = 'An error occurred. Please try again later.';
                messageElement.className = 'form-message error';
            })
            .finally(() => {
                // Reset button state
                buttonText.style.display = 'inline-block';
                buttonLoader.style.display = 'none';
                submitButton.disabled = false;
            });
        });
    }
});
