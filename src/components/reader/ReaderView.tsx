import { useEffect, useRef } from 'react';

interface ReaderViewProps {
  title: string;
  contentHtml: string;
  searchQuery?: string;
  searchKey?: string;
}

export default function ReaderView({ title, contentHtml, searchQuery, searchKey }: ReaderViewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!searchQuery || !contentRef.current) return;

    const lowerQuery = searchQuery.toLowerCase();
    
    // Create a TreeWalker to safely find Text Nodes containing the query
    // Wrap in a double requestAnimationFrame to ensure the DOM is fully painted
    // before we try to walk it and measure for scrolling.
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!contentRef.current) return;

        const treeWalker = document.createTreeWalker(
          contentRef.current,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              if (node.nodeValue?.toLowerCase().includes(lowerQuery)) {
                // Ignore text nodes already inside a mark (to prevent nested highlights)
                if (node.parentElement?.tagName === 'MARK') return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
              }
              return NodeFilter.FILTER_REJECT;
            }
          }
        );

        const firstNode = treeWalker.nextNode() as Text;
        if (!firstNode) return;

        // Found a text node containing the exact query. Split it safely.
        const matchIndex = firstNode.nodeValue!.toLowerCase().indexOf(lowerQuery);
        
        // Split node before match
        const matchNode = firstNode.splitText(matchIndex);
        // Split node after match
        matchNode.splitText(searchQuery.length);

        // Now matchNode contains exactly the matched string. Wrap it in a <mark>
        const mark = document.createElement('mark');
        mark.id = 'transient-match';
        // Initial active state classes
        mark.className = 'bg-gold-light text-navy transition-colors duration-1000 ease-in-out rounded-sm';
        
        matchNode.parentNode?.insertBefore(mark, matchNode);
        mark.appendChild(matchNode);

        // Smooth scroll into view slightly delayed to ensure DOM is settled
        setTimeout(() => {
          mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        // 2500ms fade-out effect by stripping the active colors
        fadeTimerRef.current = setTimeout(() => {
          mark.classList.remove('bg-gold-light', 'text-navy');
          mark.classList.add('bg-transparent', 'text-inherit');
        }, 2500);
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      // DOM cleanup ONLY — do NOT clearTimeout(fadeTimerRef.current)
      
      // Properly restore the DOM to its original state before unmount or next effect
      const existingHighlight = contentRef.current?.querySelector('#transient-match');
      if (existingHighlight) {
        const parent = existingHighlight.parentNode;
        while (existingHighlight.firstChild) {
          parent?.insertBefore(existingHighlight.firstChild, existingHighlight);
        }
        parent?.removeChild(existingHighlight);
        parent?.normalize(); // Merges split TextNodes back together
      }
    };
  }, [searchQuery, searchKey, contentHtml]);

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
        ref={contentRef}
        className="prose prose-base md:prose-lg dark:prose-invert max-w-none prose-headings:text-navy dark:prose-headings:text-text-heading-dark prose-headings:break-words prose-a:text-gold dark:prose-a:text-gold-light hover:prose-a:text-gold-dark prose-blockquote:border-l-gold"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
}
