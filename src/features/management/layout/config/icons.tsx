import {
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  NewspaperIcon,
  PhotoIcon,
  DocumentTextIcon,
  Squares2X2Icon
} from "@heroicons/react/24/solid";

export const iconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  home: HomeIcon,
  userGroup: UserGroupIcon,
  user: UserIcon,
  report: DocumentTextIcon,
  photo: PhotoIcon,
  newspaper: NewspaperIcon,
  dashboard: Squares2X2Icon,
};
