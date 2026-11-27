import CurveShape from "@/components/layout/CurveShape";

export default function HeaderCurve() {
  return (
    <CurveShape
      className="absolute -bottom-4.5 sm:-bottom-7.5 md:-bottom-11.75 -left-1 w-full h-5 sm:h-8 md:h-12 pointer-events-none"
      style={{ transform: "translateY(calc(4% - 5px)) translateX(-15px)" }}
      withShadow
    />
  );
}

