interface ReaderViewProps {
  title: string;
  contentHtml: string;
}

export default function ReaderView({ title, contentHtml }: ReaderViewProps) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-6 pb-24">
      <header className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy dark:text-text-heading-dark leading-tight break-words">
          {title}
        </h1>
      </header>
      
      {/* 
        Tailwind Typography (`prose`) automatically styles raw HTML (headings, paragraphs, lists, etc.).
        We use `dark:prose-invert` for dark mode compatibility and explicitly theme links and blockquotes.
      */}
      <div 
        className="prose prose-base md:prose-lg dark:prose-invert max-w-none prose-headings:text-navy dark:prose-headings:text-text-heading-dark prose-headings:break-words prose-a:text-gold dark:prose-a:text-gold-light hover:prose-a:text-gold-dark prose-blockquote:border-l-gold"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
}
