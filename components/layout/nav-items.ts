import type { LucideIcon } from "lucide-react";
import { LayoutGrid, Wand2, LayoutTemplate, FolderOpen, Settings } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const primaryNav: NavItem[] = [
  { label: "Meus Sites", href: "/dashboard", icon: LayoutGrid },
  { label: "Prompts", href: "/prompts", icon: Wand2 },
  { label: "Templates", href: "/templates", icon: LayoutTemplate },
  { label: "Arquivos", href: "/files", icon: FolderOpen },
];

export const secondaryNav: NavItem[] = [
  { label: "Configurações", href: "/settings", icon: Settings },
];
