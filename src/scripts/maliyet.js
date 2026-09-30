// ==========================================================================
// YAKLAŞIK MALİYET ARACI
// Proje bilgilerinden tüm metrajı tahmin eder; kullanıcı her varsayımı ve
// birim fiyatı değiştirebilir.
// ==========================================================================
import { calcBeton, calcDuvar, calcSap, calcCephe, priceRows, calcOzet, estimateInputs, DEFAULT_PRICES } from './metraj-core.js';
import { fmt, fmtTL, store, esc, num, downloadCsv } from './ui-utils.js';

const GRUPLAR = [
    {
        key: 'beton', ad: 'Betonarme', alt: 'Beton, kalıp ve donatı', calc: calcBeton,
        ozet: r => `${fmt(r.rows[1].miktar, 0)} m³ beton · ${fmt(r.rows[4].miktar, 1)} t donatı`,
        alanlar: [
            ['dosemeKalinligi', 'Döşeme kalınlığı', 'm', 0.01],
            ['dosemeCevresi', 'Döşeme kenar çevresi', 'm', 1],
            ['kirisUzunlugu', 'Kiriş uzunluğu (kat başı)', 'm', 1],
            ['kirisGenislik', 'Kiriş genişliği', 'm', 0.05],
            ['kirisYukseklik', 'Kiriş yüksekliği (döşeme dahil)', 'm', 0.05],
            ['kolonAdet', 'Kolon adedi (kat başı)', 'adet', 1],
            ['kolonB', 'Kolon kesiti b', 'm', 0.05],
            ['kolonH', 'Kolon kesiti h', 'm', 0.05],
            ['perdeUzunlugu', 'Perde uzunluğu (kat başı)', 'm', 0.5],
            ['perdeKalinlik', 'Perde kalınlığı', 'm', 0.05],
            ['donatiOrani', 'Donatı oranı', 'kg/m³', 5],
            ['fireBeton', 'Beton firesi', '%', 0.5],
            ['fireDonati', 'Donatı firesi', '%', 0.5]
        ]
    },
    {
        key: 'duvar', ad: 'Duvar ve sıva', alt: 'Örgü, lento, alçı sıva', calc: calcDuvar,
        ozet: r => `${fmt(r.rows[2].miktar, 0)} m² duvar`,
        alanlar: [
            ['duvarUzunlugu', 'Duvar uzunluğu (tüm katlar)', 'm', 1],
            ['duvarYuksekligi', 'Net duvar yüksekliği', 'm', 0.05],
            ['kapiAdet', 'Kapı adedi', 'adet', 1],
            ['pencereAdet', 'Pencere adedi', 'adet', 1],
            ['pencereAlan', 'Ortalama pencere alanı', 'm²', 0.1],
            ['sivaYuz', 'Sıvanacak yüz sayısı', 'yüz', 1],
            ['sivaKalinlik', 'Alçı sıva kalınlığı', 'cm', 0.1],
            ['fireBlok', 'Blok firesi', '%', 0.5],
            ['fireSiva', 'Sıva firesi', '%', 0.5]
        ]
    },
    {
        key: 'sap', ad: 'Şap, yalıtım ve seramik', alt: 'Şap, ıslak hacim yalıtımı, seramik', calc: calcSap,
        ozet: r => `${fmt(r.breakdown[2].deger, 0)} m² seramik`,
        alanlar: [
            ['sapAlani', 'Şap alanı (tüm katlar)', 'm²', 1],
            ['sapKalinlik', 'Şap kalınlığı', 'cm', 0.5],
            ['dozaj', 'Çimento dozajı', 'kg/m³', 10],
            ['islakZemin', 'Islak hacim zemin alanı', 'm²', 1],
            ['islakCevre', 'Islak hacim duvar çevresi', 'm', 1],
            ['yalitimYukseklik', 'Duvarda yalıtım yüksekliği', 'm', 0.05],
            ['dusAdet', 'Duş / küvet sayısı', 'adet', 1],
            ['yalitimSarfiyat', 'Yalıtım sarfiyatı (kat başı)', 'kg/m²', 0.1],
            ['yalitimKat', 'Yalıtım kat sayısı', 'kat', 1],
            ['zeminSeramik', 'Zemin seramiği alanı', 'm²', 1],
            ['duvarSeramikH', 'Duvar seramiği yüksekliği', 'm', 0.05],
            ['islakKapi', 'Islak hacim kapı adedi', 'adet', 1],
            ['fireSeramik', 'Seramik firesi', '%', 0.5],
            ['yapistiriciKg', 'Yapıştırıcı sarfiyatı', 'kg/m²', 0.5],
            ['derzKg', 'Derz sarfiyatı', 'kg/m²', 0.05],
            ['fireSap', 'Şap firesi', '%', 0.5]
        ]
    },
    {
        key: 'cephe', ad: 'Cephe', alt: 'Mantolama veya giydirme cephe', calc: calcCephe,
        ozet: r => `${fmt(r.breakdown[0].deger, 0)} m² cephe`,
        alanlar: [
            ['cepheCevre', 'Bina dış çevresi', 'm', 1],
            ['binaYukseklik', 'Cephe yüksekliği', 'm', 0.5],
            ['boslukOrani', 'Pencere / boşluk oranı', '%', 1, 'mantolama'],
            ['pencereAdet', 'Cephedeki pencere adedi', 'adet', 1, 'mantolama'],
            ['binaKose', 'Bina köşe sayısı', 'adet', 1, 'mantolama'],
            ['levhaKalinlik', 'Yalıtım levhası kalınlığı', 'cm', 1, 'mantolama'],
            ['fireLevha', 'Levha firesi', '%', 0.5, 'mantolama'],
            ['panelGenislik', 'Panel genişliği', 'm', 0.05, 'giydirme'],
            ['panelYukseklik', 'Panel yüksekliği', 'm', 0.05, 'giydirme'],
            ['camKalinlik', 'Toplam cam kalınlığı', 'mm', 1, 'giydirme'],
            ['mullionKg', 'Dikme profil ağırlığı', 'kg/m', 0.1, 'giydirme'],
            ['transomKg', 'Kayıt profil ağırlığı', 'kg/m', 0.1, 'giydirme'],
            ['fireAlu', 'Alüminyum firesi', '%', 0.5, 'giydirme']
        ]
    }
];

