import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  devIndicators: false
  /* config options here */
};

export default withFlowbiteReact(nextConfig);