export function ScrollIndicator() {
  return (
    <div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      aria-hidden="true"
    >
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
      </svg>
    </div>
  );
}
