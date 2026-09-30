// ==========================================================================
// METRAJ & MALİYET ÇEKİRDEĞİ
// Saf hesap fonksiyonları: DOM'a dokunmaz, Node testleriyle doğrulanır.
// Her modül { rows, breakdown } döndürür. rows: birim fiyatla çarpılan poz
// satırları; breakdown: bilgi amaçlı ara metrajlar.
// ==========================================================================

// Örnek birim fiyatlar (₺, KDV hariç). Piyasa fiyatı değildir; kullanıcı
// kendi tedarikçi fiyatlarını girmelidir.
export const DEFAULT_PRICES = {
    beton_hazir: 3000,
    beton_pompa: 350,
    kalip: 600,
    donati: 25000,
    donati_iscilik: 4500,
    bag_teli: 60,

    blok_tugla135: 12,
    blok_tugla85: 9,
    blok_gazbeton: 45,
    blok_bims: 25,
    orgu_harci: 2500,
    gazbeton_yapistirici: 180,
    duvar_iscilik: 250,
    lento: 450,
    alci_siva: 220,
    saten_alci: 200,
    siva_iscilik: 180,
    kose_profili: 25,

    cimento: 230,
    kum: 900,
    pp_elyaf: 180,
    sap_iscilik: 90,
    yalitim_malzeme: 110,
    pah_bandi: 35,
    yalitim_iscilik: 90,
    seramik_zemin: 450,
    seramik_duvar: 400,
    seramik_yapistirici: 250,
    derz: 60,
    seramik_iscilik: 350,

    mant_levha: 180,
    mant_yapistirma: 200,
    mant_siva: 220,
    mant_file: 30,
    mant_dubel: 4,
    mant_profil: 25,
    mant_sonkat: 120,
    mant_iscilik: 250,
    iskele: 120,

    gc_aluminyum: 450,
    gc_isicam: 2800,
    gc_epdm: 30,
    gc_silikon: 350,
    gc_ankraj: 900,
    gc_montaj: 1500
};

const pos = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
};
const pct = v => pos(v) / 100;

// --------------------------------------------------------------------------
// 1) BETONARME: beton, kalıp, donatı (tipik kat × kat sayısı)
// --------------------------------------------------------------------------
export function calcBeton(i) {
    const kat = Math.max(1, Math.round(pos(i.katSayisi, 1)));
    const A = pos(i.katAlani);
    const H = pos(i.katYuksekligi);
    const t = pos(i.dosemeKalinligi);
    const Lb = pos(i.kirisUzunlugu);
    const bw = pos(i.kirisGenislik);
    const hb = pos(i.kirisYukseklik);
    const n = Math.round(pos(i.kolonAdet));
    const bc = pos(i.kolonB);
    const hc = pos(i.kolonH);
    const Lw = pos(i.perdeUzunlugu);
    const tw = pos(i.perdeKalinlik);
    const cevre = pos(i.dosemeCevresi);
    const oran = pos(i.donatiOrani);
    const fBeton = pct(i.fireBeton);
    const fDonati = pct(i.fireDonati);

    const netH = Math.max(0, H - t);           // döşeme altı net kat yüksekliği
    const sarkma = Math.max(0, hb - t);        // kirişin döşeme altına sarkan kısmı

    // Kat başı beton (m³)
    const vDoseme = A * t;
    const vKiris = Lb * bw * sarkma;
    const vKolon = n * bc * hc * netH;
    const vPerde = Lw * tw * netH;
    const vKat = vDoseme + vKiris + vKolon + vPerde;

    // Kat başı kalıp (m²)
    const kDoseme = Math.max(0, A - n * bc * hc - Lw * tw);
    const kKiris = Lb * 2 * sarkma;
    const kKolon = n * 2 * (bc + hc) * netH;
    const kPerde = Lw * 2 * netH;
    const kKenar = cevre * Math.max(t, hb);
    const kKat = kDoseme + kKiris + kKolon + kPerde + kKenar;

    const vToplam = vKat * kat;
    const kToplam = kKat * kat;
    const donatiTon = vToplam * oran / 1000;

    return {
        rows: [
            { poz: 'B-01', tanim: 'Hazır beton C30/37 (fire dahil)', miktar: vToplam * (1 + fBeton), birim: 'm³', fiyat: 'beton_hazir' },
            { poz: 'B-02', tanim: 'Beton pompası ve döküm işçiliği', miktar: vToplam, birim: 'm³', fiyat: 'beton_pompa' },
            { poz: 'B-03', tanim: 'Kalıp ve iskele (malzeme + işçilik)', miktar: kToplam, birim: 'm²', fiyat: 'kalip' },
            { poz: 'B-04', tanim: 'Nervürlü donatı B500C (fire dahil)', miktar: donatiTon * (1 + fDonati), birim: 'ton', fiyat: 'donati' },
            { poz: 'B-05', tanim: 'Donatı kesme, bükme ve montaj işçiliği', miktar: donatiTon, birim: 'ton', fiyat: 'donati_iscilik' },
            { poz: 'B-06', tanim: 'Bağ teli (≈ 8 kg/ton donatı)', miktar: donatiTon * 8, birim: 'kg', fiyat: 'bag_teli' }
        ],
        breakdown: [
            { ad: 'Döşeme betonu (kat başı)', deger: vDoseme, birim: 'm³' },
            { ad: 'Kiriş sarkma betonu (kat başı)', deger: vKiris, birim: 'm³' },
            { ad: 'Kolon betonu (kat başı)', deger: vKolon, birim: 'm³' },
            { ad: 'Perde betonu (kat başı)', deger: vPerde, birim: 'm³' },
            { ad: 'Toplam beton (kat başı)', deger: vKat, birim: 'm³' },
            { ad: 'Transmikser seferi (kat başı, 8 m³)', deger: Math.ceil(vKat / 8), birim: 'sefer', ondalik: 0 },
            { ad: 'Kalıp (kat başı)', deger: kKat, birim: 'm²' },
            { ad: 'Beton / inşaat alanı', deger: A > 0 ? vKat / A : 0, birim: 'm³/m²', ondalik: 3 },
            { ad: 'Donatı / inşaat alanı', deger: A > 0 ? (donatiTon * 1000) / (A * kat) : 0, birim: 'kg/m²' }
        ],
        insaatAlani: A * kat
    };
}

