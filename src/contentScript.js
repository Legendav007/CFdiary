const modalHTML = `
<style>
  /* --- Root Variables & Theme --- */
  :root {
    --bg-modal: #ffffff;
    --bg-overlay: rgba(17, 24, 39, 0.6);
    --bg-input: #ffffff;
    --bg-input-focus: #f9fafb;
    --bg-btn-secondary: #f3f4f6;
    --bg-btn-secondary-hover: #e5e7eb;
    --bg-btn-primary: linear-gradient(135deg, #3b82f6, #2563eb);
    --bg-btn-primary-hover: linear-gradient(135deg, #2563eb, #1d4ed8);
    --text-main: #111827;
    --text-secondary: #6b7280;
    --text-label: #374151;
    --text-on-primary: #ffffff;
    --border-light: #e5e7eb;
    --border-medium: #d1d5db;
    --focus-ring: rgba(59, 130, 246, 0.2);
    --shadow-modal: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    
    /* Success/Error Colors */
    --success-bg: #dcfce7;
    --success-text: #166534;
    --success-border: #bbf7d0;
    --error-bg: #fef2f2;
    --error-text: #b91c1c;
    --error-border: #fecaca;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-modal: #1f2937;
      --bg-overlay: rgba(0, 0, 0, 0.7);
      --bg-input: #374151;
      --bg-input-focus: #4b5563;
      --bg-btn-secondary: #4b5563;
      --bg-btn-secondary-hover: #525c6a;
      --text-main: #f9fafb;
      --text-secondary: #9ca3af;
      --text-label: #d1d5db;
      --border-light: #374151;
      --border-medium: #4b5563;
      --shadow-modal: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
    }
  }

  /* --- Base & Modal Styles --- */
  .cf-diary-modal-overlay {
    position: fixed;
    inset: 0;
    background: var(--bg-overlay);
    backdrop-filter: blur(5px);
    z-index: 10000;
    display: none;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cf-diary-modal-overlay.show {
    display: flex;
    opacity: 1;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .cf-diary-modal {
    background: var(--bg-modal);
    color: var(--text-secondary);
    border-radius: 16px;
    box-shadow: var(--shadow-modal);
    width: 100%;
    max-width: 550px;
    max-height: 90vh;
    overflow-y: auto;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transform: scale(0.95) translateY(10px);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cf-diary-modal-overlay.show .cf-diary-modal {
    transform: scale(1) translateY(0);
  }

  /* --- Header --- */
  .cf-diary-modal-header {
    padding: 24px;
    border-bottom: 1px solid var(--border-light);
    position: relative;
  }

  .cf-diary-modal-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-main);
    margin: 0 0 4px 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .cf-diary-modal-subtitle {
    font-size: 14px;
    margin: 0;
  }

  /* --- Content & Form --- */
  .cf-diary-modal-content {
    padding: 24px;
  }

  .cf-diary-form-group {
    margin-bottom: 24px;
  }

  .cf-diary-form-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-label);
    margin-bottom: 8px;
  }
  
  .cf-diary-form-label .required-star {
    color: #ef4444;
    font-weight: 700;
    margin-left: 2px;
  }
  
  .cf-diary-form-label span {
    font-weight: 400; 
    color: var(--text-secondary);
  }

  .cf-diary-form-input,
  .cf-diary-form-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-medium);
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    background-color: var(--bg-input);
    color: var(--text-main);
    transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
    resize: vertical;
    box-sizing: border-box;
  }

  .cf-diary-form-input:focus,
  .cf-diary-form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    background-color: var(--bg-input-focus);
    box-shadow: 0 0 0 4px var(--focus-ring);
  }

  .cf-diary-form-textarea { min-height: 80px; }
  .cf-diary-form-textarea.large { min-height: 120px; }
  
  .cf-diary-char-counter {
    text-align: right; 
    font-size: 12px; 
    color: var(--text-secondary);
    margin-top: 6px;
    transition: color 0.2s;
  }
  
  .cf-diary-char-counter.limit-near {
    color: #f59e0b;
    font-weight: 500;
  }
  
  .cf-diary-char-counter.limit-exceeded {
    color: #ef4444;
    font-weight: 700;
  }

  /* --- Message Area --- */
  .cf-diary-message {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s, transform 0.3s;
    border: 1px solid transparent;
  }

  .cf-diary-message.show {
    opacity: 1;
    transform: translateY(0);
  }

  .cf-diary-message.success {
    background-color: var(--success-bg);
    color: var(--success-text);
    border-color: var(--success-border);
  }

  .cf-diary-message.error {
    background-color: var(--error-bg);
    color: var(--error-text);
    border-color: var(--error-border);
  }

  /* --- Actions & Buttons --- */
  .cf-diary-modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding: 24px;
    background-color: var(--bg-modal);
    border-top: 1px solid var(--border-light);
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  .cf-diary-btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
  }

  .cf-diary-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .cf-diary-btn-secondary {
    background-color: var(--bg-btn-secondary);
    color: var(--text-label);
    border: 1px solid var(--border-medium);
  }

  .cf-diary-btn-secondary:hover:not(:disabled) {
    background-color: var(--bg-btn-secondary-hover);
    border-color: #9ca3af;
  }

  .cf-diary-btn-primary {
    background: var(--bg-btn-primary);
    color: var(--text-on-primary);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }

  .cf-diary-btn-primary:hover:not(:disabled) {
    background: var(--bg-btn-primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 7px 10px -2px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  }

  .cf-diary-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: var(--text-on-primary);
    border-radius: 50%;
    animation: cf-diary-spin 0.8s linear infinite;
  }
  
  .cf-diary-btn .cf-diary-icon {
    width: 16px;
    height: 16px;
    color: currentColor;
  }

  @keyframes cf-diary-spin {
    to { transform: rotate(360deg); }
  }

  .cf-diary-close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: color 0.2s, background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .cf-diary-close-btn svg { width: 20px; height: 20px; }

  .cf-diary-close-btn:hover {
    color: var(--text-main);
    background-color: var(--bg-btn-secondary);
  }

  /* --- Responsive --- */
  @media (max-width: 640px) {
    .cf-diary-modal-actions {
      flex-direction: column-reverse;
    }
    .cf-diary-btn {
      width: 100%;
    }
  }
</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">


<div id="cfDiaryModalOverlay" class="cf-diary-modal-overlay">
  <div class="cf-diary-modal" role="dialog" aria-labelledby="cfDiaryModalTitle" aria-modal="true">
    <div class="cf-diary-modal-header">
      <button class="cf-diary-close-btn" id="cfDiaryCloseBtn" aria-label="Close modal">
        <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
      </button>
      <h2 id="cfDiaryModalTitle" class="cf-diary-modal-title">
        <svg class="cf-diary-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 28px; height: 28px; color: #3b82f6;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
        CF Diary Entry
      </h2>
      <p class="cf-diary-modal-subtitle">Record your problem-solving journey and key insights.</p>
    </div>

    <div class="cf-diary-modal-content">
      <div id="cfDiaryMessage" class="cf-diary-message"></div>

      <form id="cfDiaryForm">
        <div class="cf-diary-form-group">
          <label for="cfDiaryStatus" class="cf-diary-form-label">
            Status <span class="required-star">*</span>
            <span>(How did you approach this problem?)</span>
          </label>
          <textarea id="cfDiaryStatus" class="cf-diary-form-textarea" placeholder="e.g., Solved independently, Used hints, Saw solution..." required maxlength="50"></textarea>
          <div class="cf-diary-char-counter"><span id="statusCharCount">0</span>/50</div>
        </div>

        <div class="cf-diary-form-group">
          <label for="cfDiaryRemarks" class="cf-diary-form-label">
            Remarks <span>(Your thoughts on the problem)</span>
          </label>
          <textarea id="cfDiaryRemarks" class="cf-diary-form-textarea" placeholder="e.g., Interesting patterns, tricky edge cases, etc." maxlength="50"></textarea>
          <div class="cf-diary-char-counter"><span id="remarksCharCount">0</span>/50</div>
        </div>

        <div class="cf-diary-form-group">
          <label for="cfDiaryTakeaways" class="cf-diary-form-label">
            Takeaways & Learning <span>(Key insights and concepts)</span>
          </label>
          <textarea id="cfDiaryTakeaways" class="cf-diary-form-textarea large" placeholder="Explain your thought process, new techniques, or concepts learned..." maxlength="50"></textarea>
          <div class="cf-diary-char-counter"><span id="takeawaysCharCount">0</span>/50</div>
        </div>

        <div class="cf-diary-form-group">
          <label for="cfDiaryTimeTaken" class="cf-diary-form-label">
            Time Taken <span>(in minutes)</span>
          </label>
          <input id="cfDiaryTimeTaken" type="number" min="0" class="cf-diary-form-input" placeholder="e.g., 42" maxlength="5"/>
        </div>
      </form>
    </div>
    
    <div class="cf-diary-modal-actions">
        <button type="button" id="cfDiaryCancelBtn" class="cf-diary-btn cf-diary-btn-secondary">
          Cancel
        </button>
        <button type="submit" id="cfDiarySubmitBtn" class="cf-diary-btn cf-diary-btn-primary" form="cfDiaryForm">
          <span id="cfDiarySubmitIcon">
            <svg class="cf-diary-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </span>
          <span id="cfDiarySubmitText">Submit</span>
          <div id="cfDiarySpinner" class="cf-diary-spinner" style="display: none;"></div>
        </button>
    </div>

  </div>
</div>
`;

