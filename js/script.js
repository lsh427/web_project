document.addEventListener('DOMContentLoaded', () => {

    // --- 부드러운 스크롤 함수 ---
    function smoothScrollTo(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // --- 네비게이션 공통 로직 ---
    document.querySelectorAll('.nav-link, .mobile-nav-link, .site-logo').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (mobileMenu.classList.contains('open')) {
                closeMobileMenu();
                setTimeout(() => smoothScrollTo(targetId), 300);
            } else {
                smoothScrollTo(targetId);
            }
        });
    });
    
    // --- 모바일 네비게이션 ---
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    function openMobileMenu() {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    }

    hamburgerBtn?.addEventListener('click', openMobileMenu);
    closeMobileMenuBtn?.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay?.addEventListener('click', closeMobileMenu);


    // --- 맛집 카드 링크 이동 ---
    document.querySelectorAll('.restaurant-card').forEach(card => {
        card.addEventListener('click', () => {
            const link = card.dataset.link;
            if (link) {
                window.open(link, '_blank');
            }
        });
    });


    // --- 사진첩 모달 ---
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let currentImageIndex = 0;
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            showImageInModal(currentImageIndex);
        });
    });

    function showImageInModal(index) {
        const img = galleryItems[index].querySelector('img');
        if (!img) return;

        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalDescription.textContent = img.dataset.description || '';
        
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        document.getElementById('prevImage').classList.toggle('hidden', index === 0);
        document.getElementById('nextImage').classList.toggle('hidden', index === galleryItems.length - 1);
    }

    function changeImage(direction) {
        const newIndex = currentImageIndex + direction;
        if (newIndex >= 0 && newIndex < galleryItems.length) {
            currentImageIndex = newIndex;
            showImageInModal(currentImageIndex);
        }
    }

    function closeImageModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    document.getElementById('modalClose').addEventListener('click', closeImageModal);
    document.getElementById('prevImage').addEventListener('click', () => changeImage(-1));
    document.getElementById('nextImage').addEventListener('click', () => changeImage(1));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeImageModal();
    });

    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeImageModal();
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'ArrowRight') changeImage(1);
    });

    // --- 스크롤에 따른 네비게이션 링크 활성화 ---
    const sections = document.querySelectorAll('main section[id]');
    const desktopNavLinks = document.querySelectorAll('.desktop-nav-links .nav-link');
    
    window.addEventListener('scroll', () => {
        const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerOffset - 20;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        desktopNavLinks.forEach(link => {
            link.classList.remove('nav-link-active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('nav-link-active');
            }
        });
    });
});
