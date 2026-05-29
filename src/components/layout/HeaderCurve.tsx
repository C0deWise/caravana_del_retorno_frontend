import CurveShape from "@/components/layout/CurveShape";

export default function HeaderCurve() {
  return (
    <CurveShape
      className="absolute -bottom-11.75 -left-1 w-full h-12"
      style={{ transform: "translateY(calc(4% - 5px)) translateX(-15px)" }}
      withShadow
    />
  );
}

