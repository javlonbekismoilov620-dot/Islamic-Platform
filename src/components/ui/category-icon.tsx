import { BookOpen, Compass, DoorOpen, Droplets, GraduationCap, Hand, HandCoins, Heart, HeartPulse, House, Landmark, Moon, MoonStar, Plane, RotateCcw, Scale, ShieldCheck, Sparkles, Star, Sun, Sunrise, Sunset, Users, Utensils } from "lucide-react";
import { MihrabIcon, TasbihIcon } from "./icons";

const MAP: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  sunrise: Sunrise, sunset: Sunset, moon: Moon, sun: Sun, utensils: Utensils, door: DoorOpen, landmark: Landmark, plane: Plane,
  shield: ShieldCheck, heart: Heart, sparkles: Sparkles, users: Users, graduation: GraduationCap, hand: Hand, heartpulse: HeartPulse,
  home: House, moonstar: MoonStar, compass: Compass, droplet: Droplets, coins: HandCoins, book: BookOpen, refresh: RotateCcw, scale: Scale, star: Star,
};

export function CategoryIcon({ name, size = 22 }: { name?: string | null; size?: number }) {
  if (name === "mihrab") return <MihrabIcon size={size} />;
  if (name === "tasbih") return <TasbihIcon size={size} />;
  const C = MAP[name ?? ""] ?? Sparkles;
  return <C size={size} strokeWidth={1.75} />;
}
