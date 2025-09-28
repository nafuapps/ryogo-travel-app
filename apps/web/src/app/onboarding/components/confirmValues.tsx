import { P, PBold } from "@/components/typography";

type ConfirmValuesProps = {
  name: string;
  value: string;
};

export default function ConfirmValues({ name, value }: ConfirmValuesProps) {
  return (
    <div className="flex flex-row justify-between w-full items-start gap-5 lg:gap-6">
      <PBold>{name}</PBold>
      <div className="text-right">
        <P>{value}</P>
      </div>
    </div>
  );
}
