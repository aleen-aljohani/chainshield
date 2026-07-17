/**
 * FICTIONAL sample classes and students for demo purposes only.
 * No real student data is included. Teachers should replace these with their
 * own classes and clear demo data from Settings when ready.
 */

export interface SampleClass {
  id: string;
  name: string;
  section: string;
  year: string;
  notes: string;
}

export interface SampleStudent {
  id: string;
  name: string;
  number: string;
  classId: string;
  status: "active" | "archived";
  notes: string;
}

export const sampleClasses: SampleClass[] = [
  { id: "class-a", name: "12-A", section: "A", year: "1447/1448", notes: "Sample class (fictional).", },
  { id: "class-b", name: "12-B", section: "B", year: "1447/1448", notes: "Sample class (fictional).", },
];

// Fictional names only.
export const sampleStudents: SampleStudent[] = [
  { id: "st-1", name: "Sara Al-Harbi", number: "1", classId: "class-a", status: "active", notes: "" },
  { id: "st-2", name: "Noura Al-Qahtani", number: "2", classId: "class-a", status: "active", notes: "" },
  { id: "st-3", name: "Lama Al-Dosari", number: "3", classId: "class-a", status: "active", notes: "" },
  { id: "st-4", name: "Reem Al-Shammari", number: "4", classId: "class-a", status: "active", notes: "" },
  { id: "st-5", name: "Aisha Al-Ghamdi", number: "5", classId: "class-a", status: "active", notes: "" },
  { id: "st-6", name: "Maha Al-Otaibi", number: "6", classId: "class-b", status: "active", notes: "" },
  { id: "st-7", name: "Hessa Al-Mutairi", number: "7", classId: "class-b", status: "active", notes: "" },
  { id: "st-8", name: "Jood Al-Zahrani", number: "8", classId: "class-b", status: "active", notes: "" },
  { id: "st-9", name: "Danah Al-Subaie", number: "9", classId: "class-b", status: "active", notes: "" },
  { id: "st-10", name: "Rana Al-Balawi", number: "10", classId: "class-b", status: "active", notes: "" },
];
