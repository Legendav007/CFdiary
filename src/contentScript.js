const modalHTML = `
<style>
  /* Modal Styles */
  .cf-diary-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 10000;
    display: none;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .cf-diary-modal-overlay.show {
    display: flex;
    opacity: 1;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .cf-diary-modal {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transform: scale(0.95);
    transition: transform 0.2s ease-in-out;
  }

  .cf-diary-modal-overlay.show .cf-diary-modal {
    transform: scale(1);
  }

  .cf-diary-modal-header {
    padding: 24px 24px 0 24px;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 24px;
  }

  .cf-diary-modal-title {
    font-size: 20px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cf-diary-modal-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }

  .cf-diary-modal-content {
    padding: 0 24px 24px 24px;
  }

  .cf-diary-form-group {
    margin-bottom: 20px;
  }

  .cf-diary-form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
  }

  .cf-diary-form-input,
  .cf-diary-form-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
    resize: vertical;
    box-sizing: border-box;
  }

  .cf-diary-form-input:focus,
  .cf-diary-form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .cf-diary-form-textarea {
    min-height: 80px;
  }

  .cf-diary-form-textarea.large {
    min-height: 120px;
  }

  .cf-diary-message {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s, transform 0.3s;
  }

  .cf-diary-message.show {
    opacity: 1;
    transform: translateY(0);
  }

  .cf-diary-message.success {
    background-color: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  .cf-diary-message.error {
    background-color: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  .cf-diary-modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
  }

  .cf-diary-btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 80px;
    justify-content: center;
  }

  .cf-diary-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .cf-diary-btn-secondary {
    background-color: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .cf-diary-btn-secondary:hover:not(:disabled) {
    background-color: #e5e7eb;
  }

  .cf-diary-btn-primary {
    background-color: #3b82f6;
    color: white;
    border: 1px solid #3b82f6;
  }

  .cf-diary-btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .cf-diary-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: cf-diary-spin 1s linear infinite;
  }

  @keyframes cf-diary-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .cf-diary-close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 24px;
    color: #6b7280;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.2s, background-color 0.2s;
  }

  .cf-diary-close-btn:hover {
    color: #374151;
    background-color: #f3f4f6;
  }

  .cf-diary-icon {
    width: 20px;
    height: 20px;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .cf-diary-modal {
      margin: 16px;
      max-width: none;
    }
    
    .cf-diary-modal-header,
    .cf-diary-modal-content {
      padding-left: 16px;
      padding-right: 16px;
    }
    
    .cf-diary-modal-actions {
      flex-direction: column;
    }
    
    .cf-diary-btn {
      width: 100%;
    }
  }
</style>

<div id="cfDiaryModalOverlay" class="cf-diary-modal-overlay">
  <div class="cf-diary-modal" role="dialog" aria-labelledby="cfDiaryModalTitle" aria-modal="true">
    <button class="cf-diary-close-btn" id="cfDiaryCloseBtn" aria-label="Close modal">&times;</button>
    
    <div class="cf-diary-modal-header">
      <h2 id="cfDiaryModalTitle" class="cf-diary-modal-title">
        <svg class="cf-diary-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
        CF Diary Entry
      </h2>
      <p class="cf-diary-modal-subtitle">Record your problem-solving journey</p>
    </div>

    <div class="cf-diary-modal-content">
      <div id="cfDiaryMessage" class="cf-diary-message"></div>

      <form id="cfDiaryForm">
        <div class="cf-diary-form-group">
          <label for="cfDiaryStatus" class="cf-diary-form-label">
            Status *
            <span style="font-weight: 400; color: #6b7280;">(How did you approach this problem?)</span>
          </label>
          <textarea 
            id="cfDiaryStatus" 
            class="cf-diary-form-textarea" 
            placeholder="e.g., Solved independently, Used hints, Saw solution, etc."
            required
            maxlength="200"
          ></textarea>
          <div style="text-align: right; font-size: 12px; color: #6b7280; margin-top: 4px;">
            <span id="statusCharCount">0</span>/200
          </div>
        </div>

        <div class="cf-diary-form-group">
          <label for="cfDiaryRemarks" class="cf-diary-form-label">
            Remarks
            <span style="font-weight: 400; color: #6b7280;">(Your thoughts on the problem)</span>
          </label>
          <textarea 
            id="cfDiaryRemarks" 
            class="cf-diary-form-textarea" 
            placeholder="What did you think about this problem? Was it challenging? Interesting patterns?"
            maxlength="500"
          ></textarea>
          <div style="text-align: right; font-size: 12px; color: #6b7280; margin-top: 4px;">
            <span id="remarksCharCount">0</span>/500
          </div>
        </div>

        <div class="cf-diary-form-group">
          <label for="cfDiaryTakeaways" class="cf-diary-form-label">
            Takeaways & Learning
            <span style="font-weight: 400; color: #6b7280;">(Key insights and concepts)</span>
          </label>
          <textarea 
            id="cfDiaryTakeaways" 
            class="cf-diary-form-textarea large" 
            placeholder="Explain your thought process, new concepts learned, or techniques used. This will help you review later!"
            maxlength="1000"
          ></textarea>
          <div style="text-align: right; font-size: 12px; color: #6b7280; margin-top: 4px;">
            <span id="takeawaysCharCount">0</span>/1000
          </div>
        </div>

        <div class="cf-diary-modal-actions">
          <button type="button" id="cfDiaryCancelBtn" class="cf-diary-btn cf-diary-btn-secondary">
            Cancel
          </button>
          <button type="submit" id="cfDiarySubmitBtn" class="cf-diary-btn cf-diary-btn-primary">
            <span id="cfDiarySubmitText">Submit</span>
            <div id="cfDiarySpinner" class="cf-diary-spinner" style="display: none;"></div>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
`

