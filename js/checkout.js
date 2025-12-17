import { updateCartCounter, cart } from './cart.js';
import { showPurchaseSuccess } from './alerts.js';

// Checkout-related functions
const isCheckoutPage = window.location.pathname.includes('checkout.html');

function loadCheckoutCart() {
    const savedCart = localStorage.getItem('cart');
  
    displayCheckoutItems();
    calculateCheckoutTotal();
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartCounter();
    if (isCheckoutPage) {
        loadCheckoutCart();
    }
});

function calculateCheckoutTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
    const totalElement = document.getElementById('totalAmount');
    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    }
}

function displayCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.querySelector('.cart_items');
    const totalAmountElement = document.getElementById('totalAmount');
    if (!cartItemsContainer || !totalAmountElement) return;
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        totalAmountElement.textContent = '0.00';
        return;
    }
    let total = 0;
    cartItemsContainer.innerHTML = '';
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const cartItemHTML = `
            <div class="checkout-item">
                <img src="${item.image}" alt="${item.title}" class="checkout-item-image">
                <div class="checkout-item-details">
                    <div class="checkout-item-title">${item.title}</div>
                    <div class="checkout-item-size">Size: ${item.size || 'Not specified'}</div>
                    <div class="checkout-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    <div class="checkout-item-total">Total: $${itemTotal.toFixed(2)}</div>
                    <i class="fas fa-trash" onclick="removeCheckoutItem(${index})"></i>
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += cartItemHTML;
    });
    totalAmountElement.textContent = total.toFixed(2);
}

function placeOrder(event) {
    event.preventDefault();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCounter();
    displayCheckoutItems();
    showPurchaseSuccess();
}
function removeCheckoutItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        displayCheckoutItems();
    }
}

// Make functions globally accessible for onclick handlers
window.placeOrder = placeOrder;
window.removeCheckoutItem = removeCheckoutItem;