// --------------------------------------------------------------------------
// 2) DUVAR & SIVA
// --------------------------------------------------------------------------
export const DUVAR_TIPLERI = {
    tugla135: { ad: 'Yatay delikli tuğla 19×19×13,5', adetM2: 25, harcM3: 0.030, fiyat: 'blok_tugla135' },
    tugla85: { ad: 'Yatay delikli tuğla 19×19×8,5', adetM2: 25, harcM3: 0.020, fiyat: 'blok_tugla85' },
    gazbeton: { ad: 'Gazbeton blok 60×25', adetM2: 1 / (0.60 * 0.25), yapistiriciKg: 4, fiyat: 'blok_gazbeton' },
    bims: { ad: 'Bims blok 39×19×19', adetM2: 1 / (0.40 * 0.20), harcM3: 0.025, fiyat: 'blok_bims' }
};

export function calcDuvar(i) {
    const tip = DUVAR_TIPLERI[i.duvarTipi] || DUVAR_TIPLERI.tugla135;
    const L = pos(i.duvarUzunlugu);
    const H = pos(i.duvarYuksekligi);
    const kapi = Math.round(pos(i.kapiAdet));
    const pencere = Math.round(pos(i.pencereAdet));
    const pencereAlan = pos(i.pencereAlan);
    const yuz = Math.min(2, Math.max(1, Math.round(pos(i.sivaYuz, 2))));
    const sivaCm = pos(i.sivaKalinlik);
    const fBlok = pct(i.fireBlok);
    const fSiva = pct(i.fireSiva);

    const KAPI_ALAN = 0.9 * 2.1;
    const brut = L * H;
    const bosluk = kapi * KAPI_ALAN + pencere * pencereAlan;
    const net = Math.max(0, brut - bosluk);
    const sivaAlan = net * yuz;

    const rows = [
        { poz: 'D-01', tanim: `${tip.ad} (fire dahil)`, miktar: Math.ceil(net * tip.adetM2 * (1 + fBlok)), birim: 'adet', fiyat: tip.fiyat, ondalik: 0 }
    ];
    if (tip.yapistiriciKg) {
        rows.push({ poz: 'D-02', tanim: 'Gazbeton yapıştırma harcı (25 kg torba)', miktar: Math.ceil(net * tip.yapistiriciKg / 25), birim: 'torba', fiyat: 'gazbeton_yapistirici', ondalik: 0 });
    } else {
        rows.push({ poz: 'D-02', tanim: 'Duvar örgü harcı', miktar: net * tip.harcM3, birim: 'm³', fiyat: 'orgu_harci' });
    }
    // Kapı ve pencere kenarlarında sıva köşe profili: pencere çevresi ≈ 4√A, kapı ≈ 2×2,1 + 0,9
    const koseProfil = pencere * 4 * Math.sqrt(pencereAlan) + kapi * (2 * 2.1 + 0.9);
    rows.push(
        { poz: 'D-03', tanim: 'Duvar örgü işçiliği', miktar: net, birim: 'm²', fiyat: 'duvar_iscilik' },
        { poz: 'D-04', tanim: 'Prefabrik lento (kapı + pencere)', miktar: kapi + pencere, birim: 'adet', fiyat: 'lento', ondalik: 0 },
        { poz: 'D-05', tanim: `Makine alçı sıvası, ${sivaCm.toLocaleString('tr-TR')} cm (35 kg torba)`, miktar: Math.ceil(sivaAlan * 10 * sivaCm * (1 + fSiva) / 35), birim: 'torba', fiyat: 'alci_siva', ondalik: 0 },
        { poz: 'D-06', tanim: 'Saten alçı (25 kg torba)', miktar: Math.ceil(sivaAlan * 1.2 * (1 + fSiva) / 25), birim: 'torba', fiyat: 'saten_alci', ondalik: 0 },
        { poz: 'D-07', tanim: 'Alçı sıva + saten alçı işçiliği', miktar: sivaAlan, birim: 'm²', fiyat: 'siva_iscilik' },
        { poz: 'D-08', tanim: 'Sıva köşe profili (boşluk kenarları)', miktar: koseProfil, birim: 'm', fiyat: 'kose_profili' }
    );

    return {
        rows,
        breakdown: [
            { ad: 'Brüt duvar alanı', deger: brut, birim: 'm²' },
            { ad: 'Kapı + pencere düşümü', deger: bosluk, birim: 'm²' },
            { ad: 'Net duvar alanı', deger: net, birim: 'm²' },
            { ad: 'Sıvalı yüzey alanı', deger: sivaAlan, birim: 'm²' },
            { ad: 'Blok sarfiyatı (fire hariç)', deger: tip.adetM2, birim: 'adet/m²', ondalik: 1 }
        ]
    };
}

