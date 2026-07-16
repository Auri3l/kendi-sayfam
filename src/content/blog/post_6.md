---
id: "post_6"
title: "Şap İmalatlarında Çatlak Kontrolü ve Katkı Maddeleri"
category: "Malzeme Bilimi"
date: "08 Temmuz 2026"
imageUrl: "images/seramik_yalitim.png"
draft: false
excerpt: "Şap dökümlerinde büzülme (rötre) çatlaklarını önlemek için kullanılan polipropilen elyaflar, lateks katkılar ve çelik hasır uygulamaları."
---
<div class="rich-post-content">
<p>Zemin şap imalatı, özellikle ince inşaat aşamasında seramik, lamine parke veya epoksi kaplama öncesi düzgün bir terazi elde etmek için vazgeçilmez bir uygulamadır. Ancak şapın geniş alanlara ince kalınlıkta (genellikle 3-7 cm) serilmesi, yüksek yüzey alanı/hacim oranı sebebiyle hızlı su kaybına ve dolayısıyla ciddi büzülme (rötre) çatlaklarına yol açar. Çatlakları minimize etmek ve şapın mekanik dayanımını artırmak, doğru katkı seçimi ve donatı kullanımı ile mümkündür.</p>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">1. Polipropilen Elyaf (PP Fiber) ve Çatlak Kontrolü</h4>
<p>Karışıma eklenen polipropilen mikro elyaflar (genellikle 6mm veya 12mm boyunda), harç içerisinde üç boyutlu bir ağ yapısı oluşturur. Bu ağ, betonun taze fazdaki plastik rötre çatlaklarının ilerlemesini engeller. Elyaf kullanımı şapın darbe dayanımını ve aşınma direncini de artırır. Standart şantiye şaplarında metreküp başına <strong>600g ila 900g</strong> elyaf eklenmesi önerilir.</p>

<!-- Mini Interactive Screed Admixture Calculator Widget -->
<div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-lg); padding: 2rem; margin: 2.5rem 0;">
<h4 style="color: var(--text-primary); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">Şap Malzemesi & Katkı Hesaplayıcı</h4>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Şap Dökülecek Alan (m²)</label>
<input type="number" id="screedArea" value="80" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Şap Kalınlığı (cm)</label>
<input type="number" id="screedThickness" value="5" step="0.5" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Dozaj (kg Çimento / m³ Kum)</label>
<input type="number" id="screedDozaj" value="350" step="50" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Lateks Katkı Oranı (% Çimento Ağırlığı)</label>
<input type="number" id="screedLatexRate" value="1.2" step="0.1" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
</div>

<button onclick="calculateScreedMix()" style="width: 100%; padding: 0.75rem; background: var(--accent-color); color: var(--bg-primary); border: none; border-radius: 4px; font-weight: 700; cursor: pointer; transition: background 0.2s;">Karışım ve Katkı İhtiyacını Hesapla</button>

<div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Gerekli Toplam Şap Hacmi:</span>
<strong id="mixVol" style="color: var(--accent-color);">-</strong>
</div>
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Gerekli Çimento Miktarı (50kg Torba):</span>
<strong id="mixCement" style="color: var(--accent-color);">-</strong>
</div>
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Gerekli Polipropilen Elyaf:</span>
<strong id="mixFiber" style="color: var(--accent-color);">-</strong>
</div>
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Gerekli Lateks Adhezyon Katkısı:</span>
<strong id="mixLatex" style="color: var(--accent-color);">-</strong>
</div>
</div>

<script>
function calculateScreedMix() {
    var area = parseFloat(document.getElementById('screedArea').value) || 0;
    var thk = parseFloat(document.getElementById('screedThickness').value) || 0;
    var dozaj = parseFloat(document.getElementById('screedDozaj').value) || 0;
    var latexRate = parseFloat(document.getElementById('screedLatexRate').value) || 0;
    
    var vol = area * (thk / 100);
    
    // Total Cement in kg
    var cementKg = vol * dozaj;
    var cementBags = Math.ceil(cementKg / 50);
    
    // Fiber calculation (800g/m³ average)
    var fiberKg = vol * 0.8;
    
    // Latex calculation
    var latexLiters = cementKg * (latexRate / 100);
    
    document.getElementById('mixVol').innerText = vol.toFixed(2) + ' m³';
    document.getElementById('mixCement').innerText = cementBags + ' torba (' + cementKg.toLocaleString('tr-TR') + ' kg)';
    document.getElementById('mixFiber').innerText = fiberKg.toFixed(2) + ' kg';
    document.getElementById('mixLatex').innerText = latexLiters.toFixed(1) + ' Litre';
}
</script>
</div>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">2. Lateks Adhezyon Artırıcı ve Elastikiyet Katkıları</h4>
<p>Polimer esaslı lateks katkılar (örneğin SBR lateks), şapın aderansını (yapışma gücünü) dramatik şekilde artırır. Özellikle eski beton zeminler üzerine dökülecek şapların alt zemine tutunmasını kolaylaştırır, şapın su geçirimsizliğini geliştirir ve rötre büzülmelerine karşı elastikiyet sağlar. Yerden ısıtma tesisatı olan zeminlerde ısı genleşmelerini sönümlemek adına lateks katkı kullanımı zorunludur.</p>

<div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 1.5rem; margin: 2rem 0; border-left: 4px solid var(--accent-color);">
<strong style="color: var(--text-primary); display: block; margin-bottom: 0.5rem; font-size: 1.1rem;">Uygulama Uyarısı:</strong>
Şap dökümünden sonraki ilk 48 saat boyunca yüzeyin doğrudan güneş ışığı alması veya rüzgara maruz kalması engellenmeli, yüzey naylon örtüyle örtülerek veya düzenli nemlendirilerek hidratasyon hızı korunmalıdır.
</div>
</div>
