"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { CredentialType } from "@/generated/prisma";
import {
  useCreateCredentials,
  useSupenseCredential,
  useUpdateCredential,
} from "../hooks/use-credentials";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(CredentialType),
  value: z.string().min(1, "API key is required"),
});

type FormValues = z.infer<typeof formSchema>;

const credentialTypeOptions = [
  {
    value: CredentialType.GENINI,
    label: "Gemini",
    logo: "/gemini.svg",
  },
  {
    value: CredentialType.OPENAI,
    label: "OpenAI",
    logo: "/openai.svg",
  },
];

interface CredentialFormProps {
  initialData?: {
    id?: string;
    name: string;
    type: CredentialType;
    value: string;
  };
}

export const CredentialForm = ({ initialData }: CredentialFormProps) => {
  const router = useRouter();
  const { handleError } = useUpgradeModal();

  const createCredential = useCreateCredentials();
  const updateCredential = useUpdateCredential();

  const isEdit = !!initialData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      type: initialData?.type ?? CredentialType.GENINI,
      value: initialData?.value ?? "",
    },
  });

  const isPending =
    form.formState.isSubmitting ||
    createCredential.isPending ||
    updateCredential.isPending;

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit && initialData?.id) {
        await updateCredential.mutateAsync({
          id: initialData.id,
          ...values,
        });
      } else {
        await createCredential.mutateAsync(values, {
          onSuccess: (data) => {
            router.push(`/credentials/${data.id}`);
          },
          onError: handleError,
        });
      }

      router.push("/credentials");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>
          {isEdit ? "Edit Credential" : "Create Credential"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? "Update your API key or credential details"
            : "Add a new API key or credential to your account"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel htmlFor="name">Name</FieldLabel>

            <FieldContent>
              <Input
                className="border-2px"
                id="name"
                placeholder="My Gemini API Key"
                {...form.register("name")}
              />

              <FieldDescription>
                Give this credential a recognizable name.
              </FieldDescription>

              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </FieldContent>
          </Field>

          {/* AI Model */}
          <Field data-invalid={!!form.formState.errors.type}>
            <FieldLabel htmlFor="type">AI Model</FieldLabel>

            <FieldContent>
              <Controller
                name="type"
                control={form.control}
                render={({ field }) => {
                  const selected = credentialTypeOptions.find(
                    (option) => option.value === field.value,
                  );

                  return (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="type" className="w-full">
                        {selected ? (
                          <div className="flex items-center gap-2">
                            <Image
                              src={selected.logo}
                              alt={selected.label}
                              width={20}
                              height={20}
                              className="size-5 object-contain"
                            />
                            <span>{selected.label}</span>
                          </div>
                        ) : (
                          "Select an AI model"
                        )}
                      </SelectTrigger>

                      <SelectContent>
                        {credentialTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Image
                                src={option.logo}
                                alt={option.label}
                                width={20}
                                height={20}
                                className="size-5 object-contain"
                              />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />

              <FieldDescription>
                Select the AI provider for this credential.
              </FieldDescription>

              <FieldError>{form.formState.errors.type?.message}</FieldError>
            </FieldContent>
          </Field>

          {/* API Key */}
          <Field data-invalid={!!form.formState.errors.value}>
            <FieldLabel htmlFor="value">API Key</FieldLabel>

            <FieldContent>
              <Input
                className="border-2px"
                id="value"
                type="password"
                placeholder="Enter your API key"
                {...form.register("value")}
              />

              <FieldDescription>
                Your API key will be securely stored and used to authenticate
                requests.
              </FieldDescription>

              <FieldError>{form.formState.errors.value?.message}</FieldError>
            </FieldContent>
          </Field>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/credentials")}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Save Credential"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
  const { data: credential } = useSupenseCredential(credentialId);

  return <CredentialForm initialData={credential} />;
};
