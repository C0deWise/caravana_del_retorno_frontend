import {
  HomeIcon,
  ArrowUturnLeftIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

export const iconMap: Record<string, React.ReactNode> = {
  home: <HomeIcon className="w-6 h-6 shrink-0" />,
  arrowTurnLeft: <ArrowUturnLeftIcon className="w-6 h-6 shrink-0" />,
  user: <UserIcon className="w-6 h-6 shrink-0" />,
};
