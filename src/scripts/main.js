// Storage is optional: private browsing must not disable the interface.
const preference = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} }
};

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
    const savedLang = preference.get('user_lang') || 'tr';
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
    preference.set('user_lang', validLang);

    // Update active class on all segmented buttons (Header & CV)
    document.querySelectorAll('.lang-btn, .cv-lang-btn').forEach(btn => {
        const isTarget = btn.getAttribute('data-lang-target') === validLang;
        btn.classList.toggle('active', isTarget);
        btn.setAttribute('aria-pressed', String(isTarget));
    });

    window.dispatchEvent(new CustomEvent('siteLanguageChanged', { detail: { lang: validLang } }));
}
window.setSiteLanguage = setSiteLanguage;

// --- KARANLIK/AYDINLIK TEMA GEÇİŞİ ---
function initTheme() {
    const button = document.getElementById('themeToggle');
    const root = document.documentElement;
    const system = matchMedia('(prefers-color-scheme: dark)');
    function apply(dark) {
        root.classList.toggle('dark-theme', dark);
        root.classList.toggle('light-theme', !dark);
        button?.setAttribute('aria-pressed', String(dark));
    }
    apply(root.classList.contains('dark-theme'));
    button?.addEventListener('click', () => {
        const dark = !root.classList.contains('dark-theme');
        apply(dark);
        preference.set('theme', dark ? 'dark-theme' : 'light-theme');
    });
    system.addEventListener('change', event => {
        if (!preference.get('theme')) apply(event.matches);
    });
}

// --- MOBİL MENÜ YÖNETİMİ ---
function initMobileNav() {
    const button = document.getElementById('mobileNavToggle');
    const menu = document.getElementById('navMenu');
    if (!button || !menu) return;
    const mobile = matchMedia('(max-width: 900px)');
    function setOpen(open, restoreFocus = false) {
        button.classList.toggle('open', open);
        menu.classList.toggle('open', open);
        button.setAttribute('aria-expanded', String(open));
        menu.inert = mobile.matches && !open;
        document.body.classList.toggle('nav-open', mobile.matches && open);
        if (restoreFocus) button.focus();
    }
    button.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('click', event => {
        if (!menu.contains(event.target) && !button.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menu.classList.contains('open')) setOpen(false, true);
    });
    document.addEventListener('focusin', event => {
        if (mobile.matches && !menu.contains(event.target) && !button.contains(event.target)) setOpen(false);
    });
    mobile.addEventListener('change', () => setOpen(false));
    setOpen(false);
}

// --- İLETİŞİM FORMU DOĞRULAMA ---
function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('contactFormStatus');
    if (!form) return;
    form.addEventListener('submit', event => {
        event.preventDefault();
        const fields = [...form.querySelectorAll('input, textarea')];
        fields.forEach(field => {
            field.setCustomValidity(field.value.trim() ? '' : (document.documentElement.lang === 'en' ? 'Please complete this field.' : 'Lütfen bu alanı doldurun.'));
        });
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        const subject = String(data.get('subject')).trim();
        const body = String(data.get('message')).trim() + '\n\n' + String(data.get('name')).trim() + '\n' + String(data.get('email')).trim();
        const href = 'mailto:ytelli@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        window.location.href = href;
        if (status) status.textContent = document.documentElement.lang === 'en'
            ? 'Your email app was requested. Send the message there. If it did not open, email ytelli@gmail.com directly; your message is still here.'
            : 'E-posta uygulamanız açılmak üzere çağrıldı. Gönderimi oradan tamamlayın. Açılmadıysa ytelli@gmail.com adresine yazabilirsiniz; mesajınız burada korunuyor.';
    });
    form.addEventListener('input', event => {
        if ('setCustomValidity' in event.target) event.target.setCustomValidity('');
    });
}

// --- TOAST BİLDİRİMLERİ (DEVRE DIŞI) ---
function showToast() {
    // Toast popupları kullanıcı tercihi doğrultusunda tamamen kaldırıldı.
}
window.showToast = showToast;

// --- SCROLL SPY (AKTİF MENÜ BAĞLANTISI) ---
function initScrollSpy() {
    const sections = document.querySelectorAll('main section[id]');
    const links = [...document.querySelectorAll('.nav-link')].filter(link => link.hash);
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(link => {
                const active = link.hash === '#' + entry.target.id;
                link.classList.toggle('active', active);
                if (active) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-80px 0px -55% 0px' });
    sections.forEach(section => observer.observe(section));
}

// --- DENEYİM VE PROJE FİLTRELEME SİSTEMİ ---
function setupFilters() {
    document.querySelectorAll('.filter-btn, .project-filter-btn').forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
    // 1. Deneyim Filtreleri (Timeline)
    const timelineFilterBtns = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            timelineFilterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            btn.setAttribute('aria-pressed', 'true');
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
            projectFilterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            btn.setAttribute('aria-pressed', 'true');
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-proj-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                const tags = card.getAttribute('data-tags') || '';
                
                if (filterValue === 'all' || category === filterValue || card.dataset.discipline === filterValue || tags.toLowerCase().includes(filterValue.toLowerCase())) {
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
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
        document.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.style.width = bar.dataset.level + '%'; });
        return;
    }
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
    const error = document.getElementById('passphraseError');
    const submit = document.getElementById('btnUnlockSubmit');
    if (!modal || !form || !input) return;
    let opener;
    let attempt = 0;
    // Deliberately keep decrypted contact information out of browser storage.
    document.addEventListener('click', event => {
        const trigger = event.target.closest('[data-action="unlockContact"]');
        if (!trigger || modal.open) return;
        event.preventDefault();
        opener = trigger.matches('button') ? trigger : trigger.querySelector('button');
        error.textContent = '';
        modal.showModal();
        input.focus();
    });
    document.getElementById('closePassphraseModal')?.addEventListener('click', () => modal.close());
    modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
    modal.addEventListener('close', () => {
        attempt++;
        input.value = '';
        input.removeAttribute('aria-invalid');
        submit.disabled = false;
        opener?.focus();
    });
    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (!input.value || submit.disabled) return;
        const currentAttempt = ++attempt;
        submit.disabled = true;
        error.textContent = '';
        try {
            const data = await decryptContactPayload(input.value);
            if (!modal.open || currentAttempt !== attempt) return;
            updateDOMWithDecryptedContact(data);
            modal.close();
        } catch {
            if (!modal.open || currentAttempt !== attempt) return;
            input.setAttribute('aria-invalid', 'true');
            error.textContent = document.documentElement.lang === 'en' ? 'The passphrase could not be verified. Please try again.' : 'Erişim anahtarı doğrulanamadı. Lütfen tekrar deneyin.';
            input.focus();
        } finally {
            if (currentAttempt === attempt) submit.disabled = false;
        }
    });
}
