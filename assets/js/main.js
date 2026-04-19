// header.js - Complete header navigation and scroll functionality
(function() {
    'use strict';

    /**
     * Header Controller
     * Handles mobile menu toggle and scroll-based background changes
     */
    class HeaderController {
        constructor() {
            this.isMenuOpen = false;
            this.breakpoint = 768;
            this.scrollThreshold = 50;
            this.elements = {
                menuButton: null,
                closeButton: null,
                navigation: null,
                header: null
            };
            
            this.init();
        }

        /**
         * Initialize the header controller
         */
        init() {
            this.captureElements();
            
            if (this.hasRequiredElements()) {
                this.attachEventListeners();
                this.setupResponsiveHandler();
                this.setInitialState();
                this.handleScrollBackground(); // Initial check on load
            }
        }

        /**
         * Capture DOM elements
         */
        captureElements() {
            this.elements.menuButton = document.querySelector('header button.md\\:hidden');
            this.elements.closeButton = document.querySelector('nav button.md\\:hidden');
            this.elements.navigation = document.querySelector('header nav');
            this.elements.header = document.querySelector('header');
        }

        /**
         * Check if required elements exist
         */
        hasRequiredElements() {
            const hasHeader = this.elements.header !== null;
            const hasNav = this.elements.navigation !== null;
            
            if (!hasHeader) {
                console.warn('Header Controller: Header element not found');
            }
            
            return hasHeader && hasNav;
        }

        /**
         * Attach all event listeners
         */
        attachEventListeners() {
            // Menu button click
            if (this.elements.menuButton) {
                this.elements.menuButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openMenu();
                });
            }

            // Close button click
            if (this.elements.closeButton) {
                this.elements.closeButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeMenu();
                });
            }

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMenuOpen) {
                    this.closeMenu();
                }
            });

            // Close on link click (mobile only)
            const navLinks = this.elements.navigation.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < this.breakpoint) {
                        this.closeMenu();
                    }
                });
            });

            // Scroll event for header background
            window.addEventListener('scroll', () => {
                this.handleScrollBackground();
            });
        }

        /**
         * Handle scroll-based header background change
         */
        handleScrollBackground() {
            if (!this.elements.header) return;
            
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollPosition > this.scrollThreshold) {
                // Add bg-white when scrolled down
                if (!this.elements.header.classList.contains('bg-white')) {
                    this.elements.header.classList.remove('bg-transparent');
                    this.elements.header.classList.add('bg-white');
                }
            } else {
                // Add bg-transparent when at top
                if (!this.elements.header.classList.contains('bg-transparent')) {
                    this.elements.header.classList.remove('bg-white');
                    this.elements.header.classList.add('bg-transparent');
                }
            }
        }

        /**
         * Open mobile menu
         */
        openMenu() {
            if (this.isMenuOpen) return;
            
            this.isMenuOpen = true;
            this.elements.navigation.classList.remove('translate-x-full');
            this.elements.navigation.classList.add('translate-x-0');
            document.body.style.overflow = 'hidden';
        }

        /**
         * Close mobile menu
         */
        closeMenu() {
            if (!this.isMenuOpen) return;
            
            this.isMenuOpen = false;
            this.elements.navigation.classList.remove('translate-x-0');
            this.elements.navigation.classList.add('translate-x-full');
            document.body.style.overflow = '';
        }

        /**
         * Setup responsive handler for window resize
         */
        setupResponsiveHandler() {
            const mediaQuery = window.matchMedia(`(max-width: ${this.breakpoint - 1}px)`);
            
            const handleResize = (e) => {
                if (!e.matches && this.isMenuOpen) {
                    this.resetMenu();
                }
            };
            
            mediaQuery.addEventListener('change', handleResize);
            
            // Also handle orientation change
            window.addEventListener('orientationchange', () => {
                if (window.innerWidth >= this.breakpoint && this.isMenuOpen) {
                    this.resetMenu();
                }
            });
        }

        /**
         * Reset menu to default state
         */
        resetMenu() {
            this.isMenuOpen = false;
            this.elements.navigation.classList.remove('translate-x-0');
            this.elements.navigation.classList.add('translate-x-full');
            document.body.style.overflow = '';
        }

        /**
         * Set initial state based on screen size and scroll position
         */
        setInitialState() {
            // Set initial mobile menu state
            if (window.innerWidth >= this.breakpoint) {
                this.elements.navigation.classList.remove('translate-x-full', 'translate-x-0');
            } else {
                this.elements.navigation.classList.add('translate-x-full');
                this.elements.navigation.classList.remove('translate-x-0');
            }
            
            // Set initial header background based on scroll position
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollPosition > this.scrollThreshold) {
                this.elements.header.classList.add('bg-white');
                this.elements.header.classList.remove('bg-transparent');
            } else {
                this.elements.header.classList.add('bg-transparent');
                this.elements.header.classList.remove('bg-white');
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.headerController = new HeaderController();
        });
    } else {
        window.headerController = new HeaderController();
    }
})();