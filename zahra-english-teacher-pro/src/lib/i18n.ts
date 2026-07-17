export type Lang = "en" | "ar";

/**
 * Minimal, dependency-free i18n dictionary. Navigation labels and common UI
 * strings are translated. Content data (textbook items) stays in English by
 * design, since the course is an English-language course.
 */
export const dict: Record<string, { en: string; ar: string }> = {
  appName: { en: "Zahra Aljehani – English Teacher Pro", ar: "زهرة الجهني – محترف تدريس الإنجليزية" },
  welcome: { en: "Welcome", ar: "مرحباً" },
  subtitle: { en: "English Teacher – Grade 12", ar: "معلمة اللغة الإنجليزية – الصف الثاني عشر" },
  curriculumLine: { en: "Mega Goal 3 | First Semester", ar: "ميجا جول ٣ | الفصل الدراسي الأول" },
  search: { en: "Search", ar: "بحث" },
  save: { en: "Save", ar: "حفظ" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  delete: { en: "Delete", ar: "حذف" },
  edit: { en: "Edit", ar: "تعديل" },
  add: { en: "Add", ar: "إضافة" },
  duplicate: { en: "Duplicate", ar: "نسخ" },
  print: { en: "Print", ar: "طباعة" },
  close: { en: "Close", ar: "إغلاق" },
  confirm: { en: "Confirm", ar: "تأكيد" },
  loading: { en: "Loading…", ar: "جارٍ التحميل…" },
  noData: { en: "Nothing here yet", ar: "لا يوجد شيء بعد" },

  // Nav
  nav_dashboard: { en: "Dashboard", ar: "الرئيسية" },
  nav_curriculum: { en: "Curriculum", ar: "المنهج" },
  nav_units: { en: "Units", ar: "الوحدات" },
  nav_lessons: { en: "Lesson Planner", ar: "مخطط الدروس" },
  nav_vocabulary: { en: "Vocabulary", ar: "المفردات" },
  nav_grammar: { en: "Grammar", ar: "القواعد" },
  nav_reading: { en: "Reading", ar: "القراءة" },
  nav_listening: { en: "Listening", ar: "الاستماع" },
  nav_speaking: { en: "Speaking", ar: "المحادثة" },
  nav_writing: { en: "Writing", ar: "الكتابة" },
  nav_flashcards: { en: "Flashcards", ar: "البطاقات" },
  nav_questionbank: { en: "Question Bank", ar: "بنك الأسئلة" },
  nav_quiz: { en: "Quiz Generator", ar: "مولّد الاختبارات" },
  nav_worksheets: { en: "Worksheets", ar: "أوراق العمل" },
  nav_homework: { en: "Homework", ar: "الواجبات" },
  nav_games: { en: "Revision Games", ar: "ألعاب المراجعة" },
  nav_students: { en: "Students", ar: "الطالبات" },
  nav_attendance: { en: "Attendance", ar: "الحضور" },
  nav_grades: { en: "Grades", ar: "الدرجات" },
  nav_picker: { en: "Random Picker", ar: "الاختيار العشوائي" },
  nav_reports: { en: "Reports", ar: "التقارير" },
  nav_printables: { en: "Printable Resources", ar: "الموارد للطباعة" },
  nav_assistant: { en: "Teacher Assistant", ar: "مساعد المعلمة" },
  nav_backup: { en: "Backup & Restore", ar: "النسخ الاحتياطي" },
  nav_settings: { en: "Settings", ar: "الإعدادات" },
};

export function t(key: string, lang: Lang): string {
  const entry = dict[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en;
}
