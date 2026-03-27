"use client";
import dynamic from "next/dynamic";

const RoleSwitcher = dynamic(() => import("./RoleSwitcher-DEVTOOL"), {
  ssr: false,
});

export function RoleSwitcherClient() {
  return <RoleSwitcher />;
}
