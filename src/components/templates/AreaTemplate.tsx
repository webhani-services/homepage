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
      className={
        (isEven ? "bg-rose-400" : "bg-white") + " w-screen h-auto px-5"
      }
    >
      {children}
    </section>
  );
}
