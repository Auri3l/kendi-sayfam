// ==========================================================================
// ATA YIĞİT TELLİ - PORTFOLYO VE DİNAMİK VERİ YAPILANDIRMASI
// Bu dosya, web sitesinin tüm dinamik verilerini ve interaktif işlevlerini yönetir.
// Yeni proje, deneyim, blog yazısı veya yetkinlik eklemek için bu dosyayı güncelleyin.
// ==========================================================================

const PROFILE_DATA = {
    // 1. MESLEKİ DENEYİMLER
    experiences: [
        {
            role: "İnşaat Mühendisi / Şantiye Sorumlusu",
            company: "Trendworld Mimarlık",
            period: "2 Haziran 2026 – Devam Ediyor",
            location: "İstanbul, Türkiye",
            categories: ["saha", "yonetim"],
            description: "Ana müteahhitlerin şantiye standartları altında taşeron saha operasyonlarının yönetimi, ekiplerin sevk ve idaresi, iş programı takibi ile sözleşme süreçlerinin denetlenmesi.",
            details: [
                "Saha ekiplerinin günlük ve haftalık iş programlarının ana müteahhit iş takvimine göre planlanması",
                "İş güvenliği ve kalite standartlarının şantiyede eksiksiz uygulanmasının takibi",
                "Taşeron sözleşme süreçlerinin, kapsam değişikliklerinin ve hakedişlerin idari takibinin yapılması",
                "Ana müteahhit proje yöneticileri ile saha ekipleri arasındaki teknik koordinasyonun sağlanması"
            ],
            tags: ["Şantiye Yönetimi", "Sözleşme & Kapsam Yönetimi", "Ana Müteahhit Koordinasyonu", "İş Planlama"]
        },
        {
            role: "İnşaat Mühendisi / Teknik Ofis & Proje Şefi",
            company: "AA&TD Building Solutions (NCC Projesi)",
            period: "Aralık 2023 - Mart 2026 (2 Yıl 4 Ay)",
            location: "Tuzla, İstanbul",
            categories: ["saha", "yonetim"],
            description: "Büyük ölçekli üstyapı projelerinde taşeron sözleşme yönetimi, teknik ofis süreçlerinin sevk ve idaresi, hakediş-metraj analizleri ve şantiye koordinasyonu.",
            details: [
                "Ana müteahhit ve taşeron ilişkileri çerçevesinde sözleşme yönetimi, hakediş ve kapsam kontrolü",
                "Mimari uygulama detaylarının şantiye şartlarına uygunluğunun denetlenmesi",
                "Saha ilerleme raporlarının hazırlanması, bütçe takibi ve proje yönetimine sunulması"
            ],
            tags: ["Teknik Ofis Şefliği", "Sözleşme Yönetimi", "Hak Ediş & Metraj", "Proje Koordinasyonu"]
        },
        {
            role: "Proje Yöneticisi / İnşaat Mühendisi",
            company: "Metal Yapı",
            period: "Ekim 2016 - Temmuz 2023 (6 Yıl 10 Ay)",
            location: "İstanbul & ABD (New York)",
            categories: ["cephe", "yonetim"],
            description: "Amerika ve Türkiye'deki yüksek bütçeli, prestijli projelerde büyük ana müteahhitlere hizmet veren taşeron firma bünyesinde proje yöneticiliği, şantiye planlama koordinasyonu ve sözleşme yönetimi.",
            details: [
                "New York'taki One Madison Ave. ve One Willoughby Sq. gibi gökdelen projelerinde imalat ve tasarım koordinasyonunun Türkiye'den yönetimi",
                "Ana müteahhitler (Turner Construction, Gilbane vb.) ile teknik ve sözleşmesel süreçlerin doğrudan yönetilmesi",
                "BIM (Yapı Bilgi Modellemesi) süreçleri üzerinden disiplinler arası proje koordinasyonu",
                "Taşeron kapsam değişiklikleri, ek bütçe talepleri ve hakediş onay süreçlerinin takibi"
            ],
            subRoles: [
                { title: "Associate Project Manager", date: "Şubat 2023 - Temmuz 2023" },
                { title: "Assistant Project Manager", date: "Kasım 2019 - Temmuz 2023" },
                { title: "Civil Engineer", date: "Ekim 2016 - Temmuz 2023" }
            ],
            tags: ["Proje Yönetimi", "Sözleşme Yönetimi", "Ana Müteahhit İlişkileri", "BIM", "Tasarım & İmalat Koordinasyonu"]
        },
        {
            role: "Building Inspector (Saha Denetçisi)",
            company: "İstanbul MCE Yapı Denetim Ltd. Şti.",
            period: "Şubat 2016 - Mayıs 2016 (4 Ay)",
            location: "İstanbul, Türkiye",
            categories: ["saha"],
            description: "5000 metrekare üstü taahhütlerde yapı imalat denetimi gerçekleştirilmesi.",
            details: [
                "Demir donatı kontrolü ve beton döküm denetimlerinin yapılması",
                "Yapı malzemelerinin, tekniklerinin ve güvenlik standartlarının yerel yapı kodlarına uygunluğunun doğrulanması",
                "Resmi yapı denetim raporlarının hazırlanması"
            ],
            tags: ["Yapı Denetimi", "Betonarme", "Demir Donatı Kontrolü", "Standart Kontrolü"]
        },
        {
            role: "Site Manager (Şantiye Şefi)",
            company: "Ömay Yapı",
            period: "Ekim 2015 - Aralık 2015 (3 Ay)",
            location: "Çakmak, Ümraniye, İstanbul",
            categories: ["saha"],
            description: "Ümraniye-Üsküdar metro hattı Çakmak (110) İstasyonu kaba işlerde şantiye şefi olarak görev yaptım.",
            details: [
                "Metro istasyonu kaba inşaat (tünel ve peron betonarmesi) süreçlerinin yönetimi",
                "Saha güvenlik önlemlerinin ve ağır iş makinesi operasyonlarının planlanması",
                "Altyapı ve deplase işlerinin koordinasyonu"
            ],
            tags: ["Kaba İşler", "Metro İnşaatı", "Tünel İşleri", "Altyapı Koordinasyonu"]
        },
        {
            role: "Stajyer Mühendis",
            company: "Ekol Mimarlık",
            period: "2013 (Yaz Dönemi)",
            location: "İstanbul, Türkiye",
            categories: ["saha"],
            description: "Şantiye süreçleri, mimari detayların incelenmesi ve teknik ofis işleyişi hakkında temel staj eğitimi.",
            details: [
                "Saha imalatlarının yerinde incelenmesi",
                "Autocad çizimlerinin ve teknik metrajların kontrollerine yardım edilmesi"
            ],
            tags: ["Şantiye Stajı", "Metraj", "Autocad"]
        }
    ],

    // 2. REFERANS PROJELER
    projects: [
        {
            title: "One Madison Avenue",
            location: "New York, ABD",
            category: "us",
            facadeType: "Özel Tasarım Unitized Panel Cephe",
            description: "Manhattan'ın kalbinde yer alan, tarihi binanın üzerine inşa edilen modern ofis kulesi cephe projesi. (Not: Taşeron firma adına tasarım ve imalat koordinasyon süreçleri Türkiye'den yürütülmüş olup, montaj aşamasında yerinde bulunulmamıştır.)",
            tags: ["Tasarım & İmalat", "Proje Koordinasyonu", "BIM", "USA Project"]
        },
        {
            title: "One Willoughby Square",
            location: "Brooklyn, New York, ABD",
            category: "us",
            facadeType: "Geniş Modüllü Panel Cephe & Endüstriyel Pencereler",
            description: "Brooklyn'in en yüksek ofis binası projesinde cephe tasarımı koordinasyonu, fabrika imalat takibi ile onay süreçlerinin yönetilmesi. (Not: Taşeron firma adına tasarım ve imalat süreçleri Türkiye'den koordine edilmiş olup, montaj aşamasında yerinde bulunulmamıştır.)",
            tags: ["Tasarım & İmalat", "Proje Koordinasyonu", "New York", "High-Rise"]
        },
        {
            title: "Başarı Holding Genel Müdürlük",
            location: "Göztepe, İstanbul",
            category: "tr",
            facadeType: "Prestij Ofis Yapısı Cam & Metal Cephe",
            description: "Holding yönetim merkezinin özel tasarım spider cam cepheleri, alüminyum kompozit kaplamaları dahil A'dan Z'ye tasarım, imalat ve montaj süreçlerinin tamamının yönetiminde aktif rol aldım.",
            tags: ["Tasarım & İmalat", "Montaj (A-Z)", "Spider Cam", "Ofis"]
        },
        {
            title: "Maltepe Piazza",
            location: "İstanbul, Türkiye",
            category: "tr",
            facadeType: "Alışveriş Merkezi & Konut Kompleksi Dış Cephesi",
            description: "Karma kullanımlı bu devasa projenin alışveriş merkezi ve kule kısımlarının alüminyum giydirme cephe, ışıklık (skylight) ve kanopi işlerinin teknik koordinasyonu.",
            tags: ["Giydirme Cephe", "Skylight", "TR Project"]
        },
        {
            title: "İstanbul Medipol Üniversitesi",
            location: "Kavacık, İstanbul",
            category: "tr",
            facadeType: "Eğitim Yapısı Teknolojik Cephe Sistemleri",
            description: "Üniversite kampüsü binalarının yüksek performanslı akustik giydirme cephe ve güneş kırıcı panellerinin teknik tasarım ve uygulama süreçlerinin takibi.",
            tags: ["Akustik Kontrol", "Güneş Kırıcı", "Kampüs"]
        },
        {
            title: "Çakmak Metro İstasyonu",
            location: "Ümraniye, İstanbul",
            category: "tr",
            facadeType: "Metro İstasyonu Yapısı (Kaba İşler)",
            description: "Üsküdar-Ümraniye-Çekmeköy metro hattının Çakmak istasyonuna ait tünel kalıp, istasyon şaft betonarmesi ve destek kaba inşaat süreçleri.",
            tags: ["Kaba İnşaat", "Altyapı", "Ulaşım"]
        }
    ],

    // 3. MESLEKİ YETKİNLİKLER
    skills: [
        { name: "Şantiye & Saha Yönetimi", level: 93 },
        { name: "Proje Yönetimi & Planlama", level: 90 },
        { name: "Sözleşme & Hakediş Yönetimi", level: 92 },
        { name: "BIM (Yapı Bilgi Modellemesi)", level: 80 },
        { name: "Hak Ediş & Metraj Analizi", level: 88 },
        { name: "Microsoft Office & Raporlama", level: 92 }
    ],

    // 4. YABANCI DİLLER
    languages: [
        { name: "Türkçe", level: "Anadil", percent: 100 },
        { name: "İngilizce", level: "Tam Profesyonel (Full Professional)", percent: 95 },
        { name: "Almanca", level: "Sınırlı Yetkinlik (Limited Working)", percent: 50 },
        { name: "Rusça", level: "Sınırlı Yetkinlik (Limited Working)", percent: 45 },
        { name: "Fransızca", level: "Sınırlı Yetkinlik (Limited Working)", percent: 40 },
        { name: "İspanyolca", level: "Başlangıç Seviyesi (Elementary)", percent: 25 }
    ],

    // 5. EĞİTİM GEÇMİŞİ (Soldan sağa kronolojik: Lise -> Lisans -> Yüksek Lisans)
    education: [
        {
            degree: "Lise: Sayısal Bölüm",
            school: "Behiye Dr. Nevhiz Işıl Anadolu Lisesi",
            date: "2006 - 2011"
        },
        {
            degree: "Lisans: İnşaat Mühendisliği (İngilizce)",
            school: "Okan Üniversitesi",
            date: "2011 - 2015"
        },
        {
            degree: "Yüksek Lisans: İş Sağlığı ve Güvenliği",
            school: "İstanbul Gedik Üniversitesi",
            date: "2017 - 2018"
        }
    ]
};

