import React from "react";
import Article from "pixelarticons/react/Article";
import Hash from "pixelarticons/react/Hash";
import Message from "pixelarticons/react/Message";
import Terminal from "pixelarticons/react/Terminal";
import Ampersand from "pixelarticons/react/Ampersand";
import Shuffle from "pixelarticons/react/Shuffle";
import Calendar from "pixelarticons/react/Calendar";
import Settings2 from "pixelarticons/react/Settings2";
import Trophy from "pixelarticons/react/Trophy";
import Chart from "pixelarticons/react/Chart";
import User from "pixelarticons/react/User";
import AudioWaveform from "pixelarticons/react/AudioWaveform";
import Volume2 from "pixelarticons/react/Volume2";
import InfoBox from "pixelarticons/react/InfoBox";
import ArrowRight from "pixelarticons/react/ArrowRight";
import Play from "pixelarticons/react/Play";
import Close from "pixelarticons/react/Close";

export type IconName =
  | "standard"
  | "numbers"
  | "quotes"
  | "code"
  | "punctuation"
  | "random"
  | "daily"
  | "custom"
  | "trophy"
  | "stats"
  | "settings"
  | "user"
  | "mic"
  | "speaker"
  | "chart"
  | "info"
  | "arrow-right"
  | "play"
  | "close";

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export default function Icon({ name, className = "", size = 24 }: IconProps) {
  const iconMap: Record<IconName, React.ComponentType<any>> = {
    standard: Article,
    numbers: Hash,
    quotes: Message,
    code: Terminal,
    punctuation: Ampersand,
    random: Shuffle,
    daily: Calendar,
    custom: Settings2,
    trophy: Trophy,
    stats: Chart,
    settings: Settings2,
    user: User,
    mic: AudioWaveform,
    speaker: Volume2,
    chart: Chart,
    info: InfoBox,
    "arrow-right": ArrowRight,
    play: Play,
    close: Close,
  };

  const IconComponent = iconMap[name];

  if (!IconComponent) return null;

  return <IconComponent className={`${className} pixel-icon-glow`} style={{ width: size, height: size }} />;
}
