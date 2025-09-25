"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  label: string;
}
export function BackButton(props: BackButtonProps) {
  const router = useRouter();
  return (
    <Button
      variant={"secondary"}
      onClick={() => {
        router.back();
      }}
      size={"lg"}
    >
      {props.label}
    </Button>
  );
}
