// フッターで使用するデータを定義
const footerData = {
  companyName: "webhani inc.",
  getCurrentYear: () => new Date().getFullYear(),
};

export default function Footer() {
  const currentYear = footerData.getCurrentYear();

  return (
    <footer className="footer py-8 bg-gray-900 text-gray-400 justify-center">
      <div className="flex justify-center flex-nowrap items-center">
        <span className="text-lg">
          Copyright &copy; {currentYear} {footerData.companyName} All rights
          reserved.
        </span>
      </div>
    </footer>
  );
}
