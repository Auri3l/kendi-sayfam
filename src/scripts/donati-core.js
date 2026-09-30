// ==========================================================================
// DONATI METRAJI & KESİM PLANI ÇEKİRDEĞİ (saf fonksiyonlar)
// ==========================================================================

export const CAPLAR = [8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32];

// Nervürlü donatı birim ağırlığı: π/4 × d² × 7850 kg/m³ → 0,006165 × d² (d mm)
export const birimAgirlik = d => 0.00616538 * d * d;

// Liste satırları: { cap, boy (m), adet }
export function donatiMetraj(satirlar) {
    const capBazinda = new Map();
    let toplamKg = 0;
    const rows = satirlar
        .filter(r => r && r.cap > 0 && r.boy > 0 && r.adet > 0)
        .map(r => {
            const uzunluk = r.boy * r.adet;
            const kg = uzunluk * birimAgirlik(r.cap);
            toplamKg += kg;
            const c = capBazinda.get(r.cap) || { cap: r.cap, uzunluk: 0, kg: 0 };
            c.uzunluk += uzunluk;
            c.kg += kg;
            capBazinda.set(r.cap, c);
            return { ...r, uzunluk, kg };
        });
    return {
        rows,
        capBazinda: [...capBazinda.values()].sort((a, b) => a.cap - b.cap),
        toplamKg
    };
}

// Kesim optimizasyonu: parçalar { boy, adet } → stok boydan en az çubukla kesim.
// Önce ilk-uyan-azalan (FFD), sonra en iyi-uyan-azalan (BFD) denenir; daha az
// çubuk (eşitse daha büyük tek artık) veren sonuç seçilir.
export function kesimPlani(parcalar, stok = 12, kesimPayi = 0) {
    const eps = 1e-9;
    const liste = [];
    const sigmayan = [];
    parcalar.forEach(p => {
        const boy = Number(p.boy);
        const adet = Math.round(Number(p.adet));
        if (!(boy > 0) || !(adet > 0)) return;
        if (boy > stok + eps) {
            sigmayan.push({ boy, adet });
            return;
        }
        for (let i = 0; i < adet; i++) liste.push(boy);
    });
    liste.sort((a, b) => b - a);

    const yerlestir = strateji => {
        const cubuklar = [];
        for (const boy of liste) {
            const ihtiyac = c => boy + (c.parcalar.length ? kesimPayi : 0);
            let hedef = null;
            for (const c of cubuklar) {
                if (c.kalan + eps >= ihtiyac(c)) {
                    if (strateji === 'ilk') { hedef = c; break; }
                    if (!hedef || c.kalan < hedef.kalan) hedef = c;
                }
            }
            if (!hedef) {
                hedef = { parcalar: [], kalan: stok };
                cubuklar.push(hedef);
            }
            hedef.kalan -= ihtiyac(hedef);
            hedef.parcalar.push(boy);
        }
        return cubuklar;
    };

    // Desen bazlı açgözlü yöntem: kalan talepten en az artık bırakan kesim
    // desenini bulup mümkün olduğunca tekrarlar.
    const desenYontemi = () => {
        const tipler = [...new Set(liste)].sort((x, y) => y - x);
        const kalanTalep = new Map(tipler.map(t => [t, liste.filter(x => x === t).length]));
        const cubuklar = [];
        let guvenlik = 0;
        while ([...kalanTalep.values()].some(v => v > 0) && guvenlik++ < 10000) {
            let enIyi = null;
            let dugum = 0;
            const sayac = new Array(tipler.length).fill(0);
            const ara = (i, dolu, adetParca) => {
                if (++dugum > 20000) return;
                if (i === tipler.length) {
                    if (adetParca > 0 && (!enIyi || dolu > enIyi.dolu + eps)) enIyi = { dolu, sayac: sayac.slice() };
                    return;
                }
                const t = tipler[i];
                const pay = adetParca > 0 ? kesimPayi : 0;
                const maxAdet = Math.min(kalanTalep.get(t), Math.floor((stok - dolu + kesimPayi - pay + eps) / (t + kesimPayi)));
                for (let k = Math.max(0, maxAdet); k >= 0; k--) {
                    sayac[i] = k;
                    const ek = k > 0 ? k * t + (k - 1) * kesimPayi + (adetParca > 0 ? kesimPayi : 0) : 0;
                    if (dolu + ek > stok + eps) continue;
                    ara(i + 1, dolu + ek, adetParca + k);
                }
                sayac[i] = 0;
            };
            ara(0, 0, 0);
            if (!enIyi) break;
            let tekrar = Infinity;
            enIyi.sayac.forEach((k, i) => { if (k > 0) tekrar = Math.min(tekrar, Math.floor(kalanTalep.get(tipler[i]) / k)); });
            const parcalarDesen = [];
            enIyi.sayac.forEach((k, i) => { for (let j = 0; j < k; j++) parcalarDesen.push(tipler[i]); });
            for (let r = 0; r < tekrar; r++) cubuklar.push({ parcalar: parcalarDesen.slice(), kalan: stok - enIyi.dolu });
            enIyi.sayac.forEach((k, i) => kalanTalep.set(tipler[i], kalanTalep.get(tipler[i]) - k * tekrar));
        }
        return cubuklar;
    };

    const adaylar = [yerlestir('ilk'), yerlestir('en-iyi'), desenYontemi()];
    const enBuyukArtik = cs => Math.max(0, ...cs.map(c => c.kalan));
    const cubuklar = adaylar.reduce((best, c) => (c.length < best.length || (c.length === best.length && enBuyukArtik(c) > enBuyukArtik(best))) ? c : best);

    // Aynı kesim şemasını grupla
    const desenler = new Map();
    cubuklar.forEach(c => {
        const anahtar = c.parcalar.map(x => x.toFixed(2)).join('+');
        const d = desenler.get(anahtar) || { parcalar: c.parcalar.slice(), artik: Math.max(0, c.kalan), adet: 0 };
        d.adet += 1;
        desenler.set(anahtar, d);
    });

    const netBoy = liste.reduce((s, x) => s + x, 0);
    const toplamStok = cubuklar.length * stok;
    const artik = Math.max(0, toplamStok - netBoy);
    return {
        cubukSayisi: cubuklar.length,
        desenler: [...desenler.values()].sort((x, y) => y.adet - x.adet),
        netBoy,
        toplamStok,
        artik,
        firePct: toplamStok > 0 ? (artik / toplamStok) * 100 : 0,
        sigmayan
    };
}
