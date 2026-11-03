import ReactMarkdown from 'react-markdown';
import './Stage3.css';

export default function Stage3({ finalResponse, modelErrors }) {
  if (!finalResponse) {
    return null;
  }

  return (
    <div className="stage stage3">
      <h3 className="stage-title">Stage 3: Final Council Answer</h3>
      <div className="final-response">
        <div className="chairman-label">
          Chairman: {finalResponse.model.split('/')[1] || finalResponse.model}
        </div>
        <div className="final-text markdown-content">
          <ReactMarkdown>{finalResponse.response}</ReactMarkdown>
        </div>
      </div>
      {modelErrors && modelErrors.length > 0 && (
        <div className="model-errors-box">
          <div className="model-errors-title">
            ⚠ Some council members were unavailable during this exchange:
          </div>
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
