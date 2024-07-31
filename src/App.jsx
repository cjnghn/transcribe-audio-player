import React, { useState } from "react";
import OpenAI from "openai";
import ApiKeyInput from "./components/ApiKeyInput";
import AudioUploader from "./components/AudioUploader";
import TranscriptionDisplay from "./components/TranscriptionDisplay";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("");

  const handleTranscription = async () => {
    if (!audioFile || !apiKey) {
      return;
    }
    setIsLoading(true);
    try {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

      // warning: file size <= 25MB
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
      });
      setTranscription(transcription.text);
    } catch (error) {
      console.error("Translation error:", error);
      alert(
        "Error during transcription. Please check your API key and try again.",
      );
    }
    setIsLoading(false);
  };

  return (
    <div>
      <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
      <AudioUploader setAudioFile={setAudioFile} />
      <button
        onClick={handleTranscription}
        disabled={!audioFile || !apiKey || isLoading}
      >
        {isLoading ? "Transcribing..." : "Transcribe Audio"}
      </button>
      <TranscriptionDisplay transcription={transcription} />
    </div>
  );
}

export default App;
