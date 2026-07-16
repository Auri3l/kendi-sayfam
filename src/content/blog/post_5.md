---
id: "post_5"
title: "FIDIC İnşaat Sözleşmelerinde Gecikme Cezaları ve Süre Uzatımı (EOT)"
category: "Proje Yönetimi"
date: "12 Temmuz 2026"
imageUrl: "images/hero_bg.png"
draft: false
excerpt: "Uluslararası inşaat projelerinde en çok tercih edilen FIDIC sözleşme modellerinde yüklenici ve işveren süre uzatımı (EOT) ve gecikme cezası (LD) hesaplama yöntemleri."
---
<div class="rich-post-content">
<p>Büyük ölçekli uluslararası inşaat projelerinde en sık karşılaşılan uyuşmazlıklar, işin hedeflenen sürede tamamlanamaması ve buna bağlı olarak ortaya çıkan süre uzatımı (EOT - Extension of Time) ile gecikme tazminatları (LD - Liquidated Damages) konularındadır. Bu süreçlerin FIDIC (Kırmızı Kitap veya Sarı Kitap) sözleşme koşullarına göre doğru yönetilmesi, hem yüklenici hem de işveren için hayati finansal sonuçlar doğurur.</p>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">1. Süre Uzatımı (EOT) Kriterleri</h4>
<p>Yüklenicinin süre uzatımı talep edebilmesi için gecikmenin kendi kusurundan kaynaklanmaması ve kritik yolu (critical path) etkilemesi gerekir. FIDIC Alt-Madde 20.1 (yeni 2017 versiyonunda Alt-Madde 20.2) uyarınca, gecikmeye sebep olan olayın fark edilmesinden itibaren <strong>28 gün içerisinde</strong> işverene/mühendise resmi hak talebi bildirimi (Claim Notice) yapılması zorunludur. Bu süre aşılırsa, yüklenici tüm haklarını kaybeder (Time-bar).</p>

<!-- Mini Interactive EOT & Penalty Calculator Widget -->
<div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-lg); padding: 2rem; margin: 2.5rem 0;">
<h4 style="color: var(--text-primary); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">Gecikme Cezası & EOT Hesaplayıcı</h4>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Sözleşme Bedeli ($)</label>
<input type="number" id="contractVal" value="12500000" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Günlük Gecikme Cezası Oranı (%/gün)</label>
<input type="number" id="penaltyRate" value="0.05" step="0.01" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Toplam Gecikme Süresi (Gün)</label>
<input type="number" id="delayDays" value="45" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
<div>
<label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Onaylanan Süre Uzatımı / EOT (Gün)</label>
<input type="number" id="eotDays" value="30" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
</div>
</div>

<button onclick="calculateEOT()" style="width: 100%; padding: 0.75rem; background: var(--accent-color); color: var(--bg-primary); border: none; border-radius: 4px; font-weight: 700; cursor: pointer; transition: background 0.2s;">Analiz Et ve Hesapla</button>

<div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Cezaya Tabi Kalan Gecikme:</span>
<strong id="netDelay" style="color: var(--accent-color);">-</strong>
</div>
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Hesaplanan Gecikme Cezası ($):</span>
<strong id="totalPenalty" style="color: var(--accent-color);">-</strong>
</div>
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Sözleşme Bedeline Göre Oranı:</span>
<strong id="penaltyPercentage" style="color: var(--accent-color);">-</strong>
</div>
<div style="display: flex; justify-content: space-between;">
<span style="color: var(--text-secondary);">Azami Limit Durumu (%10 Barajı):</span>
<strong id="limitStatus" style="color: var(--accent-color); font-weight: 800;">-</strong>
</div>
</div>

<script>
function calculateEOT() {
    var price = parseFloat(document.getElementById('contractVal').value) || 0;
    var rate = parseFloat(document.getElementById('penaltyRate').value) || 0;
    var delay = parseFloat(document.getElementById('delayDays').value) || 0;
    var eot = parseFloat(document.getElementById('eotDays').value) || 0;
    
    var netDelayDays = Math.max(0, delay - eot);
    var dailyCost = price * (rate / 100);
    var calculatedPenalty = netDelayDays * dailyCost;
    
    // Max penalty limit is generally capped at 10% of contract value
    var maxPenalty = price * 0.10;
    var finalPenalty = Math.min(calculatedPenalty, maxPenalty);
    var pct = (finalPenalty / price) * 100;
    
    document.getElementById('netDelay').innerText = netDelayDays + ' gün';
    document.getElementById('totalPenalty').innerText = '$' + finalPenalty.toLocaleString('en-US', {maximumFractionDigits: 0});
    document.getElementById('penaltyPercentage').innerText = '%' + pct.toFixed(2);
    
    var limitEl = document.getElementById('limitStatus');
    if (calculatedPenalty >= maxPenalty) {
        limitEl.innerText = 'AZAMİ CEZA LİMİTİNE ULAŞILDI (%10)';
        limitEl.style.color = '#e74c3c';
    } else {
        limitEl.innerText = 'Limit Altında (Güvenli)';
        limitEl.style.color = '#2ecc71';
    }
}
</script>
</div>

<h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">2. Gecikme Cezaları (Liquidated Damages)</h4>
<p>Gecikme cezaları (LD), işin gecikmesi durumunda işverenin uğrayacağı gerçek zararı kanıtlama yükümlülüğü olmaksızın tahsil edebileceği, önceden kararlaştırılmış maktu tazminattır. Genellikle haftalık veya günlük olarak hesaplanır ve sözleşme toplam bedelinin %10'u ile sınırlandırılır.</p>
<p>Yüklenici, işverenden kaynaklı gecikmeleri (proje gecikmesi, yer teslimi gecikmesi, ödemelerin gecikmesi) zamanında raporlayarak EOT alabilirse, bu süreye tekabül eden gecikme cezalarından muaf tutulur ve ek genel gider maliyetlerini (prolongation costs) talep edebilir.</p>

<div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 1.5rem; margin: 2rem 0; border-left: 4px solid var(--accent-color);">
<strong style="color: var(--text-primary); display: block; margin-bottom: 0.5rem; font-size: 1.1rem;">Sözleşme Uzmanı İpucu:</strong>
EOT analizlerinde sadece gecikmenin varlığı yetmez; geciken imalatın As-Built iş programındaki kritik hat (Critical Path) üzerinde yer aldığının Primavera P6 veya MS Project analizleri ile ispatlanması şarttır.
</div>
</div>
