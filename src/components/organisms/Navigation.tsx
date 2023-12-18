import Image from "next/image";

// interface Props {
//   users: IUser[];
//   [key: string]: any;
// }

import HambergerIcon from "@/components/atoms/HambergerIcon";

interface Menu {
  name: string;
  link?: string;
  children?: Menu[];
}
// export default function UserList({ users }: Props) {
const menuData: Menu[] = [
  { name: "ホーム", link: "#" },
  { name: "お問い合わせ", link: "#" },
  // {
  //   name: "Parent",
  //   children: [
  //     { name: "Submenu 1", link: "#" },
  //     { name: "Submenu 1", link: "#" },
  //   ],
  // },
];

export default function Navigation() {
  const menuComponent = () => {
    return menuData.map((menu, idx) => {
      if (menu.children) {
        return (
          <li key={idx}>
            <details>
              <summary>{menu.name}</summary>
              <ul className="p-2">
                {menu.children.map((child, subIdx) => (
                  <li key={subIdx}>
                    <a>{child.name}</a>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        );
      } else {
        return (
          <li key={idx}>
            <a>{menu.name}</a>
          </li>
        );
      }
    });
  };

  return (
    <div className="navbar bg-base-100 py-3">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <HambergerIcon />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {menuComponent()}
          </ul>
        </div>
        <a className="btn btn-lg btn-ghost text-xl pl-7">
          <Image
            src="/logo/full-logo-w200-transparent.png"
            alt="webhani Logo"
            className="dark:invert"
            width={200}
            height={45}
            priority
          />
        </a>
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{menuComponent()}</ul>
      </div>
    </div>
  );
}
