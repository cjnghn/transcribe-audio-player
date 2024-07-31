import React from "react";
import PropTypes from "prop-types";

const TranscriptionDisplay = ({
  transcriptionData,
  currentSegmentIndex,
  onSegmentClick,
}) => {
  return (
    <div className="bg-white p-4 rounded-b-lg max-h-60 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        Transcription
      </h3>
      <div className="space-y-2">
        {transcriptionData.segments.map((segment, index) => (
          <p
            key={segment.id}
            className={`text-gray-700 transition-colors duration-200 ease-in-out cursor-pointer ${
              index === currentSegmentIndex
                ? "bg-yellow-200"
                : "hover:bg-gray-100"
            }`}
            onClick={() => onSegmentClick(segment.start)}
          >
            {segment.text}
          </p>
        ))}
      </div>
    </div>
  );
};

TranscriptionDisplay.propTypes = {
  transcriptionData: PropTypes.shape({
    segments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        start: PropTypes.number,
        text: PropTypes.string,
      }),
    ),
  }).isRequired,
  currentSegmentIndex: PropTypes.number.isRequired,
  onSegmentClick: PropTypes.func.isRequired,
};

export default TranscriptionDisplay;
