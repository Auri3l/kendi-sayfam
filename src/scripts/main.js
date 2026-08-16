// ==========================================================================
// ATA YIĞİT TELLİ - PORTFOLYO VE İNTERAKTİF İŞLEMLER (ASTRO SÜRÜMÜ)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initTheme();
    initMobileNav();
    initCustomCursor();
    initContactForm();
    initScrollSpy();
    setupFilters();
    setupAnimationOnScroll();
    initProtectedContact();
});

// --- BILINGUAL (TR / EN) LANGUAGE SWITCHER ---
function initLanguage() {
    const savedLang = localStorage.getItem('user_lang') || 'tr';
    setSiteLanguage(savedLang, false);

    document.querySelectorAll('.lang-btn, .cv-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetLang = btn.getAttribute('data-lang-target');
            if (targetLang) {
                setSiteLanguage(targetLang, true);
            }
        });
    });

    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentLang = document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'tr';
            const newLang = currentLang === 'tr' ? 'en' : 'tr';
            setSiteLanguage(newLang, true);
        });
    });
}

function setSiteLanguage(lang, showNotification = false) {
    const validLang = lang === 'en' ? 'en' : 'tr';
    document.documentElement.setAttribute('data-lang', validLang);
    document.documentElement.setAttribute('lang', validLang);
    localStorage.setItem('user_lang', validLang);

    // Update active class on all segmented buttons (Header & CV)
    document.querySelectorAll('.lang-btn, .cv-lang-btn').forEach(btn => {
        const isTarget = btn.getAttribute('data-lang-target') === validLang;
        btn.classList.toggle('active', isTarget);
    });

    if (showNotification && typeof showToast === 'function') {
        if (validLang === 'en') {
            showToast('Language Changed', 'Switched to English.');
        } else {
            showToast('Dil Değiştirildi', 'Türkçe diline geçildi.');
        }
    }

    window.dispatchEvent(new CustomEvent('siteLanguageChanged', { detail: { lang: validLang } }));
}
window.setSiteLanguage = setSiteLanguage;

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
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Normalize path by stripping trailing slashes
    const cleanPath = window.location.pathname.replace(/\/$/, '').toLowerCase();
    const isHomePage = (cleanPath === '' || cleanPath.endsWith('/kendi-sayfam') || cleanPath.endsWith('index.html') || cleanPath.endsWith('/index'));
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

        if (isHomePage && sections.length > 0) {
            sections.forEach(section => {
                const sectionTop = section.offsetTop - offset;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href') || '';
                        if (href === `#${sectionId}` || href.endsWith(`#${sectionId}`)) {
                            navLinks.forEach(l => l.classList.remove('active'));
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

// --- KORUMALI İLETİŞİM BİLGİLERİ & PASSPHRASE ŞİFRE ÇÖZÜMÜ ---
const ENCRYPTED_CONTACT_DATA = {
    salt: "31fb6bb0361a8317b99f5de9550f3e77",
    iv: "1468fd2662f7eec9023ac25a",
    tag: "d4ecae57b1375f9d2ee4c0b8bf6d4293",
    ciphertext: "947ea3926c271dd4eefa2bbf06c62c93926d3138ce862c60b6b317640f24708cd3e2cb418b38010a2076904778173b36f21c572bec881c5c7364bd92ff9ad1495036d746421e7a4c166a8523597dc81c0d61eade0f46b8"
};

async function decryptContactPayload(passphrase) {
    const norm = passphrase.trim().toLowerCase();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    function hexToBuf(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes.buffer;
    }

    const saltBuf = hexToBuf(ENCRYPTED_CONTACT_DATA.salt);
    const ivBuf = hexToBuf(ENCRYPTED_CONTACT_DATA.iv);
    const ctBuf = hexToBuf(ENCRYPTED_CONTACT_DATA.ciphertext);
    const tagBuf = hexToBuf(ENCRYPTED_CONTACT_DATA.tag);

    const combined = new Uint8Array(ctBuf.byteLength + tagBuf.byteLength);
    combined.set(new Uint8Array(ctBuf), 0);
    combined.set(new Uint8Array(tagBuf), ctBuf.byteLength);

    const baseKey = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(norm),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    const derivedKey = await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: saltBuf,
            iterations: 100000,
            hash: 'SHA-256'
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
    );

    const decryptedBuf = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: ivBuf },
        derivedKey,
        combined
    );

    const jsonStr = decoder.decode(decryptedBuf);
    return JSON.parse(jsonStr);
}

function updateDOMWithDecryptedContact(data) {
    // 1. Hero Meta Card Slots (index.astro)
    const heroPhoneSlot = document.getElementById('heroPhoneSlot');
    if (heroPhoneSlot) {
        heroPhoneSlot.innerHTML = `<a href="${data.phoneTel}" class="meta-value unlocked-link">${data.phone}</a>`;
    }

    const heroAddressSlot = document.getElementById('heroAddressSlot');
    if (heroAddressSlot) {
        heroAddressSlot.innerHTML = `<span class="meta-value unlocked-text">${data.address}</span>`;
    }

    // 2. Contact Page Slots (iletisim.astro)
    const contactPhoneSlot = document.getElementById('contactPhoneSlot');
    const contactPhoneCard = document.getElementById('contactPhoneCard');
    if (contactPhoneSlot && contactPhoneCard) {
        contactPhoneCard.removeAttribute('data-action');
        contactPhoneCard.removeAttribute('role');
        contactPhoneCard.removeAttribute('tabindex');
        contactPhoneCard.removeAttribute('title');
        contactPhoneCard.style.cursor = 'default';
        contactPhoneSlot.innerHTML = `
            <span class="contact-label">Telefon</span>
            <a href="${data.phoneTel}" class="contact-value unlocked-link">${data.phone}</a>
        `;
        const badgeBtn = contactPhoneCard.querySelector('.btn-unlock-badge, [data-action="unlockContact"]');
        if (badgeBtn) {
            badgeBtn.outerHTML = `<span class="unlocked-badge" title="Bilgi Doğrulandı">🔓 Doğrulandı</span>`;
        }
    }

    const contactAddressSlot = document.getElementById('contactAddressSlot');
    const contactAddressCard = document.getElementById('contactAddressCard');
    if (contactAddressSlot && contactAddressCard) {
        contactAddressCard.removeAttribute('data-action');
        contactAddressCard.removeAttribute('role');
        contactAddressCard.removeAttribute('tabindex');
        contactAddressCard.removeAttribute('title');
        contactAddressCard.style.cursor = 'default';
        contactAddressSlot.innerHTML = `
            <span class="contact-label">Konum / Adres</span>
            <span class="contact-value unlocked-text">${data.address}</span>
        `;
        const badgeBtn = contactAddressCard.querySelector('.btn-unlock-badge, [data-action="unlockContact"]');
        if (badgeBtn) {
            badgeBtn.outerHTML = `<span class="unlocked-badge" title="Bilgi Doğrulandı">🔓 Doğrulandı</span>`;
        }
    }

    // 3. CV Page Slot (cv.astro)
    const cvPhoneSlot = document.getElementById('cvPhoneSlot');
    if (cvPhoneSlot) {
        cvPhoneSlot.innerHTML = `<a href="${data.phoneTel}" class="hcv-link">${data.phone}</a>`;
    }
}

function initProtectedContact() {
    const modal = document.getElementById('passphraseModal');
    const form = document.getElementById('passphraseForm');
    const input = document.getElementById('passphraseInput');
    const closeBtn = document.getElementById('closePassphraseModal');

    // Check if previously decrypted in this session
    const savedDecrypted = sessionStorage.getItem('decryptedContactData');
    if (savedDecrypted) {
        try {
            const data = JSON.parse(savedDecrypted);
            updateDOMWithDecryptedContact(data);
        } catch (e) {
            sessionStorage.removeItem('decryptedContactData');
        }
    }

    // Open Modal Triggers
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-action="unlockContact"]');
        if (trigger) {
            e.preventDefault();
            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => input?.focus(), 100);
            }
        }
    });

    const closeModal = () => {
        if (modal) modal.classList.add('hidden');
        if (input) input.value = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const val = input ? input.value : '';
            if (!val) return;

            const submitBtn = document.getElementById('btnUnlockSubmit');
            if (submitBtn) submitBtn.disabled = true;

            try {
                const decryptedData = await decryptContactPayload(val);
                sessionStorage.setItem('decryptedContactData', JSON.stringify(decryptedData));
                updateDOMWithDecryptedContact(decryptedData);
                closeModal();
                showToast('Erişim Onaylandı', 'Telefon numarası ve adres başarıyla çözüldü.', 'success');
            } catch (err) {
                showToast('Hatalı Passphrase', 'Girilen şifre geçersiz. Lütfen tekrar deneyiniz.', 'error');
                if (input) {
                    input.classList.add('input-shake');
                    setTimeout(() => input.classList.remove('input-shake'), 500);
                }
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
}

