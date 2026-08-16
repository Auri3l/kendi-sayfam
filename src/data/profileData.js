export const PROFILE_DATA = {
    // 1. MESLEKİ DENEYİMLER
    experiences: [
        {
            role: "İnşaat Mühendisi / Saha Sorumlusu",
            roleEn: "Civil Engineer / Site Supervisor",
            company: "Trendworld Mimarlık",
            period: "Haziran 2026 – Devam Ediyor",
            periodEn: "June 2026 – Present",
            location: "İstanbul, Türkiye",
            locationEn: "Istanbul, Turkey",
            categories: ["saha", "yonetim"],
            description: "Ana müteahhit şantiye standartları doğrultusunda taşeron saha operasyonlarının yönetimi, ekiplerin sevk ve idaresi, iş programı takibi ile sözleşme süreçlerinin yürütülmesi.",
            descriptionEn: "Managing subcontractor field operations, crew supervision, master schedule integration, and subcontractor contract/billing processes in accordance with main contractor site standards.",
            details: [
                "Saha ekiplerinin günlük ve haftalık iş programlarının ana müteahhit iş takvimine göre planlanması",
                "İş güvenliği ve kalite kontrol standartlarının sahada uygulanmasının takibi",
                "Taşeron sözleşme süreçlerinin, kapsam değişikliklerinin ve hakedişlerin idari takibinin yapılması",
                "Ana müteahhit proje yönetimi ile saha ekipleri arasındaki teknik koordinasyonun sağlanması"
            ],
            detailsEn: [
                "Aligning daily and weekly subcontractor work programs with the general contractor master schedule",
                "Enforcing on-site occupational health, safety, and quality assurance compliance",
                "Administering subcontractor contracts, scope variation orders, and progress payment certifications",
                "Facilitating technical coordination between main contractor management and trade crews"
            ],
            tags: ["Şantiye Yönetimi", "Sözleşme & Kapsam Yönetimi", "Ana Müteahhit Koordinasyonu", "İş Planlama"],
            tagsEn: ["Site Management", "Contract & Scope Management", "General Contractor Coordination", "Scheduling"]
        },
        {
            role: "İnşaat Mühendisi / Teknik Ofis & Proje Şefi",
            roleEn: "Civil Engineer / Technical Office & Site Manager",
            company: "AA&TD Building Solutions (NCC Projesi)",
            period: "Aralık 2023 - Mart 2026 (2 Yıl 4 Ay)",
            periodEn: "Dec 2023 - Mar 2026 (2 Yrs 4 Mos)",
            location: "Tuzla, İstanbul",
            locationEn: "Istanbul, Turkey",
            categories: ["saha", "yonetim"],
            description: "Üstyapı projelerinde taşeron sözleşme yönetimi, teknik ofis süreçlerinin yürütülmesi, hakediş-metraj analizleri ve saha koordinasyonu.",
            descriptionEn: "Subcontractor contract administration, technical office deliverables, quantity takeoffs, progress billing, and on-site architectural coordination.",
            details: [
                "Ana müteahhit ve taşeron ilişkileri kapsamında sözleşme yönetimi, hakediş ve kapsam kontrolü",
                "Mimari uygulama detaylarının şantiye şartlarına uygunluğunun denetlenmesi",
                "Saha ilerleme raporlarının hazırlanması, bütçe takibi ve proje yönetimine sunulması"
            ],
            detailsEn: [
                "Administering contract clauses, progress payments, and scope change management with general contractors",
                "Auditing architectural shop drawings and resolving technical site condition clashes",
                "Preparing executive progress reports, budget tracking, and schedule variance analysis"
            ],
            tags: ["Teknik Ofis Şefliği", "Sözleşme Yönetimi", "Hak Ediş & Metraj", "Proje Koordinasyonu"],
            tagsEn: ["Technical Office Management", "Contract Management", "Quantity Surveying", "Project Coordination"]
        },
        {
            role: "Proje Yöneticisi / İnşaat Mühendisi",
            roleEn: "Project Manager / Civil Engineer",
            company: "Metal Yapı",
            period: "Ekim 2016 - Temmuz 2023 (6 Yıl 10 Ay)",
            periodEn: "Oct 2016 - Jul 2023 (6 Yrs 10 Mos)",
            location: "İstanbul & ABD (New York)",
            locationEn: "Istanbul, Turkey & New York, USA",
            categories: ["cephe", "yonetim"],
            description: "Amerika ve Türkiye'deki üstyapı ve cephe projelerinde ana müteahhitlere hizmet veren taşeron firma bünyesinde proje yöneticiliği, imalat planlaması ve sözleşme koordinasyonu.",
            descriptionEn: "Project management, manufacturing planning, and international contract coordination for high-rise commercial facade systems in the US and Turkey.",
            details: [
                "New York'taki One Madison Ave. ve One Willoughby Sq. kule projelerinde imalat ve tasarım koordinasyonunun Türkiye'den yönetimi",
                "Ana müteahhitler (Turner Construction, Gilbane vb.) ile teknik ve sözleşmesel süreçlerin takibi",
                "BIM (Yapı Bilgi Modellemesi) süreçleri üzerinden disiplinler arası proje koordinasyonu",
                "Taşeron kapsam değişiklikleri, revizyon talepleri ve hakediş onay süreçlerinin takibi"
            ],
            detailsEn: [
                "Managing engineering, BIM design, and factory fabrication coordination from Turkey for New York skyscraper projects (One Madison Ave., One Willoughby Sq.)",
                "Directing technical submittals, RFI/change orders, and approvals with US general contractors (Turner, Gilbane)",
                "Conducting 3D multidisciplinary BIM clash detection and model coordination",
                "Overseeing fabrication schedules, material logistics, and financial progress certifications"
            ],
            subRoles: [
                { title: "Associate Project Manager", date: "Şubat 2023 - Temmuz 2023", dateEn: "Feb 2023 - Jul 2023" },
                { title: "Assistant Project Manager", date: "Kasım 2019 - Temmuz 2023", dateEn: "Nov 2019 - Jul 2023" },
                { title: "Civil Engineer", date: "Ekim 2016 - Temmuz 2023", dateEn: "Oct 2016 - Jul 2023" }
            ],
            tags: ["Proje Yönetimi", "Sözleşme Yönetimi", "Ana Müteahhit İlişkileri", "BIM", "Tasarım & İmalat Koordinasyonu"],
            tagsEn: ["Project Management", "Contract Administration", "GC Relations", "BIM", "Design & Fabrication Coordination"]
        },
        {
            role: "Building Inspector (Saha Denetçisi)",
            roleEn: "Site Inspector / Civil Engineer",
            company: "İstanbul MCE Yapı Denetim Ltd. Şti.",
            period: "Şubat 2016 - Mayıs 2016 (4 Ay)",
            periodEn: "Feb 2016 - May 2016 (4 Mos)",
            location: "İstanbul, Türkiye",
            locationEn: "Istanbul, Turkey",
            categories: ["saha"],
            description: "5000 metrekare üzeri taahhütlerde yapı imalat denetimi gerçekleştirilmesi.",
            descriptionEn: "Independent building inspection and structural quality assurance for commercial projects over 5,000 m².",
            details: [
                "Demir donatı kontrolü ve beton döküm denetimlerinin yapılması",
                "Yapı malzemelerinin ve imalatların yönetmeliklere uygunluğunun doğrulanması",
                "Resmi yapı denetim raporlarının hazırlanması"
            ],
            detailsEn: [
                "Inspecting rebar placement, lap splices, and concrete pour compliance on active construction sites",
                "Verifying construction material compliance according to TS 500 and Turkish Earthquake Code",
                "Issuing official engineering inspection and verification reports"
            ],
            tags: ["Yapı Denetimi", "Betonarme", "Demir Donatı Kontrolü", "Standart Kontrolü"],
            tagsEn: ["Building Inspection", "Reinforced Concrete", "Rebar Auditing", "Code Compliance"]
        },
        {
            role: "Site Manager (Şantiye Şefi)",
            roleEn: "Site Manager / Field Engineer",
            company: "Ömay Yapı",
            period: "Ekim 2015 - Aralık 2015 (3 Ay)",
            periodEn: "Oct 2015 - Dec 2015 (3 Mos)",
            location: "Çakmak, Ümraniye, İstanbul",
            locationEn: "Istanbul, Turkey",
            categories: ["saha"],
            description: "Ümraniye-Üsküdar metro hattı Çakmak (110) İstasyonu kaba işler şantiye şefliği.",
            descriptionEn: "Field site management for reinforced concrete tunnel formwork and station structures on the Umraniye-Uskudar Metro Line (Cakmak Station).",
            details: [
                "Metro istasyonu kaba inşaat (tünel ve peron betonarmesi) süreçlerinin yönetimi",
                "Saha güvenlik önlemlerinin ve ağır iş makinesi operasyonlarının planlanması",
                "Altyapı ve deplase işlerinin koordinasyonu"
            ],
            detailsEn: [
                "Supervising tunnel formwork, station shafts, and platform concrete construction",
                "Planning heavy machinery logistics and high-risk underground safety protocols",
                "Coordinating underground utility relocations and infrastructural connections"
            ],
            tags: ["Kaba İşler", "Metro İnşaatı", "Tünel İşleri", "Altyapı Koordinasyonu"],
            tagsEn: ["Structural Works", "Metro Construction", "Tunneling", "Infrastructure"]
        },
        {
            role: "Stajyer Mühendis",
            roleEn: "Engineering Intern",
            company: "Ekol Mimarlık",
            period: "2013 (Yaz Dönemi)",
            periodEn: "Summer 2013",
            location: "İstanbul, Türkiye",
            locationEn: "Istanbul, Turkey",
            categories: ["saha"],
            description: "Şantiye süreçleri, mimari detayların incelenmesi ve teknik ofis işleyişi hakkında staj çalışması.",
            descriptionEn: "Summer engineering internship focusing on on-site inspection, architectural shop drawings, and quantity takeoffs.",
            details: [
                "Saha imalatlarının yerinde incelenmesi",
                "Autocad çizimlerinin ve teknik metrajların kontrollerine destek verilmesi"
            ],
            detailsEn: [
                "On-site monitoring of civil and architectural finishes",
                "Assisting with AutoCAD drafting checks and material quantity surveys"
            ],
            tags: ["Şantiye Stajı", "Metraj", "Autocad"],
            tagsEn: ["Internship", "Takeoffs", "AutoCAD"]
        }
    ],

    // 2. REFERANS PROJELER
    projects: [
        {
            title: "One Madison Avenue",
            location: "New York, ABD",
            locationEn: "New York, USA",
            category: "us",
            facadeType: "Unitized Panel Cephe",
            facadeTypeEn: "Unitized Curtain Wall",
            description: "Mevcut yapı üzerine inşa edilen ofis kulesi cephe projesi. (Tasarım ve fabrika imalat koordinasyon süreçleri Türkiye'den yürütülmüştür.)",
            descriptionEn: "Commercial high-rise overbuild project. (Engineering, BIM design, and factory fabrication coordinated from Turkey.)",
            tags: ["Tasarım & İmalat", "Proje Koordinasyonu", "BIM", "USA Project"],
            tagsEn: ["Design & Fabrication", "Project Coordination", "BIM", "USA Project"]
        },
        {
            title: "One Willoughby Square",
            location: "Brooklyn, New York, ABD",
            locationEn: "Brooklyn, NY, USA",
            category: "us",
            facadeType: "Panel Cephe & Endüstriyel Doğrama",
            facadeTypeEn: "Panelized Facade & Industrial Glazing",
            description: "Brooklyn ofis binası projesinde cephe tasarımı koordinasyonu, fabrika imalat takibi ve onay süreçlerinin yürütülmesi. (Tasarım ve imalat süreçleri Türkiye'den koordine edilmiştir.)",
            descriptionEn: "Brooklyn commercial skyscraper facade coordination, manufacturing oversight, and GC approval workflows from Turkey.",
            tags: ["Tasarım & İmalat", "Proje Koordinasyonu", "New York", "High-Rise"],
            tagsEn: ["Design & Fabrication", "Project Coordination", "New York", "High-Rise"]
        },
        {
            title: "Başarı Holding Genel Müdürlük",
            location: "Göztepe, İstanbul",
            locationEn: "Istanbul, Turkey",
            category: "tr",
            facadeType: "Spider Cam & Kompozit Cephe",
            facadeTypeEn: "Spider Glass & Composite Facade",
            description: "Holding yönetim merkezinin spider cam cepheleri ve alüminyum kompozit kaplama imalatlarının tasarım, üretim ve montaj süreçlerinin yönetimi.",
            descriptionEn: "Design, manufacturing, and full turnkey installation management for corporate HQ spider glass and aluminum composite facades.",
            tags: ["Tasarım & İmalat", "Montaj (A-Z)", "Spider Cam", "Ofis"],
            tagsEn: ["Design & Fab", "Full Installation", "Spider Glass", "Commercial"]
        },
        {
            title: "Maltepe Piazza",
            location: "İstanbul, Türkiye",
            locationEn: "Istanbul, Turkey",
            category: "tr",
            facadeType: "AVM & Konut Dış Cephesi",
            facadeTypeEn: "Shopping Mall & Residential Facade",
            description: "Karma kullanımlı alışveriş merkezi ve kule projesinde alüminyum giydirme cephe, ışıklık (skylight) ve kanopi imalatlarının teknik koordinasyonu.",
            descriptionEn: "Technical coordination for aluminum stick/unitized curtain wall, skylights, and glass entrance canopies.",
            tags: ["Giydirme Cephe", "Skylight", "TR Project"],
            tagsEn: ["Curtain Wall", "Skylight", "TR Project"]
        },
        {
            title: "İstanbul Medipol Üniversitesi",
            location: "Kavacık, İstanbul",
            locationEn: "Istanbul, Turkey",
            category: "tr",
            facadeType: "Eğitim Yapısı Akustik Cephe",
            facadeTypeEn: "Educational Acoustic Facade",
            description: "Üniversite kampüsü binalarının akustik giydirme cephe ve güneş kırıcı panellerinin teknik tasarım ve uygulama takibi.",
            descriptionEn: "Engineering submittals and site supervision of acoustic curtain wall and solar louvers for university campus buildings.",
            tags: ["Akustik Kontrol", "Güneş Kırıcı", "Kampüs"],
            tagsEn: ["Acoustics", "Solar Louvers", "Campus"]
        },
        {
            title: "Çakmak Metro İstasyonu",
            location: "Ümraniye, İstanbul",
            locationEn: "Istanbul, Turkey",
            category: "tr",
            facadeType: "Metro İstasyonu (Kaba İşler)",
            facadeTypeEn: "Metro Station (Structural Concrete)",
            description: "Üsküdar-Ümraniye-Çekmeköy metro hattının Çakmak istasyonuna ait tünel kalıp, istasyon şaft betonarmesi ve kaba inşaat süreçleri.",
            descriptionEn: "Underground tunnel formwork, station shafts, and reinforced concrete structural works for the M5 Metro Line.",
            tags: ["Kaba İnşaat", "Altyapı", "Ulaşım"],
            tagsEn: ["Concrete", "Infrastructure", "Transit"]
        }
    ],

    // 3. MESLEKİ YETKİNLİKLER
    skills: [
        { name: "Şantiye & Saha Yönetimi", nameEn: "Site & Field Management", level: 93 },
        { name: "Proje Yönetimi & Planlama", nameEn: "Project Management & Scheduling", level: 90 },
        { name: "Sözleşme & Hakediş Yönetimi", nameEn: "Contracts & Progress Billing (FIDIC)", level: 92 },
        { name: "BIM (Yapı Bilgi Modellemesi)", nameEn: "BIM (Building Information Modeling)", level: 80 },
        { name: "Hak Ediş & Metraj Analizi", nameEn: "Quantity Takeoff & Cost Control", level: 88 },
        { name: "Microsoft Office & Raporlama", nameEn: "MS Office & Advanced Reporting", level: 92 }
    ],

    // 4. YABANCI DİLLER
    languages: [
        { name: "Türkçe", nameEn: "Turkish", level: "Anadil", levelEn: "Native", percent: 100 },
        { name: "İngilizce", nameEn: "English", level: "Tam Profesyonel (Full Professional)", levelEn: "Full Professional (Fluent)", percent: 95 },
        { name: "Almanca", nameEn: "German", level: "Sınırlı Yetkinlik (Limited Working)", levelEn: "Limited Working Proficiency", percent: 50 },
        { name: "Rusça", nameEn: "Russian", level: "Sınırlı Yetkinlik (Limited Working)", levelEn: "Elementary Proficiency", percent: 45 },
        { name: "Fransızca", nameEn: "French", level: "Sınırlı Yetkinlik (Limited Working)", levelEn: "Elementary Proficiency", percent: 40 },
        { name: "İspanyolca", nameEn: "Spanish", level: "Başlangıç Seviyesi (Elementary)", levelEn: "Beginner", percent: 25 }
    ],

    // 5. EĞİTİM GEÇMİŞİ
    education: [
        {
            degree: "Lise: Sayısal Bölüm",
            degreeEn: "High School: Science & Mathematics",
            school: "Behiye Dr. Nevhiz Işıl Anadolu Lisesi",
            schoolEn: "Behiye Dr. Nevhiz Isil Anatolian High School",
            date: "2006 - 2011",
            dateEn: "2006 - 2011"
        },
        {
            degree: "Lisans: İnşaat Mühendisliği (İngilizce)",
            degreeEn: "B.Sc. in Civil Engineering (100% English Curriculum)",
            school: "Okan Üniversitesi",
            schoolEn: "Okan University",
            date: "2011 - 2015",
            dateEn: "2011 - 2015"
        },
        {
            degree: "Yüksek Lisans: İş Sağlığı ve Güvenliği",
            degreeEn: "M.Sc. in Occupational Health and Safety",
            school: "İstanbul Gedik Üniversitesi",
            schoolEn: "Istanbul Gedik University",
            date: "2017 - 2018",
            dateEn: "2017 - 2018"
        }
    ]
};
