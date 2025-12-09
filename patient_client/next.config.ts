import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname // корень именно этой директории
  },
  devIndicators: false,
  /* config options here */
  images: {
    remotePatterns: [new URL('https://clinicode.ru:8443/**'), new URL("https://prodoctorov.ru/**")],
  },
};

export default withFlowbiteReact(nextConfig);