---
id: "post_7"
title: "Prefabrik ve Endüstriyel Yapıların Şantiye Lojistiği"
category: "Şantiye Yönetimi"
date: "01 Temmuz 2026"
imageUrl: "images/kaba_insaat.png"
draft: false
excerpt: "Prefabrik betonarme veya çelik karkas binaların montaj süreçlerinde vinç konumlandırma, iş güvenliği ve lojistik yönetimi."
---
<div class="rich-post-content">
<p>Prefabrik betonarme veya yapısal çelik sistemler, şantiye süresini kısaltan ve fabrika koşullarında kontrollü imalat kalitesi sağlayan endüstriyel çözümlerdir. Ancak prefabrik yapıların şantiyedeki montaj süreçleri; ağır tonajlı elemanların taşınması, lojistik yönetimi ve vinç operasyonlarının hassas şekilde planlanmasını gerektirir. Lojistik ve kurulum planlamasında yapılacak ufak bir hata, şantiye duruşlarına ve ciddi iş kazalarına yol açabilir.</p>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">1. Vinç Konumlandırma ve Tonaj Seçimi</h4>
<p>Montaj planlamasının en kritik ayağı, sahada kullanılacak mobil veya kule vinçlerin konumlandırılması ve bom uzunluğuna göre kaldırma kapasitelerinin belirlenmesidir. Bir vincin kaldırabileceği yük miktarı, yükün vinç merkezine olan uzaklığı (çalışma yarıçapı - radius) arttıkça logaritmik olarak azalır.</p>

<!-- Mini Interactive Crane Estimator Widget -->
<div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-lg); padding: 2rem; margin: 2.5rem 0;">
<h4 style="color: var(--text-primary); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">Vinç Kapasite ve Güvenlik Limit Analizörü</h4>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Kaldırılacak Eleman Ağırlığı (Ton)</label>
<input type="number" id="loadWeight" value="8" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Montaj Çalışma Yarıçapı (Metre)</label>
<input type="number" id="craneRadius" value="22" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Vincin Nominal Toplam Kapasitesi (Ton)</label>
<input type="number" id="craneCapacity" value="100" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Rüzgar Hızı (km/h - Maks: 45)</label>
<input type="number" id="windLimit" value="20" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
</div>

<button onclick="calculateCraneRisk()" style="width: 100%; padding: 0.75rem; background: var(--accent-color); color: var(--bg-primary); border: none; border-radius: 4px; font-weight: 700; cursor: pointer; transition: background 0.2s;">Kaldırma Risk Analizi Yap</button>

<div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Yarıçaptaki Güvenli Kaldırma Sınırı (Swl):</span>
<strong id="swlResult" style="color: var(--accent-color);">-</strong>
</div>
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Vincin Çalışma Yükü Oranı (Load Ratio):</span>
<strong id="craneRatio" style="color: var(--accent-color);">-</strong>
</div>
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Güvenlik Durumu (Kritik Limit %85):</span>
<strong id="craneSafety" style="color: var(--accent-color); font-weight: 800;">-</strong>
</div>
</div>

<script>
function calculateCraneRisk() {
    var weight = parseFloat(document.getElementById('loadWeight').value) || 0;
    var radius = parseFloat(document.getElementById('craneRadius').value) || 1;
    var cap = parseFloat(document.getElementById('craneCapacity').value) || 1;
    var wind = parseFloat(document.getElementById('windLimit').value) || 0;
    
    // Theoretical safe working load based on simple physics and leverage:
    // SWL decreases inversely proportional to radius
    // SWL = (NominalCapacity * 3.5) / radius
    var swl = (cap * 2.8) / radius;
    
    // Wind factor decreases capacity
    if (wind > 30) {
        swl = swl * 0.80; // 20% capacity drop due to wind swing
    } else if (wind > 40) {
        swl = swl * 0.50;
    }
    
    var ratio = (weight / swl) * 100;
    
    document.getElementById('swlResult').innerText = swl.toFixed(1) + ' Ton';
    document.getElementById('craneRatio').innerText = '%' + ratio.toFixed(1);
    
    var safetyEl = document.getElementById('craneSafety');
    if (wind >= 45) {
        safetyEl.innerText = 'OPERASYON YASAK (Fırtına Sınırı Aşılmıştır)';
        safetyEl.style.color = '#e74c3c';
    } else if (ratio > 95) {
        safetyEl.innerText = 'TEHLİKELİ (Aşırı Yük - Devrilme Riski!)';
        safetyEl.style.color = '#e74c3c';
    } else if (ratio > 85) {
        safetyEl.innerText = 'LİMİTTE (Gözetimli Kaldırma Gerektirir)';
        safetyEl.style.color = '#f1c40f';
    } else {
        safetyEl.innerText = 'GÜVENLİ (Yeşil Işık)';
        safetyEl.style.color = '#2ecc71';
    }
}
</script>
</div>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">2. Şantiyede Just-in-Time (JIT) Lojistik Yönetimi</h4>
<p>Prefabrik montaj şantiyelerinde geniş stok sahaları bulunmayabilir. Bu durumda fabrikadan sevk edilen tırların, şantiyeye ulaştığında doğrudan vinç altına yönlendirilmesi ve tır dorsesinden direkt olarak montaj yerine kaldırılması (Just-in-Time lojistik) gerekir. Bu yöntemle çift elleçleme (stocking/unloading) maliyetleri önlenir ve şantiye alanı verimli kullanılır.</p>

<div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 1.5rem; margin: 2rem 0; border-left: 4px solid var(--accent-color);">
<strong style="color: var(--text-primary); display: block; margin-bottom: 0.5rem; font-size: 1.1rem;">İSG Önemli Hatırlatma:</strong>
Montaj operasyonlarında sapanların ve zincirlerin yük taşıma test sertifikaları günlük kontrol edilmeli, rüzgar hızı anlık anemometre ile takip edilerek 45 km/h üzerine çıktığında montaj faaliyeti derhal durdurulmalıdır.
</div>
</div>