// ==========================================================================
// VARSAYILAN BLOG GÖNDERİLERİ (İLK ÇALIŞMADA BROWSER'A YAZILIR)
// ==========================================================================
// DEFAULT_BLOG_POSTS posts/manifest.js dosyasından yüklenir
const DEFAULT_BLOG_POSTS = window.DEFAULT_BLOG_POSTS || [];

// ==========================================================================
// UYGULAMA MANTIĞI & ETKİLEŞİM
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Sayfa Altyapı Bileşenlerini Başlat
    initTheme();
    initMobileNav();
    initCustomCursor();
    renderTimeline('all');
    renderProjects('all');
    renderSkillsAndLanguages();
    initBlogSystem();
    initContactForm();
    initScrollSpy();
    initArticleView();
    setupFilters();
    setupAnimationOnScroll();
});

// --- KARANLIK/AYDINLIK TEMA GEÇİŞİ ---
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const body = document.body;
    
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

    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .timeline-card, .filter-btn, .project-filter-btn, .blog-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.backgroundColor = 'rgba(var(--accent-rgb), 0.1)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '24px';
            cursor.style.height = '24px';
            cursor.style.backgroundColor = 'transparent';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
        isMoving = false;
    });
}

// --- DİNAMİK TIMELINE RENDER EDİLMESİ ---
function renderTimeline(filter = 'all') {
    const container = document.getElementById('timelineContainer');
    if (!container) return;

    const filtered = filter === 'all' 
        ? PROFILE_DATA.experiences 
        : PROFILE_DATA.experiences.filter(exp => exp.categories.includes(filter));

    if (filtered.length === 0) {
        container.innerHTML = `<div class="timeline-loading">Bu kategoride deneyim bulunmamaktadır.</div>`;
        return;
    }

    container.innerHTML = filtered.map((exp, idx) => {
        const subRolesHtml = exp.subRoles ? `
            <div class="timeline-sub-roles">
                <span class="sub-role-title">Kariyer Basamakları</span>
                <div class="sub-roles-grid">
                    ${exp.subRoles.map(sub => `
                        <div class="sub-role-card">
                            <span class="sub-role-name">${sub.title}</span>
                            <span class="sub-role-date">${sub.date}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        const detailsHtml = exp.details ? `
            <ul class="timeline-details">
                ${exp.details.map(det => `<li>${det}</li>`).join('')}
            </ul>
        ` : '';

        const tagsHtml = exp.tags ? `
            <div class="timeline-tags">
                ${exp.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        ` : '';

        return `
            <div class="timeline-item reveal" style="animation-delay: ${idx * 0.1}s">
                <div class="timeline-node"></div>
                <div class="timeline-meta">
                    <span class="timeline-date">${exp.period}</span>
                    <span class="timeline-location">${exp.location}</span>
                </div>
                <div class="timeline-card">
                    <h4 class="timeline-role-title">${exp.role}</h4>
                    <h5 class="timeline-company">${exp.company}</h5>
                    <p class="timeline-desc">${exp.description}</p>
                    ${detailsHtml}
                    ${subRolesHtml}
                    ${tagsHtml}
                </div>
            </div>
        `;
    }).join('');
}

