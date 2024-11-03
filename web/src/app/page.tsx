import { Header } from "@/components/header";
import { RoomComponent } from "@/components/room-component";
import { Auth } from "@/components/auth";
import LK from "@/components/lk";
import Heart from "@/assets/heart.svg";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import InteractiveAvatar from "@/components/InteractiveAvatar";
import { AgentProvider } from "@/hooks/use-agent";
export default function Dashboard() {
  return (
    <div className="flex flex-col h-full bg-neutral-100">
      <header className="flex flex-shrink-0 h-12 items-center justify-between px-4 w-full md:mx-auto">
        <LK />
        <Auth />
      </header>
      <main className="flex flex-col flex-groww-full">
        <RoomComponent />
      </main>
    </div>
  );
}
