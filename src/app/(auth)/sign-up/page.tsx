import SignUp from "@/features/auth/components/Sign-up";
import { requireUnAuth } from "@/lib/auth-utils";

export default async function Page() {
  await requireUnAuth();

  return <SignUp />;
}
