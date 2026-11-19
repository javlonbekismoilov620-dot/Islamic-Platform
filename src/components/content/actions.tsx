"use client";
import { Bookmark, BookmarkCheck, Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { useHydrated, useStore, toggleInList } from "@/lib/store";
import type { Bookmarks } from "@/lib/store-schema";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";

type Kind = keyof Bookmarks;

export function BookmarkButton({ kind, id, label = "Saqlash", className }: { kind: Kind; id: string; label?: string; className?: string }) {
  const [bm, setBm] = useStore("bookmarks");
  const hydrated = useHydrated();
  const on = hydrated && bm[kind].includes(id);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Saqlanganlardan olib tashlash" : label}
      onClick={() => {
        setBm((b) => ({ ...b, [kind]: toggleInList(b[kind], id) }));
        toast(on ? "Saqlanganlardan olib tashlandi" : "Saqlandi", on ? "info" : "success");
      }}
      className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-sunken", on ? "text-gold" : "text-muted hover:text-fg", className)}
    >
      {on ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
    </button>
  );
}

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label="Nusxa olish"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          toast("Nusxa olindi");
          window.setTimeout(() => setDone(false), 1500);
        } catch {
          toast("Nusxa olib boʻlmadi", "error");
        }
      }}
      className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-fg", className)}
    >
      {done ? <Check size={18} className="text-success" /> : <Copy size={17} />}
    </button>
  );
}

export function ShareButton({ title, text, path, className }: { title: string; text: string; path: string; className?: string }) {
  return (
    <button
      type="button"
      aria-label="Ulashish"
      onClick={async () => {
        const url = new URL(path, window.location.origin).toString();
        try {
          if (navigator.share) await navigator.share({ title, text, url });
          else {
            await navigator.clipboard.writeText(`${text}\n\n${url}`);
            toast("Havola nusxalandi");
          }
        } catch {
          /* foydalanuvchi bekor qildi */
        }
      }}
      className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-fg", className)}
    >
      <Share2 size={17} />
    </button>
  );
}
