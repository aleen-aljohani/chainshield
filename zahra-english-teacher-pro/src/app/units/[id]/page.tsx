import { curriculum } from "@/data/curriculum";
import UnitDetailClient from "./UnitDetailClient";

// Pre-render every unit page for static export (GitHub Pages).
export function generateStaticParams() {
  return curriculum.map((u) => ({ id: u.id }));
}

export const dynamicParams = false;

export default function UnitDetailPage({ params }: { params: { id: string } }) {
  return <UnitDetailClient id={params.id} />;
}
