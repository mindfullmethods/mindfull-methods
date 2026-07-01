import AssignmentPanel from "@/components/lms/AssignmentPanel";
import LmsSchemaBanner from "@/components/lms/LmsSchemaBanner";
import { isLmsSchemaReady } from "@/lib/lms/schema";
import { getLmsAssignments } from "@/Services/lms";

export default async function LmsAssignmentsPage() {
  const [assignments, schemaReady] = await Promise.all([getLmsAssignments(), isLmsSchemaReady()]);

  return (
    <>
      {!schemaReady ? <LmsSchemaBanner /> : null}
      <AssignmentPanel assignments={assignments} />
    </>
  );
}
