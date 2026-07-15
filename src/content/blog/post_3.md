---
id: "post_3"
title: "Giydirme Cephelerde Cam Seçimi ve Performans Analizi"
category: "Mühendislik & Cephe"
date: "25 Haziran 2026"
imageUrl: "images/cephe_cami.png"
draft: false
excerpt: "Modern giydirme cephe projelerinde doğru cam seçimi, binanın enerji verimliliği ve akustik konforunu belirler. U-değeri, solar faktör (SHGC) ve temperleme kriterleri."
---
<div class="rich-post-content">
<p>Modern yüksek yapılı giydirme cephe projelerinde cam, yalnızca estetik bir kabuk değil; binanın rüzgar yükü dayanımını, ısı yalıtım (U-Değeri) performansını, akustik konforunu ve güneş kontrol verimliliğini (SHGC/G-Değeri) belirleyen en önemli mühendislik elemanıdır.</p>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">1. Isı ve Güneş Kontrol Performansı</h4>
<p>Güneş kontrol kaplamalı çift veya üç camlı yalıtım üniteleri (IGU), binanın iklimlendirme yüklerini minimize eder. Dış camda Low-E kaplamaların kullanılması kızılötesi ışınları geri yansıtarak yazın serinlik, kışın ise sıcaklık koruması sağlar. İklim koşullarına ve rüzgar maruziyetine göre cam boşluğunda hava yerine argon gazı kullanımı ısı geçirgenlik katsayısını (Ug) belirgin oranda düşürür.</p>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">2. Emniyet ve Dayanım: Temperleme ve Laminasyon</h4>
<p>Yüksek yapılarda cephe camları ciddi rüzgar yüklerine maruz kalır. Termal stres çatlamaları ve yük kırılmalarını önlemek amacıyla cephe camları ısıl işlemlere (temperleme veya yarı temperleme) tabi tutulur. Düşme tehlikesini önlemek amacıyla iç ve dış cam paneller akustik PVB (Polivinil Bütiral) ara katmanları ile lamine edilerek kırılma anında dahi cam bütünlüğünün korunması sağlanır.</p>

<!-- Mini Interactive Glass Calculator Widget -->
<div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-lg); padding: 2rem; margin: 2.5rem 0;">
<h4 style="color: var(--text-primary); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">Cam Paneli Ağırlık Hesaplayıcı</h4>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Cam Genişliği (m)</label>
<input type="number" id="glassWidth" value="1.5" step="0.1" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Cam Yüksekliği (m)</label>
<input type="number" id="glassHeight" value="3.0" step="0.1" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Dış Cam Kalınlığı (mm)</label>
<input type="number" id="glassOuterThk" value="8" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">İç Cam Kalınlığı (Lamine - mm)</label>
<input type="number" id="glassInnerThk" value="12" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
</div>

<button onclick="calculateGlassWeight()" style="width: 100%; padding: 0.75rem; background: var(--accent-color); color: var(--bg-primary); border: none; border-radius: 4px; font-weight: 700; cursor: pointer; transition: background 0.2s;">Hesapla</button>

<div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Cam Yüzey Alanı:</span>
<strong id="glassAreaResult" style="color: var(--accent-color);">4.5 m²</strong>
</div>
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Toplam Cam Ağırlığı (Toleranssız):</span>
<strong id="glassWeightResult" style="color: var(--accent-color);">225 kg</strong>
</div>
</div>

<script>
function calculateGlassWeight() {
    var width = parseFloat(document.getElementById('glassWidth').value) || 0;
    var height = parseFloat(document.getElementById('glassHeight').value) || 0;
    var outer = parseFloat(document.getElementById('glassOuterThk').value) || 0;
    var inner = parseFloat(document.getElementById('glassInnerThk').value) || 0;
    
    var area = width * height;
    // Cam yoğunluğu: 2.5 kg/m2 per mm thickness
    var totalWeight = area * (outer + inner) * 2.5;
    
    document.getElementById('glassAreaResult').innerText = area.toFixed(2).toLocaleString('tr-TR') + ' m²';
    document.getElementById('glassWeightResult').innerText = Math.round(totalWeight).toLocaleString('tr-TR') + ' kg';
}
</script>
</div>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">3. Yapısal Ağırlık ve Montaj Planlaması</h4>
<p>Cam kalınlığı arttıkça panel ağırlıkları katlanarak artar. Hesaplanan bu statik ağırlıklar; ankraj tasarımlarını, döşeme taşıma kapasitelerini, rüzgar sehim sınırlarını ve şantiyede kullanılacak örümcek vinç/vantuz ekipmanlarının kapasite seçimlerini doğrudan belirler. Bu nedenle cam tasarımı yapılmadan hiçbir taşıyıcı ankraj imalatına başlanmamalıdır.</p>
</div>
