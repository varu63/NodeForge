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
    content: z
    .string()
    .min(1 , "Message content is required"),
    webhookUrl: z.string().min( 1,"Webhook URL is required")
});

export type SlackFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<SlackFormValues>;
}

export const SlackDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      content : defaultValues.content || "" ,
      webhookUrl: defaultValues.webhookUrl || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
       variableName: defaultValues.variableName || "",
      content : defaultValues.content || "" ,
      webhookUrl: defaultValues.webhookUrl || "",
      });
    }
  }, [open, defaultValues, form]);
  const watchVariableName = form.watch("variableName") || "Slack";

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Slack Configuration</DialogTitle>

          <DialogDescription>
            Configure the Slack webhook settings for this node.
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
                  placeholder="My Slack"
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
                  placeholder="https://slack.com/api/webhook/..."
                  aria-invalid={fieldState.invalid}
                />
               
                <FieldDescription>
                  Get this from Slack: Worksapck Settings →
                  Workflows → Webhooks
                </FieldDescription>
                <FieldDescription>
                  Make sure you hava "content" variable
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
          
          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
