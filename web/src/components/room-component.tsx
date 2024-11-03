"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from "@livekit/components-react";

import { ConfigurationForm } from "@/components/configuration-form";
import { Chat } from "@/components/chat";
import { Transcript } from "@/components/transcript";
import { useConnection } from "@/hooks/use-connection";
import { AgentProvider } from "@/hooks/use-agent";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import InteractiveAvatar from "./InteractiveAvatar";

export function RoomComponent() {
  const { shouldConnect, wsUrl, token } = useConnection();
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const scrollButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <LiveKitRoom
      serverUrl={wsUrl}
      token={token}
      connect={shouldConnect}
      audio={true}
      className="flex flex-col flex-grow overflow-hidden border-l border-r border-b rounded-b-md"
      style={{ "--lk-bg": "white" } as React.CSSProperties}
      options={{
        publishDefaults: {
          stopMicTrackOnMute: true,
        },
      }}
    >
      <AgentProvider>
        {/* two row layout chat full available space and transcript required space */}

        <div className="flex w-full">
          <div className="flex-1">
            <InteractiveAvatar />
            <Chat />
          </div>
          {/* <div className="w-40">
            <Transcript
              scrollContainerRef={transcriptContainerRef}
              scrollButtonRef={scrollButtonRef}
            />
          </div> */}
        </div>
        {/* <div className="flex flex-col justify-center w-full max-w-3xl mx-auto">
        <InteractiveAvatar />
          <Chat />
        </div>
        <div className="hidden md:flex flex-col h-full overflow-y-hidden border-l relative">
          <div
            className="flex-grow overflow-y-auto"
            ref={transcriptContainerRef}
          >
            <Transcript
              scrollContainerRef={transcriptContainerRef}
              scrollButtonRef={scrollButtonRef}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button
              ref={scrollButtonRef}
              className="p-2 bg-white text-gray-500 rounded-full hover:bg-gray-100 transition-colors absolute right-4 bottom-4 shadow-md flex items-center"
            >
              <ChevronDown className="mr-1 h-4 w-4" />
              <span className="text-xs pr-1">View latest</span>
            </button>
          </div>
        </div> */}
        <RoomAudioRenderer muted />
        <StartAudio label="Click to allow audio playback" />
      </AgentProvider>
    </LiveKitRoom>
  );
}