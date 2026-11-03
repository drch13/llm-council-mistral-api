import { useState, useEffect } from 'react';
import { api } from '../api';
import './SettingsModal.css';

export default function SettingsModal({ onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getApiKeyStatus()
      .then(setStatus)
      .catch(() => setStatus({ configured: false, masked: null }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const result = await api.saveApiKey(apiKey);
      if (result.key_valid === true) {
        setMessage({ type: 'success', text: 'API key saved and validated by the Mistral API.' });
      } else {
        setMessage({
          type: 'success',
          text: 'API key saved. It could not be validated now (check your connection); it will be checked on first use.',
        });
      }
      setApiKey('');
      setStatus(await api.getApiKeyStatus());
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <label className="settings-label" htmlFor="mistral-api-key">
            Mistral API Key
          </label>
          <div className="api-key-input-row">
            <input
              id="mistral-api-key"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={
                status?.configured
                  ? `Current key: ${status.masked}`
                  : 'Enter your Mistral API key'
              }
            />
            <button
              type="button"
              className="toggle-visibility-btn"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="settings-hint">
            Get your key at console.mistral.ai. It is stored locally in the .env
            file and only used to call the Mistral API.
          </p>
          {message && (
            <div className={`settings-message ${message.type}`}>{message.text}</div>
          )}
        </div>
        <div className="modal-footer">
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving || !apiKey.trim()}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
