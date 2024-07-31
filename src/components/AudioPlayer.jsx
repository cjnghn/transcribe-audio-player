import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AudioPlayer = ({ audioFile }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Create a URL for the audio file
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      audioRef.current.src = url;
      return () => URL.revokeObjectURL(url);
    }
  }, [audioFile]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (event) => {
    const time = event.target.value;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!audioFile) {
    return <p>No audio file selected.</p>;
  }

  return (
    <div>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeek}
      />
      <span>
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
};

AudioPlayer.propTypes = {
  audioFile: PropTypes.instanceOf(File),
};

export default AudioPlayer;
