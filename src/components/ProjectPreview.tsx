import type { PreviewKind } from "../data/content";
import { DashboardPreview, KpiPreview, WorkflowPreview } from "./previews";
import { HourlyPreview, ShopPreview, VoicePreview } from "./previews-more";

function Preview({ kind }: { kind: PreviewKind }) {
  switch (kind) {
    case "dashboard":
      return <DashboardPreview />;
    case "kpi":
      return <KpiPreview />;
    case "hourly":
      return <HourlyPreview />;
    case "workflow":
      return <WorkflowPreview />;
    case "voice":
      return <VoicePreview />;
    case "shop":
      return <ShopPreview />;
  }
}

/** The previews are little "screenshots", so they keep the light palette even in dark mode. */
export function ProjectPreview({ kind }: { kind: PreviewKind }) {
  return (
    <div className="theme-light h-full text-ink">
      <Preview kind={kind} />
    </div>
  );
}
