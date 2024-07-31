import React, { useState, useEffect, useCallback } from "react";
import OpenAI from "openai";
import { Mic, Upload } from "lucide-react";
import ApiKeyInput from "./components/ApiKeyInput";
import AudioPlayer from "./components/AudioPlayer";
import TranscriptionDisplay from "./components/TranscriptionDisplay";

const App = () => {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("openai_api_key") || "",
  );
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("openai_api_key", apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      setAudioUrl(url);
      handleTranscription();
      return () => URL.revokeObjectURL(url);
    }
  }, [audioFile]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleTranscription = async () => {
    if (!audioFile || !apiKey) {
      setError("Please provide both an API key and an audio file.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

      const transcriptionResponse = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        response_format: "verbose_json",
      });

      setTranscription(transcriptionResponse);
    } catch (error) {
      console.error("Transcription error:", error);
      setError(
        "Error during transcription. Please check your API key and try again.",
      );
    }
    setIsLoading(false);
  };

  const handleTimeUpdate = useCallback(
    (time) => {
      setCurrentTime(time);
      if (transcription && transcription.segments) {
        const newIndex = transcription.segments.findIndex(
          (segment, index) =>
            time >= segment.start &&
            (index === transcription.segments.length - 1 ||
              time < transcription.segments[index + 1].start),
        );
        setCurrentSegmentIndex(newIndex);
      }
    },
    [transcription],
  );

  const handleSegmentClick = useCallback((startTime) => {
    const audioElement = document.querySelector("audio");
    if (audioElement) {
      audioElement.currentTime = startTime;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Audio Transcription Player
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-center">
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <Upload className="mr-2" />
              <span>Upload Audio</span>
              <input
                id="file-upload"
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          {audioFile && (
            <p className="mt-2 text-center text-gray-600">
              Selected file: {audioFile.name}
            </p>
          )}
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <Mic className="animate-pulse inline-block mr-2 text-blue-500" />
            <span className="text-gray-600">Transcribing... Please wait.</span>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {transcription && audioUrl && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <AudioPlayer audioSrc={audioUrl} onTimeUpdate={handleTimeUpdate} />
            <TranscriptionDisplay
              transcriptionData={transcription}
              currentSegmentIndex={currentSegmentIndex}
              onSegmentClick={handleSegmentClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