const KEY = 'maliyet-araci-v2';
const saved = store.get(KEY) || {};
const state = {
    proje: { katSayisi: 5, katAlani: 400, katYuksekligi: 3, daireSayisi: '', cepheSistemi: 'mantolama', duvarTipi: 'tugla135', genelGider: 10, kar: 15, kdv: 20, ...(saved.proje || {}) },
    ezme: saved.ezme || {},
    fiyat: { ...DEFAULT_PRICES, ...(saved.fiyat || {}) },
    acik: saved.acik || { beton: true }
};
const save = () => store.set(KEY, state);

let son = null;

function hesapla() {
    const p = state.proje;
    const tahmin = estimateInputs({ ...p, daireSayisi: p.daireSayisi === '' ? undefined : p.daireSayisi });
    const sonuc = { tahmin, gruplar: {} };
    GRUPLAR.forEach(g => {
        const girdi = { ...tahmin[g.key], ...(state.ezme[g.key] || {}) };
        const res = g.calc(girdi);
        sonuc.gruplar[g.key] = { girdi, res, fiyatli: priceRows(res.rows, state.fiyat) };
    });
    const araToplamlar = Object.fromEntries(GRUPLAR.map(g => [g.key, sonuc.gruplar[g.key].fiyatli.toplam]));
    sonuc.alan = sonuc.gruplar.beton.res.insaatAlani;
    sonuc.ozet = calcOzet({ araToplamlar, insaatAlani: sonuc.alan, genelGider: p.genelGider, kar: p.kar, kdv: p.kdv });
    return sonuc;
}

