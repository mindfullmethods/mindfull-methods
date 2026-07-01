import QuizPanel from "@/components/lms/QuizPanel";
import LmsSchemaBanner from "@/components/lms/LmsSchemaBanner";
import { isLmsSchemaReady } from "@/lib/lms/schema";
import { getLmsQuiz } from "@/Services/lms";

export default async function LmsQuizzesPage() {
  const [quiz, schemaReady] = await Promise.all([getLmsQuiz(), isLmsSchemaReady()]);

  return (
    <>
      {!schemaReady ? <LmsSchemaBanner /> : null}
      <QuizPanel quiz={quiz} />
    </>
  );
}
