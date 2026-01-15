
import dynamic from "next/dynamic";

import React from "react";

const GeneratedChart = dynamic(
  () =>
    import('@/features/generated-chart').then((mod) => ({
      default: mod.GeneratedChart,
    })),
  {
    ssr: false,
  },
);
const page = () => {
  return (
    <GeneratedChart />
  );
};

export default page;
