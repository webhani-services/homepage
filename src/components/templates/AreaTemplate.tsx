interface AreaTemplateProps {
  isEven: boolean;
  sectionId: string;
  children: React.ReactNode;
}

export default function AreaTemplate({
  isEven,
  sectionId,
  children,
}: AreaTemplateProps) {
  return (
    <section
      id={sectionId}
      className={(isEven ? "bg-blue-100" : "bg-rose-400") + " w-screen h-144"}
    >
      {children}
    </section>
  );
}
