// Cart-related functions
export let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function addToCart(product, size) {
    if (!product) {
        return;
    }
    // sjekk om produktet allerede finnes i kurven
    let existingItem = cart.find(item => item.id === product.id && item.size === size);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image.url,
            size: size, 
            quantity: 1,
        });
    }
    // Lagre til localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    // oppdatering cart teller
    updateCartCounter();
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
        
//template literals : ${item.image}. tar image propertien og setter den som en src verdi : f.eks. https://rainydays.no/powerjacket.jpg og samme med item.title som da henter tittelen fra objektet og den blir alt tekst f.eks :  Rainjacket 

        const cartItemHTML = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-size">Size: ${item.size}</div>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-item-quantity">
                    <div class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</div>
                    <div class="quantity-number">${item.quantity}</div>
                    <div class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</div>
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

export function showCart() {
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.classList.add('show');
        displayCartItems();
    }
}

export function hideCart() {
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.classList.remove('show');
    }
}

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