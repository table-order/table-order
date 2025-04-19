interface FooterInfoProps {
  label: string;
  children: React.ReactNode;
}

export default function FooterInfo({ label, children }: FooterInfoProps) {
  return (
    <div className="flex flex-col text-tossgray-600">
      <span className="font-medium">{label}</span>
      <span className="font-normal">{children}</span>
    </div>
  );
}
