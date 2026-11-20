/** EveryAyah tilovatlari (havola qilinadi, saytda saqlanmaydi). Papka nomlari quran-json maʼlumotlaridan tekshirilgan. */
export const RECITERS = [
  { key: "alafasy", folder: "Alafasy_128kbps", name: "Mishari Roshid al-Afasiy" },
  { key: "husary", folder: "Husary_128kbps", name: "Mahmud Xalil al-Husariy" },
  { key: "minshawi", folder: "Minshawy_Murattal_128kbps", name: "Muhammad Siddiq al-Minshoviy" },
  { key: "abdulbasit", folder: "Abdul_Basit_Murattal_192kbps", name: "Abdulbosit Abdussamad" },
  { key: "maher", folder: "MaherAlMuaiqly128kbps", name: "Mohir al-Muayqiliy" },
] as const;

export function ayahAudioUrl(reciterKey: string, s: number, a: number) {
  const r = RECITERS.find((x) => x.key === reciterKey) ?? RECITERS[0];
  return `https://everyayah.com/data/${r.folder}/${String(s).padStart(3, "0")}${String(a).padStart(3, "0")}.mp3`;
}
