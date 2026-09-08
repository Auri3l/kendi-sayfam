export const MONTH_MAP: Record<string, number> = {
    Ocak: 0, Şubat: 1, Mart: 2, Nisan: 3, Mayıs: 4, Haziran: 5,
    Temmuz: 6, Ağustos: 7, Eylül: 8, Ekim: 9, Kasım: 10, Aralık: 11
};

/** Build dates independently of the runner's timezone. */
export function parseTurkishDate(value: string): number {
    const [day, month, year] = value.trim().split(/\s+/);
    if (!(month in MONTH_MAP) || !Number(day) || !Number(year)) return 0;
    return Date.UTC(Number(year), MONTH_MAP[month], Number(day));
}
