import Link from "next/link"
import Image from "next/image"
const Layout = ({children}:{children:React.ReactNode})=>{
    return (
       <div className="bg-muted min-h-svh flex flex-col justify-center gap-6 p-6 md:p-10 items-center">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
        <Image
          src="/logo.svg"
          alt="NodeFroge Logo"
          width={32}
          height={32}
          priority
        />
        <span className="text-xl font-bold">NodeFroge</span>
      </Link>
      {children}

      </div>

    </div> 
    )
}
export default Layout