// Insert modal into page
document.body.insertAdjacentHTML("beforeend", modalHTML);

// Modal elements
const modalOverlay = document.getElementById("cfDiaryModalOverlay");
const modalForm = document.getElementById("cfDiaryForm");
const statusInput = document.getElementById("cfDiaryStatus");
const remarksInput = document.getElementById("cfDiaryRemarks");
const takeawaysInput = document.getElementById("cfDiaryTakeaways");
const submitBtn = document.getElementById("cfDiarySubmitBtn");
const submitText = document.getElementById("cfDiarySubmitText");
const spinner = document.getElementById("cfDiarySpinner");
const messageDiv = document.getElementById("cfDiaryMessage");
const closeBtn = document.getElementById("cfDiaryCloseBtn");
const cancelBtn = document.getElementById("cfDiaryCancelBtn");

const statusCharCount = document.getElementById("statusCharCount");
const remarksCharCount = document.getElementById("remarksCharCount");
const takeawaysCharCount = document.getElementById("takeawaysCharCount");

let currentAction = null;

function updateCharCount(input, counter){
  counter.textContent = input.value.length;
  const maxLength = input.getAttribute("maxlength");
  if(input.value.length > maxLength * 0.9){
    counter.style.color = "#dc2626";
  }
  else{
    counter.style.color = "#6b7280";
  }
}

statusInput.addEventListener("input", () => updateCharCount(statusInput, statusCharCount));
remarksInput.addEventListener("input", () => updateCharCount(remarksInput, remarksCharCount));
takeawaysInput.addEventListener("input", () => updateCharCount(takeawaysInput, takeawaysCharCount));

function showMessage(text, type = "success") {
  messageDiv.textContent = text;
  messageDiv.className = `cf-diary-message ${type}`;
  messageDiv.classList.add("show");

  setTimeout(() => {
    messageDiv.classList.remove("show");
  }, 5000)
}

function showModal() {
  modalOverlay.classList.add("show");
  statusInput.focus();
  document.body.style.overflow = "hidden";
}

function hideModal() {
  modalOverlay.classList.remove("show");
  document.body.style.overflow = "";

  setTimeout(() => {
    modalForm.reset();
    messageDiv.classList.remove("show");
    updateCharCount(statusInput, statusCharCount);
    updateCharCount(remarksInput, remarksCharCount);
    updateCharCount(takeawaysInput, takeawaysCharCount);
  }, 200)
}

function prefillModal(problem) {
  statusInput.value = problem.status || "";
  remarksInput.value = problem.remarks || "";
  takeawaysInput.value = problem.takeaways || "";

  updateCharCount(statusInput, statusCharCount);
  updateCharCount(remarksInput, remarksCharCount);
  updateCharCount(takeawaysInput, takeawaysCharCount);

  showModal();
}

function setLoadingState(loading) {
  submitBtn.disabled = loading
  if(loading){
    submitText.style.display = "none";
    spinner.style.display = "block";
  }
  else{
    submitText.style.display = "block";
    spinner.style.display = "none";
  }
}

// Form validation
function validateForm() {
  const status = statusInput.value.trim();
  if(!status){
    showMessage("Status field is required", "error");
    statusInput.focus();
    return false;
  }
  return true;
}

closeBtn.addEventListener("click", hideModal);
cancelBtn.addEventListener("click", hideModal);

// Click outside to close
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    hideModal();
  }
})

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (modalOverlay.classList.contains("show")) {
    if(e.key === "Escape"){
      hideModal()
    }
    else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      modalForm.dispatchEvent(new Event("submit"))
    }
  }
})

// Form submission
modalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if(!validateForm()) return;

  const status = statusInput.value.trim();
  const remarks = remarksInput.value.trim();
  const takeaways = takeawaysInput.value.trim();

  setLoadingState(true);

  window.chrome.runtime.sendMessage(
    {
      action: currentAction || "submitProblem",
      data: { status, remarks, takeaways },
    },
    (response) => {
      setLoadingState(false)
      if (response && response.status === "success") {
        showMessage("Entry saved successfully! 🎉", "success")
        setTimeout(hideModal, 2000)
      }
      else{
        const errorMsg = response?.error || "Unknown error occurred";
        showMessage(`Error: ${errorMsg}`, "error");
      }
    },
  )
})

// Message listener
window.chrome.runtime.onMessage.addListener((request) => {
  if(request.action === "openModal"){
    currentAction = "submitProblem"
    submitText.textContent = "Submit"
    showModal()
  }
  if(request.action === "prefillModal"){
    const { data } = request
    if (data.status === "success" && data.problem) {
      currentAction = "updateProblem"
      submitText.textContent = "Update Entry"
      prefillModal(data.problem)
    }
    else{
      currentAction = "submitProblem"
      submitText.textContent = "Submit"
      showModal()
    }
  }
})
