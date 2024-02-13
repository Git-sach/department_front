export interface Department {
  id: number;
  name: string;
  code: string;
  prefecture: string | null;
  svg_path: string;
  viewBox00: number | null;
  viewBox01: number | null;
  viewBox10: number | null;
  viewBox11: number | null;
  color?: string;
  tmin?: number;
  tmoy?: number;
  tmax?: number;
}
