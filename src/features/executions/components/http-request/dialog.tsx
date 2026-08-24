"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Controller, useForm } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useEffect } from "react";

const formSchema = z.object({
  variableName : z.string().min(1,{message: "Variavle name is required"})
  .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/,{
    message:" Variable name must start with a letter or underscore and container only letters , numbers, and underscores"
  }),
  endpoint: z.string().min(1,({
    message: "Please enter the valid URL",
  })),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
});


export type HttpRequestFormValues= z.infer<typeof formSchema>

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<HttpRequestFormValues>
}

export const HTTPRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues ={}
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      endpoint: defaultValues.endpoint || "",
      method: defaultValues.method || "GET",
      body: defaultValues.body || "",
    },
  });

  useEffect(() => {
  if (open) {
    form.reset({
      variableName: defaultValues.variableName || "",
      endpoint: defaultValues.endpoint || "",
      method: defaultValues.method || "GET",
      body: defaultValues.body || "",
    });
  }
}, [
  open,
  defaultValues,
  form,
]);
  const watchVariableName = form.watch("variableName")|| "myApiCall"
  const watchMethod = form.watch("method");

  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>

          <DialogDescription>
            Configure settings for the HTTP Request node
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          {/* variable name */}
          <Controller
            control={form.control}
            name="variableName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Variable Name
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  placeholder="My api call"
                  aria-invalid={fieldState.invalid}
                />

                <FieldDescription>
                  Use this name to reference the result in other nodes:{' '}
                  {`{{${watchVariableName}.httpResponse.data}}`}
                </FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Method */}
          <Controller
            control={form.control}
            name="method"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Method
                </FieldLabel>

                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>

                <FieldDescription>
                  The HTTP method to use for this request
                </FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Endpoint */}
          <Controller
            control={form.control}
            name="endpoint"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Endpoint URL
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="url"
                  placeholder="https://api.example.com/users"
                  aria-invalid={fieldState.invalid}
                />

                <FieldDescription>
                  Static URL or use {"{{variables}}"} for simple values or{" "}
                  {"{{json variable}}"} to stringify objects
                </FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Request Body */}
          {showBodyField && (
            <Controller
              control={form.control}
              name="body"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Request Body
                  </FieldLabel>

                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder='
                    {"key": "value",
                    "userId" : "{{httpResponse.data.id}}",
                    "name" : "{{httpResponse.data.name}},

                    }
                    '
                    aria-invalid={fieldState.invalid}
                    className="min-h-32 font-mono"
                  />

                  <FieldDescription>
                    Enter the JSON payload that will be sent with the request.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};