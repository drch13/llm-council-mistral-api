import { useState, useEffect } from 'react';
import { api } from '../api';
import { LANGUAGES } from '../i18n';
import './SettingsModal.css';

export default function SettingsModal({ onClose, t, language, onLanguageChange }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(language || 'en');
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
        setMessage({ type: 'success', text: t('save_success_validated') });
      } else {
        setMessage({ type: 'success', text: t('save_success_unvalidated') });
      }
      setApiKey('');
      setStatus(await api.getApiKeyStatus());
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = async (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    try {
      await api.saveLanguage(lang);
      onLanguageChange(lang);
      setMessage({ type: 'success', text: t('language_saved') });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('settings').replace('⚙ ', '')}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <label className="settings-label" htmlFor="mistral-api-key">
            {t('api_key_label')}
          </label>
          <div className="api-key-input-row">
            <input
              id="mistral-api-key"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={
                status?.configured
                  ? t('current_key', { masked: status.masked })
                  : t('api_key_placeholder')
              }
            />
            <button
              type="button"
              className="toggle-visibility-btn"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? t('hide') : t('show')}
            </button>
          </div>
          <p className="settings-hint">{t('settings_hint')}</p>

          <label className="settings-label settings-language-label" htmlFor="language-select">
            {t('language_label')}
          </label>
          <select
            id="language-select"
            className="language-select"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>

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
            {saving ? t('saving') : t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}
