export type NavigationItem = {
  nameKey: string;
  href: string;
  children?: NavigationChild[];
};

export type NavigationChild = {
  nameKey: string;
  href: string;
};
