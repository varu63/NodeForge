"use client";
import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
  EmptyView,
  EntityList,
  EntityItem,
} from "@/components/entity-components";
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { CredentialType } from "@/generated/prisma";
import { Credential } from "@/generated/prisma";
import { formatDistanceToNow } from "date-fns";
import {
  useRemoveCredentials,
  useSupspenseCredentials,
} from "../hooks/use-credentials";
import Image from "next/image"

export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Credentials"
    />
  );
};

export const Credentialslist = () => {
  const credentials = useSupspenseCredentials();
  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialsItem data={credential} />}
      emptyView={<CredentialsEmpty />}
    />
  );
};

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <>
      <EntityHeader
        title="Credentials"
        description="Manage your credentials"
        newButtonHref="/credentials/new"
        newButtonLabel="New Credentials"
        disabled={disabled}
      />
    </>
  );
};
export const CredentialsPagination = () => {
  const credentials = useSupspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntityPagination
      page={credentials.data.page}
      totalPage={credentials.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
      disabled={credentials.isFetching}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader disabled={false} />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoading = () => {
  return <LoadingView message="Loading credential...." />;
};

export const CredentialsError = () => {
  return <ErrorView message="Error loading credentials.." />;
};

export const CredentialsEmpty = () => {
  const router = useRouter();

  const handelCreate = () => {
    router.push(`/credentials/new}`);
  };
  return (
    <EmptyView
      onNew={handelCreate}
      message="You haven't created any credential yet, Get started by
    creating your first credential"
    />
  );
};
const credentialsLogos: Record<CredentialType , string> ={
  [CredentialType.OPENAI]:"/openai.svg",
  [CredentialType.GENINI]:"/gemini.svg",
[CredentialType.ANTHROPIC]:"/anthropic.svg"
}

export const CredentialsItem = ({ data }: { data: Credential }) => {
  const removeCredential = useRemoveCredentials();
  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
  };
  const logo = credentialsLogos[data.type] || "/gemini.svg"

  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Update {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <Image src={logo} alt ={data.type} width={20} height={20}/>
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};
