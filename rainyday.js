const API_URL = "https://v2.api.noroff.dev/rainy-days";

let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const isProductPage = window.location.pathname.includes('productpage.html') 
const isHomePage = window.location.pathname === '/' || window.location.pathname.includes('index.html');
const isCheckoutPage = window.location.pathname.includes('checkout.html');

async function fetchProducts() {
    if (!API_URL) {
        console.error("API_URL is not defined");
        return;
    }
    try {
        const respons = await fetch(API_URL);
        const data = await respons.json();
        
        const produkter = data.data || data;

        products = produkter; // lagre produkter globalt så jeg kan bruke det i andre functions
        console.log('Fetched products:', products);

        if (produkter && produkter.length > 0) {
            if(isProductPage) {
                const productId = getProductId() || produkter[0].id;
                const product = produkter.find(p => p.id === productId);
                if(product) {
                    displaySingleProduct(product);
                } 
            }
            // viser inntil 12 produkter (1 for hver produkt boks)for å kjøre en ny commit
            else if(isHomePage) {
                for (let i = 0; i < Math.min(12, produkter.length); i++) {
                    displayProduct(produkter[i], i);
                }
            }
        }
    }
    catch (error) {
        console.error("klarer ikke hente produkter:", error); // thinking of keeping this console.error... not sure yet
    }
}

function getProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function displaySingleProduct(product){
    const titleElement = document.getElementById('productTitle');
    if (titleElement) titleElement.textContent = product.title;

    const imageElement = document.getElementById('mainProductImage');
    if (imageElement && product.image) {
        imageElement.src = product.image.url;
        imageElement.alt = product.image.alt || product.title;
    }
    const priceElement = document.getElementById('productPrice');
    if (priceElement) priceElement.textContent = `Price: $${product.price}`;
    
    const descriptionElement = document.getElementById('productDescription');
    if (descriptionElement) descriptionElement.textContent = product.description;
    
    // Add sizes to the dropdown
    const sizeSelect = document.getElementById('sizeSelect');
    if (sizeSelect && product.sizes && product.sizes.length > 0) {
        // Clear existing options except the first one
        sizeSelect.innerHTML = '<option value="">Select Size</option>';
        
        // Add each size as an option
        product.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
    } else if (sizeSelect) {
        // If no sizes in API data, add default clothing sizes
        const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        sizeSelect.innerHTML = '<option value="">Select Size</option>';
        
        defaultSizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
    }
    
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.onclick = () => addToCart(product.id);
    }

    const buyNowBtn = document.getElementById('buyNowBtn');
    if (buyNowBtn) {
        buyNowBtn.onclick = () => buyNow();
    }
}




function displayProduct(product, index) {
    // Finding the product box for this index
    const productBoxes = document.querySelectorAll('.product_box');
    const currentBox = productBoxes[index];
    if (!currentBox) return;
    currentBox.innerHTML = "";
    currentBox.dataset.productId = product.id;
        console.log('Rendering product:', product);

    // Create the image section
    const imgDiv = document.createElement('div');
    imgDiv.className = 'product_img';
    const img = document.createElement('img');
    img.src = product.image ? product.image.url : '';
    img.alt = product.image ? (product.image.alt || product.title) : product.title;
    imgDiv.appendChild(img);
    currentBox.appendChild(imgDiv);

    // Create my info section
    const infoDiv = document.createElement('div');
    infoDiv.className = 'product_info';
    const title = document.createElement('h3');
    title.textContent = product.title;
    infoDiv.appendChild(title);
    const desc = document.createElement('p');
    desc.textContent = product.description;
    infoDiv.appendChild(desc);
    const price = document.createElement('p');
    price.textContent = `Price: $${product.price}`;
    infoDiv.appendChild(price);

    // Size dropdown meny
    const sizeDropdown = document.createElement('select');
    sizeDropdown.className = 'size-dropdown';
    const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Size';
    sizeDropdown.appendChild(defaultOption);
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeDropdown.appendChild(option);
    });
    infoDiv.appendChild(sizeDropdown);

    // View Details button
    const viewDetailsBtn = document.createElement('button');
    viewDetailsBtn.id = 'viewDetailsButton';
    viewDetailsBtn.textContent = 'View Details';
    viewDetailsBtn.onclick = () => {
        window.location.href = `productpage.html?id=${product.id}`;
    };
    infoDiv.appendChild(viewDetailsBtn);

    // Add to Cart button
    const addToCartBtnElement = document.createElement('button');
    addToCartBtnElement.id = 'addToCartButton';
    addToCartBtnElement.textContent = 'Add to Cart';
    addToCartBtnElement.onclick = () => {
        const selectedSize = sizeDropdown.value;
        if (!selectedSize) {
            showCustomAlert('Please select a size before adding to cart.', 'Size Required');
            return;
        }
        addToCart(product.id, selectedSize);
    };
    infoDiv.appendChild(addToCartBtnElement);

    currentBox.appendChild(infoDiv);
}

