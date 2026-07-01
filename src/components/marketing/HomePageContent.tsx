import HomeAboutSection from "@/components/marketing/home/HomeAboutSection";
import HomeCourseShowcase from "@/components/marketing/home/HomeCourseShowcase";
import HomeCtaBanner from "@/components/marketing/home/HomeCtaBanner";
import HomeHeroSection from "@/components/marketing/home/HomeHeroSection";
import HomeLeadForm from "@/components/marketing/home/HomeLeadForm";
import HomeProcessTimeline from "@/components/marketing/home/HomeProcessTimeline";
import HomeSampleShowcase from "@/components/marketing/home/HomeSampleShowcase";
import HomeServiceLines from "@/components/marketing/home/HomeServiceLines";
import HomeTestimonialsGrid from "@/components/marketing/home/HomeTestimonialsGrid";
import HomeWhatWeTeach from "@/components/marketing/home/HomeWhatWeTeach";
import HomeWhoWeServe from "@/components/marketing/home/HomeWhoWeServe";
import HomeWhyChooseUs from "@/components/marketing/home/HomeWhyChooseUs";
import HomeWhyMentorship from "@/components/marketing/home/HomeWhyMentorship";

import { getFeaturedCourses } from "@/lib/courses";
import { getSiteContent } from "@/lib/site-content";

export default async function HomePageContent() {
  const courses = getFeaturedCourses();
  const site = await getSiteContent();

  return (
    <div className="mm-landing-page bg-black text-white">
      <HomeHeroSection />
      <HomeAboutSection />
      <HomeWhyChooseUs />
      <HomeWhatWeTeach />
      <HomeProcessTimeline />
      <HomeWhyMentorship />
      <HomeCourseShowcase courses={courses} />
      <HomeServiceLines />
      <HomeSampleShowcase />
      <HomeTestimonialsGrid testimonials={site.testimonials} />
      <HomeWhoWeServe />
      <HomeCtaBanner />
      <HomeLeadForm />
    </div>
  );
}
