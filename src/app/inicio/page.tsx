import { PublicPublicationsFeed } from "@/features/home/publications/components/PublicPublicationsFeed";

export default function Inicio() {
  return (
    <div className="w-full min-h-screen bg-bg">
      <div className="pt-8">
        <PublicPublicationsFeed />
      </div>
    </div>
  );
}
