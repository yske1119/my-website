

/*!
 * Global Green Event 2025 - JavaScript
 * Main functionality for the event landing page
 */

// Initialize AOS library for scroll animations
AOS.init({
  duration: 1000,
  easing: 'ease-in-out',
  offset: -500,
  delay: 100,
  once: true
});

// DOMContent loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all features
  initializeNavigation();
  initializeLanguageSelector();
  initializeSlider();
  initializeCarousel();
  initializeBackToTop();
  initializeFormHandlers();
  updateDynamicContent();
});

// Navigation functionality
function initializeNavigation() {
  // const header = document.querySelector('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  // // Sticky header on scroll
  // window.addEventListener('scroll', () => {
  //   if (window.scrollY > 100) {
  //     header.classList.add('sticky');
  //   } else {
  //     header.classList.remove('sticky');
  //   }
  // });
  
  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
  
  // Close mobile menu when link is clicked
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
  
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Update active navigation link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });
}

// Language selector functionality
function initializeLanguageSelector() {
  const languageButtons = document.querySelectorAll('.language-selector button');
  const body = document.body;
  
  // Load saved language preference
  const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
  setLanguage(savedLanguage);
  
  languageButtons.forEach(button => {
    button.addEventListener('click', function() {
      const language = this.getAttribute('data-lang');
      setLanguage(language);
    });
  });

  function setLanguage(language) {
    // Update active button
    languageButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-lang') === language) {
        btn.classList.add('active');
      }
    });
    
    // Update body class
    if (language === 'jp') {
      body.classList.add('jp');
      body.classList.remove('en');
    } else {
      body.classList.add('en');
      body.classList.remove('jp');
    }
    console.log('language:'+language)
    console.log('現在のbodyクラス: ', body.className); 
    console.log(document.querySelectorAll('.jp'))
    // Save language preference
    localStorage.setItem('preferredLanguage', language);
  }
 
}

// Hero slider functionality
function initializeSlider() {
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval;
  
  function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentSlide = index;
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }
  
  function startSlider() {
    slideInterval = setInterval(nextSlide, 6000);
  }
  
  function stopSlider() {
    clearInterval(slideInterval);
  }
  
  // Event listeners
  prevBtn.addEventListener('click', () => {
    stopSlider();
    prevSlide();
    startSlider();
  });
  
  nextBtn.addEventListener('click', () => {
    stopSlider();
    nextSlide();
    startSlider();
  });
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopSlider();
      showSlide(index);
      startSlider();
    });
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      stopSlider();
      prevSlide();
      startSlider();
    } else if (e.key === 'ArrowRight') {
      stopSlider();
      nextSlide();
      startSlider();
    }
  });
  
  // Start automatic sliding
  startSlider();
}

// Locations carousel functionality
function initializeCarousel() {
  const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.location-card');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  
  let currentIndex = 0;
  let cardsPerView = calculateCardsPerView();
  let maxIndex = Math.max(0, cards.length - cardsPerView);
  
  function calculateCardsPerView() {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1024) return 3;
    if (screenWidth >= 768) return 2;
    return 1;
  }
  
  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 0; // 30px for gap
    const translateX = -currentIndex * cardWidth;
    track.style.transform = `translateX(${translateX}px)`;
  }
  
  prevBtn.addEventListener('click', () => {
    currentIndex = Math.max(currentIndex - 1, 0);
    updateCarousel();
  });
  
  nextBtn.addEventListener('click', () => {
    currentIndex = Math.min(currentIndex + 1, maxIndex);
    updateCarousel();
  });
  
  // Update cards per view on window resize
  window.addEventListener('resize', () => {
    cardsPerView = calculateCardsPerView();
    maxIndex = Math.max(0, cards.length - cardsPerView);
    currentIndex = Math.min(currentIndex, maxIndex);
    updateCarousel();
  });
  
  // Auto-scroll carousel
  let carouselInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % (maxIndex + 1);
    updateCarousel();
  }, 5000);
  
  // Pause auto-scroll on hover
  track.addEventListener('mouseenter', () => clearInterval(carouselInterval));
  track.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % (maxIndex + 1);
      updateCarousel();
    }, 5000);
  });
}

// Back to top button functionality
function initializeBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  });
  
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Form handlers
function initializeFormHandlers() {
  // Contact form
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      
      // Simulate form submission
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
    });
  }
  
  // Newsletter form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = newsletterForm.querySelector('input[type="email"]').value;
      
      // Simulate newsletter subscription
      alert(`Thank you for subscribing with email: ${email}`);
      newsletterForm.reset();
    });
  }
}

// Dynamic content updates
function updateDynamicContent() {
  // Update current year in footer
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.footer-bottom p').forEach(p => {
    p.innerHTML = p.innerHTML.replace('2025', currentYear);
  });
  
  // Parallax effect on hero section
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
  });
  
  // Animate numbers on scroll
  const animateNumbers = () => {
    const numbers = document.querySelectorAll('.stat .number');
    
    numbers.forEach(number => {
      const updateCount = () => {
        const target = parseInt(number.textContent.replace(/\D/g, ''));
        const count = +number.innerHTML.replace(/\D/g, '');
        const speed = 100;
        
        if (count < target) {
          number.innerHTML = Math.ceil(count + target / speed);
          setTimeout(updateCount, 50);
        } else {
          number.textContent = target + (number.textContent.includes('+') ? '+' : '');
        }
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateCount();
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(number);
    });
  };
  
  animateNumbers();
  
  // Gallery image lazy loading
  const galleryImages = document.querySelectorAll('.gallery-item img, .news-image img');
  const imageOptions = {
    threshold: 0.1,
    rootMargin: '50px 0px'
  };
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '1';
        img.style.transition = 'opacity 0.5s ease';
        
        img.onload = () => {
          img.style.opacity = '1';
        };
        
        observer.unobserve(img);
      }
    });
  }, imageOptions);
  
  galleryImages.forEach(img => {
    imageObserver.observe(img);
  });
  
  // Add hover effect to gallery items
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Typing effect for hero titles
  const typeEffect = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';
    element.style.visibility = 'visible';
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    type();
  };
  
  // Apply typing effect to active slide titles
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains('active')) {
        const h1 = mutation.target.querySelector('h1:not(.jp)');
        if (h1 && !h1.classList.contains('typed')) {
          h1.classList.add('typed');
          const originalText = h1.textContent;
          typeEffect(h1, originalText, 50);
        }
      }
    });
  });
  
  document.querySelectorAll('.slide').forEach(slide => {
    observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
  });
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Enhance scroll performance
let ticking = false;
function requestTick() {
  if (!ticking) {
    window.requestAnimationFrame(updateElements);
    ticking = true;
  }
}

function updateElements() {
  // Update elements based on scroll position
  ticking = false;
}

window.addEventListener('scroll', requestTick);