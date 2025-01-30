import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer p-4 bg-neutral text-neutral-content justify-center">
      <div className="flex justify-center flex-nowrap items-center">
        <span className="text-lg">
          Copyright &copy; {currentYear} webhani inc. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
