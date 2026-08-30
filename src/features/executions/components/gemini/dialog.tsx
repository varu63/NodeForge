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
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma";
import Image from "next/image";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variavle name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        " Variable name must start with a letter or underscore and container only letters , numbers, and underscores",
    }),
  credentialId: z.string().min(1, "Credential is required"),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
});

export type GeminiFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<GeminiFormValues>;
}

export const GeminiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const { data: credentials, isLoading: isLoadingCredentilas } =
    useCredentialsByType(CredentialType.GENINI);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      credentialId: defaultValues.credentialId || "",
      systemPrompt: defaultValues.systemPrompt || "",
      userPrompt: defaultValues.userPrompt || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        credentialId: defaultValues.credentialId || "",
        systemPrompt: defaultValues.systemPrompt || "",
        userPrompt: defaultValues.userPrompt || "",
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
          <DialogTitle>Gemini Configuration</DialogTitle>

          <DialogDescription>
            Configure the AI model and prompts form this node.
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
                  placeholder="My api call"
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
          {/* Credentials*/}
          <Controller
            control={form.control}
            name="credentialId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Credentials</FieldLabel>

                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoadingCredentilas}
                >
                  <SelectTrigger
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select a Credential">
                      {
                        credentials?.find(
                          (credential) => credential.id === field.value,
                        )?.name
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {credentials?.map((credential) => (
                      <SelectItem key={credential.id} value={credential.id}>
                        <div className="flex items-center gap-2">
                          <Image
                            src="/gemini.svg"
                            alt="Gemini"
                            width={16}
                            height={16}
                          />
                          {credential.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>Select the credentials</FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* System Prompt*/}

          <Controller
            control={form.control}
            name="systemPrompt"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  System Prompt (Optional)
                </FieldLabel>

                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="You ara a helpful assistant"
                  aria-invalid={fieldState.invalid}
                  className="min-h-22 font-mono"
                />

                <FieldDescription>
                  Sets the behavior of the assistant. use{"{{variables}}"}for
                  simple values or{"{{json variable}}"} to stringify objects
                </FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* User Prompt*/}

          <Controller
            control={form.control}
            name="userPrompt"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>User Prompt</FieldLabel>

                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Summarize this text: {{json httpResponse.data}}"
                  aria-invalid={fieldState.invalid}
                  className="min-h-22 font-mono"
                />

                <FieldDescription>
                  The prompt to send to the Ai. Use{"{{variables}}"}for simple
                  values or{"{{json variable}}"} to stringify objects
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
