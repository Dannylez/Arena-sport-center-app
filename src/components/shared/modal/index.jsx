import styles from './modal.module.css';

function Modal({ isOpen, onClose, previous, children, popUp, success, error }) {
  if (!isOpen && !popUp) {
    return null;
  }

  return (
    <div
      className={`${popUp ? styles.modalOverlayPop : styles.modalOverlay} ${
        isOpen ? styles.open : ''
      }`}
      onClick={() => onClose()}
    >
      <div
        className={`${styles.modalContent} ${
          success ? styles.modalSuccess : ''
        } ${error ? styles.modalError : ''} ${isOpen ? styles.open : ''}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles.header}>
          <span
            className={`${styles.previous} ${
              success || error ? styles.hidden : ''
            }`}
            onClick={() => previous()}
          >
            &larr;
          </span>
          <span
            className={`${
              error || success ? styles.closeBtn2 : styles.closeBtn
            }`}
            onClick={() => onClose()}
          >
            &times;
          </span>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
