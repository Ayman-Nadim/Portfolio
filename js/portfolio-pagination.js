/**
 * Portfolio Pagination Script
 * Handles dynamic pagination for portfolio items
 */

(function() {
  'use strict';

  // Configuration
  const ITEMS_PER_PAGE = 6;
  
  // State
  let currentPage = 1;
  let totalPages = 1;
  let portfolioItems = [];

  /**
   * Initialize pagination
   */
  function initPagination() {
    // Get all portfolio items
    portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (portfolioItems.length === 0) {
      console.warn('No portfolio items found');
      return;
    }

    // Calculate total pages
    totalPages = Math.ceil(portfolioItems.length / ITEMS_PER_PAGE);

    // Set up page numbers based on data-page attribute if it exists
    const maxPage = Math.max(...Array.from(portfolioItems).map(item => 
      parseInt(item.getAttribute('data-page') || '1')
    ));
    
    if (maxPage > totalPages) {
      totalPages = maxPage;
    }

    // Create page numbers
    createPageNumbers();

    // Set up event listeners
    setupEventListeners();

    // Show first page
    showPage(1);

    console.log(`Pagination initialized: ${portfolioItems.length} items, ${totalPages} pages`);
  }

  /**
   * Create page number buttons
   */
  function createPageNumbers() {
    const pageNumbersContainer = document.getElementById('pageNumbers');
    if (!pageNumbersContainer) return;

    pageNumbersContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('div');
      pageBtn.className = 'page-number';
      pageBtn.textContent = i;
      pageBtn.dataset.page = i;
      
      if (i === currentPage) {
        pageBtn.classList.add('active');
      }

      pageBtn.addEventListener('click', () => {
        showPage(i);
        scrollToPortfolio();
      });

      pageNumbersContainer.appendChild(pageBtn);
    }
  }

  /**
   * Set up event listeners for prev/next buttons
   */
  function setupEventListeners() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          showPage(currentPage - 1);
          scrollToPortfolio();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          showPage(currentPage + 1);
          scrollToPortfolio();
        }
      });
    }
  }

  /**
   * Show specific page
   * @param {number} pageNum - Page number to show
   */
  function showPage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages) {
      console.warn(`Invalid page number: ${pageNum}`);
      return;
    }

    currentPage = pageNum;

    // Hide all items first
    portfolioItems.forEach(item => {
      item.classList.remove('active');
    });

    // Show items for current page
    // Check if items have data-page attribute
    const hasDataPageAttr = portfolioItems[0].hasAttribute('data-page');
    
    if (hasDataPageAttr) {
      // Use data-page attribute
      portfolioItems.forEach(item => {
        const itemPage = parseInt(item.getAttribute('data-page'));
        if (itemPage === pageNum) {
          item.classList.add('active');
        }
      });
    } else {
      // Calculate based on index
      const startIndex = (pageNum - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;

      for (let i = startIndex; i < endIndex && i < portfolioItems.length; i++) {
        portfolioItems[i].classList.add('active');
      }
    }

    // Update UI
    updatePaginationUI();

    // Trigger isotope layout if available
    if (typeof $.fn.isotope !== 'undefined') {
      setTimeout(() => {
        $('.art-grid').isotope('layout');
      }, 100);
    }
  }

  /**
   * Update pagination UI (buttons and page numbers)
   */
  function updatePaginationUI() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageNumbers = document.querySelectorAll('.page-number');

    // Update prev button
    if (prevBtn) {
      prevBtn.disabled = currentPage === 1;
    }

    // Update next button
    if (nextBtn) {
      nextBtn.disabled = currentPage === totalPages;
    }

    // Update page numbers
    pageNumbers.forEach(btn => {
      const pageNum = parseInt(btn.dataset.page);
      if (pageNum === currentPage) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /**
   * Scroll to portfolio section
   */
  function scrollToPortfolio() {
    const portfolioSection = document.getElementById('portfolio-section');
    if (portfolioSection) {
      const offset = window.innerWidth <= 920 ? 70 : 0;
      const sectionTop = portfolioSection.offsetTop - offset;
      
      window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Handle keyboard navigation
   */
  function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Only handle if not in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch(e.key) {
        case 'ArrowLeft':
          if (currentPage > 1) {
            showPage(currentPage - 1);
            scrollToPortfolio();
          }
          break;
        case 'ArrowRight':
          if (currentPage < totalPages) {
            showPage(currentPage + 1);
            scrollToPortfolio();
          }
          break;
      }
    });
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Re-trigger layout if isotope is available
        if (typeof $.fn.isotope !== 'undefined') {
          $('.art-grid').isotope('layout');
        }
      }, 250);
    });
  }

  /**
   * Initialize on DOM ready
   */
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initPagination();
        setupKeyboardNavigation();
        handleResize();
      });
    } else {
      initPagination();
      setupKeyboardNavigation();
      handleResize();
    }
  }

  // Start initialization
  init();

  // Expose public API
  window.PortfolioPagination = {
    showPage: showPage,
    getCurrentPage: () => currentPage,
    getTotalPages: () => totalPages,
    refresh: initPagination
  };

  console.log('Portfolio Pagination script loaded');

})();

/**
 * Smooth scroll for "Explore My Projects" button
 */
document.addEventListener('DOMContentLoaded', function() {
  const exploreBtn = document.querySelector('.scroll-to-portfolio');
  
  if (exploreBtn) {
    exploreBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const portfolioSection = document.getElementById('portfolio-section');
      
      if (portfolioSection) {
        const offset = window.innerWidth <= 920 ? 70 : 0;
        const sectionTop = portfolioSection.offsetTop - offset;
        
        window.scrollTo({
          top: sectionTop,
          behavior: 'smooth'
        });
      }
    });
  }
});