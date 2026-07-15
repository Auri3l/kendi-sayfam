// ==========================================================================
// ATA YIĞİT TELLİ - PORTFOLYO VE İNTERAKTİF İŞLEMLER (ASTRO SÜRÜMÜ)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initCustomCursor();
    initContactForm();
    initScrollSpy();
    setupFilters();
    setupAnimationOnScroll();
});

// --- KARANLIK/AYDINLIK TEMA GEÇİŞİ ---
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const body = document.body;
    if (!themeToggleBtn) return;
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        body.className = savedTheme;
    } else if (systemPrefersDark) {
        body.className = 'dark-theme';
    } else {
        body.className = 'light-theme';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
            showToast('Tema Değiştirildi', 'Endüstriyel Açık Tema Aktif.');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            showToast('Tema Değiştirildi', 'Endüstriyel Koyu Tema Aktif.');
        }
    });
}

// --- MOBİL MENÜ YÖNETİMİ ---
function initMobileNav() {
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    if (!mobileNavToggle || !navMenu) return;
    
    const navLinks = document.querySelectorAll('.nav-link');

    mobileNavToggle.addEventListener('click', () => {
        mobileNavToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileNavToggle.contains(e.target) && navMenu.classList.contains('open')) {
            mobileNavToggle.classList.remove('open');
            navMenu.classList.remove('open');
        }
    });
}

// --- LÜKS ÖZEL İMLEÇ ANİMASYONU ---
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    if (!cursor || !cursorDot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let isMoving = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isMoving) {
            cursor.style.opacity = '1';
            cursorDot.style.opacity = '1';
            isMoving = true;
        }

        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function animateCursor() {
        const delay = 8;
        cursorX += (mouseX - cursorX) / delay;
        cursorY += (mouseY - cursorY) / delay;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const updateHoverElements = () => {
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .timeline-card, .filter-btn, .project-filter-btn, .blog-card');
        
        interactiveElements.forEach(el => {
            // Çakışmayı önlemek için önce dinleyicileri kaldırıp tekrar eklemiyoruz, doğrudan tekil ekliyoruz
            el.removeEventListener('mouseenter', onMouseEnter);
            el.removeEventListener('mouseleave', onMouseLeave);
            
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });
    };

    function onMouseEnter() {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.backgroundColor = 'rgba(var(--accent-rgb), 0.1)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
    }

    function onMouseLeave() {
        cursor.style.width = '24px';
        cursor.style.height = '24px';
        cursor.style.backgroundColor = 'transparent';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    }

    updateHoverElements();
    
    // DOM değişimlerini izle (yeni eklenen elemanlara imleç efekti eklemek için)
    const observer = new MutationObserver(updateHoverElements);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
        isMoving = false;
    });
}

// Global scope'a imleç tetikleyicisi ekleyelim
window.initCustomCursor = initCustomCursor;

// --- İLETİŞİM FORMU DOĞRULAMA VE TOAST BİLDİRİMİ ---
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.parentElement.classList.contains('invalid')) {
                validateField(input);
            }
        });
    });

    function validateField(field) {
        let isValid = true;
        const parent = field.parentElement;
        
        if (!field.value.trim()) {
            isValid = false;
        } else if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(field.value.trim());
        }

        if (isValid) {
            parent.classList.remove('invalid');
        } else {
            parent.classList.add('invalid');
        }
        
        return isValid;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            showToast('Form Hatası', 'Lütfen tüm zorunlu (*) alanları doğru şekilde doldurun.', 'error');
            return;
        }

        const submitBtn = document.getElementById('submitBtn');
        const submitSpan = submitBtn.querySelector('span');
        const spinner = submitBtn.querySelector('.send-spinner');
        
        submitBtn.disabled = true;
        submitSpan.textContent = 'Gönderiliyor...';
        spinner.classList.remove('hidden');

        setTimeout(() => {
            submitBtn.disabled = false;
            submitSpan.textContent = 'Gönder';
            spinner.classList.add('hidden');
            
            showToast('Mesajınız İletildi', `Sayın ${document.getElementById('formName').value}, mesajınız başarıyla gönderildi. En kısa sürede dönüş yapılacaktır.`);
            
            form.reset();
            inputs.forEach(input => input.parentElement.classList.remove('invalid'));
        }, 1800);
    });
}

// --- DİNAMİK TOAST BİLDİRİM SİSTEMİ ---
function showToast(title, message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    
    const icon = type === 'success' 
        ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
        : `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

    toast.innerHTML = `
        <div style="color: var(--accent-color);">${icon}</div>
        <div style="display: flex; flex-direction: column; gap: 0.15rem;">
            <strong style="font-size: 0.9rem; font-weight: 700;">${title}</strong>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">${message}</span>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-closing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 4000);
}

// Global scope'a açalım
window.showToast = showToast;

// --- SCROLL SPY (ÇOKLU SAYFA DESTEKLİ AKTİF MENÜ BAĞLANTISI) ---
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    const isHomePage = (currentPage === 'index.html' || currentPage === '' || currentPage === '/' || currentPage === 'kendi-sayfam' || currentPage === 'kendi-sayfam/');
    const offset = 100;

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY || document.documentElement.scrollTop;

        if (scrollIndicator) {
            if (scrollPos > 50) {
                scrollIndicator.classList.add('hidden-indicator');
            } else {
                scrollIndicator.classList.remove('hidden-indicator');
            }
        }

        if (isHomePage) {
            sections.forEach(section => {
                const sectionTop = section.offsetTop - offset;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        const href = link.getAttribute('href');
                        if (href === `#${sectionId}` || href === `index.html#${sectionId}` || href.endsWith(`#${sectionId}`)) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        const header = document.querySelector('.main-header');
        if (header) {
            if (scrollPos > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
}

// --- FİLTRE DÜĞMELERİ ÇALIŞMA MANTIĞI (CSS BAZLI HIZLI HİLE) ---
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterVal = btn.getAttribute('data-filter');
            timelineItems.forEach(item => {
                const categories = (item.getAttribute('data-categories') || '').split(' ');
                if (filterVal === 'all' || categories.includes(filterVal)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
            initCustomCursor();
        });
    });

    const projFilterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    projFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            projFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-proj-filter');
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const tags = (card.getAttribute('data-tags') || '').toLowerCase();
                
                if (filterVal === 'all') {
                    card.style.display = 'flex';
                } else if (filterVal === 'facade') {
                    if (tags.includes('tasarım') || tags.includes('cephe') || tags.includes('facade')) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                } else {
                    if (category === filterVal) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
            initCustomCursor();
        });
    });
}

// --- INTERACTION OBSERVER (GİRİŞ ANİMASYONLARI & SKILL BARS) ---
function setupAnimationOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const checkReveals = () => {
        document.querySelectorAll('.timeline-item, .project-card, .education-card, .interest-card, .blog-card').forEach(el => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
            }
            revealObserver.observe(el);
        });
    };
    
    setTimeout(checkReveals, 300);
    
    const skillBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const level = fill.getAttribute('data-level');
                fill.style.width = `${level}%`;
                skillBarObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.5 });

    setTimeout(() => {
        document.querySelectorAll('.skill-bar-fill').forEach(bar => {
            skillBarObserver.observe(bar);
        });
    }, 500);
}
