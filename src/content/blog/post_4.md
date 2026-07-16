---
id: "post_4"
title: "Alüminyum Giydirme Cephelerde Performans Testleri (Mock-up)"
category: "Cephe Mühendisliği"
date: "16 Temmuz 2026"
imageUrl: "images/cephe_cami.png"
draft: false
excerpt: "Giydirme cephe sistemlerinin rüzgar, hava, su sızdırmazlığı ve sismik hareketlere dayanımını sahaya uygulanmadan önce doğrulayan mock-up test süreçleri."
---
<div class="rich-post-content">
<p>Büyük ölçekli ve yüksek katlı projelerde giydirme cephe sistemleri, binanın kabuğunu oluşturarak dış etkenlere karşı ilk savunma hattını oluşturur. Cephe sistemlerinin tasarım aşamasında teorik olarak yapılan statik ve ısıl hesapların, sahada birebir performans gösterip gösteremeyeceğini doğrulamak amacıyla yapılan test sürecine <strong>Mock-up (Performans) Testleri</strong> denir.</p>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">1. Mock-up Testi Nedir ve Neden Yapılır?</h4>
<p>Mock-up testi, sahada kurulacak olan cephe sisteminin tipik bir bölümünün (genellikle iki kat yüksekliğinde ve en az üç modül genişliğinde), laboratuvar ortamında kurulan özel bir test odasına (chamber) monte edilerek gerçek dış ortam koşullarına maruz bırakılması işlemidir. Bu testler sayesinde cephe tasarımındaki zayıf noktalar, imalat hataları ve montaj riskleri işin başında tespit edilir.</p>

<!-- Mini Interactive Mock-up Simulator Widget -->
<div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-lg); padding: 2rem; margin: 2.5rem 0;">
<h4 style="color: var(--text-primary); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">Rüzgar Yükü & Deformasyon Test Simülatörü</h4>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Test Rüzgar Basıncı (Pascal)</label>
<input type="number" id="testPressure" value="1200" min="500" max="3000" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Mullion Profil Atalet Momenti (Ix - cm⁴)</label>
<input type="number" id="mullionIx" value="180" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Açıklık / Profil Boyu (Metre)</label>
<input type="number" id="spanLength" value="3.5" step="0.1" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Modül Genişliği (Metre)</label>
<input type="number" id="moduleWidth" value="1.5" step="0.1" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
</div>

<button onclick="calculateMockup()" style="width: 100%; padding: 0.75rem; background: var(--accent-color); color: var(--bg-primary); border: none; border-radius: 4px; font-weight: 700; cursor: pointer; transition: background 0.2s;">Test Sonucunu Simüle Et</button>

<div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Mullion Üzerine Gelen Yük (kN/m):</span>
<strong id="mockupLoad" style="color: var(--accent-color);">-</strong>
</div>
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Hesaplanan Profil Sehmi (Deflection):</span>
<strong id="mockupDeflect" style="color: var(--accent-color);">-</strong>
</div>
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">İzin Verilen Limit (L/200 veya 15mm):</span>
<strong id="mockupLimit" style="color: var(--accent-color);">-</strong>
</div>
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Test Durumu:</span>
<strong id="mockupResult" style="color: var(--accent-color); font-weight: 800;">-</strong>
</div>
</div>

<script>
function calculateMockup() {
    var p = parseFloat(document.getElementById('testPressure').value) || 0;
    var ix = parseFloat(document.getElementById('mullionIx').value) || 1;
    var l = parseFloat(document.getElementById('spanLength').value) || 0;
    var w = parseFloat(document.getElementById('moduleWidth').value) || 0;
    
    // Convert pressure to load on mullion: w = p * moduleWidth (N/m)
    var loadNm = p * w;
    var loadKnm = loadNm / 1000;
    
    // Deflection calculation for simple span under uniform load:
    // delta = (5 * w * L^4) / (384 * E * I)
    // E = 70,000 MPa = 7,000,000 N/cm²
    // I = Ix * 10^-8 m^4
    var E = 70 * 1e9; // N/m²
    var I_m4 = ix * 1e-8; // m^4
    var deflectionM = (5 * loadNm * Math.pow(l, 4)) / (384 * E * I_m4);
    var deflectionMM = deflectionM * 1000;
    
    var limit = Math.min(15, (l * 1000) / 200);
    
    document.getElementById('mockupLoad').innerText = loadKnm.toFixed(2) + ' kN/m';
    document.getElementById('mockupDeflect').innerText = deflectionMM.toFixed(2) + ' mm';
    document.getElementById('mockupLimit').innerText = limit.toFixed(1) + ' mm';
    
    var resultEl = document.getElementById('mockupResult');
    if (deflectionMM <= limit) {
        resultEl.innerText = 'BAŞARILI (PASSED)';
        resultEl.style.color = '#2ecc71';
    } else {
        resultEl.innerText = 'BAŞARISIZ (FAILED - Profil Güçlendirilmeli)';
        resultEl.style.color = '#e74c3c';
    }
}
</script>
</div>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">2. Standart Test Sekansı</h4>
<p>Performans testleri, uluslararası standartlara (EN veya AAMA) uygun olarak belirli bir sıra ile gerçekleştirilir:</p>
<ul>
    <li><strong>Hava Geçirgenlik Testi:</strong> Negatif ve pozitif basınç altında profillerden ve derzlerden sızan hava miktarı ölçülür.</li>
    <li><strong>Statik Su Sızdırmazlık Testi:</strong> Dış yüzeye sürekli su püskürtülürken test odası basınçlandırılarak iç mekâna su sızışı olup olmadığı denetlenir.</li>
    <li><strong>Rüzgar Direnci Testi (Servis Basıncı):</strong> Cephenin tasarım rüzgar yükü altındaki sehim miktarları ölçülür ve limitlerle karşılaştırılır.</li>
    <li><strong>Dinamik Su Sızdırmazlık Testi:</strong> Bir uçak pervanesi ile dinamik rüzgar ve fırtına etkisi yaratılarak su sızdırmazlık performansı ölçülür.</li>
    <li><strong>Sismik Deplasman Testi:</strong> Kat kirişleri yatay doğrultuda hareket ettirilerek deprem anındaki cephe paneli deformasyonları ve derz esneklikleri kontrol edilir.</li>
</ul>

<div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 1.5rem; margin: 2rem 0; border-left: 4px solid var(--accent-color);">
<strong style="color: var(--text-primary); display: block; margin-bottom: 0.5rem; font-size: 1.1rem;">Kritik Hata Sebebi:</strong>
Mock-up testlerinde en sık karşılaşılan başarısızlık nedeni profil statik yetersizliğinden ziyade, köşe birleşim noktalarındaki epoksi/butil dolgu hataları ile EPDM conta montaj işçiliği eksiklikleridir.
</div>
</div>
