const renderErrors = (elements, error) => {
  const { input, feedback } = elements;

  if (error) {
    input.classList.add("is-invalid");
    feedback.classList.add("text-danger");
    feedback.textContent = error;
  } else {
    input.classList.remove("is-invalid");
    feedback.classList.remove("text-danger");
    feedback.textContent = "";
  }
};

const handleProcessState = (elements, processState) => {
  const { submit, input } = elements;

  switch (processState) {
    case "filling":
      submit.disabled = false;
      input.readOnly = false;
      break;
    case "sending":
      submit.disabled = true;
      input.readOnly = true;
      break;
    default:
      break;
  }
};

export default (state, elements) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case "form.error":
        renderErrors(elements, value);
        break;
      case "form.processState":
        handleProcessState(elements, value);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
