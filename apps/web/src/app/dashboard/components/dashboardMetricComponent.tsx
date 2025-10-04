import { CaptionGrey, H3 } from "@/components/typography";

type DashboardMetricComponentProps = {
  title: string;
  metric: string;
};
export const DashboardMetricComponent = (
  props: DashboardMetricComponentProps
) => {
  return (
    <div className="flex flex-col gap-1.5 lg:gap-2 bg-white justify-start items-start shadow rounded-lg p-4 lg:p-5">
      <CaptionGrey>{props.title}</CaptionGrey>
      <H3>{props.metric}</H3>
    </div>
  );
};
