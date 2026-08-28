---
id: "post_12"
title: "Yeni BIM ve IFC Yönetmeliği Rehberi: Yapı Ruhsatında e-PYS Dönemi, openBIM Standartları ve Geçiş Takvimi"
category: "Mevzuat & Mühendislik"
date: "28 Ağustos 2026"
imageUrl: "images/hero_bg.png"
draft: false
excerpt: "Çevre, Şehircilik ve İklim Değişikliği Bakanlığı'nın Resmî Gazete'de yayımladığı yeni BIM ve IFC yönetmeliği; e-PYS üzerinden ruhsat teslimi, openBIM (ISO 16739), kademeli geçiş takvimi ve teknik ofis hazırlıkları."
---
<div class="rich-post-content">
<p>Çevre, Şehircilik ve İklim Değişikliği Bakanlığı tarafından hazırlanan ve <strong>5 Ağustos 2026 tarihli Resmî Gazete</strong>'de yayımlanan iki devrim niteliğindeki yönetmelik, Türk inşaat sektöründe 2 boyutlu CAD çizim dönemini resmi olarak kapatarak <strong>Yapı Bilgi Modellemesi (BIM)</strong> ve <strong>IFC (Industry Foundation Classes)</strong> tabanlı dijital ruhsat çağını başlatmıştır.</p>

<p>Bu makalede; yeni mevzuatın yasal çerçevesini, e-PYS (Elektronik Proje Yönetim Sistemi) üzerinden yürütülecek dijital ruhsat onay mekanizmasını, openBIM (ISO 16739) veri standartlarını, 2027–2033 kademeli geçiş takvimini ve şantiye/teknik ofis süreçlerine getireceği yapısal dönüşümü bir şantiye şefi ve proje yöneticisi gözüyle detaylandırıyoruz.</p>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">1. Mevzuatın Hukuki Çerçevesi: Resmî Gazete'de Yayımlanan İki Temel Yönetmelik</h4>
<p>Bakanlık tarafından yürürlüğe konulan düzenleme, birbirini tamamlayan iki ana yönetmelikten oluşmaktadır:</p>
<ul>
    <li><strong>Mimarlık ve Mühendislik Projelerinin Dijital Olarak Hazırlanması Hakkında Yönetmelik (Yürürlük: 1 Eylül 2027):</strong> Mimari, statik, mekanik ve elektrik tesisat projelerinin BIM tabanlı, IFC formatında ve paftaların PDF/A standardında nasıl modelleneceğini, katman hiyerarşisini ve veri gereksinimlerini belirler.</li>
    <li><strong>Mimarlık ve Mühendislik Projelerinin Elektronik Ortamda Teslimi ve Yönetilmesi Hakkında Yönetmelik (Yürürlük: 1 Eylül 2028):</strong> Hazırlanan modellerin Bakanlıkça kurulan <strong>e-PYS</strong> platformu üzerinden idarelere (belediyeler, il özel idareleri, organize sanayi bölge müdürlükleri) teslimini, dijital imar ve mevzuat denetimini, onay ve kalıcı arşivleme prosedürlerini düzenler.</li>
</ul>

<div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-xs); padding: 1.25rem; margin: 1.5rem 0;">
    <strong style="color: var(--accent-color); font-family: var(--font-mono); display: block; margin-bottom: 0.5rem; font-size: 0.88rem; text-transform: uppercase; letter-spacing: 0.08em;">Temel Amaç &amp; Vizyon:</strong>
    <p style="font-size: 0.90rem; color: var(--text-secondary); margin: 0; line-height: 1.6;">
        Projelerin kağıt ortamında veya statik 2D CAD formatında incelenmesi yerine; üç boyutlu parametrik nesneler üzerinden hacim, alan, malzeme özellikleri ve çakışma testlerinin algoritmik olarak denetlenmesi; imar kaçaklarının, deprem güvenliğini riske atan statik uyumsuzlukların ve metraj manipülasyonlarının kaynağında sıfırlanması hedeflenmektedir.
    </p>
</div>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">2. e-PYS Platformu ve Dijital Ruhsat Onay Mekanizması</h4>
<p>Geleneksel ruhsat süreçlerinde yaşanan ozalit baskı masrafları, fiziksel imza kuyrukları ve paftalar arası revizyon uyuşmazlıkları e-PYS ile tamamen ortadan kalkmaktadır:</p>
<ul>
    <li><strong>Otomatik Kural Kontrolü (Automated Rule Checking):</strong> e-PYS'ye yüklenen IFC modeli; Planlı Alanlar İmar Yönetmeliği, Türkiye Bina Deprem Yönetmeliği (TBDY 2018), Binaların Yangından Korunması Hakkında Yönetmelik ve Binalarda Enerji Performansı (BEP) kurallarına göre otomatik yazılımsal süzgeçlerden geçer. Çekme mesafeleri, emsal (KAKS/TAKS), yangın merdiveni genişlikleri ve kat yükseklikleri anında doğrulanır.</li>
    <li><strong>Model - Pafta Birebir Eşleşmesi (Model-Drawing Parity):</strong> Proje müellifleri 2D paftalarını PDF/A formatında sunarken, bu çizimlerin doğrudan yüklenen 3D IFC modelinin kesit ve planlarından üretilmiş olması zorunludur. Modelde olmayan veya modelle çelişen hiçbir çizgi ruhsata esas kabul edilmez.</li>
    <li><strong>Nitelikli Elektronik Sertifika (E-İmza &amp; E-Mühür):</strong> Mimar, inşaat mühendisi, makine mühendisi ve elektrik mühendisi projelerini kendi disiplin modellerine dijital zaman damgalı e-imza atarak teslim eder. Yapı denetim firmaları ve belediye ruhsat birimleri onaylarını yine sistem üzerinden dijital olarak tamamlar.</li>
