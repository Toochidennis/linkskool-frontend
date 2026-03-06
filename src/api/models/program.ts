export interface Program {
  id: number;
  slug: string;
  name: string;
  description: string;
  imageUrl: string | null;
  courseCount: number;
  sponsor: string | null;
  shortname: string | null;
}
