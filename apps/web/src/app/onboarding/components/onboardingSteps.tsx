import { FormEventHandler } from "react";
import {
  formClassName,
  contentClassName,
  actionsClassName,
  successContentClassName,
  headerClassName,
  pageClassName,
  buttonClassName,
  iconContainerClassName,
  lucideIconClassName,
} from "./commonClassNames";
import { Button } from "@/components/ui/button";
import { LucideCheck } from "lucide-react";

export type OnboardingStepPageProps = {
  pageId: string;
  children: React.ReactNode;
};

export function OnboardingStepPage(props: OnboardingStepPageProps) {
  return (
    <div id={props.pageId} className={pageClassName}>
      {props.children}
    </div>
  );
}

export type OnboardingStepHeaderProps = {
  headerId: string;
  children: React.ReactNode;
};

export function OnboardingStepHeader(props: OnboardingStepHeaderProps) {
  return (
    <div id={props.headerId} className={headerClassName}>
      {props.children}
    </div>
  );
}

export type OnboardingStepFormProps = {
  formId: string;
  submit: FormEventHandler<HTMLFormElement> | undefined;
  children: React.ReactNode;
};

export function OnboardingStepForm(props: OnboardingStepFormProps) {
  return (
    <form id={props.formId} onSubmit={props.submit} className={formClassName}>
      {props.children}
    </form>
  );
}

export type OnboardingStepFinishProps = {
  formId: string;
  children: React.ReactNode;
};

export function OnboardingStepFinishForm(props: OnboardingStepFinishProps) {
  return (
    <div id={props.formId} className={formClassName}>
      {props.children}
    </div>
  );
}

export type OnboardingStepContentProps = {
  contentId: string;
  children: React.ReactNode;
};
export function OnboardingStepContent(props: OnboardingStepContentProps) {
  return (
    <div id={props.contentId} className={contentClassName}>
      {props.children}
    </div>
  );
}

export function OnboardingStepFinishContent(props: OnboardingStepContentProps) {
  return (
    <div id={props.contentId} className={successContentClassName}>
      {props.children}
    </div>
  );
}

export type OnboardingStepActionsProps = {
  actionsId: string;
  children: React.ReactNode;
};
export function OnboardingStepActions(props: OnboardingStepActionsProps) {
  return (
    <div id={props.actionsId} className={actionsClassName}>
      {props.children}
    </div>
  );
}

export type OnboardingStepPrimaryActionProps = {
  children: React.ReactNode;
  disabled: boolean;
};
export function OnboardingStepPrimaryAction(
  props: OnboardingStepPrimaryActionProps
) {
  return (
    <Button
      variant={"default"}
      size={"lg"}
      type="submit"
      className={buttonClassName}
      disabled={props.disabled}
    >
      {props.children}
    </Button>
  );
}

export type OnboardingStepSecondaryActionProps = {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
};
export function OnboardingStepSecondaryAction(
  props: OnboardingStepSecondaryActionProps
) {
  return (
    <Button
      variant={"secondary"}
      size={"lg"}
      onClick={props.onClick}
      className={buttonClassName}
      disabled={props.disabled}
    >
      {props.children}
    </Button>
  );
}

export type OnboardingSuccessIconProps = {
  iconId: string;
};
export function OnboardingSuccessIcon(props: OnboardingSuccessIconProps) {
  return (
    <div id={props.iconId} className={iconContainerClassName}>
      <LucideCheck className={lucideIconClassName} />
    </div>
  );
}