function addToCart(productId, size) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        return;
    }
    
    // sjekk om produktet allerede finnes i kurven
    let existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
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

function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCounter) {
        cartCounter.textContent = totalItems;
    }
}

function displayCartItems() {
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
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += cartItemHTML;
    });
    cartTotal.textContent = total.toFixed(2);
}
//funksjonen for å endre antall varer i handlekurven, basert på brukeren klikker + eller - for å legge til eller fjerne produkter. Når antallet kommer til 0 skal produktet fjernes helt fra kurven. 
function changeQuantity(itemAmount, change) {
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

function showCart() {
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.classList.add('show');
        displayCartItems();
    }
}

function hideCart() {
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.classList.remove('show');
    }
}

function buyNow(){ 
    const selectedProduct = getSelectedProduct();
    const sizeSelect = document.getElementById('sizeSelect');
    const selectedSize = sizeSelect ? sizeSelect.value : '';

    if (sizeSelect && !selectedSize) {
        showCustomAlert("Please choose a size before buying!", "Size Required");
        return;
    }

    selectedProduct.size = selectedSize;
    
    selectedProduct.id = getProductId();

    let existingItem = cart.find(item => item.id === selectedProduct.id && item.size === selectedProduct.size);
    if(existingItem){
        existingItem.quantity += selectedProduct.quantity;
    } else {
        cart.push(selectedProduct);
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCounter();

    // Redirect til checkout page
    window.location.href = 'checkout.html';
    }

function getSelectedProduct(){
    const productTitle = document.getElementById('productTitle').textContent;
    const priceText = document.getElementById('productPrice').textContent;
    const productPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    const productImage = document.getElementById('mainProductImage').src;

    return {
        title: productTitle,
        price: productPrice,
        image: productImage,
        quantity: 1
    };
}

//jeg har noen "tabs" på product sidene med reviews, shipping info etc.. denne funksjonen er for å aktivere disse sånn at de er aktive 1 om gangen så man jo da bare ser 1 fane om gangen. Og den fanen som er aktiv er da blå (satt i css som active class)
function initializeProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            button.classList.add('active');

            const tabName = button.getAttribute("data-tab");
            const tabPane = document.getElementById(tabName);
            if (tabPane) tabPane.classList.add('active');
        });
    });
}


function initializeFilter() {
    const filterSelect = document.getElementById('categoryFilter');
    if (!filterSelect) return;
    filterSelect.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        if (selectedCategory === '') {
            displayFilteredProducts(products);
        } else {
            filterProducts(selectedCategory);
        }
    });
}


function displayFilteredProducts(filteredProducts) {
    const productContainer = document.getElementById('product-container');
    if (productContainer) {
        productContainer.innerHTML = "";
        const maxProducts = Math.min(12, filteredProducts.length);
        for (let i = 0; i < maxProducts; i++) {
            const productBox = document.createElement('div');
            productBox.className = 'product_box';
            productContainer.appendChild(productBox);
            displayProduct(filteredProducts[i], i);
        }
    }
    console.log('Filtered Products:', filteredProducts);
}

function filterProducts(category) {
    if (!products || products.length === 0) return;

    let filteredProducts = products;

    if (category && category !== 'all') {
        filteredProducts = products.filter(product => {
            const productGender = product.gender ? product.gender.toLowerCase() : '';
            const productTitle = product.title ? product.title.toLowerCase() : '';
            const productTags = product.tags ? product.tags.join(', ').toLowerCase() : '';
            

            switch (category) {
                case "women":
                    return productGender.includes("female") || 
                           productTitle.includes('women') || 
                           productTitle.includes('female') ||
                           productTags.includes('women') ||
                           productTags.includes('female');
                           
                   
                case "men":
                     return productGender === "male" || 
                        /\bmen\b/i.test(productTitle) || 
                        /\bmale\b/i.test(productTitle) ||
                        /\bmen\b/i.test(productTags) ||
                        /\bmale\b/i.test(productTags);

                case 'accessories':
                    return productTitle.includes('accessory') ||
                           productTitle.includes('accessories') ||
                           productTags.includes('accessories');

                default:
                    return true;
            }
        });
    }
    
    // vise filtrerte produkter
        console.log('Filter category:', category);
        console.log('Filtered products:', filteredProducts);
    displayFilteredProducts(filteredProducts);
}

