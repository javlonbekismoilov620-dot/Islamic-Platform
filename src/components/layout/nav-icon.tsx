import { BookOpen, House, Library, User } from "lucide-react";
import { DuaIcon, MihrabIcon, QuranIcon, TasbihIcon } from "@/components/ui/icons";

export function NavIcon({ name, size = 22 }: { name: string; size?: number }) {
  switch (name) {
    case "home": return <House size={size} strokeWidth={1.75} />;
    case "book": return <QuranIcon size={size} />;
    case "mosque": return <MihrabIcon size={size} />;
    case "hands": return <DuaIcon size={size} />;
    case "circle": return <TasbihIcon size={size} />;
    case "library": return <Library size={size} strokeWidth={1.75} />;
    case "user": return <User size={size} strokeWidth={1.75} />;
    default: return <BookOpen size={size} />;
  }
}
