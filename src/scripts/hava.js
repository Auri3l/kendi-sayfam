// ==========================================================================
// ŞANTİYE HAVA & İŞ PLANI ARACI (Open-Meteo, anahtar gerektirmez)
// ==========================================================================
import { gunuDegerlendir, saatlikGrupla, VARSAYILAN_ESIKLER, DURUM } from './hava-core.js';
import { fmt, store, esc, num } from './ui-utils.js';

const KEY = 'hava-araci-v1';
const saved = store.get(KEY) || {};
const state = {
    konum: saved.konum || { ad: 'İstanbul', lat: 41.0082, lon: 28.9784 },
    esik: { ...VARSAYILAN_ESIKLER, ...(saved.esik || {}) }
};
const save = () => store.set(KEY, state);
let veri = null;

const ISLER = [
    ['beton', 'Beton dökümü'],
    ['vinc', 'Vinç ve kaldırma'],
    ['yuksek', 'İskele / yüksekte çalışma'],
    ['cephe', 'Dış cephe, mantolama, boya']
];
const ETIKET = { [DURUM.UYGUN]: 'Uygun', [DURUM.DIKKAT]: 'Dikkat', [DURUM.UYGUN_DEGIL]: 'Uygun değil' };
const gunAdi = tarih => new Date(`${tarih}T12:00:00`).toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' });

function durumYaz(root, mesaj, hata = false) {
    const el = root.querySelector('[data-hava-durum]');
    el.textContent = mesaj;
    el.classList.toggle('is-hata', hata);
    el.hidden = !mesaj;
}

async function tahminGetir(root) {
    const { lat, lon } = state.konum;
    root.querySelector('[data-k="konum"]').textContent = state.konum.ad;
    durumYaz(root, 'Tahmin yükleniyor…');
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
        + '&hourly=temperature_2m,precipitation,wind_speed_10m,wind_gusts_10m,relative_humidity_2m'
        + '&forecast_days=7&timezone=auto&wind_speed_unit=kmh';
    try {
        const r = await fetch(url);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        veri = saatlikGrupla(j.hourly);
        durumYaz(root, '');
        ciz(root);
    } catch (err) {
        veri = null;
        root.querySelector('[data-gunler]').innerHTML = '';
        durumYaz(root, 'Hava tahmini alınamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.', true);
    }
}

function ciz(root) {
    if (!veri) return;
    root.querySelector('[data-gunler]').innerHTML = veri.map(g => {
        const d = gunuDegerlendir(g.saatler, state.esik);
        const o = d.ozet;
        return `<article class="gun">
            <header>
                <strong>${esc(gunAdi(g.tarih))}</strong>
                <span class="gun-hava">
                    <span title="Mesai saatlerinde en düşük / en yüksek sıcaklık">${fmt(o.tMin, 0)}° / ${fmt(o.tMax, 0)}°</span>
                    <span title="Mesai saatlerinde toplam yağış">${fmt(o.yagis, 1)} mm</span>
                    <span title="Mesai saatlerinde en yüksek rüzgar hamlesi">${fmt(o.hamle, 0)} km/h hamle</span>
                </span>
            </header>
            <ul>
                ${ISLER.map(([k, ad]) => {
                    const is = d.isler[k];
                    return `<li class="is is-${is.durum}"><span class="is-ad">${ad}</span><span class="is-durum">${ETIKET[is.durum]}</span><span class="is-not">${esc(is.not)}</span></li>`;
                }).join('')}
            </ul>
        </article>`;
    }).join('');
}

async function konumAra(root, sorgu) {
    const liste = root.querySelector('[data-sonuclar]');
    liste.innerHTML = '';
    if (!sorgu.trim()) return;
    try {
        const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(sorgu.trim())}&count=6&language=tr&format=json`);
        const j = await r.json();
        const sonuclar = j.results || [];
        liste.innerHTML = sonuclar.length
            ? sonuclar.map((s, i) => `<li><button type="button" data-sonuc="${i}">${esc(s.name)}${s.admin1 ? `, ${esc(s.admin1)}` : ''}${s.country ? ` <small>${esc(s.country)}</small>` : ''}</button></li>`).join('')
            : '<li class="empty">Sonuç bulunamadı.</li>';
        liste._sonuclar = sonuclar;
    } catch {
        liste.innerHTML = '<li class="empty">Arama yapılamadı.</li>';
    }
}

export function initHava() {
    const root = document.getElementById('panel-hava');
    if (!root) return;
    let yuklendi = false;

    root.querySelectorAll('[data-esik]').forEach(el => { el.value = state.esik[el.dataset.esik]; });
    root.querySelector('[data-k="konum"]').textContent = state.konum.ad;

    root.addEventListener('submit', e => {
        e.preventDefault();
        konumAra(root, root.querySelector('[data-ara]').value);
    });
    root.addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;
        if (b.dataset.sonuc !== undefined) {
            const s = b.closest('ul')._sonuclar[Number(b.dataset.sonuc)];
            state.konum = { ad: [s.name, s.admin1].filter(Boolean).join(', '), lat: s.latitude, lon: s.longitude };
            save();
            root.querySelector('[data-sonuclar]').innerHTML = '';
            tahminGetir(root);
        } else if (b.dataset.act === 'konumum') {
            if (!navigator.geolocation) return durumYaz(root, 'Tarayıcınız konum paylaşımını desteklemiyor.', true);
            durumYaz(root, 'Konum alınıyor…');
            navigator.geolocation.getCurrentPosition(p => {
                state.konum = { ad: 'Bulunduğum konum', lat: Math.round(p.coords.latitude * 1000) / 1000, lon: Math.round(p.coords.longitude * 1000) / 1000 };
                save();
                tahminGetir(root);
            }, () => durumYaz(root, 'Konum izni verilmedi. Şehir veya ilçe adıyla arayabilirsiniz.', true));
        } else if (b.dataset.act === 'yenile') {
            tahminGetir(root);
        }
    });
    root.addEventListener('input', e => {
        const k = e.target.dataset.esik;
        if (!k) return;
        const v = num(e.target.value);
        if (Number.isFinite(v)) { state.esik[k] = v; save(); ciz(root); }
    });

    // Sekme ilk açıldığında veriyi çek
    const yukle = () => { if (!yuklendi) { yuklendi = true; tahminGetir(root); } };
    if (!root.hidden) yukle();
    document.addEventListener('arac-acildi', e => { if (e.detail === 'hava') yukle(); });
}
