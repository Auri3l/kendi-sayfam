// ==========================================================================
// ATA YIĞİT TELLİ - PORTFOLYO VE İNTERAKTİF İŞLEMLER (ASTRO SÜRÜMÜ)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initTheme();
    initMobileNav();
    initContactForm();
    initScrollSpy();
    setupFilters();
    setupAnimationOnScroll();
    initProtectedContact();
});

// --- BILINGUAL (TR / EN) LANGUAGE SWITCHER ---
function initLanguage() {
    const savedLang = localStorage.getItem('user_lang') || 'tr';
    setSiteLanguage(savedLang);

    document.querySelectorAll('.lang-btn, .cv-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetLang = btn.getAttribute('data-lang-target');
            if (targetLang) {
                setSiteLanguage(targetLang);
            }
        });
    });

    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentLang = document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'tr';
            const newLang = currentLang === 'tr' ? 'en' : 'tr';
            setSiteLanguage(newLang);
        });
    });
}

function setSiteLanguage(lang) {
    const validLang = lang === 'en' ? 'en' : 'tr';
    document.documentElement.setAttribute('data-lang', validLang);
    document.documentElement.setAttribute('lang', validLang);
    localStorage.setItem('user_lang', validLang);

    // Update active class on all segmented buttons (Header & CV)
    document.querySelectorAll('.lang-btn, .cv-lang-btn').forEach(btn => {
        const isTarget = btn.getAttribute('data-lang-target') === validLang;
        btn.classList.toggle('active', isTarget);
    });

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
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
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

// --- İLETİŞİM FORMU DOĞRULAMA ---
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

        if (!isFormValid) return;

        const submitBtn = document.getElementById('submitBtn');
        const submitSpan = submitBtn ? submitBtn.querySelector('span') : null;
        const spinner = submitBtn ? submitBtn.querySelector('.send-spinner') : null;
        
        if (submitBtn) submitBtn.disabled = true;
        if (submitSpan) submitSpan.textContent = '...';
        if (spinner) spinner.classList.remove('hidden');

        setTimeout(() => {
            if (submitBtn) submitBtn.disabled = false;
            if (submitSpan) submitSpan.textContent = 'Gönder';
            if (spinner) spinner.classList.add('hidden');
            
            form.reset();
            inputs.forEach(input => input.parentElement.classList.remove('invalid'));
        }, 1200);
    });
}

// --- TOAST BİLDİRİMLERİ (DEVRE DIŞI) ---
function showToast() {
    // Toast popupları kullanıcı tercihi doğrultusunda tamamen kaldırıldı.
}
window.showToast = showToast;

// --- SCROLL SPY (AKTİF MENÜ BAĞLANTISI) ---
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    const cleanPath = window.location.pathname.replace(/\/$/, '').toLowerCase();
    const isHomePage = (cleanPath === '' || cleanPath.endsWith('/kendi-sayfam') || cleanPath.endsWith('index.html') || cleanPath.endsWith('/index'));
    const offset = 80;

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY || document.documentElement.scrollTop;
        
        if (scrollIndicator) {
            if (scrollPos > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '0.7';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }

        if (!isHomePage) return;

        sections.forEach(sec => {
            const top = sec.offsetTop - offset;
            const bottom = top + sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href && (href.endsWith(`#${id}`) || href === `#${id}`)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// --- DENEYİM VE PROJE FİLTRELEME SİSTEMİ ---
function setupFilters() {
    // 1. Deneyim Filtreleri (Timeline)
    const timelineFilterBtns = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            timelineFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            timelineItems.forEach(item => {
                const categories = item.getAttribute('data-categories') || '';
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.style.display = 'grid';
                    item.style.opacity = '1';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 2. Proje Filtreleri
    const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    projectFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            projectFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-proj-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                const tags = card.getAttribute('data-tags') || '';
                
                if (filterValue === 'all' || category === filterValue || tags.toLowerCase().includes(filterValue.toLowerCase())) {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// --- KAYDIRMA ESNASINDA ORTAYA ÇIKMA (REVEAL) ---
function setupAnimationOnScroll() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
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
    
    setTimeout(checkReveals, 200);
    
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
    }, 400);
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
    const tagBuf = hexToBuf(ENCRYPTED_CONTACT_DATA.tag);
    const cipherBuf = hexToBuf(ENCRYPTED_CONTACT_DATA.ciphertext);

    const combinedCiphertext = new Uint8Array(cipherBuf.byteLength + tagBuf.byteLength);
    combinedCiphertext.set(new Uint8Array(cipherBuf), 0);
    combinedCiphertext.set(new Uint8Array(tagBuf), cipherBuf.byteLength);

    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(norm),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBuf,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
    );

    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: ivBuf
        },
        key,
        combinedCiphertext
    );

    const jsonStr = decoder.decode(decrypted);
    return JSON.parse(jsonStr);
}

function updateDOMWithDecryptedContact(data) {
    // 1. Hero Slots
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
            badgeBtn.outerHTML = `<span class="unlocked-badge" title="Doğrulandı">Doğrulandı</span>`;
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
            badgeBtn.outerHTML = `<span class="unlocked-badge" title="Doğrulandı">Doğrulandı</span>`;
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
            } catch (err) {
                if (input) {
                    input.style.borderColor = '#ef4444';
                    setTimeout(() => { input.style.borderColor = ''; }, 1500);
                }
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
}
