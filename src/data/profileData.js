export const PROFILE_DATA = {
    // 1. MESLEKİ DENEYİMLER
    experiences: [
        {
            role: "İnşaat Mühendisi / Saha Sorumlusu",
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
            description: "Manhattan'ın kalbinde yer alan, tarihi binanın üzerine inşa edilen modern ofis kulesi cephe projesi. (Not: Tasarım ve imalat koordinasyon süreçleri Türkiye'den yürütülmüş olup, montaj aşamasında yerinde bulunulmamıştır.)",
            tags: ["Tasarım & İmalat", "Proje Koordinasyonu", "BIM", "USA Project"]
        },
        {
            title: "One Willoughby Square",
            location: "Brooklyn, New York, ABD",
            category: "us",
            facadeType: "Geniş Modüllü Panel Cephe & Endüstriyel Pencereler",
            description: "Brooklyn'in en yüksek ofis binası projesinde cephe tasarımı koordinasyonu, fabrika imalat takibi ile onay süreçlerinin yönetilmesi. (Not: Tasarım ve imalat süreçleri Türkiye'den koordine edilmiş olup, montaj aşamasında yerinde bulunulmamıştır.)",
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

    // 5. EĞİTİM GEÇMİŞİ
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
