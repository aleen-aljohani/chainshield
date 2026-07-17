import {
  LayoutDashboard, BookOpen, Layers, CalendarDays, Languages, PencilRuler,
  BookMarked, Headphones, MessagesSquare, PenLine, Copy, Database, FileQuestion,
  FileText, ClipboardList, Gamepad2, Users, CalendarCheck, GraduationCap, Shuffle,
  BarChart3, Printer, Sparkles, DatabaseBackup, Settings, type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  key: string; // i18n key
  label: string; // fallback English label
  icon: LucideIcon;
  group: "main" | "content" | "materials" | "class" | "system";
}

export const navItems: NavItem[] = [
  { href: "/", key: "nav_dashboard", label: "Dashboard", icon: LayoutDashboard, group: "main" },

  { href: "/curriculum", key: "nav_curriculum", label: "Curriculum", icon: BookOpen, group: "content" },
  { href: "/units", key: "nav_units", label: "Units", icon: Layers, group: "content" },
  { href: "/lessons", key: "nav_lessons", label: "Lesson Planner", icon: CalendarDays, group: "content" },
  { href: "/vocabulary", key: "nav_vocabulary", label: "Vocabulary", icon: Languages, group: "content" },
  { href: "/grammar", key: "nav_grammar", label: "Grammar", icon: PencilRuler, group: "content" },
  { href: "/reading", key: "nav_reading", label: "Reading", icon: BookMarked, group: "content" },
  { href: "/listening", key: "nav_listening", label: "Listening", icon: Headphones, group: "content" },
  { href: "/speaking", key: "nav_speaking", label: "Speaking", icon: MessagesSquare, group: "content" },
  { href: "/writing", key: "nav_writing", label: "Writing", icon: PenLine, group: "content" },
  { href: "/flashcards", key: "nav_flashcards", label: "Flashcards", icon: Copy, group: "content" },

  { href: "/question-bank", key: "nav_questionbank", label: "Question Bank", icon: Database, group: "materials" },
  { href: "/quiz", key: "nav_quiz", label: "Quiz Generator", icon: FileQuestion, group: "materials" },
  { href: "/worksheets", key: "nav_worksheets", label: "Worksheets", icon: FileText, group: "materials" },
  { href: "/homework", key: "nav_homework", label: "Homework", icon: ClipboardList, group: "materials" },
  { href: "/games", key: "nav_games", label: "Revision Games", icon: Gamepad2, group: "materials" },
  { href: "/assistant", key: "nav_assistant", label: "Teacher Assistant", icon: Sparkles, group: "materials" },

  { href: "/students", key: "nav_students", label: "Students", icon: Users, group: "class" },
  { href: "/attendance", key: "nav_attendance", label: "Attendance", icon: CalendarCheck, group: "class" },
  { href: "/grades", key: "nav_grades", label: "Grades", icon: GraduationCap, group: "class" },
  { href: "/picker", key: "nav_picker", label: "Random Picker", icon: Shuffle, group: "class" },
  { href: "/reports", key: "nav_reports", label: "Reports", icon: BarChart3, group: "class" },

  { href: "/printables", key: "nav_printables", label: "Printable Resources", icon: Printer, group: "system" },
  { href: "/backup", key: "nav_backup", label: "Backup & Restore", icon: DatabaseBackup, group: "system" },
  { href: "/settings", key: "nav_settings", label: "Settings", icon: Settings, group: "system" },
];

export const navGroups: { id: NavItem["group"]; en: string; ar: string }[] = [
  { id: "main", en: "", ar: "" },
  { id: "content", en: "Teaching Content", ar: "المحتوى التعليمي" },
  { id: "materials", en: "Materials & Games", ar: "المواد والألعاب" },
  { id: "class", en: "Classroom", ar: "الفصل" },
  { id: "system", en: "System", ar: "النظام" },
];
