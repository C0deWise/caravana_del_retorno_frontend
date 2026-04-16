import CurveShape from "@/ui/decorators/CurveShape";

export default function HeaderCurve() {
  return (
    <CurveShape
      className="absolute -bottom-15 left-0 w-full h-15"
      style={{ transform: "translateY(calc(4% - 5px)) translateX(-15px)" }}
      withShadow
    />
  );
}
