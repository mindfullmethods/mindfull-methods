export { createClient as createBrowserClient } from "@/lib/supabase/client";

import { createClient } from "@/lib/supabase/client";

/** Browser Supabase client — use in client components. */
export const supabase = createClient();
