"use client";
import type { StartAvatarResponse } from "@heygen/streaming-avatar";

import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
} from "@heygen/streaming-avatar";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Select,
  SelectItem,
  Spinner,
  Chip,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useMemoizedFn, usePrevious } from "ahooks";

import InteractiveAvatarTextInput from "./InteractiveAvatarTextInput";

import { AVATARS, STT_LANGUAGE_LIST } from "@/app/lib/constants";
import { useAgent } from "@/hooks/use-agent";

export default function InteractiveAvatar() {
  const { displayTranscriptions } = useAgent();
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const [knowledgeId, setKnowledgeId] = useState<string>("");
  const [avatarId, setAvatarId] = useState<string>("");
  const [language, setLanguage] = useState<string>("en");

  const [data, setData] = useState<StartAvatarResponse>();
  const [text, setText] = useState<string>("");
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);
  const [chatMode, setChatMode] = useState("text_mode");
  const [isUserTalking, setIsUserTalking] = useState(false);

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();

      console.log("Access Token:", token); // Log the token to verify

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
    }

    return "";
  }

  // avatar.current
  //     .speak({ text: "Hello Pavan, Im AI", taskType: TaskType.REPEAT, taskMode: TaskMode.SYNC })
  //     .catch((e) => {
  //       setDebug(e.message);
  //     });

  useEffect(() => {
    // Get the last transcription's text
    const lastTranscription = displayTranscriptions?.[displayTranscriptions.length - 1];
    if(lastTranscription?.segment?.final === true) {
      if (lastTranscription) {
        
            avatar.current
              .speak({ text: lastTranscription?.segment?.text?.trim(), taskType: TaskType.REPEAT, taskMode: TaskMode.SYNC })
              .catch((e) => {
                setDebug(e.message);
              });
    }
  }
   
  }, [displayTranscriptions]);

  // useEffect(() => {
  //   if (lastTranscript) {
  //     avatar.current
  //       .speak({ text: lastTranscript, taskType: TaskType.REPEAT, taskMode: TaskMode.SYNC })
  //       .catch((e) => {
  //         setDebug(e.message);
  //       });
  //   }
  // }, [lastTranscript]);


  async function startSession() {
    setIsLoadingSession(true);
    const newToken = await fetchAccessToken();

    avatar.current = new StreamingAvatar({
      token: newToken,
    });
    avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
      console.log("Avatar started talking", e);
    });
    avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
      console.log("Avatar stopped talking", e);
    });
    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log("Stream disconnected");
      endSession();
    });
    avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
      console.log(">>>>> Stream ready:", event.detail);
      setStream(event.detail);
    });
    avatar.current?.on(StreamingEvents.USER_START, (event) => {
      console.log(">>>>> User started talking:", event);
      setIsUserTalking(true);
    });
    avatar.current?.on(StreamingEvents.USER_STOP, (event) => {
      console.log(">>>>> User stopped talking:", event);
      setIsUserTalking(false);
    });
    try {
      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: "Wayne_20240711",
        knowledgeId: knowledgeId, // Or use a custom `knowledgeBase`.
        voice: {
          rate: 1.5, // 0.5 ~ 1.5
          emotion: VoiceEmotion.Neutral,
        },
        language: language,
      });

      setData(res);
      // default to voice mode
      // await avatar.current?.startVoiceChat();

      setIsLoadingRepeat(false);
      setChatMode("voice_mode");
    } catch (error) {
      console.error("Error starting avatar session:", error);
    } finally {
      setIsLoadingSession(false);
    }
  }
  async function handleSpeak() {
    setIsLoadingRepeat(true);
    if (!avatar.current) {
      setDebug("Avatar API not initialized");

      return;
    }
    // speak({ text: text, task_type: TaskType.REPEAT })
    await avatar.current
      .speak({ text: text, taskType: TaskType.REPEAT, taskMode: TaskMode.SYNC })
      .catch((e) => {
        setDebug(e.message);
      });
    setIsLoadingRepeat(false);
  }
  async function handleInterrupt() {
    if (!avatar.current) {
      setDebug("Avatar API not initialized");

      return;
    }
    await avatar.current.interrupt().catch((e) => {
      setDebug(e.message);
    });
  }
  async function endSession() {
    await avatar.current?.stopAvatar();
    setStream(undefined);
  }

  const handleChangeChatMode = useMemoizedFn(async (v) => {
    if (v === chatMode) {
      return;
    }
    if (v === "text_mode") {
      avatar.current?.closeVoiceChat();
    } else {
      await avatar.current?.startVoiceChat();
    }
    setChatMode(v);
  });

  const previousText = usePrevious(text);
  useEffect(() => {
    if (!previousText && text) {
      avatar.current?.startListening();
    } else if (previousText && !text) {
      avatar?.current?.stopListening();
    }
  }, [text, previousText]);

  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
        setDebug("Playing");
      };
    }
  }, [mediaStream, stream]);

  return (
    <div className="w-full flex flex-col gap-4">
      <Card>
        <div style={{ display: "none" }}>
          <Button
            className="bg-gradient-to-tr from-indigo-500 to-indigo-300 w-full text-white"
            size="md"
            variant="shadow"
            onClick={startSession}
            id="heygen-start-session"
          >
            Start session
          </Button>
        </div>
        {stream && (
          <div className="justify-center items-center flex rounded-lg">
            <video
              ref={mediaStream}
              autoPlay
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            >
              <track kind="captions" />
            </video>
            <div className="flex flex-col gap-2 absolute bottom-3 right-3 hidden">
              <Button
                className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white rounded-lg"
                size="md"
                variant="shadow"
                onClick={handleInterrupt}
              >
                Interrupt task
              </Button>
              <Button
                className="bg-gradient-to-tr from-indigo-500 to-indigo-300  text-white rounded-lg  display:none"
                size="md"
                variant="shadow"
                onClick={endSession}
                id="hygen-end-session"
              >
                End session
              </Button>
            </div>
          </div>
        )}
        <Divider />
      </Card>
    </div>
  );
}
