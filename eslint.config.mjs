import nextVitals from "eslint-config-next/core-web-vitals";

export default [
  {
    ignores: ["convex/**", "src/convex/_generated/**"],
  },
  ...nextVitals,
];
