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
      className={(isEven ? "bg-white" : "bg-rose-400") + " w-screen h-144 px-5"}
    >
      {children}
    </section>
  );
}
