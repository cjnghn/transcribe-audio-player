import PropTypes from "prop-types";

function AudioUploader({ setAudioFile }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setAudioFile(file);
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileUpload} />
    </div>
  );
}

AudioUploader.propTypes = {
  setAudioFile: PropTypes.func.isRequired,
};

export default AudioUploader;
