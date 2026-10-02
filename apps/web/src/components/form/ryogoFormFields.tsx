import { RyogoCaption } from "@/components/typography"
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
import { CalendarIcon, Star, ThumbsDown, ThumbsUp } from "lucide-react"
import React, { Dispatch, SetStateAction } from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import { getLangDisplay } from "@/lib/utils"
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
import { UserLangEnum } from "@ryogo-travel-app/db/schema"

export function RyogoInput({
  name,
  label,
  placeholder,
  description,
  type,
  disabled,
}: {
  name: string
  label: string
  placeholder: string
  description?: string
  type: React.HTMLInputTypeAttribute | undefined
  disabled?: boolean
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="w-full relative">
          <FormLabel>
            <RyogoCaption
              weight="font-bold"
              color={disabled ? "light" : "dark"}
            >
              {label}
            </RyogoCaption>
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
}: {
  name: string
  label: string
  description?: string
  disabled?: boolean
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="w-full relative">
          <FormLabel>
            <RyogoCaption
              weight="font-bold"
              color={disabled ? "light" : "dark"}
            >
              {label}
            </RyogoCaption>
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
}: {
  name: string
  label: string
  placeholder: string
  description?: string
  register: UseFormRegisterReturn<string>
}) {
  return (
    <FormField
      name={name}
      render={() => (
        <FormItem className="w-full relative">
          <FormLabel>
            <RyogoCaption weight="font-bold" color={"dark"}>
              {label}
            </RyogoCaption>
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
}: {
  name: string
  label: string
  placeholder: string
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="w-full relative">
          <FormLabel>
            <RyogoCaption weight="font-bold" color={"dark"}>
              {label}
            </RyogoCaption>
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
  translateLang,
}: {
  name: string
  title?: string
  array: string[]
  placeholder: string
  description?: string
  register: UseFormRegisterReturn<string>
  resetField?: () => void
  translateLang?: boolean
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="w-full relative">
          <FormLabel>
            <RyogoCaption weight="font-bold" color={"dark"}>
              {title}
            </RyogoCaption>
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
              {array.map((item) => (
                <SelectItem key={item} value={item}>
                  <RyogoCaption color="slate">
                    {translateLang
                      ? getLangDisplay(item as UserLangEnum)
                      : item}
                  </RyogoCaption>
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
}: {
  name: string
  title?: string
  array: string[]
  placeholder: string
  register: UseFormRegisterReturn<string>
  resetField?: () => void
}) {
  return (
    <FormField
      name={name}
      key={name}
      render={({ field }) => (
        <FormItem className="w-full relative">
          <FormLabel>
            <RyogoCaption weight="font-bold" color={"dark"}>
              {title}
            </RyogoCaption>
          </FormLabel>
          <Combobox
            items={array}
            itemToStringValue={(item: string) => item}
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
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
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
}: {
  name: string
  title?: string
  array: string[]
  register: UseFormRegisterReturn<string>
  defaultValue: string
  description?: string
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="w-full relative">
          <FormLabel>
            <RyogoCaption weight="font-bold" color={"dark"}>
              {title}
            </RyogoCaption>
          </FormLabel>
          <RadioGroup
            {...register}
            onValueChange={field.onChange}
            defaultValue={defaultValue}
          >
            {array.map((item) => (
              <div className="flex items-center gap-3" key={item}>
                <RadioGroupItem value={item} id={item} />
                <Label htmlFor={item}>{item}</Label>
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
}: {
  name: string
  label: string
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
              <RyogoCaption weight="font-bold" color={"dark"}>
                {label}
              </RyogoCaption>
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
}: {
  name: string
  label: string
  array: string[]
}) {
  return (
    <FormField
      name={name}
      render={() => (
        <FormItem className="flex flex-col gap-2 lg:gap-3 w-full">
          <FormLabel>
            <RyogoCaption weight="font-bold" color={"dark"}>
              {label}
            </RyogoCaption>
          </FormLabel>
          {array.map((item) => (
            <FormField
              key={item}
              name={name}
              render={({ field }) => {
                return (
                  <FormItem
                    key={item}
                    className="flex flex-row items-end gap-2 lg:gap-3 w-full px-2"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value.includes(item)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item])
                            : field.onChange(
                                field.value.filter(
                                  (value: string) => value !== item,
                                ),
                              )
                        }}
                      />
                    </FormControl>
                    <FormLabel>
                      <RyogoCaption color="slate">{item}</RyogoCaption>
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
}: {
  name: string
  label: string
  placeholder: string
  description?: string
  disabled?: boolean
  pastAllowed?: boolean
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1.5 lg:gap-2 w-full">
          <FormLabel>
            <RyogoCaption
              weight="font-bold"
              color={disabled ? "light" : "dark"}
            >
              {label}
            </RyogoCaption>
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild disabled={disabled}>
              <FormControl>
                <RyogoOutlineButton
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

export function RyogoSwitch({ name, label }: { name: string; label: string }) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between gap-2 lg:gap-3 w-full py-1.5 lg:py-2">
          <FormLabel>
            <RyogoCaption weight="font-bold" color={"dark"}>
              {label}
            </RyogoCaption>
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
}: {
  name: string
  label: string
  description?: string
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1 lg:gap-1.5 w-full">
          <FormLabel>
            <RyogoCaption weight="font-bold" color={"dark"}>
              {label}
            </RyogoCaption>
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
}: {
  name: string
  label: string
  selectedStars: number
  setSelectedStars: Dispatch<SetStateAction<number>>
  totalStars: number
  disabled?: boolean
}) {
  return (
    <FormField
      name={name}
      disabled={disabled}
      render={({}) => (
        <FormItem className="flex flex-row justify-between items-center gap-1 lg:gap-1.5 w-full">
          <FormLabel>
            <RyogoCaption
              weight="font-bold"
              color={disabled ? "light" : "dark"}
            >
              {label}
            </RyogoCaption>
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
                  thick={selectedStars > index}
                />
              )
            })}
          </div>
        </FormItem>
      )}
    />
  )
}

export function RyogoThumbsInput({
  name,
  label,
  isLiked,
  setIsLiked,
  disabled,
}: {
  name: string
  label: string
  isLiked: boolean | null
  setIsLiked: Dispatch<SetStateAction<boolean | null>>
  disabled?: boolean
}) {
  return (
    <FormField
      name={name}
      disabled={disabled}
      render={({}) => (
        <FormItem className="flex flex-col justify-between items-center gap-2 lg:gap-3 w-full my-3 lg:my-4">
          <FormLabel>
            <RyogoCaption
              weight="font-bold"
              color={disabled ? "light" : "dark"}
              className="text-center"
            >
              {label}
            </RyogoCaption>
          </FormLabel>
          <div className="flex flex-row gap-2 lg:gap-3 items-center justify-center">
            <RyogoIcon
              icon={ThumbsDown}
              size="md"
              color={`${isLiked === false ? "red" : "slate"}`}
              onClick={() => setIsLiked(isLiked === false ? null : false)}
              thick={isLiked === false}
              className="mt-2 lg:mt-3"
            />
            <RyogoIcon
              icon={ThumbsUp}
              size="md"
              color={`${isLiked === true ? "green" : "slate"}`}
              onClick={() => setIsLiked(isLiked === true ? null : true)}
              thick={isLiked === true}
            />
          </div>
        </FormItem>
      )}
    />
  )
}
