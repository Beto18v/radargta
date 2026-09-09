interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div data-reveal className="mb-10 flex flex-col items-center gap-4 text-center">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="heading-sweep text-vice-gradient font-display text-4xl uppercase leading-none tracking-wide sm:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl leading-relaxed text-muted">{description}</p>
      ) : null}
    </div>
  );
}
