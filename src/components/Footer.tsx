const footerData = {
  companyName: "webhani inc.",
  getCurrentYear: () => new Date().getFullYear(),
};

export default function Footer() {
  const currentYear = footerData.getCurrentYear();

  return (
    <footer className="relative bg-gray-950 text-gray-500 overflow-hidden">
      {/* Subtle top border accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-amber-500/80 font-semibold tracking-wide text-sm">
            {footerData.companyName}
          </span>
          <span className="text-xs text-gray-600">
            &copy; {currentYear} {footerData.companyName} All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
