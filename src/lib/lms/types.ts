export type LmsRole = "student" | "instructor" | "admin";

export type LmsLesson = {
  id: string;
  title: string;
  duration: string;
  videoUrl: string | null;
  notesUrl: string | null;
  sortOrder: number;
  complete: boolean;
};

export type LmsModule = {
  id: string;
  title: string;
  sortOrder: number;
  lessons: LmsLesson[];
};

export type LmsCourse = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceInr: number;
  level: string;
  duration: string;
  thumbnail: string | null;
  modules: LmsModule[];
  progressPercent: number;
  enrolled: boolean;
};

export type LmsQuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

export type LmsQuiz = {
  id: string;
  lessonId: string;
  title: string;
  timerSeconds: number;
  passingScore: number;
  questions: LmsQuizQuestion[];
};

export type LmsAssignment = {
  id: string;
  lessonId: string;
  title: string;
  courseTitle: string;
  dueAt: string | null;
  status: string;
  grade: string | null;
};

export type LmsDashboardStats = {
  enrolledCount: number;
  averageProgress: number;
  certificateCount: number;
  upcomingAssignments: number;
};
