import AreaTemplate from "@/components/templates/AreaTemplate";
import Image from "next/image";
import { IoMailOutline } from "react-icons/io5";

export default function AreaContact() {
  return (
    <AreaTemplate isEven={false} sectionId={"area-contact"}>
      <div className="grid grid-cols-3 gap-2 pt-20 pb-20 sm:px-10 lg:px-20 xl:px-40 2xl:px-56 py-6 sm:py-8 lg:py-12 xl:py-16">
        <div className="col-span-2">
          <h2 className="text-4xl pb-8">お問い合わせ</h2>
          <span className="flex">
            <IoMailOutline size={50} />{" "}
            <span className="text-2xl pl-4 pt-2">contact@webhani.com</span>
          </span>
        </div>

        <div>
          <Image
            src="/contact/contact.svg"
            alt="contact"
            className="dark:invert"
            width={600}
            height={600}
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      </div>
    </AreaTemplate>
  );
}