function iskelet(root) {
    root.querySelector('[data-gruplar]').innerHTML = GRUPLAR.map(g => `
        <details class="mal-grup" data-grup="${g.key}"${state.acik[g.key] ? ' open' : ''}>
            <summary>
                <span class="mal-grup-ad"><strong>${g.ad}</strong><small>${g.alt}</small></span>
                <span class="mal-grup-ozet" data-g-ozet></span>
                <span class="mal-grup-tutar" data-g-tutar></span>
                <span class="mal-grup-ok" aria-hidden="true"></span>
            </summary>
            <div class="mal-grup-body">
                <div class="mal-tablo">
                    <div class="table-scroll">
                        <table class="tool-table">
                            <thead><tr><th>Poz</th><th>İmalat</th><th class="num">Miktar</th><th>Birim</th><th class="num">Birim fiyat (₺)</th><th class="num">Tutar</th></tr></thead>
                            <tbody data-g-rows></tbody>
                            <tfoot><tr><td colspan="5">Ara toplam</td><td class="num" data-g-tutar2></td></tr></tfoot>
                        </table>
                    </div>
                    <div class="mal-dokum" data-g-dokum></div>
                </div>
                <div class="mal-varsayim">
                    <div class="mal-varsayim-bas">
                        <h4>Varsayımlar</h4>
                        <button type="button" class="link-btn" data-g-sifirla hidden>Tahmine dön</button>
                    </div>
                    <p class="tool-hint">Soluk değerler proje bilgilerinden tahmin edilir. Kendi değerinizi yazın; silerseniz tahmine döner.</p>
                    <div class="mal-alanlar">
                        ${g.alanlar.map(([k, label, birim, step, sistem]) => `
                        <label class="tool-field"${sistem ? ` data-sistem="${sistem}"` : ''}>
                            <span>${label}</span>
                            <span class="tool-input"><input type="number" inputmode="decimal" min="0" step="${step}" data-g-alan="${k}"><em>${birim}</em></span>
                        </label>`).join('')}
                    </div>
                </div>
            </div>
        </details>`).join('');
}

function ciz(root) {
    son = hesapla();
    const { ozet } = son;
    const set = (k, v) => root.querySelectorAll(`[data-k="${k}"]`).forEach(el => { el.textContent = v; });
    set('genelToplam', fmtTL(ozet.genelToplam));
    set('m2', son.alan > 0 ? `${fmtTL(ozet.m2Maliyet)} / m²` : '—');
    set('dogrudan', fmtTL(ozet.dogrudan));
    set('m2Dogrudan', son.alan > 0 ? `${fmtTL(ozet.m2DogrudanMaliyet)} / m²` : '—');
    set('giderKar', fmtTL(ozet.genelGider + ozet.kar));
    set('kdv', fmtTL(ozet.kdv));
    set('alan', `${fmt(son.alan, 0)} m²`);

    const daire = root.querySelector('[data-p="daireSayisi"]');
    if (daire) daire.placeholder = `${son.tahmin.daireSayisi} (tahmin)`;

    const paylar = root.querySelector('[data-paylar]');
    if (paylar) {
        paylar.innerHTML = GRUPLAR.map(g => {
            const t = son.gruplar[g.key].fiyatli.toplam;
            const pay = ozet.dogrudan > 0 ? (t / ozet.dogrudan) * 100 : 0;
            return `<li><span class="pay-ad">${g.ad}</span><span class="pay-bar"><i style="width:${pay.toFixed(1)}%"></i></span><span class="pay-deger">%${fmt(pay, 0)}</span></li>`;
        }).join('');
    }

    GRUPLAR.forEach(g => {
        const el = root.querySelector(`.mal-grup[data-grup="${g.key}"]`);
        const { girdi, res, fiyatli } = son.gruplar[g.key];
        el.querySelector('[data-g-ozet]').textContent = g.ozet(res);
        el.querySelector('[data-g-tutar]').textContent = fmtTL(fiyatli.toplam);
        el.querySelector('[data-g-tutar2]').textContent = fmtTL(fiyatli.toplam);

        const ezme = state.ezme[g.key] || {};
        el.querySelector('[data-g-sifirla]').hidden = Object.keys(ezme).length === 0;
        el.querySelectorAll('[data-g-alan]').forEach(inp => {
            const k = inp.dataset.gAlan;
            const t = son.tahmin[g.key][k];
            inp.placeholder = Number.isInteger(t) ? String(t) : String(Math.round(t * 100) / 100).replace('.', ',');
            if (document.activeElement !== inp) inp.value = k in ezme ? ezme[k] : '';
            inp.closest('.tool-field').classList.toggle('is-ezme', k in ezme);
        });
        el.querySelectorAll('[data-sistem]').forEach(f => { f.hidden = f.dataset.sistem !== girdi.sistem; });

        const tbody = el.querySelector('[data-g-rows]');
        const imza = fiyatli.rows.map(r => r.poz + r.fiyat).join('|');
        if (tbody.dataset.imza !== imza) {
            tbody.innerHTML = fiyatli.rows.map(r => `
                <tr data-poz="${r.poz}">
                    <td class="poz">${r.poz}</td>
                    <td data-c="tanim"></td>
                    <td class="num" data-c="miktar"></td>
                    <td class="birim">${esc(r.birim)}</td>
                    <td class="num"><input type="number" inputmode="decimal" min="0" step="any" class="fiyat-input" data-fiyat="${r.fiyat}" aria-label="${r.poz} birim fiyatı (₺)"></td>
                    <td class="num tutar" data-c="tutar"></td>
                </tr>`).join('');
            tbody.dataset.imza = imza;
        }
        fiyatli.rows.forEach(r => {
            const tr = tbody.querySelector(`tr[data-poz="${r.poz}"]`);
            tr.querySelector('[data-c="tanim"]').textContent = r.tanim;
            tr.querySelector('[data-c="miktar"]').textContent = fmt(r.miktar, r.ondalik ?? 2);
            tr.querySelector('[data-c="tutar"]').textContent = fmtTL(r.tutar);
            const fi = tr.querySelector('.fiyat-input');
            if (document.activeElement !== fi) fi.value = r.birimFiyat;
        });

        el.querySelector('[data-g-dokum]').innerHTML = res.breakdown.map(b =>
            `<span><small>${esc(b.ad)}</small>${fmt(b.deger, b.ondalik ?? 2)} ${esc(b.birim)}</span>`).join('');
    });
}