if(!document.getElementById("cfDiaryModalOverlay")){
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

const shadowHost = document.createElement('div');
shadowHost.id = "cfDiaryShadowHost";
document.body.appendChild(shadowHost);
const shadow = shadowHost.attachShadow({ mode: 'open' });
shadow.innerHTML = modalHTML;

const modalOverlay = document.getElementById("cfDiaryModalOverlay");
const modalForm = document.getElementById("cfDiaryForm");
const statusInput = document.getElementById("cfDiaryStatus");
const remarksInput = document.getElementById("cfDiaryRemarks");
const takeawaysInput = document.getElementById("cfDiaryTakeaways");
const timeTakenInput = document.getElementById("cfDiaryTimeTaken");
const submitBtn = document.getElementById("cfDiarySubmitBtn");
const submitText = document.getElementById("cfDiarySubmitText");
const submitIcon = document.getElementById("cfDiarySubmitIcon"); // New
const spinner = document.getElementById("cfDiarySpinner");
const messageDiv = document.getElementById("cfDiaryMessage");
const closeBtn = document.getElementById("cfDiaryCloseBtn");
const cancelBtn = document.getElementById("cfDiaryCancelBtn");
const statusCharCount = document.getElementById("statusCharCount");
const remarksCharCount = document.getElementById("remarksCharCount");
const takeawaysCharCount = document.getElementById("takeawaysCharCount");

let currentAction = null;

function updateCharCount(input, counterElement) {
  const counterWrapper = counterElement.parentElement;
  const currentLength = input.value.length;
  const maxLength = parseInt(input.getAttribute("maxlength"), 10);
  
  counterElement.textContent = currentLength;

  counterWrapper.classList.remove("limit-near", "limit-exceeded");
  if(currentLength > maxLength){
    counterWrapper.classList.add("limit-exceeded");
  }
  else if(currentLength > maxLength * 0.9){
    counterWrapper.classList.add("limit-near");
  }
}

statusInput.addEventListener("input", () => updateCharCount(statusInput, statusCharCount));
remarksInput.addEventListener("input", () => updateCharCount(remarksInput, remarksCharCount));
takeawaysInput.addEventListener("input", () => updateCharCount(takeawaysInput, takeawaysCharCount));

function showMessage(text, type = "success"){
  const icon = type === 'success' 
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width:20px; height:20px;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width:20px; height:20px;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" /></svg>`;
  
  messageDiv.innerHTML = `${icon}<span>${text}</span>`;
  messageDiv.className = `cf-diary-message ${type}`;
  messageDiv.classList.add("show");

  setTimeout(() => {
    messageDiv.classList.remove("show");
  }, 5000);
}

function setLoadingState(loading){
  submitBtn.disabled = loading;
  submitText.style.display = loading ? "none" : "block";
  submitIcon.style.display = loading ? "none" : "block";
  spinner.style.display = loading ? "block" : "none";
}


function showModal() {
  // console.log("I am coming here");
  modalOverlay.classList.add("show");
  statusInput.focus();
  document.body.style.overflow = "hidden";
}

function hideModal(){
  modalOverlay.classList.remove("show");
  document.body.style.overflow = "";

  setTimeout(() =>{
    modalForm.reset();
    messageDiv.classList.remove("show");
    updateCharCount(statusInput, statusCharCount);
    updateCharCount(remarksInput, remarksCharCount);
    updateCharCount(takeawaysInput, takeawaysCharCount);
  }, 300);
}

function prefillModal(problem){
  statusInput.value = problem.status || "";
  remarksInput.value = problem.remarks || "";
  takeawaysInput.value = problem.takeaways || "";

  updateCharCount(statusInput, statusCharCount);
  updateCharCount(remarksInput, remarksCharCount);
  updateCharCount(takeawaysInput, takeawaysCharCount);

  showModal();
}

function validateForm(){
  const status = statusInput.value.trim();
  if(!status){
    showMessage("The Status field is required.", "error");
    statusInput.focus();
    return false;
  }
  return true;
}

closeBtn.addEventListener("click", hideModal);
cancelBtn.addEventListener("click", hideModal);
modalOverlay.addEventListener("click", (e) => {
  if(e.target === modalOverlay) hideModal();
});
document.addEventListener("keydown", (e)=>{
  if(modalOverlay.classList.contains("show")){
    if(e.key === "Escape") hideModal();
    if(e.key === "Enter" && (e.ctrlKey || e.metaKey)){
      e.preventDefault();
      submitBtn.click();
    }
  }
});

submitBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    if(!modalForm.checkValidity() || !validateForm()) return;

    const status = statusInput.value.trim();
    const remarks = remarksInput.value.trim();
    const takeaways = takeawaysInput.value.trim();
    const timeTaken = timeTakenInput.value.trim();

    setLoadingState(true);

    window.chrome.runtime.sendMessage(
        {
            action: currentAction || "submitProblem",
            data: { status, remarks, takeaways , timeTaken },
        },
        (response) => {
            setLoadingState(false);
            if(response && response.status === "success"){
                showMessage("Entry saved successfully!", "success");
                setTimeout(hideModal, 1500);
            }
            else{
                const errorMsg = response?.error || "An unknown error occurred.";
                showMessage(`Error: ${errorMsg}`, "error");
            }
        }
    );
});

window.chrome.runtime.onMessage.addListener((request) => {
  // console.log("Content script received");
  if(request.action === "openModal"){
    // console.log("here under openmodal");
    currentAction = "submitProblem";
    submitText.textContent = "Submit";
    showModal();
  }
  if(request.action === "prefillModal"){
    const { data } = request;
    if(data.status === "success" && data.problem){
      currentAction = "updateProblem";
      submitText.textContent = "Update Entry";
      prefillModal(data.problem);
    }
    else{
      currentAction = "submitProblem";
      submitText.textContent = "Submit";
      showModal();
    }
  }
});