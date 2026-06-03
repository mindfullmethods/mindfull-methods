import AdminPromoCodesPanel from "@/components/components/dashboard/AdminPromoCodesPanel";
import AdminSiteContentPanel from "@/components/components/dashboard/AdminSiteContentPanel";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import { getPromoCodes } from "@/lib/promo-codes";
import { requireAdmin } from "@/lib/auth";
import { isPlatformSettingsReady } from "@/lib/platform-content";
import { getSiteContent } from "@/lib/site-content";

export default async function AdminSiteSettingsPage() {
  await requireAdmin();
  const tableReady = await isPlatformSettingsReady();
  const [promoCodes, siteContent] = await Promise.all([getPromoCodes(), getSiteContent()]);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <DashboardPageHeader
        eyebrow="Site settings"
        title="Promo codes & marketing copy"
        description="Edit checkout discounts and public-facing trust content without redeploying code."
      />

      <div className="mt-8 space-y-8">
        <AdminPromoCodesPanel initialCodes={promoCodes} tableReady={tableReady} />
        <AdminSiteContentPanel initial={siteContent} tableReady={tableReady} />
      </div>
    </main>
  );
}
