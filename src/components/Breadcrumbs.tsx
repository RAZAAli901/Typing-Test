import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4 text-xs font-mono text-crt-dim">
        <ol className="flex flex-wrap items-center gap-1.5 list-none p-0 m-0">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center gap-1.5">
                {index > 0 && <span className="text-crt-dim/60 select-none">&gt;</span>}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-crt-dim hover:text-crt-primary transition-colors underline underline-offset-2"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-crt-primary font-bold" aria-current={isLast ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