function csv() {
    const rows = [['İş grubu', 'Poz', 'İmalat', 'Miktar', 'Birim', 'Birim fiyat (₺)', 'Tutar (₺)']];
    GRUPLAR.forEach(g => {
        son.gruplar[g.key].fiyatli.rows.forEach(r => rows.push([g.ad, r.poz, r.tanim, fmt(r.miktar, r.ondalik ?? 2), r.birim, fmt(r.birimFiyat, 2), fmt(r.tutar, 2)]));
        rows.push([g.ad, '', 'Ara toplam', '', '', '', fmt(son.gruplar[g.key].fiyatli.toplam, 2)]);
    });
    const o = son.ozet;
    const t = (ad, v) => [ad, '', '', '', '', '', fmt(v, 2)];
    rows.push([], t('Doğrudan maliyet', o.dogrudan), t('Genel giderler', o.genelGider), t('Yüklenici kârı', o.kar), t('KDV', o.kdv), t('Genel toplam', o.genelToplam), t('m² maliyeti', o.m2Maliyet));
    downloadCsv('Yaklasik_Maliyet', rows);
}

export function initMaliyet() {
    const root = document.getElementById('panel-maliyet');
    if (!root) return;
    iskelet(root);

    root.querySelectorAll('[data-p]').forEach(el => {
        const v = state.proje[el.dataset.p];
        if (v !== undefined) el.value = v;
    });

    const guncelle = t => {
        if (t.dataset.p) {
            state.proje[t.dataset.p] = t.tagName === 'SELECT' ? t.value : (t.value === '' ? '' : num(t.value));
        } else if (t.dataset.gAlan) {
            const g = t.closest('.mal-grup').dataset.grup;
            const ezme = (state.ezme[g] ||= {});
            const v = num(t.value);
            if (t.value === '' || !Number.isFinite(v)) delete ezme[t.dataset.gAlan];
            else ezme[t.dataset.gAlan] = v;
            if (!Object.keys(ezme).length) delete state.ezme[g];
        } else if (t.dataset.fiyat) {
            const v = num(t.value);
            if (!Number.isFinite(v) || v < 0) return;
            state.fiyat[t.dataset.fiyat] = v;
        } else return;
        save();
        ciz(root);
    };
    root.addEventListener('input', e => guncelle(e.target));
    root.addEventListener('change', e => { if (e.target.tagName === 'SELECT') guncelle(e.target); });
    root.addEventListener('toggle', e => {
        const d = e.target.closest?.('.mal-grup');
        if (d) { state.acik[d.dataset.grup] = d.open; save(); }
    }, true);
    root.addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;
        if (b.matches('[data-g-sifirla]')) {
            delete state.ezme[b.closest('.mal-grup').dataset.grup];
        } else if (b.dataset.act === 'fiyat-sifirla') {
            state.fiyat = { ...DEFAULT_PRICES };
        } else if (b.dataset.act === 'csv') {
            csv();
            return;
        } else if (b.dataset.act === 'yazdir') {
            root.querySelectorAll('.mal-grup').forEach(d => { d.open = true; });
            window.print();
            return;
        } else return;
        save();
        ciz(root);
    });

    ciz(root);
}
