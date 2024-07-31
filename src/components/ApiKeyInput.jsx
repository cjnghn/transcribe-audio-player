import PropTypes from "prop-types";

function ApiKeyInput({ apiKey, setApiKey }) {
  return (
    <div>
      <label htmlFor="api-key">OpenAI API Key:</label>
      <input
        type="password"
        id="api-key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your OpenAI API key"
      />
    </div>
  );
}

ApiKeyInput.propTypes = {
  apiKey: PropTypes.string.isRequired,
  setApiKey: PropTypes.func.isRequired,
};

export default ApiKeyInput;
