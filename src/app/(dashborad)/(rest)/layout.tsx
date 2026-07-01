import { AppHeader } from "@/components/app-header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>
  <AppHeader/>
  {children}</>;
};

export default Layout;
