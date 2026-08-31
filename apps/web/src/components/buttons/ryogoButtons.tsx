import {
  RyogoCaption,
  RyogoSmall,
  RyogoTextColorType,
} from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type ButtonType = React.ComponentProps<"button"> & {
  size?: "default" | "lg"
  variant?: "white" | "brand" | "default" | "destructive" | "outline" | "ghost"
  label?: string
  labelColor?: RyogoTextColorType
  labelClassName?: string
  showSpinner?: boolean
  children?: React.ReactNode
}

function RyogoButton(props: ButtonType) {
  const { labelColor, labelClassName, showSpinner, ...originalProps } = props
  return (
    <Button {...originalProps}>
      {props.label &&
        (props.size === "lg" ? (
          <RyogoSmall
            color={props.labelColor}
            className={props.labelClassName ?? ""}
          >
            {props.label}
          </RyogoSmall>
        ) : (
          <RyogoCaption
            color={props.labelColor}
            className={props.labelClassName ?? ""}
          >
            {props.label}
          </RyogoCaption>
        ))}
      {props.children}
    </Button>
  )
}

//Variant will be set by individual buttons
type RyogoButtonType = Omit<ButtonType, "variant">

export function RyogoDefaultButton(props: RyogoButtonType) {
  return (
    <RyogoButton
      {...props}
      variant="default"
      labelColor={props.labelColor ?? "white"}
    >
      {props.showSpinner && (
        <Spinner className="text-white dark:text-slate-950" />
      )}
      {props.children}
    </RyogoButton>
  )
}

export function RyogoBrandButton(props: RyogoButtonType) {
  return (
    <RyogoButton
      {...props}
      variant="brand"
      labelColor={props.labelColor ?? "white"}
    >
      {props.showSpinner && (
        <Spinner className="text-white dark:text-slate-950" />
      )}
      {props.children}
    </RyogoButton>
  )
}

export function RyogoDestructiveButton(props: RyogoButtonType) {
  return (
    <RyogoButton
      {...props}
      variant="destructive"
      labelColor={props.labelColor ?? "white"}
    >
      {props.showSpinner && (
        <Spinner className="text-white dark:text-slate-950" />
      )}
      {props.children}
    </RyogoButton>
  )
}

export function RyogoWhiteButton(props: RyogoButtonType) {
  return (
    <RyogoButton
      {...props}
      variant="white"
      labelColor={props.labelColor ?? "dark"}
    >
      {props.showSpinner && (
        <Spinner className="text-slate-950 dark:text-white" />
      )}
      {props.children}
    </RyogoButton>
  )
}

export function RyogoOutlineButton(props: RyogoButtonType) {
  return (
    <RyogoButton
      {...props}
      variant="outline"
      labelColor={props.labelColor ?? "slate"}
    >
      {props.showSpinner && (
        <Spinner className="text-slate-500 dark:text-slate-500" />
      )}
      {props.children}
    </RyogoButton>
  )
}

export function RyogoGhostButton(props: RyogoButtonType) {
  return (
    <RyogoButton
      {...props}
      variant="ghost"
      labelColor={props.labelColor ?? "slate"}
    >
      {props.showSpinner && (
        <Spinner className="text-slate-700 dark:text-slate-200" />
      )}
      {props.children}
    </RyogoButton>
  )
}