// --- DİNAMİK PROJELER GRID RENDER EDİLMESİ ---
function renderProjects(filter = 'all') {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    const filtered = filter === 'all'
        ? PROFILE_DATA.projects
        : (filter === 'facade' 
            ? PROFILE_DATA.projects.filter(p => p.tags.some(t => t.toLowerCase().includes('tasarım') || t.toLowerCase().includes('cephe') || t.toLowerCase() === 'facade'))
            : PROFILE_DATA.projects.filter(p => p.category === filter));

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="projects-loading">Bu filtreye uygun proje bulunmamaktadır.</div>`;
        return;
    }

    grid.innerHTML = filtered.map((proj, idx) => {
        const iconSvg = proj.category === 'us' 
            ? `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
            : `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" stroke-linecap="round"/><path d="M9 3v18M21 9H3M21 15H3" stroke-linecap="round"/></svg>`;

        return `
            <div class="project-card reveal" style="animation-delay: ${idx * 0.1}s">
                <div>
                    <div class="project-header">
                        <div class="project-icon">
                            ${iconSvg}
                        </div>
                        <span class="project-loc-tag">${proj.location}</span>
                    </div>
                    <h4 class="project-title">${proj.title}</h4>
                    <p class="project-desc">${proj.description}</p>
                </div>
                <div class="project-footer">
                    <span class="project-tech">${proj.facadeType}</span>
                    <div class="timeline-tags">
                        ${proj.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// --- DİNAMİK YETKİNLİKLER VE DİLLER RENDER EDİLMESİ ---
function renderSkillsAndLanguages() {
    const skillsList = document.getElementById('skillsList');
    if (skillsList) {
        skillsList.innerHTML = PROFILE_DATA.skills.map(sk => `
            <div class="skill-item">
                <div class="skill-info">
                    <span class="skill-name">${sk.name}</span>
                    <span class="skill-percentage">${sk.level}%</span>
                </div>
                <div class="skill-bar-bg">
                    <div class="skill-bar-fill" data-level="${sk.level}"></div>
                </div>
            </div>
        `).join('');
    }

    const languagesList = document.getElementById('languagesList');
    if (languagesList) {
        languagesList.innerHTML = PROFILE_DATA.languages.map(lang => `
            <div class="language-card" style="--lang-percent: ${lang.percent}%">
                <span class="language-name">${lang.name}</span>
                <span class="language-level">${lang.level}</span>
                <div class="language-bar"></div>
            </div>
        `).join('');
    }

    const educationGrid = document.getElementById('educationGrid');
    if (educationGrid) {
        educationGrid.innerHTML = PROFILE_DATA.education.map(edu => `
            <div class="education-card">
                <span class="education-date">${edu.date}</span>
                <h5 class="education-degree">${edu.degree}</h5>
                <span class="education-school">${edu.school}</span>
            </div>
        `).join('');
    }
}

// --- BLOG SİSTEMİ (STATİK MAKALE YÜKLEME) ---
function initBlogSystem() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;

    // Sadece yayınlanmış (draft olmayan) statik verileri render et
    const posts = (DEFAULT_BLOG_POSTS || []).filter(p => !p.draft);

    function renderBlog() {
        if (posts.length === 0) {
            blogGrid.innerHTML = `<div class="blog-loading">Yayınlanmış bir yazı bulunmamaktadır.</div>`;
            return;
        }

        blogGrid.innerHTML = posts.map((post, idx) => {
            const coverImageHtml = post.imageUrl ? `
                <div class="blog-card-cover" style="margin-bottom: 1.5rem; border-radius: var(--border-radius-md); overflow: hidden; height: 180px; border: 1px solid var(--border-color);">
                    <img src="${post.imageUrl}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;">
                </div>
            ` : '';

            // Kart önizlemesi için HTML etiketlerini kaldırarak kısa açıklama üret
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const plainExcerpt = tempDiv.textContent || tempDiv.innerText || "";
            const shortExcerpt = plainExcerpt.length > 180 ? plainExcerpt.substring(0, 177) + "..." : plainExcerpt;

            return `
                <div class="blog-card reveal" style="animation-delay: ${idx * 0.1}s">
                    <div>
                        ${coverImageHtml}
                        <div class="blog-card-meta">
                            <span class="blog-card-date">${post.date}</span>
                            <span class="blog-card-category">${post.category}</span>
                        </div>
                        <h4 class="blog-card-title">
                            <a href="makale.html?id=${post.id}" style="color: inherit; text-decoration: none; transition: var(--transition-fast);">
                                ${post.title}
                            </a>
                        </h4>
                        <p class="blog-card-excerpt">${shortExcerpt}</p>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <a href="makale.html?id=${post.id}" class="blog-read-more-btn" style="text-decoration: none;">
                            Devamını Oku
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderBlog();
}

