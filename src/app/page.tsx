import AreaConsultant from "@/components/organisms/AreaConsultant";
import AreaHome from "@/components/organisms/AreaHome";
import AreaInquire from "@/components/organisms/AreaInquire";
import AreaRecruit from "@/components/organisms/AreaRecruit";
import AreaSystemDevelopment from "@/components/organisms/AreaSystemDevelopment";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <AreaHome />
      <AreaSystemDevelopment />
      <AreaConsultant />
      <AreaRecruit />
      <AreaInquire />
    </main>
  );
}
