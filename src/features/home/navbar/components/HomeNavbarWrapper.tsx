// "use client";

//import { Suspense } from "react";
import HomeNavbar from "./HomeNavbar";
//import NavbarSkeleton from "../skeletons/NavbarSkeleton";

export default function HomeNavbarWrapper() {
  return (
    // <Suspense fallback={<NavbarSkeleton />}>
    <div className="h-full">
      <HomeNavbar />
    </div>
    // </Suspense>
  );
}
