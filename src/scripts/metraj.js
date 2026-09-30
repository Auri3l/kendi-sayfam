// ==========================================================================
// METRAJ & MALİYET ARAYÜZÜ
// Girdileri okur, metraj-core.js ile hesaplar, tabloları ve özeti günceller.
// ==========================================================================
import { calcBeton, calcDuvar, calcSap, calcCephe, priceRows, calcOzet, DEFAULT_PRICES } from './metraj-core.js';

const MODULES = {
    beton: { calc: calcBeton, ad: 'Betonarme (beton, kalıp, donatı)' },
    duvar: { calc: calcDuvar, ad: 'Duvar ve sıva' },
    sap: { calc: calcSap, ad: 'Şap, ıslak hacim yalıtımı ve seramik' },
    cephe: { calc: calcCephe, ad: 'Cephe' }
};

const PRICE_KEY = 'metraj-birim-fiyatlar-v1';
const INPUT_KEY = 'metraj-girdiler-v1';

const store = {
    get(key) {
        try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
    },
    set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* depolama kapalı olabilir */ }
    }
};

const fmt = (n, d = 2) => (Number.isFinite(n) ? n : 0).toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtTL = n => `${fmt(n, 0)} ₺`;

const prices = { ...DEFAULT_PRICES, ...(store.get(PRICE_KEY) || {}) };
const savedInputs = store.get(INPUT_KEY) || {};
const results = {};

function readInputs(mod) {
    const values = {};
    document.querySelectorAll(`[data-mmod="${mod}"][data-mkey]`).forEach(el => {
        values[el.dataset.mkey] = el.tagName === 'SELECT' ? el.value : Number(String(el.value).replace(',', '.'));
    });
    return values;
}

function restoreInputs() {
    document.querySelectorAll('[data-mmod][data-mkey]').forEach(el => {
        const saved = savedInputs[el.dataset.mmod]?.[el.dataset.mkey];
        if (saved !== undefined && saved !== null && saved !== '') el.value = saved;
    });
}

function saveInputs() {
    const all = {};
    document.querySelectorAll('[data-mmod][data-mkey]').forEach(el => {
        (all[el.dataset.mmod] ||= {})[el.dataset.mkey] = el.value;
    });
    store.set(INPUT_KEY, all);
}

function buildRows(tbody, rows) {
    tbody.innerHTML = '';
    rows.forEach(r => {
        const tr = document.createElement('tr');
        tr.dataset.poz = r.poz;
        tr.innerHTML = `
            <td>${r.poz}</td>
            <td class="m-tanim"></td>
            <td class="metraj-value-cell m-miktar"></td>
            <td>${r.birim}</td>
            <td class="m-fiyat-cell"><input type="number" inputmode="decimal" min="0" step="any" class="metraj-price-input" data-price="${r.fiyat}" aria-label="${r.poz} birim fiyatı (₺)"></td>
            <td class="m-tutar"></td>`;
        tbody.appendChild(tr);
    });
    tbody.dataset.signature = rows.map(r => r.poz + r.fiyat + r.birim).join('|');
}

function renderModule(mod) {
    const panel = document.getElementById(`tab-${mod}`);
    if (!panel) return;
    const res = MODULES[mod].calc(readInputs(mod));
    const priced = priceRows(res.rows, prices);
    results[mod] = priced.toplam;

    const tbody = panel.querySelector('tbody[data-metraj-body]');
    const signature = res.rows.map(r => r.poz + r.fiyat + r.birim).join('|');
    if (tbody.dataset.signature !== signature) buildRows(tbody, res.rows);

    priced.rows.forEach(r => {
        const tr = tbody.querySelector(`tr[data-poz="${r.poz}"]`);
        if (!tr) return;
        tr.querySelector('.m-tanim').textContent = r.tanim;
        tr.querySelector('.m-miktar').textContent = fmt(r.miktar, r.ondalik ?? 2);
        const input = tr.querySelector('.metraj-price-input');
        if (document.activeElement !== input) input.value = r.birimFiyat;
        tr.querySelector('.m-tutar').textContent = fmtTL(r.tutar);
    });

    const sumEl = panel.querySelector('[data-metraj-sum]');
    if (sumEl) sumEl.textContent = fmtTL(priced.toplam);

    const bd = panel.querySelector('[data-metraj-breakdown]');
    if (bd) {
        bd.innerHTML = res.breakdown.map(b => `
            <div class="metraj-bd-item"><span>${b.ad}</span><strong>${fmt(b.deger, b.ondalik ?? 2)} <small>${b.birim}</small></strong></div>`).join('');
    }

    if (mod === 'beton') results.insaatAlani = res.insaatAlani;
    if (mod === 'cephe') toggleCepheFields();
}

function toggleCepheFields() {
    const sistem = document.querySelector('[data-mmod="cephe"][data-mkey="sistem"]')?.value || 'mantolama';
    document.querySelectorAll('[data-cephe-sistem]').forEach(el => {
        el.hidden = el.dataset.cepheSistem !== sistem;
    });
}

