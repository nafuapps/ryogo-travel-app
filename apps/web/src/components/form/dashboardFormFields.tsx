import { PBold, CaptionGrey, Caption, PGrey } from "@/components/typography";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";

type DashboardInputProps = {
  name: string;
  label: string;
  placeholder: string;
  description?: string;
  type: React.HTMLInputTypeAttribute | undefined;
  disabled?: boolean;
};

export function DashboardInput(props: DashboardInputProps) {
  return (
    <FormField
      name={props.name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>
            {props.disabled ? (
              <PGrey>{props.label}</PGrey>
            ) : (
              <PBold>{props.label}</PBold>
            )}
          </FormLabel>
          <FormControl>
            <Input
              type={props.type}
              placeholder={props.placeholder}
              {...field}
              disabled={props.disabled ?? false}
            />
          </FormControl>
          {props.description && (
            <FormDescription>
              <CaptionGrey>{props.description}</CaptionGrey>
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type DashboardFileInputProps = {
  name: string;
  label: string;
  placeholder: string;
  description: string;
  register: UseFormRegisterReturn<string>;
};
export function DashboardFileInput(props: DashboardFileInputProps) {
  return (
    <FormField
      name={props.name}
      render={() => (
        <FormItem className="w-full">
          <FormLabel>
            <PBold>{props.label}</PBold>
          </FormLabel>
          <FormControl>
            <Input
              {...props.register}
              type="file"
              placeholder={props.placeholder}
            />
          </FormControl>
          <FormDescription>
            <CaptionGrey>{props.description}</CaptionGrey>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type DashboardTextareaProps = {
  name: string;
  label: string;
  placeholder: string;
};

export function DashboardTextarea(props: DashboardTextareaProps) {
  return (
    <FormField
      name={props.name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>
            <PBold>{props.label}</PBold>
          </FormLabel>
          <FormControl>
            <Textarea placeholder={props.placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type DashboardSelectProps = {
  name: string;
  title?: string;
  array: string[] | undefined;
  placeholder: string;
  register: UseFormRegisterReturn<string>;
};
export function DashboardSelect(props: DashboardSelectProps) {
  return (
    <FormField
      name={props.name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>
            <PBold>{props.title}</PBold>
          </FormLabel>
          <Select
            {...props.register}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {props.array!.map((item, index) => (
                <SelectItem key={index} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type DashboardCheckboxProps = {
  name: string;
  label: string;
  register: UseFormRegisterReturn<string>;
};
export function DashboardCheckbox(props: DashboardCheckboxProps) {
  return (
    <FormField
      name={props.name}
      render={({ field }) => {
        return (
          <FormItem className="flex flex-row items-end gap-2 lg:gap-3 w-full px-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>
              <Caption>{props.label}</Caption>
            </FormLabel>
          </FormItem>
        );
      }}
    />
  );
}

type DashboardMultipleCheckboxProps = {
  name: string;
  label: string;
  array: string[] | undefined;
  register: UseFormRegisterReturn<string>;
};
export function DashboardMultipleCheckbox(
  props: DashboardMultipleCheckboxProps
) {
  return (
    <FormField
      name={props.name}
      render={() => (
        <FormItem className="flex flex-col gap-2 lg:gap-3 w-full">
          <FormLabel className="text-base">
            <PBold>{props.label}</PBold>
          </FormLabel>
          {props.array!.map((item) => (
            <FormField
              key={item}
              name={props.name}
              render={({ field }) => {
                return (
                  <FormItem
                    key={item}
                    className="flex flex-row items-end gap-2 lg:gap-3 w-full px-2"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item])
                            : field.onChange(
                                field.value?.filter(
                                  (value: string) => value !== item
                                )
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      <Caption>{item}</Caption>
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type DashboardDatePickerProps = {
  name: string;
  label: string;
  placeholder: string;
  description?: string;
  disabled?: boolean;
};
export function DashboardDatePicker(props: DashboardDatePickerProps) {
  return (
    <FormField
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1 lg:gap-1.5 w-full">
          <FormLabel>
            {props.disabled ? (
              <PGrey>{props.label}</PGrey>
            ) : (
              <PBold>{props.label}</PBold>
            )}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild disabled={props.disabled}>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>{props.placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date()}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
          <FormDescription>
            <Caption>{props.description}</Caption>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type DashboardSwitchProps = {
  name: string;
  label: string;
};
export function DashboardSwitch(props: DashboardSwitchProps) {
  return (
    <FormField
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between gap-2 lg:gap-3 w-full py-1.5 lg:py-2">
          <FormLabel>
            <PBold>{props.label}</PBold>
          </FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
