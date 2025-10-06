import { H5, Small } from "@/components/typography";

type BookingsSwitchComponentProps = {
  title: string;
  isActive?: boolean;
  setActiveTab: (title: string) => void;
};
export default function BookingsSwitchComponent(
  props: BookingsSwitchComponentProps
) {
  return (
    <div
      className={`flex flex-row rounded border px-3 py-2 gap-3 lg:gap-4 items-center ${
        props.isActive
          ? "bg-white border-white shadow"
          : "border-slate-200 hover:bg-slate-200"
      }`}
      onClick={() => {
        props.setActiveTab(props.title);
      }}
    >
      <Small>{props.title}</Small>
      {/* <div className="flex rounded bg-slate-200 px-2 py-1 lg:px-3 lg:py-2">
        <H5>{props.number}</H5>
      </div> */}
    </div>
  );
}