function renderOzet() {
    const panel = document.getElementById('tab-maliyet');
    if (!panel) return;
    const ozIn = readInputs('ozet');
    const alanInput = panel.querySelector('[data-mkey="insaatAlani"]');
    const autoAlan = results.insaatAlani || 0;
    if (alanInput) alanInput.placeholder = fmt(autoAlan, 0);
    const alan = alanInput && alanInput.value !== '' ? Number(alanInput.value) : autoAlan;

    const araToplamlar = { beton: results.beton, duvar: results.duvar, sap: results.sap, cephe: results.cephe };
    const o = calcOzet({ araToplamlar, insaatAlani: alan, genelGider: ozIn.genelGider, kar: ozIn.kar, kdv: ozIn.kdv });

    const tbody = panel.querySelector('tbody[data-ozet-body]');
    if (tbody) {
        tbody.innerHTML = Object.entries(araToplamlar).map(([k, v]) => {
            const pay = o.dogrudan > 0 ? (v / o.dogrudan) * 100 : 0;
            return `<tr>
                <td>${MODULES[k].ad}</td>
                <td class="metraj-value-cell">${fmtTL(v)}</td>
                <td class="m-pay"><span class="m-pay-bar"><span style="width:${pay.toFixed(1)}%"></span></span><span class="m-pay-txt">%${fmt(pay, 1)}</span></td>
            </tr>`;
        }).join('');
    }
    const set = (key, val) => panel.querySelectorAll(`[data-ozet="${key}"]`).forEach(el => { el.textContent = val; });
    set('dogrudan', fmtTL(o.dogrudan));
    set('genelGider', fmtTL(o.genelGider));
    set('kar', fmtTL(o.kar));
    set('kdvHaric', fmtTL(o.kdvHaric));
    set('kdv', fmtTL(o.kdv));
    set('genelToplam', fmtTL(o.genelToplam));
    set('m2', alan > 0 ? `${fmtTL(o.m2Maliyet)} / m²` : '—');
    set('m2Dogrudan', alan > 0 ? `${fmtTL(o.m2DogrudanMaliyet)} / m²` : '—');
    set('alan', `${fmt(alan, 0)} m²`);
}

function renderAll() {
    Object.keys(MODULES).forEach(renderModule);
    renderOzet();
}

function csvFor(mod) {
    const q = v => `"${String(v).replace(/"/g, '""')}"`;
    const lines = [];
    if (mod === 'maliyet') {
        lines.push(['Kalem', 'Tutar (₺)'].map(q).join(';'));
        document.querySelectorAll('#tab-maliyet tbody[data-ozet-body] tr').forEach(tr => {
            const tds = tr.querySelectorAll('td');
            lines.push([tds[0].textContent, tds[1].textContent].map(q).join(';'));
        });
        const seen = new Set();
        document.querySelectorAll('#tab-maliyet tfoot [data-ozet], #tab-maliyet .m-kpi [data-ozet]').forEach(el => {
            const label = el.dataset.ozetLabel || el.dataset.ozet;
            if (seen.has(label)) return;
            seen.add(label);
            lines.push([label, el.textContent].map(q).join(';'));
        });
    } else {
        const res = priceRows(MODULES[mod].calc(readInputs(mod)).rows, prices);
        lines.push(['Poz', 'İmalat', 'Miktar', 'Birim', 'Birim Fiyat (₺)', 'Tutar (₺)'].map(q).join(';'));
        res.rows.forEach(r => lines.push([r.poz, r.tanim, fmt(r.miktar, r.ondalik ?? 2), r.birim, fmt(r.birimFiyat, 2), fmt(r.tutar, 2)].map(q).join(';')));
        lines.push(['', 'Ara toplam', '', '', '', fmt(res.toplam, 2)].map(q).join(';'));
    }
    return '﻿' + lines.join('\n');
}

function downloadCsv(mod) {
    const blob = new Blob([csvFor(mod)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Metraj_${mod}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function init() {
    if (!document.getElementById('tab-beton')) return;
    restoreInputs();

    document.addEventListener('input', e => {
        const t = e.target;
        if (t.matches?.('.metraj-price-input')) {
            const v = Number(t.value);
            if (Number.isFinite(v) && v >= 0) {
                prices[t.dataset.price] = v;
                store.set(PRICE_KEY, prices);
                // Aynı fiyat anahtarını kullanan diğer hücreleri de eşitle
                document.querySelectorAll(`.metraj-price-input[data-price="${t.dataset.price}"]`).forEach(o => { if (o !== t) o.value = v; });
                renderAll();
            }
        } else if (t.matches?.('[data-mmod][data-mkey]')) {
            saveInputs();
            renderAll();
        }
    });
    document.addEventListener('change', e => {
        if (e.target.matches?.('select[data-mmod]')) { saveInputs(); renderAll(); }
    });

    document.querySelectorAll('[data-metraj-csv]').forEach(btn => btn.addEventListener('click', () => downloadCsv(btn.dataset.metrajCsv)));

    document.getElementById('btnResetPrices')?.addEventListener('click', () => {
        Object.assign(prices, DEFAULT_PRICES);
        store.set(PRICE_KEY, null);
        document.querySelectorAll('.metraj-price-input').forEach(i => { i.value = prices[i.dataset.price]; });
        renderAll();
    });

    renderAll();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