</ul>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">3. openBIM ve IFC (ISO 16739) Veri Standardı Neden Zorunlu Kılındı?</h4>
<p>Yönetmeliğin en kritik teknik tercihi, herhangi bir ticari yazılım üreticisinin tescilli dosya formatına (RVT, DGN, DWG, PLN vb.) bağımlı kalmaksızın, uluslararası <strong>openBIM (ISO 16739-1)</strong> standardı olan <strong>IFC (Industry Foundation Classes)</strong> formatını şart koşmasıdır.</p>

<table class="metraj-table" style="margin: 1.5rem 0; width: 100%;">
    <thead>
        <tr>
            <th>IFC Varlık Sınıfı (Entity)</th>
            <th>Mühendislik Karşılığı</th>
            <th>Gerekli Asgari Öznitelik Seti (Property Set - Pset)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="font-family: var(--font-mono); color: var(--accent-color); font-weight: 600;">IfcColumn / IfcBeam</td>
            <td>Kolon ve Kiriş Elemanları</td>
            <td>Beton sınıfı (C30/37 vb.), donatı oranı, yangın dayanım süresi (REI), paspayı (mm)</td>
        </tr>
        <tr>
            <td style="font-family: var(--font-mono); color: var(--accent-color); font-weight: 600;">IfcSlab / IfcWall</td>
            <td>Döşeme ve Taşıyıcı Perde</td>
            <td>Katman kalınlığı, yük taşıma kapasitesi ($kN/m^2$), akustik yalıtım indeksi ($dB$)</td>
        </tr>
        <tr>
            <td style="font-family: var(--font-mono); color: var(--accent-color); font-weight: 600;">IfcCurtainWall / IfcWindow</td>
            <td>Giydirme Cephe ve Doğrama</td>
            <td>Isı geçirgenlik katsayısı ($U_w, U_g$), rüzgar sehim limiti, cam kombinasyonu, akustik sınıf</td>
        </tr>
        <tr>
            <td style="font-family: var(--font-mono); color: var(--accent-color); font-weight: 600;">IfcSpace / IfcZone</td>
            <td>Mahal ve İmar Zonları</td>
            <td>Net/Brüt alan ($m^2$), tavan yüksekliği, mahal kullanım amacı, yangın zon kodu</td>
        </tr>
    </tbody>
</table>

<p>Ruhsat aşamasında modellerin <strong>LOD 300 / LOIN (Level of Information Need)</strong> seviyesinde olması; geometrik hassasiyetin yanı sıra malzeme yoğunluğu, ısı iletkenliği ($\lambda$), yangın tepki sınıfı ve taşıyıcı karakteristik değerlerini içermesi gerekmektedir.</p>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">4. Kademeli Geçiş Takvimi ve Muafiyetler (2027 – 2033)</h4>
<p>Sektörün yazılım, donanım ve insan kaynağı adaptasyonunu sağlamak amacıyla Bakanlık 6 yıllık kademeli bir geçiş planı ilan etmiştir:</p>

