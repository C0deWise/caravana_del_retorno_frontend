export default function HorizontalSeparator({ className = "" }: { className?: string }) {
  return (
    <div className={`flex w-full h-full ${className}`}>
      <div className="flex-1 bg-[#f28f38]"></div>
      <div className="flex-1 bg-[#038c4a]"></div>
      <div className="flex-1 bg-[#eabe03]"></div>
      <div className="flex-1 bg-[#ec1e25]"></div>
    </div>
  );
}
