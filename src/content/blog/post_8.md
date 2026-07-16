---
id: "post_8"
title: "Sürdürülebilir Yapılar ve LEED Sertifikası Puanlama Süreci"
category: "Sürdürülebilirlik"
date: "25 Haziran 2026"
imageUrl: "images/hero_bg.png"
draft: false
excerpt: "İnşaat sektöründe karbon ayak izini azaltan yeşil bina tasarım kriterleri, LEED sertifikası puanlama sistemi ve mühendislik rolleri."
---
<div class="rich-post-content">
<p>Küresel iklim kriziyle mücadele kapsamında inşaat sektörü, enerji ve su tüketiminin en yoğun olduğu alanlardan biri olarak yeşil bina dönüşümünü hızlandırmaktadır. Sürdürülebilir yapılar tasarlamak ve bunları tescil etmek için dünya genelinde en çok kabul gören sistemlerin başında USGBC tarafından geliştirilen <strong>LEED (Leadership in Energy and Environmental Design)</strong> sertifikasyon sistemi gelmektedir.</p>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">1. LEED Sertifikası Kriter Kategorileri</h4>
<p>Bir yapının LEED sertifikası alabilmesi için tasarım ve inşaat süreçlerinde şu ana başlıklardaki kriterleri karşılaması gerekir:</p>
<ul>
    <li><strong>Sürdürülebilir Alanlar (SS):</strong> İnşaatın çevreye olan olumsuz etkilerini azaltma ve biyoçeşitliliği koruma.</li>
    <li><strong>Su Verimliliği (WE):</strong> İç ve dış mekan su kullanımında akıllı armatürler ve peyzaj tasarımı ile tasarruf sağlama.</li>
    <li><strong>Enerji ve Atmosfer (EA):</strong> Yenilenebilir enerji entegrasyonu ve enerji tüketimini optimize etme.</li>
    <li><strong>Malzemeler ve Kaynaklar (MR):</strong> Geri dönüştürülmüş, yerel ve EPD belgeli sürdürülebilir malzeme kullanımı.</li>
    <li><strong>İç Mekan Çevresel Kalite (EQ):</strong> İç hava kalitesi, gün ışığı faydalanımı ve akustik konfor.</li>
</ul>

<!-- Mini Interactive LEED Score Checklist Widget -->
<div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-lg); padding: 2rem; margin: 2.5rem 0;">
<h4 style="color: var(--text-primary); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">Dinamik LEED Sertifika Seviye Simülatörü</h4>

<p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">Projenizde hedeflediğiniz veya uyguladığınız kategorilerdeki tahmini puanlarınızı girin:</p>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Entegre Tasarım & Konum (Maks: 16)</label>
<input type="number" id="leedLoc" value="10" min="0" max="16" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Su Verimliliği (Maks: 11)</label>
<input type="number" id="leedWater" value="7" min="0" max="11" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Enerji ve Atmosfer (Maks: 33)</label>
<input type="number" id="leedEnergy" value="22" min="0" max="33" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Malzeme ve Kaynaklar (Maks: 13)</label>
<input type="number" id="leedMaterials" value="6" min="0" max="13" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">İç Mekan Hava Kalitesi (Maks: 16)</label>
<input type="number" id="leedAir" value="11" min="0" max="16" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Yenilikçilik & Bölgesel Puan (Maks: 10)</label>
<input type="number" id="leedInnov" value="6" min="0" max="10" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
</div>

<button onclick="calculateLEED()" style="width: 100%; padding: 0.75rem; background: var(--accent-color); color: var(--bg-primary); border: none; border-radius: 4px; font-weight: 700; cursor: pointer; transition: background 0.2s;">Sertifika Seviyesini Belirle</button>

<div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Hesaplanan Toplam LEED Puanı:</span>
<strong id="leedTotalScore" style="color: var(--accent-color); font-size: 1.1rem;">-</strong>
</div>
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Sertifika Seviyesi (Level):</span>
<strong id="leedBadge" style="color: var(--accent-color); font-weight: 800; font-size: 1.1rem;">-</strong>
</div>
</div>

<script>
function calculateLEED() {
    var loc = parseFloat(document.getElementById('leedLoc').value) || 0;
    var wat = parseFloat(document.getElementById('leedWater').value) || 0;
    var nrg = parseFloat(document.getElementById('leedEnergy').value) || 0;
    var mat = parseFloat(document.getElementById('leedMaterials').value) || 0;
    var air = parseFloat(document.getElementById('leedAir').value) || 0;
    var inn = parseFloat(document.getElementById('leedInnov').value) || 0;
    
    // Bounds check
    loc = Math.min(16, Math.max(0, loc));
    wat = Math.min(11, Math.max(0, wat));
    nrg = Math.min(33, Math.max(0, nrg));
    mat = Math.min(13, Math.max(0, mat));
    air = Math.min(16, Math.max(0, air));
    inn = Math.min(10, Math.max(0, inn));
    
    var total = loc + wat + nrg + mat + air + inn;
    document.getElementById('leedTotalScore').innerText = total + ' / 110 Puan';
    
    var badgeEl = document.getElementById('leedBadge');
    if (total >= 80) {
        badgeEl.innerText = 'PLATINUM (En Üst Seviye)';
        badgeEl.style.color = '#e5e4e2'; // Platinum silver/white
    } else if (total >= 60) {
        badgeEl.innerText = 'GOLD (Altın)';
        badgeEl.style.color = '#f1c40f'; // Gold
    } else if (total >= 50) {
        badgeEl.innerText = 'SILVER (Gümüş)';
        badgeEl.style.color = '#bdc3c7'; // Silver
    } else if (total >= 40) {
        badgeEl.innerText = 'CERTIFIED (Onaylı)';
        badgeEl.style.color = '#d35400'; // Bronze/Orange
    } else {
        badgeEl.innerText = 'SERTİFİKA ALAMAZ (Maks 40 Puan Altı)';
        badgeEl.style.color = '#e74c3c';
    }
}
</script>
</div>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">2. Yeşil Binaların Finansal ve Çevresel Katkısı</h4>
<p>Yeşil binaların ilk yatırım maliyetleri, özel otomasyon, yalıtım ve yenilenebilir enerji teknolojileri dolayısıyla %2 ila %5 oranında daha yüksek olabilir. Ancak bu yapılar, standart binalara kıyasla <strong>%30 ila %50 enerji tasarrufu</strong> ve <strong>%40'a varan su tasarrufu</strong> sağlayarak işletme aşamasında kendilerini 3-5 yıl içinde amorti ederler.</p>

<div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 1.5rem; margin: 2rem 0; border-left: 4px solid var(--accent-color);">
<strong style="color: var(--text-primary); display: block; margin-bottom: 0.5rem; font-size: 1.1rem;">Sürdürülebilirlik Notu:</strong>
İnşaat atıklarının şantiyede sınıflara ayrılarak geri dönüşüme gönderilmesi ve bunun resmi nakliye fişleriyle raporlanması, LEED Malzemeler ve Kaynaklar (MR) kategorisinde doğrudan puan kazandıran zorunlu bir uygulamadır.
</div>
</div>
