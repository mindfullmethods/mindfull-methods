# Mindful Methods LMS Portal

This is a complete static first-pass LMS portal built from the PRD. Open `index.html` in a browser to review the student, instructor, admin, course learning, quiz, assignment, certificate, and verification flows.

## Included

- Student dashboard with enrolled courses, progress, certificates, assignments, and activity.
- Course catalog for all four AI programs from the PRD.
- Lesson player area with Bunny Stream-ready video placement.
- Quiz flow with timer display, answer selection, auto-score, and result feedback.
- Assignment upload form for PDF/ZIP, GitHub repository, and project URL.
- Certificate page with certificate ID, completion date, QR placeholder, and `/verify/{certificate_id}` path.
- Admin dashboard with metrics, course management, and student management.
- Instructor dashboard for assigned courses, lesson publishing, assignment review, and performance tracking.
- Login panel representing Supabase email auth, Google sign-in, and password reset.
- Razorpay checkout placeholders on paid courses.
- Dark and light themes with responsive layouts.

## Next.js integration (shipped)

The prototype in this folder is implemented in the main app:

| Prototype view | App route |
|----------------|-----------|
| Student dashboard | `/dashboard/lms` |
| Courses | `/dashboard/lms/courses` |
| Learn / lesson player | `/dashboard/lms/learn/[slug]` |
| Quizzes | `/dashboard/lms/quizzes` |
| Assignments | `/dashboard/lms/assignments` |
| Certificates | `/dashboard/lms/certificates` |
| Admin | `/dashboard/lms/admin` (admin emails only) |
| Instructor | `/dashboard/lms/instructor` (`lms_profiles.role = instructor` or admin) |
| Verify | `/verify/[id]` → `/certificates/verify/[id]` |

**Database:** run `supabase/lms-portal-schema.sql` (migration **#15** in `docs/LOCAL_MIGRATIONS.md`).

**Enrollments:** LMS lessons require an existing paid enrollment (`enrollments.course_slug`). Checkout stays on marketing course pages (Razorpay).

**Video:** set `video_url` on lessons (Bunny iframe / YouTube). Optional env: `BUNNY_STREAM_LIBRARY_ID`, `BUNNY_STREAM_API_KEY`.
