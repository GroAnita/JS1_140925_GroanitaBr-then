// Alert/modal functions
function showCustomAlert(message, title = "Alert") { /* ...existing code... */ }
function closeCustomAlert() { /* ...existing code... */ }
function showPurchaseSuccess() { /* ...existing code... */ }
function closePurchaseSuccess() { /* ...existing code... */ }
function showAlert(message) { /* ...existing code... */ }
function closeAlert() { /* ...existing code... */ }
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
    if (isCheckoutPage) {
        const successModal = document.getElementById('purchaseSuccessModal');
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
        if (successModal) {
            successModal.onclick = function(event) {
                if (event.target === successModal) {
                    closePurchaseSuccess();
                }
            }
        }
    }
}