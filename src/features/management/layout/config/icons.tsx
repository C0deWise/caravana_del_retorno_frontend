import { HomeIcon, UserGroupIcon, UserIcon, NewspaperIcon } from "@heroicons/react/24/solid";

export const iconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  home: HomeIcon,
  userGroup: UserGroupIcon,
  user: UserIcon,
  newspaper: NewspaperIcon,
};
