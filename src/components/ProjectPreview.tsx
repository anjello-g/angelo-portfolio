import type { PreviewKind } from "../data/content";
import { DashboardPreview, KpiPreview, WorkflowPreview } from "./previews";
import { HourlyPreview, ShopPreview, VoicePreview } from "./previews-more";

export function ProjectPreview({ kind }: { kind: PreviewKind }) {
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
