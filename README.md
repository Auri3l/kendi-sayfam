# Ata Yiğit Telli — Kişisel Portfolyo & Blog Web Sitesi

Ata Yiğit Telli'nin (İnşaat Mühendisi & Proje Yöneticisi) kişisel web sitesi ve blog platformu. Bu proje, **Astro v5+** mimarisi kullanılarak yüksek performanslı ve modüler bir statik site olarak geliştirilmiştir.

## 🚀 Öne Çıkan Özellikler

- **Modern & Duyarlı Arayüz:** Endüstriyel koyu ve açık tema desteği (FOUC koruması ile).
- **İnteraktif Simülatörler & Hesaplayıcılar:**
  - 🏗️ **Beton & Donatı (Metraj) Simülatörü** (`/simulasyon`)
  - 🎨 **Makale İçi İnteraktif Boya & Astar Hesaplayıcı Widget'ı** (`/makale/post_10`)
- **Astro Content Collections:** Tip güvenli Markdown içerik yönetimi.
- **SEO & Performans:** Hızlı yüklenme süreleri, semantik HTML, OpenGraph meta etiketleri ve duyarlı bileşenler.
- **GitHub Pages Otomatik Yaygınlaştırma:** `.github/workflows/deploy.yml` aracılığıyla her push işleminde otomatik yayınlama.

## 📁 Proje Yapısı

```text
/
├── .github/workflows/   # GitHub Pages CI/CD workflow deployment
├── public/              # Statik görsel varlıkları ve faviconlar
│   └── images/          # Görseller (hero, kaba inşaat, cephe, yalıtım vb.)
├── src/
│   ├── content/         # Blog makaleleri (Markdown içerik koleksiyonları)
│   │   └── blog/
│   ├── data/            # Özgeçmiş ve deneyim verileri (profileData.js)
│   ├── layouts/         # Ana sayfa düzeni ve navigasyon (Layout.astro)
│   ├── pages/           # Sayfa rotaları (Ana Sayfa, Blog, Simülasyon, İletişim, Makale Detay)
│   ├── scripts/         # Tema, navigasyon ve interaktif JS mantığı (main.js)
│   └── styles/          # Global stil tanımlamaları ve CSS değişkenleri (global.css)
├── astro.config.mjs     # Astro konfigürasyonu (Base path: /kendi-sayfam)
└── package.json
```

## 🛠️ Komutlar

Bütün komutlar kök dizinden çalıştırılır:

| Komut | Açıklama |
| :--- | :--- |
| `npm install` | Proje bağımlılıklarını yükler |
| `npm run dev` | Geliştirici sunucusunu yerelde başlatır (`http://localhost:4321/kendi-sayfam/`) |
| `npm run build` | Üretim derlemesini hazırlar (`./dist/`) |
| `npm run preview` | Derlenen siteyi yerelde önizler |

## 🌐 Yayınlama (Deployment)

Proje `main` dalına push yapıldığında GitHub Actions workflow'u tetiklenir ve site otomatik olarak **GitHub Pages** üzerinde güncellenir.
