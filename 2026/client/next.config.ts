import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disabled because the Krmx client is a module-level singleton with
  // imperative connect()/link() semantics — Strict Mode's dev-only double
  // mount/effect-invocation causes a spurious WebSocket open-then-close pair
  // on every component mount, polluting server logs. Production builds are
  // unaffected (Strict Mode's double-invoke only runs in dev anyway).
  // reactStrictMode: false,
};

export default nextConfig;
