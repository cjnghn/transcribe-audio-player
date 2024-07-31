import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

const AudioPlayer = ({ audioSrc, onTimeUpdate }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const handleTimeUpdate = useCallback(() => {
    const time = audioRef.current.currentTime;
    setCurrentTime(time);
    onTimeUpdate(time);
  }, [onTimeUpdate]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", () =>
        setDuration(audio.duration),
      );
      audio.removeEventListener("play", () => setIsPlaying(true));
      audio.removeEventListener("pause", () => setIsPlaying(false));
    };
  }, [handleTimeUpdate]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const handleSliderChange = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
    onTimeUpdate(time);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const skip = (seconds) => {
    const audio = audioRef.current;
    audio.currentTime += seconds;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-t-lg">
      <audio ref={audioRef} src={audioSrc} />
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => skip(-10)}
          className="text-gray-600 hover:text-gray-800"
        >
          <SkipBack size={24} />
        </button>
        <button
          onClick={togglePlayPause}
          className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={() => skip(10)}
          className="text-gray-600 hover:text-gray-800"
        >
          <SkipForward size={24} />
        </button>
      </div>
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSliderChange}
          className="w-full"
        />
        <span className="text-sm text-gray-600">{formatTime(duration)}</span>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleMute}
          className="text-gray-600 hover:text-gray-800"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-24"
        />
      </div>
    </div>
  );
};

AudioPlayer.propTypes = {
  audioSrc: PropTypes.string.isRequired,
  onTimeUpdate: PropTypes.func.isRequired,
};

export default AudioPlayer;
