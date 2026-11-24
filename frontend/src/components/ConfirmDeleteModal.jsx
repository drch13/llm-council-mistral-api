import './SettingsModal.css';
import './ConfirmDeleteModal.css';

export default function ConfirmDeleteModal({ conversation, onConfirm, onCancel, t }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal confirm-delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('delete_confirm_title')}</h2>
          <button className="modal-close" onClick={onCancel}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p className="confirm-delete-message">
            {t('delete_confirm_message', {
              title: conversation.title || 'New Conversation',
            })}
          </p>
        </div>
        <div className="modal-footer confirm-delete-footer">
          <button className="cancel-btn" onClick={onCancel}>
            {t('cancel')}
          </button>
          <button className="confirm-delete-btn" onClick={onConfirm}>
            {t('delete_confirm_button')}
          </button>
        </div>
      </div>
    </div>
  );
}
