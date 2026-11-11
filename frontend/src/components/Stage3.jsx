import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Stage3.css';

export default function Stage3({ finalResponse, modelErrors, t }) {
  if (!finalResponse) {
    return null;
  }

  const handleDownload = () => {
    const blob = new Blob([finalResponse.response], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'llm-council-final-answer.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="stage stage3">
      <div className="stage3-header">
        <h3 className="stage-title">{t('stage3_title')}</h3>
        <button className="download-button" onClick={handleDownload}>
          {t('download_markdown')}
        </button>
      </div>
      <div className="final-response">
        <div className="chairman-label">
          {t('chairman')} {finalResponse.model.split('/')[1] || finalResponse.model}
        </div>
        <div className="final-text markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {finalResponse.response}
          </ReactMarkdown>
        </div>
      </div>
      {modelErrors && modelErrors.length > 0 && (
        <div className="model-errors-box">
          <div className="model-errors-title">{t('model_errors_title')}</div>
          <ul className="model-errors-list">
            {modelErrors.map((e, i) => (
              <li key={i}>
                <span className="model-error-name">{e.model}</span>
                <span className="model-error-detail">
                  [{e.error?.type}] {e.error?.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