// --------------------------------------------------------------------------
// 3) ŞAP, ISLAK HACİM YALITIMI & SERAMİK
// --------------------------------------------------------------------------
export function calcSap(i) {
    const sapA = pos(i.sapAlani);
    const sapCm = pos(i.sapKalinlik);
    const doz = pos(i.dozaj);
    const fSap = pct(i.fireSap);
    const zemin = pos(i.islakZemin);
    const cevre = pos(i.islakCevre);
    const yalH = pos(i.yalitimYukseklik);
    const dus = Math.round(pos(i.dusAdet));
    const sarf = pos(i.yalitimSarfiyat);
    const kat = Math.max(1, Math.round(pos(i.yalitimKat, 2)));
    const zSer = pos(i.zeminSeramik);
    const dSerH = pos(i.duvarSeramikH);
    const islakKapi = Math.round(pos(i.islakKapi));
    const fSer = pct(i.fireSeramik);
    const yapKg = pos(i.yapistiriciKg);
    const derzKg = pos(i.derzKg);

    const vSap = sapA * sapCm / 100;
    const cimentoTorba = Math.ceil(vSap * doz * (1 + fSap) / 50);
    const kum = vSap * 1.15 * (1 + fSap);
    const elyaf = vSap * 0.9;

    // Duş alanı: iki duvar × 0,9 m × 2,10 m yükseklikte ek yalıtım
    const DUS_EK_ALAN = 2 * 0.9 * 2.1;
    const yalAlan = zemin + cevre * yalH + dus * DUS_EK_ALAN;
    const yalKg = yalAlan * sarf * kat * 1.05;
    const pahBandi = (cevre + dus * 2 * 2.1) * 1.05;

    const dSerNet = Math.max(0, cevre * dSerH - islakKapi * 0.9 * 2.1);
    const serNet = zSer + dSerNet;

    return {
        rows: [
            { poz: 'S-01', tanim: `Çimento CEM II, 50 kg torba (${doz} kg/m³ dozaj)`, miktar: cimentoTorba, birim: 'torba', fiyat: 'cimento', ondalik: 0 },
            { poz: 'S-02', tanim: 'Şap kumu', miktar: kum, birim: 'm³', fiyat: 'kum' },
            { poz: 'S-03', tanim: 'Polipropilen elyaf (≈ 0,9 kg/m³)', miktar: elyaf, birim: 'kg', fiyat: 'pp_elyaf' },
            { poz: 'S-04', tanim: 'Şap döküm ve perdah işçiliği', miktar: sapA, birim: 'm²', fiyat: 'sap_iscilik' },
            { poz: 'S-05', tanim: `Sürme su yalıtımı, ${kat} kat (fire dahil)`, miktar: yalKg, birim: 'kg', fiyat: 'yalitim_malzeme' },
            { poz: 'S-06', tanim: 'Elastik pah / köşe bandı', miktar: pahBandi, birim: 'm', fiyat: 'pah_bandi' },
            { poz: 'S-07', tanim: 'Su yalıtımı işçiliği', miktar: yalAlan, birim: 'm²', fiyat: 'yalitim_iscilik' },
            { poz: 'S-08', tanim: 'Zemin seramiği (fire dahil)', miktar: zSer * (1 + fSer), birim: 'm²', fiyat: 'seramik_zemin' },
            { poz: 'S-09', tanim: 'Duvar seramiği (fire dahil)', miktar: dSerNet * (1 + fSer), birim: 'm²', fiyat: 'seramik_duvar' },
            { poz: 'S-10', tanim: `Seramik yapıştırıcı (${yapKg.toLocaleString('tr-TR')} kg/m², 25 kg torba)`, miktar: Math.ceil(serNet * yapKg / 25), birim: 'torba', fiyat: 'seramik_yapistirici', ondalik: 0 },
            { poz: 'S-11', tanim: 'Derz dolgusu', miktar: serNet * derzKg, birim: 'kg', fiyat: 'derz' },
            { poz: 'S-12', tanim: 'Seramik döşeme ve kaplama işçiliği', miktar: serNet, birim: 'm²', fiyat: 'seramik_iscilik' }
        ],
        breakdown: [
            { ad: 'Şap hacmi', deger: vSap, birim: 'm³' },
            { ad: 'Su yalıtımı uygulama alanı', deger: yalAlan, birim: 'm²' },
            { ad: 'Net seramik alanı (zemin + duvar)', deger: serNet, birim: 'm²' },
            { ad: 'Duvar seramiği net alanı', deger: dSerNet, birim: 'm²' }
        ]
    };
}

