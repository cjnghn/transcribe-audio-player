import React, { useState } from "react";
import PropTypes from "prop-types";

const TranscriptionDisplay = ({ transcription }) => {
  const [copyMessage, setCopyMessage] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription).then(() => {
      setCopyMessage("Copied to clipboard!");
      setTimeout(() => setCopyMessage(""), 2000);
    });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([transcription], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "transcription.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!transcription) {
    return <p>No transcription available yet.</p>;
  }

  return (
    <div>
      <h3>Transcription Result:</h3>
      <div>
        <button onClick={handleCopy}>Copy</button>
        <button onClick={handleDownload}>Download</button>
      </div>
      <div>
        <p>{transcription}</p>
      </div>
      {copyMessage && <p>{copyMessage}</p>}
    </div>
  );
};

TranscriptionDisplay.propTypes = {
  transcription: PropTypes.string.isRequired,
};

export default TranscriptionDisplay;
