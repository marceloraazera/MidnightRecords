document.addEventListener('DOMContentLoaded', () => {
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const dots = Array.from(document.querySelectorAll('.dot-indicator'));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentIndex = 0;

    function updateCarousel(index) {
        currentIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentIndex);
        });
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    function moveNext() {
        updateCarousel(currentIndex + 1);
    }

    function movePrev() {
        updateCarousel(currentIndex - 1);
    }

    nextBtn?.addEventListener('click', moveNext);
    prevBtn?.addEventListener('click', movePrev);

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const slideIndex = Number(dot.dataset.slide);
            updateCarousel(slideIndex);
        });
    });

    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
    });

    revealElements.forEach((element) => revealObserver.observe(element));

    // -------------------------------------------------------------
    // SEARCH & MOBILE NAVIGATION LOGIC
    // -------------------------------------------------------------
    const albumSearch = document.getElementById('album-search');
    const searchDropdown = document.getElementById('search-results-dropdown');
    
    // Index the carousel records dynamically
    const albums = slides.map((slide, index) => {
        const coverImg = slide.querySelector('.album-cover')?.getAttribute('src') || '';
        const genre = slide.querySelector('.album-genre')?.textContent || '';
        const title = slide.querySelector('.album-title')?.textContent || '';
        const artist = slide.querySelector('.album-artist')?.textContent || '';
        const price = slide.querySelector('.price-current')?.textContent || '';
        
        return {
            index,
            coverImg,
            genre,
            title,
            artist,
            price
        };
    });

    // Helper function to remove diacritics for clean searches
    function cleanString(str) {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    function renderResults(results) {
        searchDropdown.innerHTML = '';
        
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'search-no-results';
            noResults.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> Nenhum disco encontrado`;
            searchDropdown.appendChild(noResults);
            return;
        }

        results.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <img src="${item.coverImg}" alt="${item.title}" class="search-result-cover" onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=60';">
                <div class="search-result-info">
                    <span class="search-result-title">${item.title}</span>
                    <span class="search-result-artist">${item.artist}</span>
                    <span class="search-result-genre">${item.genre}</span>
                </div>
                <span class="search-result-price">${item.price}</span>
            `;
            
            resultItem.addEventListener('click', () => {
                // Navigate carousel to the selected index
                updateCarousel(item.index);
                
                // Reset search bar
                albumSearch.value = '';
                searchDropdown.classList.add('hidden');
                
                // Smooth scroll to the carousel showcase
                const carouselSection = document.getElementById('carousel-section');
                carouselSection?.scrollIntoView({ behavior: 'smooth' });
            });
            
            searchDropdown.appendChild(resultItem);
        });
    }

    albumSearch?.addEventListener('input', (e) => {
        const query = cleanString(e.target.value);
        
        if (!query) {
            searchDropdown.classList.add('hidden');
            return;
        }

        const filtered = albums.filter(album => {
            return cleanString(album.title).includes(query) || 
                   cleanString(album.artist).includes(query) || 
                   cleanString(album.genre).includes(query);
        });

        renderResults(filtered);
        searchDropdown.classList.remove('hidden');
    });

    // Close search dropdown on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            searchDropdown?.classList.add('hidden');
        }
    });

    // Mobile Navigation Controls
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileMenu() {
        mobileNavOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileNavOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileMenuBtn?.addEventListener('click', openMobileMenu);
    closeMobileMenuBtn?.addEventListener('click', closeMobileMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    updateCarousel(0);
});