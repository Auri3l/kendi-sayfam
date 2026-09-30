// ==========================================================================
// DONATI METRAJI & KESİM PLANI ARACI
// ==========================================================================
import { CAPLAR, birimAgirlik, donatiMetraj, kesimPlani } from './donati-core.js';
import { fmt, store, esc, num, downloadCsv } from './ui-utils.js';

const KEY = 'donati-araci-v1';
const ORNEK = [
    { cap: 16, boy: 5.2, adet: 12, not: 'Kiriş alt donatı' },
    { cap: 16, boy: 3.4, adet: 30, not: 'Kiriş üst donatı' },
    { cap: 16, boy: 2.8, adet: 25, not: 'Pilye' },
    { cap: 10, boy: 1.9, adet: 120, not: 'Etriye (açınım)' }
];
const saved = store.get(KEY);
const state = {
    satirlar: saved?.satirlar?.length ? saved.satirlar : ORNEK.map(r => ({ ...r })),
    stok: saved?.stok ?? 12,
    kesimMm: saved?.kesimMm ?? 0
};
const save = () => store.set(KEY, state);
let son = null;

function satirHtml(r, i) {
    return `<tr data-i="${i}">
        <td><select data-f="cap" aria-label="Çap">${CAPLAR.map(c => `<option value="${c}"${c === r.cap ? ' selected' : ''}>Ø${c}</option>`).join('')}</select></td>
        <td><input type="number" inputmode="decimal" min="0" step="0.01" data-f="boy" value="${r.boy ?? ''}" aria-label="Parça boyu (m)"></td>
        <td><input type="number" inputmode="numeric" min="0" step="1" data-f="adet" value="${r.adet ?? ''}" aria-label="Adet"></td>
        <td><input type="text" data-f="not" value="${esc(r.not || '')}" placeholder="Açıklama" aria-label="Açıklama"></td>
        <td class="num" data-c="kg"></td>
        <td><button type="button" class="icon-btn" data-act="sil" aria-label="Satırı sil">×</button></td>
    </tr>`;
}

function listeyiCiz(root) {
    root.querySelector('[data-liste]').innerHTML = state.satirlar.map(satirHtml).join('');
}

function hesapla(root) {
    const stok = state.stok > 0 ? state.stok : 12;
    const kesim = (state.kesimMm || 0) / 1000;
    const metraj = donatiMetraj(state.satirlar);
    const planlar = metraj.capBazinda.map(c => ({
        cap: c.cap,
        ...c,
        plan: kesimPlani(state.satirlar.filter(r => r.cap === c.cap), stok, kesim)
    }));
    son = { metraj, planlar, stok };

    root.querySelectorAll('[data-liste] tr').forEach(tr => {
        const r = state.satirlar[Number(tr.dataset.i)];
        const kg = r && r.boy > 0 && r.adet > 0 ? r.boy * r.adet * birimAgirlik(r.cap) : 0;
        tr.querySelector('[data-c="kg"]').textContent = kg ? `${fmt(kg, 1)} kg` : '—';
    });

    const toplamCubuk = planlar.reduce((s, p) => s + p.plan.cubukSayisi, 0);
    const toplamStokKg = planlar.reduce((s, p) => s + p.plan.toplamStok * birimAgirlik(p.cap), 0);
    const fire = toplamStokKg > 0 ? (1 - metraj.toplamKg / toplamStokKg) * 100 : 0;
    const set = (k, v) => { const el = root.querySelector(`[data-k="${k}"]`); if (el) el.textContent = v; };
    set('toplamKg', `${fmt(metraj.toplamKg, 0)} kg`);
    set('toplamTon', `${fmt(metraj.toplamKg / 1000, 3)} ton`);
    set('cubuk', `${toplamCubuk} çubuk`);
    set('fire', `%${fmt(fire, 1)}`);
    set('siparisKg', `${fmt(toplamStokKg, 0)} kg`);

    root.querySelector('[data-cap-ozet]').innerHTML = planlar.length ? planlar.map(p => `
        <tr>
            <td>Ø${p.cap}</td>
            <td class="num">${fmt(p.uzunluk, 1)} m</td>
            <td class="num">${fmt(p.kg, 1)} kg</td>
            <td class="num">${p.plan.cubukSayisi}</td>
            <td class="num">${fmt(p.plan.toplamStok * birimAgirlik(p.cap), 1)} kg</td>
            <td class="num">%${fmt(p.plan.firePct, 1)}</td>
        </tr>`).join('') : '<tr><td colspan="6" class="empty">Listeye parça ekleyin.</td></tr>';

    root.querySelector('[data-planlar]').innerHTML = planlar.map(p => `
        <div class="kesim-cap">
            <h4>Ø${p.cap} <small>${p.plan.cubukSayisi} × ${fmt(stok, 2)} m çubuk · fire %${fmt(p.plan.firePct, 1)}</small></h4>
            ${p.plan.sigmayan.length ? `<p class="tool-warn">Stok boydan uzun parçalar kesim planına alınmadı (ek/bindirme gerekir): ${p.plan.sigmayan.map(s => `${s.adet} × ${fmt(s.boy, 2)} m`).join(', ')}</p>` : ''}
            <ul class="kesim-liste">
                ${p.plan.desenler.map(d => `
                <li>
                    <span class="kesim-adet">${d.adet}×</span>
                    <span class="kesim-bar" role="img" aria-label="${d.parcalar.map(x => fmt(x, 2)).join(' + ')} m, artık ${fmt(d.artik, 2)} m">
                        ${d.parcalar.map(x => `<i style="flex:${x}">${fmt(x, 2)}</i>`).join('')}${d.artik > 0.005 ? `<b style="flex:${d.artik}">${fmt(d.artik, 2)}</b>` : ''}
                    </span>
                </li>`).join('')}
            </ul>
        </div>`).join('');
}

