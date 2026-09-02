import { RyogoSmall, RyogoCaption } from "@/components/typography"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { CalendarIcon, Star } from "lucide-react"
import React, { Dispatch, SetStateAction } from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export function RyogoInput({
  name,
  label,
  placeholder,
  description,
  type,
  disabled,
  fadeLabel,
}: {
  name: string
  label: string
  placeholder: string
  description?: string
  type: React.HTMLInputTypeAttribute | undefined
  disabled?: boolean
  fadeLabel?: boolean
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="w-full relative">
          <FormLabel>
            <RyogoSmall
              weight="font-bold"
              color={disabled || fadeLabel ? "light" : "dark"}
            >
              {label}
            </RyogoSmall>
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              disabled={disabled ?? false}
            />
          </FormControl>
          {description && (
            <FormDescription>
              <RyogoCaption color="light">{description}</RyogoCaption>
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function RyogoOTPInput({
  name,
  label,
  description,
  disabled,
  fadeLabel,
}: {
  name: string
  label: string
  description?: string
  disabled?: boolean
  fadeLabel?: boolean
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="w-full relative">
          <FormLabel>
            <RyogoSmall
              weight="font-bold"
              color={disabled || fadeLabel ? "light" : "dark"}
            >
              {label}
            </RyogoSmall>
          </FormLabel>
          <FormControl>
            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          {description && (
            <FormDescription>
              <RyogoCaption color="light">{description}</RyogoCaption>
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function RyogoFileInput({
  name,
  label,
  placeholder,
  description,
  register,
  fadeLabel,
}: {
  name: string
  label: string
  placeholder: string
  description?: string
  register: UseFormRegisterReturn<string>
  fadeLabel?: boolean
}) {
  return (
    <FormField
      name={name}
      render={() => (
        <FormItem className="w-full relative">
          <FormLabel>
            <RyogoSmall weight="font-bold" color={fadeLabel ? "light" : "dark"}>
              {label}
            </RyogoSmall>
          </FormLabel>
          <FormControl>
            <Input {...register} type="file" placeholder={placeholder} />
          </FormControl>
          {description && (
            <FormDescription>
              <RyogoCaption color="light">{description}</RyogoCaption>
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function RyogoTextarea({
  name,
  label,
  placeholder,
  fadeLabel,
}: {
  name: string
  label: string
  placeholder: string
  fadeLabel?: boolean
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="w-full relative">
          <FormLabel>
            <RyogoSmall weight="font-bold" color={fadeLabel ? "light" : "dark"}>
              {label}
            </RyogoSmall>
          </FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function RyogoSelect({
  name,
  title,
  array,
  placeholder,
  description,
  register,
  resetField,
  fadeLabel,
}: {
  name: string
  title?: string
  array: { value: string; display: string }[]
  placeholder: string
  description?: string
  register: UseFormRegisterReturn<string>
  resetField?: () => void
  fadeLabel?: boolean
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="w-full relative">
          <FormLabel>
            <RyogoSmall weight="font-bold" color={fadeLabel ? "light" : "dark"}>
              {title}
            </RyogoSmall>
          </FormLabel>
          <Select
            {...register}
            onValueChange={(value) => {
              field.onChange(value)
              resetField && resetField()
            }}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {array.map((item, index) => (
                <SelectItem key={index} value={item.value}>
                  {item.display}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && (
            <FormDescription>
              <RyogoCaption color="light">{description}</RyogoCaption>
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function RyogoCombobox({
  name,
  title,
  array,
  placeholder,
  register,
  resetField,
  fadeLabel,
}: {
  name: string
  title?: string
  array: { value: string; display: string }[]
  placeholder: string
  register: UseFormRegisterReturn<string>
  resetField?: () => void
  fadeLabel?: boolean
}) {
  return (
    <FormField
      name={name}
      key={name}
      render={({ field }) => (
        <FormItem className="w-full relative">
          <FormLabel>
            <RyogoSmall weight="font-bold" color={fadeLabel ? "light" : "dark"}>
              {title}
            </RyogoSmall>
          </FormLabel>
          <Combobox
            items={array}
            itemToStringValue={(item: { value: string; display: string }) =>
              item.display
            }
            {...register}
            onValueChange={(value) => {
              field.onChange(value)
              resetField && resetField()
            }}
            value={field.value}
          >
            <ComboboxInput placeholder={placeholder} />
            <ComboboxContent>
              <ComboboxEmpty />
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.value} value={item.value}>
                    {item.display}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function RyogoRadio({
  name,
  title,
  array,
  register,
  defaultValue,
  description,
  fadeLabel,
}: {
  name: string
  title?: string
  array: { value: string; display: string }[]
  register: UseFormRegisterReturn<string>
  defaultValue: string
  description?: string
  fadeLabel?: boolean
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="w-full relative">
          <FormLabel>
            <RyogoSmall weight="font-bold" color={fadeLabel ? "light" : "dark"}>
              {title}
            </RyogoSmall>
          </FormLabel>
          <RadioGroup
            {...register}
            onValueChange={field.onChange}
            defaultValue={defaultValue}
          >
            {array.map((item, index) => (
              <div className="flex items-center gap-3" key={index}>
                <RadioGroupItem value={item.value} id={`r${index}`} />
                <Label htmlFor={`r${index}`}>{item.display}</Label>
              </div>
            ))}
          </RadioGroup>
          <FormDescription>
            <RyogoCaption color="light">{description}</RyogoCaption>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function RyogoCheckbox({
  name,
  label,
  fadeLabel,
}: {
  name: string
  label: string
  fadeLabel?: boolean
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex flex-row items-center gap-2 lg:gap-3 w-full px-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>
              <RyogoSmall
                weight="font-bold"
                color={fadeLabel ? "light" : "dark"}
              >
                {label}
              </RyogoSmall>
            </FormLabel>
          </FormItem>
        )
      }}
    />
  )
}

export function RyogoMultipleCheckbox({
  name,
  label,
  array,
  fadeLabel,
}: {
  name: string
  label: string
  array: { value: string; display: string }[]
  fadeLabel?: boolean
}) {
  return (
    <FormField
      name={name}
      render={() => (
        <FormItem className="flex flex-col gap-2 lg:gap-3 w-full">
          <FormLabel className="text-base">
            <RyogoSmall weight="font-bold" color={fadeLabel ? "light" : "dark"}>
              {label}
            </RyogoSmall>
          </FormLabel>
          {array.map((item) => (
            <FormField
              key={item.value}
              name={name}
              render={({ field }) => {
                return (
                  <FormItem
                    key={item.value}
                    className="flex flex-row items-end gap-2 lg:gap-3 w-full px-2"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value.includes(item.value)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item.value])
                            : field.onChange(
                                field.value.filter(
                                  (value: string) => value !== item.value,
                                ),
                              )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      <RyogoCaption color="slate">{item.display}</RyogoCaption>
                    </FormLabel>
                  </FormItem>
                )
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function RyogoDatePicker({
  name,
  label,
  placeholder,
  description,
  disabled,
  pastAllowed,
  fadeLabel,
}: {
  name: string
  label: string
  placeholder: string
  description?: string
  disabled?: boolean
  pastAllowed?: boolean
  fadeLabel?: boolean
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1 lg:gap-1.5 w-full">
          <FormLabel>
            <RyogoSmall
              weight="font-bold"
              color={disabled || fadeLabel ? "light" : "dark"}
            >
              {label}
            </RyogoSmall>
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild disabled={disabled}>
              <FormControl>
                <RyogoOutlineButton
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                  label={field.value ? format(field.value, "PPP") : placeholder}
                >
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </RyogoOutlineButton>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={
                  //If past allowed, disable dates before 2025, else disable dates before today
                  pastAllowed
                    ? { before: new Date(2025, 1, 1) }
                    : { before: new Date() }
                }
                timeZone="UTC"
                captionLayout="dropdown"
                reverseYears
                endMonth={new Date(2040, 0)}
              />
            </PopoverContent>
          </Popover>
          {description && (
            <FormDescription>
              <RyogoCaption color="light">{description}</RyogoCaption>
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function RyogoSwitch({
  name,
  label,
  fadeLabel,
}: {
  name: string
  label: string
  fadeLabel?: boolean
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between gap-2 lg:gap-3 w-full py-1.5 lg:py-2">
          <FormLabel>
            <RyogoSmall weight="font-bold" color={fadeLabel ? "light" : "dark"}>
              {label}
            </RyogoSmall>
          </FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export function RyogoTimePicker({
  name,
  label,
  description,
  fadeLabel,
}: {
  name: string
  label: string
  description?: string
  fadeLabel?: boolean
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1 lg:gap-1.5 w-full">
          <FormLabel>
            <RyogoSmall weight="font-bold" color={fadeLabel ? "light" : "dark"}>
              {label}
            </RyogoSmall>
          </FormLabel>
          <Input
            type="time"
            step="60"
            {...field}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
          <FormDescription>
            <RyogoCaption color="light">{description}</RyogoCaption>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function RyogoRatingInput({
  name,
  label,
  selectedStars,
  setSelectedStars,
  totalStars,
  disabled,
  fadeLabel,
}: {
  name: string
  label: string
  selectedStars: number
  setSelectedStars: Dispatch<SetStateAction<number>>
  totalStars: number
  disabled?: boolean
  fadeLabel?: boolean
}) {
  return (
    <FormField
      name={name}
      disabled={disabled}
      render={({}) => (
        <FormItem className="flex flex-row justify-between items-center gap-1 lg:gap-1.5 w-full">
          <FormLabel>
            <RyogoSmall
              weight="font-bold"
              color={disabled || fadeLabel ? "light" : "dark"}
            >
              {label}
            </RyogoSmall>
          </FormLabel>
          <div className="flex flex-row gap-2 lg:gap-3 items-center">
            {Array.from({ length: totalStars }).map((_, index) => {
              return (
                <RyogoIcon
                  key={index + 1}
                  icon={Star}
                  size="sm"
                  color={`${selectedStars > index ? "yellow" : "slate"}`}
                  onClick={
                    selectedStars !== index + 1
                      ? () => setSelectedStars(index + 1)
                      : () => setSelectedStars(0)
                  }
                />
              )
            })}
          </div>
        </FormItem>
      )}
    />
  )
}
