import CurveShape from "@/components/layout/CurveShape";

export default function FooterCurve() {
  return (
    <CurveShape
      className="absolute right-0 -top-3.5 sm:-top-6.5 md:-top-9.75 w-full h-4 sm:h-7 md:h-10 rotate-180 pointer-events-none"
      style={{ transform: "translateY(calc(4% - 5px)) translateX(-15px)" }}
    />
  );
}

