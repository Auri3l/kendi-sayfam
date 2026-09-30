// Şantiye Araçları sayfası: sekme yönetimi ve araçların başlatılması
import { initMaliyet } from './maliyet.js';
import { initHava } from './hava.js';
import { initDonati } from './donati.js';

const ARACLAR = ['maliyet', 'hava', 'donati'];

function ac(ad, odak = false) {
    if (!ARACLAR.includes(ad)) ad = 'maliyet';
    document.querySelectorAll('[data-arac-tab]').forEach(b => {
        const aktif = b.dataset.aracTab === ad;
        b.setAttribute('aria-selected', String(aktif));
        b.tabIndex = aktif ? 0 : -1;
        if (aktif && odak) b.focus();
    });
    ARACLAR.forEach(a => {
        const p = document.getElementById(`panel-${a}`);
        if (p) p.hidden = a !== ad;
    });
    document.dispatchEvent(new CustomEvent('arac-acildi', { detail: ad }));
}

function init() {
    const tabs = [...document.querySelectorAll('[data-arac-tab]')];
    if (!tabs.length) return;
    tabs.forEach(b => {
        b.addEventListener('click', () => {
            history.replaceState(null, '', `#${b.dataset.aracTab}`);
            ac(b.dataset.aracTab);
        });
        b.addEventListener('keydown', e => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
            e.preventDefault();
            const i = tabs.indexOf(b);
            const n = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
            history.replaceState(null, '', `#${tabs[n].dataset.aracTab}`);
            ac(tabs[n].dataset.aracTab, true);
        });
    });
    ac(location.hash.slice(1));
    initMaliyet();
    initHava();
    initDonati();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
