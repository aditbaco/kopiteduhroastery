// Rupiah has no minor unit, so prices are plain integers everywhere and only
// become strings at the edge. id-ID formats as "Rp 95.000" (dot thousands).
export const formatIdr = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)

// Plain number, no currency symbol — for places where "Rp" is already shown.
export const formatNumber = (amount: number) => new Intl.NumberFormat('id-ID').format(amount)

// 200 -> "200 g", 1000 -> "1 kg". Keeps listings from reading "1000 g".
export const formatWeight = (grams: number) => (grams >= 1000 ? `${grams / 1000} kg` : `${grams} g`)

// "1100-1200 mdpl" / "1,100-1,200 masl"
export const formatAltitude = (min: number, max: number, lang: 'id' | 'en' = 'id') =>
  lang === 'id'
    ? `${formatNumber(min)}–${formatNumber(max)} mdpl`
    : `${new Intl.NumberFormat('en-US').format(min)}–${new Intl.NumberFormat('en-US').format(max)} masl`
