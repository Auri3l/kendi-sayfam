// Ortak arayüz yardımcıları
export const fmt = (n, d = 2) => (Number.isFinite(n) ? n : 0).toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });
export const fmtTL = n => `${fmt(n, 0)} ₺`;

export const store = {
    get(key) {
        try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
    },
    set(key, value) {
        try {
            if (value === null) localStorage.removeItem(key);
            else localStorage.setItem(key, JSON.stringify(value));
        } catch { /* depolama kapalı olabilir */ }
    }
};

export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const num = v => {
    const n = Number(String(v ?? '').replace(',', '.'));
    return Number.isFinite(n) ? n : NaN;
};

export function downloadCsv(filename, rows) {
    const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = '﻿' + rows.map(r => r.map(q).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
