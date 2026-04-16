import CurveShape from "@/ui/decorators/CurveShape";

export default function FooterCurve() {
  return (
    <CurveShape
      className="absolute right-0 -top-[39px] w-full h-10 rotate-180 pointer-events-none"
      style={{ transform: "translateY(calc(4% - 5px)) translateX(-15px)" }}
    />
  );
}
