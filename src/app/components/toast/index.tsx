'use client'

import { useGlobalComponentsStore } from "@/stores/global-components";
import { Toast, ToastToggle } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

export function GlobalToast() {
  const { toast, closeToast } = useGlobalComponentsStore();

  return toast ? (
    <div className="fixed w-screen h-screen top-0 left-0 flex justify-center z-50">
      <Toast className="absolute top-[50px]">
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
        {toast.type === "error" ? (
          <HiExclamation className="h-5 w-5" />
        ) : toast.type === "warn" ? (
          <HiX className="h-5 w-5" />
        ) : (
          <HiCheck className="h-5 w-5" />
        )}
      </div>
      <div className="ml-3 text-sm font-normal">{toast.message}</div>
      <ToastToggle onDismiss={() => closeToast()} />
    </Toast>
    </div>
  ) : null;
}
