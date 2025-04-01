/**
 * A higher-order component that generates an alert component with a specified alert type.
 *
 * @param {string} [alertType="primary"] - The type of alert to display (e.g., "primary", "success", "danger").
 * @returns {Function} - A React functional component that renders an alert box.
 *
 * The returned component accepts the following props:
 * @param {string} message - The message to display inside the alert.
 * @param {boolean} show - A flag to determine whether the alert should be visible.
 * @param {Function} [onClose=() => null] - A callback function triggered when the close button is clicked.
 */
const AlertComp = (alertType = "primary") => {
  return ({ message, show, onClose = () => null }) => {
    if (!show) {
      return null;
    }
    return (
      <div
        className={`alert alert-${alertType} alert-dismissible`}
        role="alert"
      >
        {message}

        {onClose && (
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={onClose}
          ></button>
        )}
      </div>
    );
  };
};

// warning alert
export const AlertWarning = AlertComp("warning");

// success alert
export const AlertSuccess = AlertComp("success");

// error alert
export const AlertError = AlertComp("danger");

// info alert
export const AlertInfo = AlertComp("info");

// primary alert
export const AlertPrimary = AlertComp();
