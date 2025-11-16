document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.getElementById('heroSection');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const currentSectionSpan = document.querySelector('.current-section');
    const sectionNames = {
        'home': 'Home',
        'menu': 'Menu',
        'about': 'About',
        'contact': 'Contact',
        'catering': 'Catering',
        'experiences': 'Experiences',
        'more': 'More'
    };
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all nav links
            navLinks.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Update mobile dropdown current section text
            if (currentSectionSpan && sectionNames[targetSection]) {
                currentSectionSpan.textContent = sectionNames[targetSection];
            }
            
            // Close mobile dropdown if open
            const mobileDropdown = document.querySelector('.mobile-dropdown');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileDropdown && mobileToggle) {
                mobileDropdown.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
            
            // If Home is clicked, expand hero section and show home content
            if (targetSection === 'home') {
                heroSection.classList.remove('collapsed');
                
                // Hide all content sections
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show home section after hero expands
                setTimeout(() => {
                    const homeSection = document.getElementById('home');
                    if (homeSection) {
                        homeSection.classList.add('active');
                    }
                    // Scroll to top smoothly
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 300);
            } else {
                // Collapse hero section for other sections
                heroSection.classList.add('collapsed');
                
                // Hide all content sections
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show target section after a short delay for smooth transition
                setTimeout(() => {
                    const target = document.getElementById(targetSection);
                    if (target) {
                        target.classList.add('active');
                        // Scroll to top smoothly, accounting for fixed header
                        const headerHeight = document.querySelector('.navbar').offsetHeight;
                        window.scrollTo({
                            top: target.offsetTop - headerHeight,
                            behavior: 'smooth'
                        });
                    }
                }, 300);
            }
        });
    });
    
    // Handle "View Menu" button in home section
    const viewMenuBtn = document.querySelector('.view-menu-btn');
    if (viewMenuBtn) {
        viewMenuBtn.addEventListener('click', function() {
            const menuLink = document.querySelector('[data-section="menu"]');
            if (menuLink) {
                menuLink.click();
            }
        });
    }
    
    // Handle reservation form submission
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your reservation request! We will contact you shortly to confirm.');
            this.reset();
        });
    }
    
    // Handle "Order Online" button
    const orderBtn = document.querySelector('.order-btn');
    if (orderBtn) {
        orderBtn.addEventListener('click', function() {
            alert('Order online feature coming soon!');
        });
    }
    
    // Handle menu tab switching
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuTabContents = document.querySelectorAll('.menu-tab-content');
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            menuTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab contents
            menuTabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show target tab content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
                // Smooth scroll to top of menu section
                targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Handle mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileDropdown = document.querySelector('.mobile-dropdown');
    
    if (mobileMenuToggle && mobileDropdown) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            mobileDropdown.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!mobileDropdown.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    mobileMenuToggle.classList.remove('active');
                    mobileDropdown.classList.remove('active');
                }
            }
        });
    }
});

