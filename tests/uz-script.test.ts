import { describe, expect, it } from "vitest";
import { cyrToLat } from "@/lib/uz-script";

describe("cyrToLat", () => {
  it("converts the basic alphabet and digraphs", () => {
    expect(cyrToLat("Меҳрибон ва раҳмли Аллоҳнинг номи билан бошлайман.")).toBe(
      "Mehribon va rahmli Allohning nomi bilan boshlayman.",
    );
    expect(cyrToLat("Ҳамд оламларнинг Робби — Аллоҳгадир.")).toBe("Hamd olamlarning Robbi — Allohgadir.");
  });
  it("handles ў, ғ, қ and ъ", () => {
    expect(cyrToLat("Ўзи яратган нарсаларнинг ёмонлигидан")).toBe("Oʻzi yaratgan narsalarning yomonligidan");
    expect(cyrToLat("Ғалаба Қуръон маъно")).toBe("Gʻalaba Qurʼon maʼno");
  });
  it("uses ye at word start and after vowels", () => {
    expect(cyrToLat("ер еди келди уей")).toBe("yer yedi keldi uyey");
  });
  it("treats Latin homoglyphs inside Cyrillic words as Cyrillic", () => {
    expect(cyrToLat("Аллоҳ Cомад (Беҳожат)дир.")).toBe("Alloh Somad (Behojat)dir.");
  });
  it("keeps all-caps digraphs uppercase", () => {
    expect(cyrToLat("ШАЙХ")).toBe("SHAYX");
    expect(cyrToLat("Шайх")).toBe("Shayx");
  });
});