<ul>
    <li><strong>1 Eylül 2027:</strong> Mimarlık ve mühendislik projelerinin BIM tabanlı dijital hazırlanmasına yönelik standartlar yürürlüğe girer.</li>
    <li><strong>1 Eylül 2028:</strong> e-PYS üzerinden teslim zorunluluğu 1. Etap olarak büyükşehir belediyeleri sınırları içerisindeki belirli büyüklükteki konut projelerinde başlar.</li>
    <li><strong>2028 – 2033 Geçiş Evresi:</strong> Toplam inşaat alanı baremleri kademeli olarak düşürülerek sistem Türkiye geneline yaygınlaştırılır.</li>
    <li><strong>1 Eylül 2033:</strong> Konut dışı yapılar (Ofis kuleleri, AVM'ler, fabrikalar, hastaneler, oteller ve eğitim tesisleri) için tanınan geçici muafiyet sona erer ve tüm ticari yapılar sisteme dahil olur.</li>
</ul>

<h5 style="color: var(--text-primary); margin-top: 1.5rem; margin-bottom: 0.75rem;">Yönetmelikten Kalıcı Olarak Muaf Tutulan Yapılar:</h5>
<ol style="margin-left: 1.5rem; color: var(--text-secondary); line-height: 1.7;">
    <li>Bodrum katı hariç en çok <strong>2 katlı</strong> ve toplam yapı inşaat alanı <strong>200 m²'yi geçmeyen</strong> müstakil konut ve yapılar.</li>
    <li>Entegre tesis niteliğinde olmayan, kırsal yerleşimlerdeki tarım ve hayvancılık amaçlı köy yapıları ve müştemilatlar.</li>
</ol>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">5. Şantiye ve Saha Yönetimine Doğrudan Yansımaları</h4>
<p>Bu yönetmelik yalnızca bir tasarım ve ruhsat düzenlemesi değildir; sahadaki inşaat yönetimini kökten değiştirecek pratik sonuçlar doğuracaktır:</p>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin: 1.5rem 0;">
    <div style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--border-radius-xs); padding: 1.25rem;">
        <strong style="color: var(--accent-color); font-family: var(--font-mono); font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">01 / METRAJ &amp; PURSANTAJ GÜVENİ</strong>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.6;">
            Ruhsat projesinin IFC modelinde tanımlı beton, kalıp, donatı ve cephe metrajları doğrudan QTO (Quantity Takeoff) motoruyla çekileceği için taşeron sözleşmelerinde keşif artışı ve metraj ihtilafları minimuma inecektir.
        </p>
    </div>
    <div style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--border-radius-xs); padding: 1.25rem;">
        <strong style="color: var(--accent-color); font-family: var(--font-mono); font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">02 / ÇAKIŞMA (CLASH) SIFIRLAMA</strong>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.6;">
            Kiriş ve perde duvarlardan geçen havalandırma kanalları ve yangın boruları ruhsat öncesinde sanal olarak çakıştırılacağı için, kaba yapı bittikten sonra betonarme elemanlara karot delinmesi engellenecektir.
        </p>
    </div>
    <div style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--border-radius-xs); padding: 1.25rem;">
        <strong style="color: var(--accent-color); font-family: var(--font-mono); font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">03 / AS-BUILT &amp; İSKAN ENTEGRASYONU</strong>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.6;">
            İnşaat sırasında yapılan revizyonlar IFC modeli üzerinden güncellenecek; yapı kullanım izin belgesi (iskan) aşamasında yapının dijital ikizi (Digital Twin) tapu ve belediye arşivine tescil edilecektir.
        </p>
    </div>
</div>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">6. Teknik Ofisler ve Proje Ekipleri İçin 5 Maddelik Hazırlık Rehberi</h4>
<ol style="margin-left: 1.5rem; color: var(--text-secondary); line-height: 1.8;">
    <li><strong>openBIM ve IFC Export Şablonlarının Oluşturulması:</strong> Kullandığınız BIM yazılımında (Revit, Allplan, ArchiCAD, Tekla, Aecosim vb.) Türkiye koordinat sistemi (ITRF96 / TUREF) ve Bakanlık Pset standartlarına uygun IFC 4.3 export konfigürasyonlarını şimdiden hazırlayın.</li>
    <li><strong>Ortak Veri Ortamı (CDE - Common Data Environment) Kurulumu:</strong> ISO 19650 standardına uygun olarak mimari, statik, mekanik ve elektrik disiplinlerinin modellerini haftalık koordinasyon toplantılarıyla birleştiren çalışma disiplinine geçin.</li>
    <li><strong>Model-Pafta Bütünlüğü Denetimi:</strong> Çizim ofisinizde 2D çizgi çizme alışkanlığını terk ederek, pafta çıktılarının %100 3D model kesit ve planlarından parametrik olarak türetilmesini zorunlu kılın.</li>
    <li><strong>Nitelikli E-İmza Altyapısı:</strong> Proje müellifleri ve teknik ofis çalışanlarının e-PYS sisteminde geçerli 5070 sayılı kanuna uygun elektronik imza ve zaman damgası tedarik süreçlerini tamamlayın.</li>
    <li><strong>Taşeron ve Tedarikçi Şartnamelerine BIM Kriterlerinin Eklenmesi:</strong> Özellikle giydirme cephe, çelik konstrüksiyon ve prefabrik imalatçılarından teslim edilecek imalat çizimlerinin IFC uyumlu dijital modellerle teslim edilmesi şartını sözleşmelere bağlayın.</li>
</ol>

<div style="background-color: var(--bg-secondary); border-left: 3px solid var(--accent-color); padding: 1.25rem; margin: 2rem 0;">
    <strong style="color: var(--text-primary); display: block; margin-bottom: 0.35rem;">Sonuç &amp; Değerlendirme</strong>
    <p style="font-size: 0.90rem; color: var(--text-secondary); margin: 0; line-height: 1.6;">
        5 Ağustos 2026 Resmî Gazete yönetmelikleri, Türkiye'de inşaat mühendisliği ve şantiye yönetimini çağdaş dünya standartlarına taşıyan en kritik yapısal reformdur. 1 Eylül 2027 ve 1 Eylül 2028 tarihlerine bugünden hazırlanan mühendislik ofisleri ve müteahhitlik firmaları; hata maliyetlerini düşürerek, metraj hassasiyetini artırarak ve ruhsat süreçlerini hızlandırarak sektörde belirleyici bir rekabet avantajı elde edecektir.
    </p>
</div>
</div>
