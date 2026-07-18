import type { NextConfig } from "next";
import { withReticle } from '@reticlehq/next';

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withReticle(nextConfig);
 