// Blog Oku Detayı (Sayfa Yönlendirmesi)
window.readFullPost = function(id) {
    window.location.href = `makale.html?id=${id}`;
};

// --- DİNAMİK TEKİL MAKALE GÖRÜNÜMÜ (makale.html) ---
function initArticleView() {
    const container = document.getElementById('articleContainer');
    if (!container) return; // Bu sayfada makale görüntüleme alanı yok

    // URL'den makale id'sini al
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        renderArticleNotFound(container);
        return;
    }

    const posts = DEFAULT_BLOG_POSTS;
    const post = posts.find(p => p.id === postId);

    if (!post) {
        renderArticleNotFound(container);
        return;
    }

    // Başlığı güncelle
    document.title = `${post.title} | Ata Yiğit Telli`;

    const coverImageHtml = post.imageUrl ? `
        <div class="article-cover-image" style="width: 100%; height: 350px; border-radius: var(--border-radius-lg); overflow: hidden; margin-bottom: 2.5rem; border: 1px solid var(--border-color);">
            <img src="${post.imageUrl}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
    ` : '';

    container.innerHTML = `
        <a href="blog.html" class="article-back-link">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" style="transform: rotate(180deg);"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            Bloga Geri Dön
        </a>
        <article class="article-body">
            ${coverImageHtml}
            <div class="article-header">
                <div class="article-meta">
                    <span class="article-date">${post.date}</span>
                    <span class="article-category">${post.category}</span>
                </div>
                <h1 class="article-title">${post.title}</h1>
            </div>
            <div class="article-content" id="articleBodyContent">
                <!-- İçerik buraya yüklenecek -->
            </div>
        </article>
    `;

    const bodyContentDiv = document.getElementById('articleBodyContent');
    
    // HTML enjekte edip içindeki scriptleri değerlendiren (çalıştıran) fonksiyon
    function injectHTMLAndRunScripts(html, target) {
        target.innerHTML = html;
        const scripts = target.getElementsByTagName('script');
        const scriptsArray = Array.from(scripts);
        scriptsArray.forEach(oldScript => {
            const newScript = document.createElement('script');
            newScript.text = oldScript.text;
            document.body.appendChild(newScript).parentNode.removeChild(newScript);
        });
    }

    // 1. Yazı alanına varsayılan olarak kısa özet metnini koyalım
    if (bodyContentDiv) {
        bodyContentDiv.innerHTML = `<p style="color: var(--text-secondary); font-style: italic;">${post.content}</p>`;
    }

    // 2. Dış HTML dosyasını fetch etmeye çalış
    if (post.contentUrl && bodyContentDiv) {
        fetch(post.contentUrl)
            .then(response => {
                if (!response.ok) throw new Error('Dosya yüklenemedi');
                return response.text();
            })
            .then(html => {
                // Başarılı ise zengin HTML içeriğini yükle ve içindeki scriptleri çalıştır
                injectHTMLAndRunScripts(html, bodyContentDiv);
            })
            .catch(err => {
                console.warn("Dış HTML dosyası yüklenirken hata oluştu:", err);
                
                // Eğer yerel dosya sistemi (CORS) engeli nedeniyle yüklenemediyse bilgilendirme kutusu göster
                if (window.location.protocol === 'file:') {
                    bodyContentDiv.innerHTML = `
                        <div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 1.5rem; border-radius: var(--border-radius-md); margin-bottom: 2rem; border-left: 4px solid var(--accent-color);">
                            <h4 style="color: var(--text-primary); margin-bottom: 0.5rem; font-size: 1rem;">Yerel Önizleme Modu</h4>
                            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
                                Bu makalenin zengin içeriği ve interaktif programları <strong>${post.contentUrl}</strong> dosyasından çekilmektedir. 
                                Tarayıcı güvenlik kuralları (CORS) nedeniyle yerel HTML dosyasına çift tıklayarak girdiğinizde bu dış dosyalar yüklenemez.
                            </p>
                            <p style="font-size: 0.85rem; color: var(--text-muted);">
                                <strong>Çözüm:</strong> Projenizi internette (GitHub Pages, Netlify vb.) yayınladığınızda veya yerel bir geliştirme sunucusu (örn. VS Code Live Server) ile açtığınızda makale ve programcıklar otomatik olarak yüklenecektir.
                            </p>
                        </div>
                        <p style="color: var(--text-primary); font-size: 1.05rem; line-height: 1.7;">${post.content}</p>
                    `;
                } else {
                    // Sunucuda olmasına rağmen dosya bulunamadıysa:
                    bodyContentDiv.innerHTML = `
                        <p style="color: var(--text-primary); font-size: 1.05rem; line-height: 1.7;">${post.content}</p>
                        <p style="color: #ff6b6b; font-size: 0.85rem; margin-top: 1rem;">Hata: Makale gövde dosyası (${post.contentUrl}) sunucuda bulunamadı.</p>
                    `;
                }
            });
    }
    
    // Custom cursor hover tetikleyicilerini yeniden kur
    initCustomCursor();
}

