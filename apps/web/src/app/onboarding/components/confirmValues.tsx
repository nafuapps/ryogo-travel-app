import { P, PBold } from "@/components/typography";

interface ConfirmValuesProps {
  name: string;
  value: string;
}

export default function ConfirmValues({ name, value }: ConfirmValuesProps) {
  return (
    <div className="flex flex-row justify-between w-full items-start gap-5 lg:gap-6">
      <PBold>{name}</PBold>
      <P>{value}</P>
    </div>
  );
}
