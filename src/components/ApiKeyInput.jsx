import React, { useState } from "react";
import PropTypes from "prop-types";

const ApiKeyInput = ({ apiKey, setApiKey }) => {
  const [showApiKey, setShowApiKey] = useState(false);

  className = "block text-sm font-medium text-gray-700"
    >
    OpenAI API Key
      </label >
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type={showApiKey ? "text" : "password"}
          id="api-key"
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your OpenAI API key"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          onClick={() => setShowApiKey(!showApiKey)}
        >
          {showApiKey ? "Hide" : "Show"}
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Your API key is securely stored in your browser and never sent to our
        servers.
      </p>
    </div >
  );
};

ApiKeyInput.propTypes = {
  apiKey: PropTypes.string.isRequired,
  setApiKey: PropTypes.func.isRequired,
};

export default ApiKeyInput;