function renderArticleNotFound(container) {
    container.innerHTML = `
        <div class="article-not-found">
            <h3>Yazı Bulunamadı</h3>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">İstediğiniz blog gönderisi silinmiş veya hatalı bir yönlendirme yapılmış olabilir.</p>
            <a href="blog.html" class="btn btn-primary">Bloga Geri Dön</a>
        </div>
    `;
}

// --- FİLTRE DÜĞMELERİ ÇALIŞMA MANTIĞI ---
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterVal = btn.getAttribute('data-filter');
            renderTimeline(filterVal);
            initCustomCursor();
        });
    });

    const projFilterBtns = document.querySelectorAll('.project-filter-btn');
    projFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            projFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-proj-filter');
            renderProjects(filterVal);
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
    
    const timelineContainer = document.getElementById('timelineContainer');
    const projectsGrid = document.getElementById('projectsGrid');
    const blogGrid = document.getElementById('blogGrid');
    
    const mutationCallback = () => {
        checkReveals();
    };

    if (timelineContainer) {
        new MutationObserver(mutationCallback).observe(timelineContainer, { childList: true });
    }
    if (projectsGrid) {
        new MutationObserver(mutationCallback).observe(projectsGrid, { childList: true });
    }
    if (blogGrid) {
        new MutationObserver(mutationCallback).observe(blogGrid, { childList: true });
    }

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


// --- SCROLL SPY (ÇOKLU SAYFA DESTEKLİ AKTİF MENÜ BAĞLANTISI) ---
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Alt sayfalar için: o sayfanın kendisine ait nav linkini aktif yap
    // (HTML'de zaten active sınıfı var; scroll spy sadece index.html'de section takibi yapar)
    const isHomePage = (currentPage === 'index.html' || currentPage === '' || currentPage === '/');
    
    const offset = 100;

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY || document.documentElement.scrollTop;

        // Girişteki aşağı kaydır yazısının kaybolması
        if (scrollIndicator) {
            if (scrollPos > 50) {
                scrollIndicator.classList.add('hidden-indicator');
            } else {
                scrollIndicator.classList.remove('hidden-indicator');
            }
        }

        // Sadece ana sayfada section-bazlı scroll spy çalışsın
        if (isHomePage) {
            sections.forEach(section => {
                const sectionTop = section.offsetTop - offset;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        const href = link.getAttribute('href');
                        // index.html#hakkimda veya #hakkimda formatlı linkleri eşleştir
                        if (href === `#${sectionId}` || href === `index.html#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        // Header küçülme efekti (tüm sayfalarda aktif)
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
