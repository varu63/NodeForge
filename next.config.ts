import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  /* config options here */
  async redirects(){
return[
  
  {
    source:"/",
    destination:"/workflow",
    permanent:false ,
  }
]
  },
  reactCompiler: true,
};

export default nextConfig;
