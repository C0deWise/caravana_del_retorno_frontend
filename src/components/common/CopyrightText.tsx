interface CopyrightTextProps {
  readonly className?: string;
}

export default function CopyrightText({ className }: CopyrightTextProps) {
  return (
    <div className={className}>
      © {new Date().getFullYear()} All rights reserved | Caravana del retorno,
      Florencia, Cauca | Made with love by C0deWise
    </div>
  );
}
