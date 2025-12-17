// Cart-related functions
export let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function addToCart(product, size) {
    if (!product) {
        console.error('Product is undefined');
        return;
    }
    console.log('Adding to cart:', product.title, 'Size:', size);
    
    // sjekk om produktet allerede finnes i kurven
    let existingItem = cart.find(item => item.id === product.id && item.size === size);
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('Increased quantity for existing item');
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image.url,
            size: size, 
            quantity: 1,
        });
        console.log('Added new item to cart');
    }
    
    // Lagre til localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart saved to localStorage:', cart);
    
    // oppdatering cart teller
    updateCartCounter();
    
    // Show success message
    showCart();
}

export function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCounter) {
        cartCounter.textContent = totalItems;
    }
}

export function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    let total = 0;
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemHTML = `
            <div class="item">
                <img src="${item.image}" alt="${item.title}" />
                <div>
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-size">Size: ${item.size}</div>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="quantity">
                    <span onclick="changeQuantity(${index}, -1)">-</span>
                    <span>${item.quantity}</span>
                    <span onclick="changeQuantity(${index}, 1)">+</span>
                </div>
                <div>
                    <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                    <i class="fas fa-trash" onclick="removeFromCart(${index})"></i>
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += cartItemHTML;
    });
    
    cartTotal.textContent = total.toFixed(2);
}

export function changeQuantity(itemAmount, change) {
    if (itemAmount >= 0 && itemAmount < cart.length) {
        cart[itemAmount].quantity += change;
//splice fjerner produktet når man kommer til 0
        if (cart[itemAmount].quantity <= 0) {
            cart.splice(itemAmount, 1);
        }
        //oppdaterer til localstorage og refresher kurven til nåværende resultat.
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        displayCartItems();
        if (window.location.pathname.includes('checkout.html')) {
            displayCheckoutItems();
        }
    }
}

// Make changeQuantity globally accessible for onclick handlers
window.changeQuantity = changeQuantity;

export function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        displayCartItems();
    }
}

// Make removeFromCart globally accessible for onclick handlers
window.removeFromCart = removeFromCart;

export function showCart() {
    document.body.classList.add('show-cart');
    displayCartItems();
}

export function hideCart() {
    document.body.classList.remove('show-cart');
}

export function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout.html';
}

// Make functions globally accessible for onclick handlers
window.changeQuantity = changeQuantity;
window.checkout = checkout;

document.addEventListener('DOMContentLoaded', function() {
    updateCartCounter();
    // Show cart overlay when cart icon is clicked
    const shoppingBag = document.querySelector('.shopping_bag');
    if (shoppingBag) {
        shoppingBag.addEventListener('click', showCart);
    }
    // Hide cart overlay when close button is clicked
    const closeCart = document.getElementById('closeCart');
    if (closeCart) {
        closeCart.addEventListener('click', hideCart);
    }
    // Hide cart overlay when clicking outside the cart content
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', function(e) {
            if (e.target === cartOverlay) {
                hideCart();
            }
        });
    }
});