function checkout(){
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    // Saving cart to localStorage before redirecting (it's already saved, but just to be sure)
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Redirecting to checkout page
    window.location.href = 'checkout.html';
}

// starte "appen"
fetchProducts().then(() => {
    updateCartCounter();
    
    // Add this for checkout page
    if (isCheckoutPage) {
        loadCheckoutCart();
    }
    
    //  event listeners for my cart
    const shoppingBag = document.querySelector('.shopping_bag');
    const closeCart = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');
    if (isProductPage) {
        initializeProductTabs();
    }
    if (isHomePage) {
        initializeFilter();
    }
    if (shoppingBag) {
        shoppingBag.addEventListener('click', showCart);
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', hideCart);
    }
    
    // Lukk cart når man klikker utenfor
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) {
                hideCart();
            }
        });
    }

    // Initializing custom alert modal
    initializeCustomAlert();
});

// Checkout



function loadCheckoutCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    displayCheckoutItems();
    calculateCheckoutTotal();
}


// Call this when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update cart counter on all pages
    updateCartCounter();
    
    // If we're on checkout page, display items
    if (window.location.pathname.includes('checkout.html')) {
        displayCheckoutItems();
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


// Custom Alert Modal Functions testing
function showCustomAlert(message, title = "Alert") {
    document.getElementById('alertTitle').textContent = title;
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('customAlert').style.display = 'block';
}

function closeCustomAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

// Purchase Success Modal Functions
function showPurchaseSuccess() {
    // Generate random order ID
    const orderId = '#RD' + Math.floor(Math.random() * 1000000);
    
    // Calculate delivery date (7-14 days from now)
    const deliveryDays = Math.floor(Math.random() * 8) + 7; // 7-14 days
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
    const formattedDate = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Update modal content
    document.getElementById('purchaseId').textContent = orderId;
    document.getElementById('deliveryDate').textContent = formattedDate;
    
    // Show modal
    document.getElementById('purchaseSuccessModal').style.display = 'block';
}

function closePurchaseSuccess() {
    document.getElementById('purchaseSuccessModal').style.display = 'none';
}

// Place Order function for checkout page
function placeOrder(event) {
    event.preventDefault(); // Prevent form submission
    
    // Validate that there are items in cart
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    // Clear the cart after successful order
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    //empty checkoutpage for times when cart is cleared
    displayCheckoutItems();
    // Show purchase success modal
    showPurchaseSuccess();
}


function showAlert(message) {
    showCustomAlert(message);
}

function closeAlert() {
    closeCustomAlert();
}

// Initialize Custom Alert confirmedPurchase Modal
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
    
    // Closing when I am clicking outside the modal
    if (alertModal) {
        alertModal.onclick = function(event) {
            if (event.target === alertModal) {
                closeCustomAlert();
            }
        }
    }
    
    // Initialize Purchase Success Modal (only on my checkout page)
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
                // Redirect to home page for continuing shopping
                window.location.href = 'index.html';
            };
        }
        
        // Closing when I am clicking outside the success modal
        if (successModal) {
            successModal.onclick = function(event) {
                if (event.target === successModal) {
                    closePurchaseSuccess();
                }
            }
        }
    }
}

function displayCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.querySelector('.cart_items');
    const totalAmountElement = document.getElementById('totalAmount');
    
    // Check if I am on the checkout page , it know this because these elements are only found on checkoutpage
    if (!cartItemsContainer || !totalAmountElement) return;
    
    // If my cart is empty
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        totalAmountElement.textContent = '0.00';
        return;
    }
    
    let total = 0;
    cartItemsContainer.innerHTML = '';
    
    // Loop through each cart item
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        // Create HTML for each item
        const cartItemHTML = `
            <div class="checkout-item">
                <img src="${item.image}" alt="${item.title}" class="checkout-item-image">
                <div class="checkout-item-details">
                    <div class="checkout-item-title">${item.title}</div>
                    <div class="checkout-item-size">Size: ${item.size || 'Not specified'}</div>
                    <div class="checkout-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    <div class="checkout-item-total">Total: $${itemTotal.toFixed(2)}</div>
                </div>
            </div>
        `;
        
        cartItemsContainer.innerHTML += cartItemHTML;
    });
    
    // Updating my total amount
    totalAmountElement.textContent = total.toFixed(2);
}