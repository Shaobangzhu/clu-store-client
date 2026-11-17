import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

type VideoHeroProps = {
  videoSrc: string;
  videoSmallSrc: string;
};

const VideoHero = ({ videoSrc, videoSmallSrc }: VideoHeroProps) => {
  const { t } = useTranslation();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [failed, setFailed] = useState<string[]>([]);
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [borderRadius, setBorderRadius] = useState(0);
  const [videoSize, setVideoSize] = useState("100%");
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setVideoSize(`${Math.max(87, 100 - scrollTop * 0.1)}%`);
      setBorderRadius(Math.min(40, scrollTop * 0.1));
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const preferred = isLargeScreen ? videoSrc : videoSmallSrc;
  const alternate = isLargeScreen ? videoSmallSrc : videoSrc;
  const src = [preferred, alternate].find(value => value && !failed.includes(value));
  if (!src) return <p role="status" className="p-6 text-center">{t("ui.noVideo")}</p>;
  return (
    <div className="w-full flex justify-center items-center overflow-hidden">
      <video
        key={src}
        src={src}
        onError={() => setFailed(values => [...values, src])}
        aria-label={t("ui.video")}
        playsInline
        controls
        autoPlay
        loop
        muted
        style={{
          width: isLargeScreen ? videoSize : "100%",
          borderRadius: isLargeScreen ? `${borderRadius}px` : "40px",
        }}
        className={`${
          isLargeScreen
            ? "h-[730px] object-cover transition-all duration-300 ease-out"
            : "w-full object-cover rounded-[40px] m-1"
        }`}
      >
      </video>
    </div>
  );
};

export default VideoHero;
