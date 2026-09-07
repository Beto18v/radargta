interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-col items-center gap-4 text-center">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="font-display text-4xl uppercase leading-none tracking-tight text-mist sm:text-5xl">
        {title}
      </h2>
      {description ? <p className="max-w-2xl text-muted">{description}</p> : null}
    </div>
  );
}