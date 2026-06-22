
import { requireAuth } from "@/lib/auth-utils";

export default  async function Home() {
  await requireAuth();
  return(
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to the Home Page</h1>
    </div>
  )
}

