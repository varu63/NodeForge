import SignIn from '@/features/auth/components/Sign-in'
import { requireUnAuth } from "@/lib/auth-utils";
const page = async() => {
  await requireUnAuth();
  return (
      <SignIn/>
  )
}

export default page
