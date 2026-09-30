import test from 'node:test';
import assert from 'node:assert/strict';
import { calcBeton, calcDuvar, calcSap, calcCephe, priceRows, calcOzet, DEFAULT_PRICES } from '../src/scripts/metraj-core.js';

const close = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) <= tol, `${a} ≠ ${b}`);
const row = (res, poz) => res.rows.find(r => r.poz === poz);

test('betonarme: hacim, kalıp ve donatı elle hesapla uyumlu', () => {
    const r = calcBeton({
        katSayisi: 2, katAlani: 100, katYuksekligi: 3, dosemeKalinligi: 0.15,
        kirisUzunlugu: 40, kirisGenislik: 0.25, kirisYukseklik: 0.5,
        kolonAdet: 4, kolonB: 0.3, kolonH: 0.5, perdeUzunlugu: 5, perdeKalinlik: 0.25,
        dosemeCevresi: 40, donatiOrani: 100, fireBeton: 0, fireDonati: 0
    });
    // Kat başı: döşeme 15 + kiriş 40×0,25×0,35=3,5 + kolon 4×0,15×2,85=1,71 + perde 5×0,25×2,85=3,5625
    const vKat = 15 + 3.5 + 1.71 + 3.5625;
    close(row(r, 'B-01').miktar, vKat * 2);
    // Kalıp: döşeme 100−0,6−1,25=98,15; kiriş 40×2×0,35=28; kolon 4×1,6×2,85=18,24; perde 5×2×2,85=28,5; kenar 40×0,5=20
    close(row(r, 'B-03').miktar, (98.15 + 28 + 18.24 + 28.5 + 20) * 2);
    close(row(r, 'B-04').miktar, vKat * 2 * 100 / 1000);
    assert.equal(r.insaatAlani, 200);
});

test('betonarme: fire yalnızca malzeme satırlarına eklenir', () => {
    const base = { katSayisi: 1, katAlani: 100, katYuksekligi: 3, dosemeKalinligi: 0.2, donatiOrani: 100 };
    const a = calcBeton({ ...base, fireBeton: 0, fireDonati: 0 });
    const b = calcBeton({ ...base, fireBeton: 5, fireDonati: 10 });
    close(row(b, 'B-01').miktar, row(a, 'B-01').miktar * 1.05);
    close(row(b, 'B-02').miktar, row(a, 'B-02').miktar);
    close(row(b, 'B-04').miktar, row(a, 'B-04').miktar * 1.10);
});

test('duvar: net alan kapı ve pencere düşülerek bulunur', () => {
    const r = calcDuvar({ duvarTipi: 'tugla135', duvarUzunlugu: 10, duvarYuksekligi: 3, kapiAdet: 1, pencereAdet: 2, pencereAlan: 1.5, sivaYuz: 2, sivaKalinlik: 1.5, fireBlok: 0, fireSiva: 0 });
    const net = 30 - 1.89 - 3;
    close(row(r, 'D-03').miktar, net);
    assert.equal(row(r, 'D-01').miktar, Math.ceil(net * 25));
    close(row(r, 'D-07').miktar, net * 2);
    assert.equal(row(r, 'D-05').miktar, Math.ceil(net * 2 * 15 / 35));
});

test('duvar: gazbetonda harç yerine yapıştırıcı kullanılır', () => {
    const r = calcDuvar({ duvarTipi: 'gazbeton', duvarUzunlugu: 10, duvarYuksekligi: 2.5, sivaYuz: 1, sivaKalinlik: 1 });
    assert.equal(row(r, 'D-02').birim, 'torba');
    assert.equal(row(r, 'D-01').miktar, Math.ceil(25 / 0.15));
});

test('şap ve seramik: alanlar ve torbalar doğru', () => {
    const r = calcSap({ sapAlani: 100, sapKalinlik: 5, dozaj: 350, fireSap: 0, islakZemin: 10, islakCevre: 14, yalitimYukseklik: 0.3, dusAdet: 1, yalitimSarfiyat: 1.5, yalitimKat: 2, zeminSeramik: 10, duvarSeramikH: 2.4, islakKapi: 1, fireSeramik: 0, yapistiriciKg: 5, derzKg: 0.3 });
    assert.equal(row(r, 'S-01').miktar, Math.ceil(5 * 350 / 50));
    const yal = 10 + 14 * 0.3 + 3.78;
    close(row(r, 'S-07').miktar, yal);
    close(row(r, 'S-05').miktar, yal * 1.5 * 2 * 1.05);
    const duvarNet = 14 * 2.4 - 1.89;
    close(row(r, 'S-09').miktar, duvarNet);
    close(row(r, 'S-12').miktar, 10 + duvarNet);
});

test('cephe: giydirme cephede dikme ve kayıt boyları', () => {
    const r = calcCephe({ sistem: 'giydirme', cepheCevre: 30, binaYukseklik: 9, panelGenislik: 1.5, panelYukseklik: 3, camKalinlik: 20, mullionKg: 4, transomKg: 3, fireAlu: 0 });
    // 20 modül, 3 sıra; dikme 20×9=180 m; kayıt 4×30=120 m
    close(row(r, 'G-01').miktar, 180 * 4 + 120 * 3);
    close(row(r, 'G-06').miktar, 270);
    assert.equal(row(r, 'G-05').miktar, 80);
});

test('cephe: mantolamada boşluk oranı düşülür', () => {
    const r = calcCephe({ sistem: 'mantolama', cepheCevre: 40, binaYukseklik: 10, boslukOrani: 25, pencereAdet: 10, binaKose: 4, levhaKalinlik: 5, fireLevha: 0 });
    close(row(r, 'M-08').miktar, 300);
    close(row(r, 'M-09').miktar, 400);
});

test('fiyatlandırma ve özet', () => {
    const p = priceRows([{ miktar: 2, fiyat: 'a' }, { miktar: 3, fiyat: 'b' }], { a: 10, b: 5 });
    assert.equal(p.toplam, 35);
    const o = calcOzet({ araToplamlar: { x: 1000 }, insaatAlani: 10, genelGider: 10, kar: 10, kdv: 20 });
    close(o.kdvHaric, 1210);
    close(o.genelToplam, 1452);
    close(o.m2Maliyet, 145.2);
});

test('her poz satırının bir varsayılan fiyatı var', () => {
    const all = [
        calcBeton({}), calcDuvar({ duvarTipi: 'tugla135' }), calcDuvar({ duvarTipi: 'tugla85' }),
        calcDuvar({ duvarTipi: 'gazbeton' }), calcDuvar({ duvarTipi: 'bims' }), calcSap({}),
        calcCephe({ sistem: 'giydirme' }), calcCephe({ sistem: 'mantolama' })
    ];
    for (const res of all) for (const r of res.rows) {
        assert.ok(r.fiyat in DEFAULT_PRICES, `${r.poz} için fiyat anahtarı yok: ${r.fiyat}`);
        assert.ok(Number.isFinite(r.miktar), `${r.poz} sayı değil`);
    }
});
