
import dynamic from "next/dist/shared/lib/dynamic";
import React from "react";

const GeneratedCode = dynamic(
  () =>
    import('@/features/generated-code').then((mod) => ({
      default: mod.GeneratedCode,
    })),
  {
    ssr: false,
  },
);
const page = () => {
  return (
    <GeneratedCode />
  );
};

export default page;
