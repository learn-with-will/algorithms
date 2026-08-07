/**
 * The Algorithms mark: a small four-node graph (a diamond) drawn with edges and
 * filled vertices — a nod to the data structures and graph algorithms at the
 * heart of the course. Rendered in the current text colour so callers control
 * the accent.
 */
export function AlgorithmsLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* edges (drawn first so the nodes sit on top) */}
      <path
        d="M12 4.3 5.4 13M12 4.3 18.6 13M5.4 13 12 19.7M18.6 13 12 19.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* nodes */}
      <circle cx="12" cy="4.3" r="2.4" fill="currentColor" />
      <circle cx="5.4" cy="13" r="2.3" fill="currentColor" />
      <circle cx="18.6" cy="13" r="2.3" fill="currentColor" />
      <circle cx="12" cy="19.7" r="2.3" fill="currentColor" />
    </svg>
  );
}
