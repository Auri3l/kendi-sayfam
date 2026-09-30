// ==========================================================================
// ŞANTİYE HAVA & İŞ PLANI ÇEKİRDEĞİ (saf fonksiyonlar)
// Open-Meteo saatlik tahmininden günlük iş uygunluğu üretir.
// ==========================================================================

export const VARSAYILAN_ESIKLER = {
    mesaiBas: 7,
    mesaiBit: 19,
    betonMin: 5,       // °C altı: soğuk hava önlemi gerekir
    betonMax: 32,      // °C üstü: sıcak hava önlemi gerekir
    vincHamle: 50,     // km/h: üreticinin sınırı girilmeli
    yuksekHamle: 40,   // km/h: iskele / yüksekte çalışma
    cepheMin: 5,
    cepheMax: 30,
    cepheNem: 85,      // %
    yagisEsik: 0.2     // mm/saat: "yağışlı saat" sayılır
};

export const DURUM = { UYGUN: 'uygun', DIKKAT: 'dikkat', UYGUN_DEGIL: 'uygun-degil' };

// saatler: [{ saat: 0-23, sicaklik, yagis, ruzgar, hamle, nem }]
export function gunuDegerlendir(saatler, esik = VARSAYILAN_ESIKLER) {
    const mesai = saatler.filter(h => h.saat >= esik.mesaiBas && h.saat < esik.mesaiBit);
    const s = mesai.length ? mesai : saatler;
    const maxOf = k => Math.max(...s.map(h => Number(h[k]) || 0));
    const minOf = k => Math.min(...s.map(h => Number(h[k]) || 0));
    const sum = k => s.reduce((t, h) => t + (Number(h[k]) || 0), 0);

    const tMin = minOf('sicaklik');
    const tMax = maxOf('sicaklik');
    const yagis = sum('yagis');
    const yagisliSaat = s.filter(h => (Number(h.yagis) || 0) >= esik.yagisEsik).length;
    const hamle = maxOf('hamle');
    const nemMax = maxOf('nem');

    const ozet = { tMin, tMax, yagis, yagisliSaat, hamle, nemMax };

    const beton = (() => {
        if (tMin < 0 || tMax > esik.betonMax + 3 || yagis >= 5) return [DURUM.UYGUN_DEGIL, tMin < 0 ? 'Don riski' : tMax > esik.betonMax + 3 ? 'Aşırı sıcak' : 'Kuvvetli yağış'];
        if (tMin < esik.betonMin) return [DURUM.DIKKAT, 'Soğuk hava önlemi (örtü, ısıtma, kür)'];
        if (tMax > esik.betonMax) return [DURUM.DIKKAT, 'Sıcak hava önlemi (sabah dökümü, kür)'];
        if (yagisliSaat > 0) return [DURUM.DIKKAT, 'Yağış: yüzeyi örtün'];
        return [DURUM.UYGUN, 'Normal döküm'];
    })();

    const vinc = (() => {
        if (hamle >= esik.vincHamle) return [DURUM.UYGUN_DEGIL, `Hamle ${Math.round(hamle)} km/h`];
        if (hamle >= esik.vincHamle * 0.8) return [DURUM.DIKKAT, 'Limite yakın, geniş yüzeyli yükte dikkat'];
        return [DURUM.UYGUN, 'Rüzgar limit altında'];
    })();

    const yuksek = (() => {
        if (hamle >= esik.yuksekHamle || yagis >= 5) return [DURUM.UYGUN_DEGIL, hamle >= esik.yuksekHamle ? `Hamle ${Math.round(hamle)} km/h` : 'Kuvvetli yağış'];
        if (yagisliSaat > 0 || hamle >= esik.yuksekHamle * 0.8) return [DURUM.DIKKAT, yagisliSaat > 0 ? 'Kaygan zemin riski' : 'Rüzgar artıyor'];
        return [DURUM.UYGUN, 'Elverişli'];
    })();

    const cephe = (() => {
        if (yagisliSaat >= 2 || tMin < esik.cepheMin - 2 || tMax > esik.cepheMax + 5) return [DURUM.UYGUN_DEGIL, yagisliSaat >= 2 ? 'Yağış' : tMin < esik.cepheMin - 2 ? 'Soğuk' : 'Aşırı sıcak'];
        if (yagisliSaat === 1 || tMin < esik.cepheMin || tMax > esik.cepheMax || nemMax > esik.cepheNem) {
            return [DURUM.DIKKAT, yagisliSaat === 1 ? 'Kısa süreli yağış' : nemMax > esik.cepheNem ? 'Yüksek nem, kuruma yavaş' : 'Sıcaklık sınırda'];
        }
        return [DURUM.UYGUN, 'Mantolama, boya ve silikon için uygun'];
    })();

    return {
        ozet,
        isler: {
            beton: { durum: beton[0], not: beton[1] },
            vinc: { durum: vinc[0], not: vinc[1] },
            yuksek: { durum: yuksek[0], not: yuksek[1] },
            cephe: { durum: cephe[0], not: cephe[1] }
        }
    };
}

// Open-Meteo "hourly" yanıtını güne göre gruplar
export function saatlikGrupla(hourly) {
    const gunler = new Map();
    (hourly?.time || []).forEach((t, i) => {
        const [tarih, saatStr] = t.split('T');
        const saat = Number(saatStr.slice(0, 2));
        const g = gunler.get(tarih) || [];
        g.push({
            saat,
            sicaklik: hourly.temperature_2m?.[i],
            yagis: hourly.precipitation?.[i],
            ruzgar: hourly.wind_speed_10m?.[i],
            hamle: hourly.wind_gusts_10m?.[i],
            nem: hourly.relative_humidity_2m?.[i]
        });
        gunler.set(tarih, g);
    });
    return [...gunler.entries()].map(([tarih, saatler]) => ({ tarih, saatler }));
}
