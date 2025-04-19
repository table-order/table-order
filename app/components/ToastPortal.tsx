"use client";

import { useToastStore } from "../store/toastStore";
import Toast from "./Toast";

export default function ToastPortal() {
  const toast = useToastStore((state) => state.toast);

  if (!toast) return null; // toast가 없으면 렌더링 안함

  return <Toast type={toast.type} message={toast.message} />; // toast UI 렌더링
}
