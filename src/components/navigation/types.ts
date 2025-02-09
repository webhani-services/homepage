export type NavigationItem = {
  name: string;
  href: string;
  children?: NavigationChild[];
};

export type NavigationChild = {
  name: string;
  href: string;
};
