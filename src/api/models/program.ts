import type { Course } from "./course";

export interface Program {
  programId: number;
  name: string;
  description: string;
  imageUrl: string | null;
  courses: Course[];
}
