import type { Program } from "./program";
import type { Course } from "./course";

export interface ProgramCourses {
  program: Program;
  courses: Course[];
}
