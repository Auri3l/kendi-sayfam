---
id: "post_2"
title: "Islak Hacimlerde Seramik Altı Su Yalıtımı ve İzolasyon Detayları"
category: "Saha & Uygulama"
date: "02 Temmuz 2026"
imageUrl: "images/seramik_yalitim.png"
draft: false
excerpt: "Islak hacimlerde seramik kaplama öncesi doğru su yalıtımı uygulaması, yapı ömrünü doğrudan etkiler. Yüzey hazırlığı, astar seçimi, köşe pah bantları ve katlar arası kuruma süreleri."
---
<div class="rich-post-content">
    <p>Islak hacim imalatlarında (banyo, wc, balkon ve teraslar) seramik kaplama yapılmadan önce uygulanacak su yalıtım katmanı, yapı konforunu ve ömrünü koruyan en kritik katmandır. Seramik yapıştırıcıları su geçirimsiz olmadığı için, su yalıtım membranı döşenmeden yapılan uygulamalarda alt katlara su sızması kaçınılmazdır.</p>
    
    <h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">1. Yüzey Hazırlığı ve Astar Uygulaması</h4>
    <p>Başarılı bir su yalıtımının temeli aderansı zayıflatacak toz, yağ ve serbest parçalardan arındırılmış düzgün bir yüzeydir. Yüzeydeki bozukluklar tamir harçları ile giderilmeli, dik köşeler mutlaka pah harçları ile yuvarlatılmalıdır. Tozumanın önlenmesi ve emiciliğin dengelenmesi için yüzeye uygun akrilik esaslı astar sürülmelidir.</p>

    <h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">2. Köşe Pah Bantları ve Kritik Noktalar</h4>
    <p>Yapısal hareketlerin ve çatlamaların en yoğun yaşandığı kolon-duvar ve zemin-duvar birleşim yerlerine (soğuk derzler) mutlaka elastik pah bandı yerleştirilmelidir. Pah bantları birinci kat yalıtım malzemesi henüz yaş iken bastırılarak oturtulmalı, üzerine ikinci kat sürülerek kilitlenmelidir.</p>

    <!-- Mini Interactive Insulation Calculator Widget -->
    <div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-lg); padding: 2rem; margin: 2.5rem 0;">
        <h4 style="color: var(--text-primary); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">Yalıtım Malzemesi Sarfiyat Hesaplayıcı</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div>
                <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Uygulama Alanı (m²)</label>
                <input type="number" id="isoArea" value="15" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
            </div>
            <div>
                <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Kat Sayısı (Önerilen: 2)</label>
                <input type="number" id="isoCoats" value="2" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div>
                <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Sarfiyat Oranı (kg/m² - Tek Kat İçin)</label>
                <input type="number" id="isoRate" value="1.5" step="0.1" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
            </div>
            <div>
                <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Oda Çevresi (Pah Bandı İçin - Metre)</label>
                <input type="number" id="isoPerimeter" value="16" style="width: 100%; padding: 0.5rem; background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
            </div>
        </div>

        <button onclick="calculateInsulation()" style="width: 100%; padding: 0.75rem; background: var(--accent-color); color: var(--bg-primary); border: none; border-radius: 4px; font-weight: 700; cursor: pointer; transition: background 0.2s;">Sarfiyat Hesapla</button>
        
        <div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
            <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Toplam Gerekli Malzeme (Sıvı/Toz):</span>
                <strong id="isoTotalKg" style="color: var(--accent-color);">45 kg</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Gerekli Paket Sayısı (20 kg'lık torba):</span>
                <strong id="isoBags" style="color: var(--accent-color);">3 torba</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Gerekli Köşe Pah Bandı:</span>
                <strong id="isoPahLength" style="color: var(--accent-color);">16 m</strong>
            </div>
        </div>
        
        <script>
            function calculateInsulation() {
                var area = parseFloat(document.getElementById('isoArea').value) || 0;
                var coats = parseFloat(document.getElementById('isoCoats').value) || 0;
                var rate = parseFloat(document.getElementById('isoRate').value) || 0;
                var perimeter = parseFloat(document.getElementById('isoPerimeter').value) || 0;
                
                var totalKg = area * coats * rate;
                var bags = Math.ceil(totalKg / 20);
                
                document.getElementById('isoTotalKg').innerText = totalKg.toLocaleString('tr-TR') + ' kg';
                document.getElementById('isoBags').innerText = bags + ' torba';
                document.getElementById('isoPahLength').innerText = perimeter.toLocaleString('tr-TR') + ' m';
            }
        </script>
    </div>

    <h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">3. İzolasyon Katmanları ve Kuruma Kriterleri</h4>
    <p>Su yalıtımı çift bileşenli çimento veya akrilik esaslı sürme malzemelerle en az iki kat halinde uygulanmalıdır. Katlar birbirine dik doğrultuda sürülmeli ve katlar arasında en az 4-6 saat kuruma süresi beklenmelidir. İmalat sonrasında yüzeyde göllenme testi (24 saat su altında bekletme testi) yapılarak sızdırmazlık raporlanmadan seramik kaplama aşamasına geçilmemelidir.</p>
</div>