function csv() {
    const rows = [['Çap (mm)', 'Parça boyu (m)', 'Adet', 'Açıklama', 'Toplam boy (m)', 'Ağırlık (kg)']];
    son.metraj.rows.forEach(r => rows.push([r.cap, fmt(r.boy, 2), r.adet, r.not || '', fmt(r.uzunluk, 2), fmt(r.kg, 2)]));
    rows.push([], ['Kesim planı', `Stok boy ${fmt(son.stok, 2)} m`]);
    son.planlar.forEach(p => {
        rows.push([`Ø${p.cap}`, `${p.plan.cubukSayisi} çubuk`, `Fire %${fmt(p.plan.firePct, 1)}`]);
        p.plan.desenler.forEach(d => rows.push(['', `${d.adet} ×`, d.parcalar.map(x => fmt(x, 2)).join(' + '), `Artık ${fmt(d.artik, 2)} m`]));
    });
    downloadCsv('Donati_Kesim_Plani', rows);
}

export function initDonati() {
    const root = document.getElementById('panel-donati');
    if (!root) return;
    const stokEl = root.querySelector('[data-s="stok"]');
    const kesimEl = root.querySelector('[data-s="kesimMm"]');
    stokEl.value = state.stok;
    kesimEl.value = state.kesimMm;
    listeyiCiz(root);

    root.addEventListener('input', e => {
        const t = e.target;
        if (t.dataset.s) {
            const v = num(t.value);
            state[t.dataset.s] = Number.isFinite(v) ? v : 0;
        } else if (t.dataset.f) {
            const r = state.satirlar[Number(t.closest('tr').dataset.i)];
            if (!r) return;
            r[t.dataset.f] = t.dataset.f === 'not' ? t.value : (t.dataset.f === 'cap' ? Number(t.value) : (num(t.value) || 0));
        } else return;
        save();
        hesapla(root);
    });
    root.addEventListener('change', e => {
        if (e.target.dataset.f === 'cap') {
            state.satirlar[Number(e.target.closest('tr').dataset.i)].cap = Number(e.target.value);
            save();
            hesapla(root);
        }
    });
    root.addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;
        const act = b.dataset.act;
        if (act === 'sil') state.satirlar.splice(Number(b.closest('tr').dataset.i), 1);
        else if (act === 'ekle') state.satirlar.push({ cap: state.satirlar.at(-1)?.cap || 12, boy: '', adet: '', not: '' });
        else if (act === 'ornek') state.satirlar = ORNEK.map(r => ({ ...r }));
        else if (act === 'temizle') state.satirlar = [{ cap: 12, boy: '', adet: '', not: '' }];
        else if (act === 'csv') { csv(); return; }
        else if (act === 'yazdir') { window.print(); return; }
        else return;
        save();
        listeyiCiz(root);
        hesapla(root);
        if (act === 'ekle') root.querySelector('[data-liste] tr:last-child [data-f="boy"]')?.focus();
    });

    hesapla(root);
}
