'use client';

import { useLoginStore } from "@/stores/login";

const page = () => {
  const { loginInfo } = useLoginStore();
  return loginInfo?.accessToken ? <div className="h-full w-full overflow-hidden">
    <iframe src={`/tools/url-analyzer/index.html?accessToken=${loginInfo.accessToken}`} className="h-full w-full" />
  </div> : null;
};

export default page;
