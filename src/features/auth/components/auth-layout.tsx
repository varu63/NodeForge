import Image from "next/image";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <Image
            src="/logo.svg"
            alt="NodeForge Logo"
            width={32}
            height={32}
            priority
          />
          <span className="text-xl font-bold">NodeForge</span>
        </Link>
        {children}
      </div>
    </div>
  );
};

export default Layout;
