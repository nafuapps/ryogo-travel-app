import {
  RyogoCaption,
  RyogoSmall,
  RyogoTextColorType,
} from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type RyogoButtonType = React.ComponentProps<"button"> & {
  label: string
  size?: "default" | "lg"
  variant?: "white" | "brand" | "default" | "destructive" | "outline" | "ghost"
  labelColor?: RyogoTextColorType
  labelClassName?: string
  showSpinner?: boolean
  children?: React.ReactNode
}

export function RyogoButton(props: RyogoButtonType) {
  return (
    <Button {...props}>
      {props.size === "lg" ? (
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
      )}
      {props.children}
    </Button>
  )
}

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

export function RyogoDesctructiveButton(props: RyogoButtonType) {
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
      labelColor={props.labelColor ?? "light"}
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
