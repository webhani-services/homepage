import AreaConsultant from "@/components/organisms/AreaConsultant";
import AreaHome from "@/components/organisms/AreaHome";
import AreaInquire from "@/components/organisms/AreaInquire";
import AreaRecruit from "@/components/organisms/AreaRecruit";
import AreaSystemDevelopment from "@/components/organisms/AreaSystemDevelopment";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <AreaHome />
      <AreaSystemDevelopment />
      <AreaConsultant />
      <AreaRecruit />
      <AreaInquire />
    </div>
  );
}
