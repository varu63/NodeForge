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
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useEffect } from "react";



const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variavle name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        " Variable name must start with a letter or underscore and container only letters , numbers, and underscores",
    }),
    username: z.string().optional(),
    content: z
    .string()
    .min(1 , "Message content is required")
    .max(2000 , "Discord messages cannot exceed 2000 chareacters"),
    webhookUrl: z.string().min( 1,"Webhook URL is required")
});

export type DiscordFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<DiscordFormValues>;
}

export const DiscordDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      username: defaultValues.username || "",
      content : defaultValues.content || "" ,
      webhookUrl: defaultValues.webhookUrl || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
       variableName: defaultValues.variableName || "",
      username: defaultValues.username || "",
      content : defaultValues.content || "" ,
      webhookUrl: defaultValues.webhookUrl || "",
      });
    }
  }, [open, defaultValues, form]);
  const watchVariableName = form.watch("variableName") || "myApiCall";

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Discord Configuration</DialogTitle>

          <DialogDescription>
            Configure the Discord webhook settings for this node.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* variable name */}
          <Controller
            control={form.control}
            name="variableName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Variable Name</FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  placeholder="My Discord"
                  aria-invalid={fieldState.invalid}
                />

                <FieldDescription>
                  Use this name to reference the result in other nodes:{" "}
                  {`{{${watchVariableName}.text}}`}
                </FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          
          {/* Webhook URL*/}
          <Controller
            control={form.control}
            name="webhookUrl"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Webhook URL </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="https://discord.com/api/webhook/..."
                  aria-invalid={fieldState.invalid}
                />
               
                <FieldDescription>
                  Get this from Discord: Channel Settings →
                  Integrations → Webhooks
                </FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Content*/}

          <Controller
            control={form.control}
            name="content"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Message Content
                </FieldLabel>

                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Summary : {{mygemini , text}}"
                  aria-invalid={fieldState.invalid}
                  className="min-h-22 font-mono"
                />

                <FieldDescription>
                  This message to send.Use{"{{variables}}"}for
                  simple values or{"{{json variable}}"} to stringify objects
                </FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* username*/}
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Bot Username (Optional) </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Workflow Bot"
                  aria-invalid={fieldState.invalid}
                />
               
                <FieldDescription>
                  Override the webhook's default username
                </FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
