import test from 'node:test';
import assert from 'node:assert/strict';
import { birimAgirlik, donatiMetraj, kesimPlani } from '../src/scripts/donati-core.js';
import { gunuDegerlendir, saatlikGrupla, DURUM } from '../src/scripts/hava-core.js';
import { estimateInputs, calcBeton } from '../src/scripts/metraj-core.js';

const close = (a, b, tol = 1e-3) => assert.ok(Math.abs(a - b) <= tol, `${a} ≠ ${b}`);

test('donatı birim ağırlıkları standart tabloyla uyumlu', () => {
    close(birimAgirlik(8), 0.395);
    close(birimAgirlik(12), 0.888);
    close(birimAgirlik(16), 1.578);
    close(birimAgirlik(32), 6.313);
});

test('donatı metrajı çap bazında toplar', () => {
    const r = donatiMetraj([{ cap: 12, boy: 3.5, adet: 40 }, { cap: 12, boy: 2, adet: 10 }, { cap: 8, boy: 1.2, adet: 100 }]);
    assert.equal(r.capBazinda.length, 2);
    close(r.capBazinda.find(c => c.cap === 12).uzunluk, 160);
    close(r.toplamKg, 160 * birimAgirlik(12) + 120 * birimAgirlik(8));
});

test('kesim planı hiçbir parçayı atlamaz ve çubuk sayısı alt sınıra yakındır', () => {
    const parcalar = [{ boy: 3.4, adet: 30 }, { boy: 2.8, adet: 25 }, { boy: 5.2, adet: 12 }];
    const r = kesimPlani(parcalar, 12, 0);
    const kesilen = r.desenler.reduce((s, d) => s + d.parcalar.length * d.adet, 0);
    assert.equal(kesilen, 67);
    close(r.netBoy, 3.4 * 30 + 2.8 * 25 + 5.2 * 12);
    const altSinir = Math.ceil(r.netBoy / 12);
    assert.ok(r.cubukSayisi <= altSinir + 2, `${r.cubukSayisi} çubuk, alt sınır ${altSinir}`);
    r.desenler.forEach(d => assert.ok(d.parcalar.reduce((s, x) => s + x, 0) <= 12 + 1e-9));
});

test('kesim payı ve stoktan uzun parçalar', () => {
    const r = kesimPlani([{ boy: 4, adet: 3 }, { boy: 13, adet: 2 }], 12, 0.005);
    assert.equal(r.cubukSayisi, 2); // 4+4+4 + 2 kesim payı > 12
    assert.deepEqual(r.sigmayan, [{ boy: 13, adet: 2 }]);
});

const gun = (over = {}) => Array.from({ length: 24 }, (_, saat) => ({ saat, sicaklik: 18, yagis: 0, ruzgar: 10, hamle: 20, nem: 60, ...over }));

test('hava: normal gün her iş için uygun', () => {
    const r = gunuDegerlendir(gun());
    Object.values(r.isler).forEach(i => assert.equal(i.durum, DURUM.UYGUN));
});

test('hava: don riski, fırtına ve yağış kuralları', () => {
    assert.equal(gunuDegerlendir(gun({ sicaklik: -2 })).isler.beton.durum, DURUM.UYGUN_DEGIL);
    assert.equal(gunuDegerlendir(gun({ sicaklik: 3 })).isler.beton.durum, DURUM.DIKKAT);
    assert.equal(gunuDegerlendir(gun({ hamle: 55 })).isler.vinc.durum, DURUM.UYGUN_DEGIL);
    assert.equal(gunuDegerlendir(gun({ hamle: 42 })).isler.vinc.durum, DURUM.DIKKAT);
    assert.equal(gunuDegerlendir(gun({ yagis: 0.5 })).isler.cephe.durum, DURUM.UYGUN_DEGIL);
    // Mesai dışı kötü hava dikkate alınmaz
    const gece = gun().map(h => (h.saat < 6 ? { ...h, sicaklik: -3 } : h));
    assert.equal(gunuDegerlendir(gece).isler.beton.durum, DURUM.UYGUN);
});

test('hava: Open-Meteo saatlik veri güne göre gruplanır', () => {
    const time = ['2026-10-01T00:00', '2026-10-01T01:00', '2026-10-02T00:00'];
    const g = saatlikGrupla({ time, temperature_2m: [1, 2, 3], precipitation: [0, 0, 1], wind_speed_10m: [5, 5, 5], wind_gusts_10m: [9, 9, 9], relative_humidity_2m: [50, 50, 50] });
    assert.equal(g.length, 2);
    assert.equal(g[0].saatler[1].sicaklik, 2);
    assert.equal(g[1].saatler[0].saat, 0);
});

test('proje bilgilerinden tahmin makul oranlar üretir', () => {
    const e = estimateInputs({ katSayisi: 5, katAlani: 400, katYuksekligi: 3, daireSayisi: 20 });
    const b = calcBeton(e.beton);
    const betonM2 = b.rows[1].miktar / 2000;
    assert.ok(betonM2 > 0.2 && betonM2 < 0.5, `beton ${betonM2} m³/m²`);
    assert.equal(e.sap.dusAdet, 20);
    assert.equal(e.cephe.binaYukseklik, 15);
});
