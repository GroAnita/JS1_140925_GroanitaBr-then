// Alert/modal functions
export function showCustomAlert(message, title = "Alert") {
    const alertTitle = document.getElementById('alertTitle');
    const alertMessage = document.getElementById('alertMessage');
    const customAlert = document.getElementById('customAlert');
    
    if (alertTitle) alertTitle.textContent = title;
    if (alertMessage) alertMessage.textContent = message;
    if (customAlert) customAlert.style.display = 'block';
}

function closeCustomAlert() {
    const customAlert = document.getElementById('customAlert');
    if (customAlert) customAlert.style.display = 'none';
}

export function showPurchaseSuccess() {
    const successModal = document.getElementById('purchaseSuccessModal');
    if (successModal) successModal.style.display = 'block';
}

function closePurchaseSuccess() {
    const successModal = document.getElementById('purchaseSuccessModal');
    if (successModal) successModal.style.display = 'none';
}

function showAlert(message) {
    alert(message);
}

function closeAlert() {
    // Close generic alert
}
// Only keep one definition of initializeCustomAlert below:
function initializeCustomAlert() {
    const alertModal = document.getElementById('customAlert');
    const closeBtn = document.querySelector('.alert-close');
    const okBtn = document.getElementById('alertOkBtn');
    if (closeBtn) {
        closeBtn.onclick = closeCustomAlert;
    }
    if (okBtn) {
        okBtn.onclick = closeCustomAlert;
    }
    if (alertModal) {
        alertModal.onclick = function(event) {
            if (event.target === alertModal) {
                closeCustomAlert();
            }
        }
    }
    
    // Initialize purchase success modal if it exists (on checkout page)
    const successModal = document.getElementById('purchaseSuccessModal');
    if (successModal) {
        const successCloseBtn = document.querySelector('.success-close');
        const successOkBtn = document.getElementById('successOkBtn');
        if (successCloseBtn) {
            successCloseBtn.onclick = closePurchaseSuccess;
        }
        if (successOkBtn) {
            successOkBtn.onclick = function() {
                closePurchaseSuccess();
                window.location.href = 'index.html';
            };
        }
        successModal.onclick = function(event) {
            if (event.target === successModal) {
                closePurchaseSuccess();
            }
        }
    }
}

// Initialize the custom alert when the page loads
document.addEventListener('DOMContentLoaded', initializeCustomAlert);