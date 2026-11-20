import { describe, expect, it } from "vitest";
import { normUz } from "@/lib/search-normalize";

describe("normUz", () => {
  it("unifies common Uzbek spelling variants", () => {
    expect(normUz("Qurʼon")).toBe(normUz("Quron"));
    expect(normUz("Qur'on")).toBe(normUz("Kuron"));
    expect(normUz("namoz")).toBe(normUz("namaz"));
    expect(normUz("hadis")).toBe(normUz("xadis"));
    expect(normUz("Alloh")).toBe(normUz("Allah"));
    expect(normUz("roʻza")).toBe(normUz("roza"));
    expect(normUz("gʻusl")).toBe(normUz("g'usl"));
    expect(normUz("tahorat")).toBe(normUz("таҳорат"));
  });
  it("strips transliteration diacritics", () => {
    expect(normUz("Subḥānallāh")).toBe(normUz("subhanalloh"));
  });
});