// --------------------------------------------------------------------------
// 4) CEPHE: mantolama (ETICS) veya giydirme cephe
// --------------------------------------------------------------------------
export function calcCephe(i) {
    const cevre = pos(i.cepheCevre);
    const H = pos(i.binaYukseklik);
    const brut = cevre * H;

    if (i.sistem === 'giydirme') {
        const pw = Math.max(0.3, pos(i.panelGenislik, 1.5));
        const ph = Math.max(0.3, pos(i.panelYukseklik, 3.0));
        const camMm = pos(i.camKalinlik);
        const mw = pos(i.mullionKg);
        const tw = pos(i.transomKg);
        const fAlu = pct(i.fireAlu);

        const kolon = Math.ceil(cevre / pw);             // kapalı çevre: dikme sayısı = modül sayısı
        const sira = Math.ceil(H / ph);
        const panel = kolon * sira;
        const dikme = kolon * H;
        const kayit = (sira + 1) * cevre;
        const camAlan = panel * Math.max(0, pw - 0.1) * Math.max(0, ph - 0.1);
        const aluKg = (dikme * mw + kayit * tw) * (1 + fAlu);
        const panelCevre = 2 * (pw + ph);
        const epdm = panel * panelCevre * 2 * 1.05;
        const silikon = Math.ceil(panel * panelCevre * 0.02 / 0.6);
        const ankraj = kolon * (sira + 1);

        return {
            rows: [
                { poz: 'G-01', tanim: 'Alüminyum dikme ve kayıt profilleri (fire dahil)', miktar: aluKg, birim: 'kg', fiyat: 'gc_aluminyum' },
                { poz: 'G-02', tanim: `Isıcam ünitesi (toplam ${camMm} mm cam)`, miktar: camAlan, birim: 'm²', fiyat: 'gc_isicam' },
                { poz: 'G-03', tanim: 'EPDM conta (iç + dış)', miktar: epdm, birim: 'm', fiyat: 'gc_epdm' },
                { poz: 'G-04', tanim: 'Yapısal / hava izolasyon silikonu (600 ml)', miktar: silikon, birim: 'adet', fiyat: 'gc_silikon', ondalik: 0 },
                { poz: 'G-05', tanim: 'Ankraj seti (dikme × kat bağlantısı)', miktar: ankraj, birim: 'adet', fiyat: 'gc_ankraj', ondalik: 0 },
                { poz: 'G-06', tanim: 'İmalat ve montaj işçiliği', miktar: brut, birim: 'm²', fiyat: 'gc_montaj' }
            ],
            breakdown: [
                { ad: 'Cephe brüt alanı', deger: brut, birim: 'm²' },
                { ad: 'Panel sayısı', deger: panel, birim: 'adet', ondalik: 0 },
                { ad: 'Dikme toplam boyu', deger: dikme, birim: 'm' },
                { ad: 'Kayıt toplam boyu', deger: kayit, birim: 'm' },
                { ad: 'Cam ağırlığı (2,5 kg/m²·mm)', deger: camAlan * camMm * 2.5, birim: 'kg', ondalik: 0 }
            ]
        };
    }

    // Mantolama
    const bosluk = Math.min(90, pos(i.boslukOrani)) / 100;
    const pencere = Math.round(pos(i.pencereAdet));
    const kose = Math.round(pos(i.binaKose, 4));
    const levhaCm = pos(i.levhaKalinlik);
    const fLevha = pct(i.fireLevha);
    const net = brut * (1 - bosluk);
    const ortPencere = pencere > 0 ? (brut * bosluk) / pencere : 0;
    const profil = pencere * 4 * Math.sqrt(ortPencere) + kose * H;

    return {
        rows: [
            { poz: 'M-01', tanim: `Isı yalıtım levhası, ${levhaCm} cm (fire dahil)`, miktar: net * (1 + fLevha), birim: 'm²', fiyat: 'mant_levha' },
            { poz: 'M-02', tanim: 'Yapıştırma harcı (≈ 5 kg/m², 25 kg torba)', miktar: Math.ceil(net * 5 / 25), birim: 'torba', fiyat: 'mant_yapistirma', ondalik: 0 },
            { poz: 'M-03', tanim: 'Mantolama sıva harcı (≈ 5 kg/m², 25 kg torba)', miktar: Math.ceil(net * 5 / 25), birim: 'torba', fiyat: 'mant_siva', ondalik: 0 },
            { poz: 'M-04', tanim: 'Sıva filesi (bindirme dahil)', miktar: net * 1.15, birim: 'm²', fiyat: 'mant_file' },
            { poz: 'M-05', tanim: 'Yalıtım dübeli (≈ 6 adet/m²)', miktar: Math.ceil(net * 6), birim: 'adet', fiyat: 'mant_dubel', ondalik: 0 },
            { poz: 'M-06', tanim: 'Köşe ve damlalık profilleri', miktar: profil, birim: 'm', fiyat: 'mant_profil' },
            { poz: 'M-07', tanim: 'Dekoratif son kat kaplama', miktar: net, birim: 'm²', fiyat: 'mant_sonkat' },
            { poz: 'M-08', tanim: 'Mantolama işçiliği', miktar: net, birim: 'm²', fiyat: 'mant_iscilik' },
            { poz: 'M-09', tanim: 'Cephe iskelesi (kurma + kira)', miktar: brut, birim: 'm²', fiyat: 'iskele' }
        ],
        breakdown: [
            { ad: 'Cephe brüt alanı', deger: brut, birim: 'm²' },
            { ad: 'Boşluk (pencere/kapı) alanı', deger: brut * bosluk, birim: 'm²' },
            { ad: 'Net mantolama alanı', deger: net, birim: 'm²' },
            { ad: 'Ortalama pencere alanı', deger: ortPencere, birim: 'm²', ondalik: 2 }
        ]
    };
}

// --------------------------------------------------------------------------
// Tutar ve özet hesapları
// --------------------------------------------------------------------------
export function priceRows(rows, prices) {
    let toplam = 0;
    const priced = rows.map(r => {
        const birimFiyat = pos(prices[r.fiyat]);
        const tutar = r.miktar * birimFiyat;
        toplam += tutar;
        return { ...r, birimFiyat, tutar };
    });
    return { rows: priced, toplam };
}

export function calcOzet({ araToplamlar, insaatAlani, genelGider, kar, kdv }) {
    const dogrudan = Object.values(araToplamlar).reduce((s, v) => s + pos(v), 0);
    const gg = dogrudan * pct(genelGider);
    const k = (dogrudan + gg) * pct(kar);
    const kdvHaric = dogrudan + gg + k;
    const kdvTutar = kdvHaric * pct(kdv);
    const genelToplam = kdvHaric + kdvTutar;
    const alan = pos(insaatAlani);
    return {
        dogrudan,
        genelGider: gg,
        kar: k,
        kdvHaric,
        kdv: kdvTutar,
        genelToplam,
        m2Maliyet: alan > 0 ? genelToplam / alan : 0,
        m2DogrudanMaliyet: alan > 0 ? dogrudan / alan : 0
    };
}
