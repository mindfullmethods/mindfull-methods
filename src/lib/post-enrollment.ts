import { markInquiryEnrolledForCourse } from "@/lib/contact-inquiry-enrollment";
import { getCourseBySlug } from "@/lib/courses";
import { recordEnrollment, type EnrollmentRecord } from "@/lib/enrollments";
import { notifyEnrollmentCompleted } from "@/lib/email";
import { getResolvedCourseBySlug } from "@/lib/platform-content";

function enrollmentAmountLabel(courseSlug: string, amountPaise: number) {
  return getCourseBySlug(courseSlug)?.priceLabel ?? `₹${Math.round(amountPaise / 100).toLocaleString("en-IN")}`;
}

export async function sendEnrollmentConfirmation(params: {
  courseSlug: string;
  courseTitle: string;
  amountPaise: number;
  email?: string | null;
  name?: string | null;
}) {
  if (!params.email?.includes("@")) return;

  await notifyEnrollmentCompleted({
    studentName: params.name ?? params.email.split("@")[0] ?? "Student",
    studentEmail: params.email,
    courseTitle: params.courseTitle,
    courseSlug: params.courseSlug,
    amountLabel: enrollmentAmountLabel(params.courseSlug, params.amountPaise),
  });
}

export async function finalizePaidEnrollment(params: {
  courseSlug: string;
  courseTitle: string;
  amountPaise: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  userId?: string | null;
  email?: string | null;
  name?: string | null;
  status?: string;
}): Promise<{ enrollment: EnrollmentRecord; isNew: boolean }> {
  const { enrollment, isNew } = await recordEnrollment({
    courseSlug: params.courseSlug,
    courseTitle: params.courseTitle,
    amountPaise: params.amountPaise,
    razorpayOrderId: params.razorpayOrderId,
    razorpayPaymentId: params.razorpayPaymentId,
    userId: params.userId ?? null,
    email: params.email ?? null,
    status: params.status ?? "paid",
  });

  if (isNew) {
    void sendEnrollmentConfirmation({
      courseSlug: params.courseSlug,
      courseTitle: params.courseTitle,
      amountPaise: params.amountPaise,
      email: params.email,
      name: params.name,
    }).catch((err) => console.error("[finalizePaidEnrollment] email", err));

    if (params.email) {
      void markInquiryEnrolledForCourse(params.email, params.courseSlug);
    }
  }

  return { enrollment, isNew };
}

export async function resolveEnrollmentCourseMeta(courseSlug: string) {
  const course = await getResolvedCourseBySlug(courseSlug);
  if (!course) return null;

  return {
    slug: course.slug,
    title: course.title,
    amountPaise: course.priceInPaise,
  };
}
