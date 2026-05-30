export interface Internship {
  id: string;
  title: string;
  company: string;
  description: string;
  duration: string;
  stipend: string;
  image_url: string;
  tags?: string | null;
  is_published?: boolean | null;
  created_at?: string | null;
}
