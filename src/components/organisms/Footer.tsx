import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer py-8 bg-gray-900 text-gray-400 justify-center">
      <div className="flex justify-center flex-nowrap items-center">
        <span className="text-lg">
          Copyright &copy; {currentYear} webhani inc. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
