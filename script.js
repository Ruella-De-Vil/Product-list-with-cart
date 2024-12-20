function addToCart(event) { /* addToCart(event) vs addToCart() --- targets the dessert/<article> most closely associated with the button clicked */
    const element = event.currentTarget;

    if (element && !element.classList.contains('transformed')) { // check if already transformed
    element.innerHTML = 

// first click transforms the button to a quantity selector
    `<div class="quantity-selector">
        <a class="quantity-change-down"><svg class="decrease" xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path d="M0 .375h10v1.25H0V.375Z" alt="decrease-amount-button"/></svg></a>
        <span class="quantity-of-items-to-add">1</span>
        <a class="quantity-change-up"><svg class="increase" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" alt="increase-amount-button"/></svg></a>
    </div>
    `;

    // Add class to mark as transformed
    element.classList.add('transformed');

    const selectedArticle = element.closest('article');
    const selectedImage = selectedArticle.querySelector('.item-image'); // Add this class to your image elements
    selectedImage.classList.add('highlight-item');

    const quantitySelector = element.querySelector('.quantity-selector');
    quantitySelector.classList.add('quantity-selector');  // Add the class to the button


    // Add event listeners to the new <a> tags
    const decreaseBtn = quantitySelector.querySelector('.quantity-change-down');
    const increaseBtn =  quantitySelector.querySelector('.quantity-change-up');
    const quantitySpan = quantitySelector.querySelector('.quantity-of-items-to-add');
    const cart = document.querySelector('.cart');

    // gets the parent article of button clicked (closest)
    const parentArticle = element.closest('article');

    // Get the text content you want from the parent article
    const dessertName = parentArticle.querySelector('.dessert-name').textContent;
    const dessertPrice = parentArticle.querySelector('.price').textContent;

    // Check if cart is empty first
    if (!cart.querySelector('.cart-item')) {
    cart.innerHTML = `
        <h2 class="cart-title">Your Cart (<span id="number-of-cart-items">0</span>)</h2>
    `;
}

    // Create new cart item
    cart.innerHTML += `
            <div class="cart-item">
            <h3 class="cart-item-name">${dessertName}</h3>
                <div class="cart-item-details">
                    <span class="cart-item-quantity">${quantitySpan.textContent}X</span>
                    <span class="cart-item-price">@ R ${dessertPrice}</span>
                    <span class="total-item-amount">R ${parseInt(dessertPrice) * parseInt(quantitySpan.textContent)}</span>
                    <button class="remove-items">x</button>
                </div>
                <hr />
             </div>
    `;



    // Update total items in cart
    const updateCartCount = () => {
    const items = cart.querySelectorAll('.cart-item');
    let totalItems = 0;
    items.forEach(item => {
        const quantityText = item.querySelector('.cart-item-quantity').textContent;
        totalItems += parseInt(quantityText);
    });
    // Update the total items count in the cart title
    document.getElementById('number-of-cart-items').textContent = totalItems;
};

updateCartCount();
updateCartFooter();
    

    // Handle increase click
    increaseBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent parent button click
        let quantity = parseInt(quantitySpan.textContent); // parseInt converts a string into an integer
        if (quantity < 10) {  // Only increase if less than 10
            quantity += 1;
            quantitySpan.textContent = quantity;

             // Update this specific item in cart
            const itemInCart = Array.from(cart.querySelectorAll('.cart-item-name'))
                .find(item => item.textContent === dessertName)
                .closest('.cart-item');

            const cartItemQuantity = itemInCart.querySelector('.cart-item-quantity');
            const totalItemAmount = itemInCart.querySelector('.total-item-amount');
            cartItemQuantity.textContent = `${quantity}X`;
            totalItemAmount.textContent = `R ${parseInt(dessertPrice) * quantity}`;
            
            // Update total items in cart
            updateCartCount();
            updateCartFooter();
        } else {
            alert("You can't order more than 10 of the same item.");
        }
    });

    // Handle decrease click
    decreaseBtn.addEventListener('click', function(e) { //the e parameter is for event
        e.stopPropagation(); // Prevent parent button click
        let quantity = parseInt(quantitySpan.textContent);
        if (quantity > 1) {
            quantity -= 1;
            quantitySpan.textContent = quantity;
            
            // Update this specific item in cart
                const itemInCart = Array.from(cart.querySelectorAll('.cart-item-name'))
                .find(item => item.textContent === dessertName)
                .closest('.cart-item');
            
            const cartItemQuantity = itemInCart.querySelector('.cart-item-quantity');
            const totalItemAmount = itemInCart.querySelector('.total-item-amount');
            cartItemQuantity.textContent = `${quantity}X`;
            totalItemAmount.textContent = `R ${parseInt(dessertPrice) * quantity}`;
        
            updateCartCount();
            updateCartFooter();

        } else {
            // Remove just this item
        const itemToRemove = Array.from(cart.querySelectorAll('.cart-item-name'))
        .find(item => item.textContent === dessertName)
        .closest('.cart-item');
    itemToRemove.remove();
    
    element.innerHTML = `<span class="button-return"><img src="assets/icon-add-to-cart.svg"/>Add to Cart`;
    element.classList.remove('transformed');
    element.classList.add('button');
    selectedImage.classList.remove('highlight-item');
    
    // If cart is empty, reset it
    if (!cart.querySelector('.cart-item')) {
        cart.innerHTML = `
            <h2 class="cart-title">Your Cart (<span id="number-of-cart-items">0)</h2>
            <img src="assets/illustration-empty-cart.svg"/>
            <p>Your added items will appear here</p>
        `;

        // Hide the confirm section
        const confirmSection = document.querySelector('.confirm');
        confirmSection.style.display = 'none';
    } else {
        updateCartCount();
        updateCartFooter();

    }
    }});

    //confirm order section
    function updateCartFooter() {
        const cartFooter = document.querySelector('.confirm');
        const cartItems = document.querySelectorAll('.cart-item');
        
        if (cartItems.length > 0) {
            cartFooter.style.display = 'block';
            
            // Calculate total
            let total = 0;
            cartItems.forEach(item => {
                const amountText = item.querySelector('.total-item-amount').textContent;
                const amount = parseFloat(amountText.replace('R ', ''));
                total += amount;
            });
            
            // Update total display
            const totalElement = cartFooter.querySelector('.total-amount');
            totalElement.textContent = `R ${total.toFixed(2)}`;
        } else {
            cartFooter.style.display = 'none';
        }
    }
    
    document.querySelector('.cart').addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remove-items')) {
            // 1. Get the cart item and its name
            const cartItem = e.target.closest('.cart-item');

            // 2. Remove the item from cart
            cartItem.remove();

            //.3 Restore original state
            const itemName = cartItem.querySelector('.cart-item-name').textContent;
            console.log(itemName);

            let element;
            document.querySelectorAll('.dessert-name').forEach(el => {
            if (el.textContent === itemName) {
            element = el;
        }
        });console.log(element);

            const restorebtn = element.closest('article').querySelector('button');  
            console.log(restorebtn);
            restorebtn.innerHTML = `<span class="button-return"><img src="assets/icon-add-to-cart.svg"/>Add to Cart</span>`;
            restorebtn.classList.remove('transformed');
            restorebtn.classList.add('button-returned');
            
            const elementImage = element.closest('article').querySelector('.item-image');
            elementImage.classList.remove('highlight-item');

            
            // 4. Check if cart is empty and reset if needed
            const remainingItems = document.querySelectorAll('.cart-item');
            const cart = document.querySelector('.cart');
            
            if (remainingItems.length === 0) {
                // Reset cart to empty state
                cart.innerHTML = `
                    <h2 class="cart-title">Your Cart (<span id="number-of-cart-items">0)</h2>
                    <img src="assets/illustration-empty-cart.svg"/>
                    <p>Your added items will appear here</p>
                `;


            updateCartFooter();

            } else {
                // Update cart count if items remain
                const numberDisplay = document.getElementById('number-of-cart-items');
                let totalItems = 0;
                remainingItems.forEach(item => {
                    const quantity = parseInt(item.querySelector('.cart-item-quantity').textContent);
                    totalItems += quantity;
                });
                numberDisplay.textContent = totalItems;
            }
        }
    });
};

// First, remove any existing event listener
const confirmBtn = document.querySelector('.confirm-order-btn');
const oldConfirmBtn = confirmBtn.cloneNode(true); 
confirmBtn.parentNode.replaceChild(oldConfirmBtn, confirmBtn);

document.querySelector('.confirm-order-btn').addEventListener('click', function() {
    const modalConfirmedOrder = document.querySelector('.modal-confirmed-order');
    const cartItems = document.querySelectorAll('.cart-item');
    const totalAmount = document.querySelector('.total-amount').textContent;
    

    // Clear existing content first
    modalConfirmedOrder.innerHTML = '';

    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Copy each cart item to the modal
    cartItems.forEach(item => {
         const cartItemDiv = document.createElement('div');

         //Object for dessert thumbnails
    const dessertThumbnails = {
        "Pistachio Baklava": "assets/image-baklava-thumbnail.jpg",
        "Waffle with Berries": "assets/image-waffle-thumbnail.jpg",
        "Vanilla Bean Crème Brûlée": "assets/image-creme-brulee-thumbnail.jpg",
        "Macaron Mix of Five": "assets/image-macaron-thumbnail.jpg",
        "Classic Tiramisu": "assets/image-tiramisu-thumbnail.jpg",
        "Lemon Meringue Pie": "assets/image-meringue-thumbnail.jpg",
        "Red Velvet Cake": "assets/image-cake-thumbnail.jpg",
        "Salted Caramel Brownie": "assets/image-brownie-thumbnail.jpg",
        "Vanilla Panna Cotta": "assets/image-panna-cotta-thumbnail.jpg"
    }; 

    // Get the corresponding image for this dessert
    const dessertThumbnail = dessertThumbnails[item.querySelector('.cart-item-name').textContent];

         cartItemDiv.className = 'cart-item';
         cartItemDiv.innerHTML = `
             <div class="cart-item-details">
                 <img class="cart-item-thumbnail" src="${dessertThumbnail}" alt="${item.querySelector('.cart-item-name').textContent}">
                 <span class="items">
                    <h3 class="cart-item-name">${item.querySelector('.cart-item-name').textContent}</h3>
                    <span class="cart-item-quantity">${item.querySelector('.cart-item-quantity').textContent}</span>
                    <span class="cart-item-price">${item.querySelector('.cart-item-price').textContent}</span>
                    <span class="total-item-amount">${item.querySelector('.total-item-amount').textContent}</span>
                    <hr/>
                 </span>
             </div>
         `;
         fragment.appendChild(cartItemDiv);
     });
 
     // Add total amount
     const totalDiv = document.createElement('div');
     totalDiv.className = 'modal-total';
     totalDiv.innerHTML = `<p>Order Total: <strong>${totalAmount}</strong</p>`;
     fragment.appendChild(totalDiv);
 
     // Append all content at once
     modalConfirmedOrder.appendChild(fragment);
 
     // Show the modal
     document.getElementById('confirmationModal').style.display = 'flex';
 });

    const closeModal = document.querySelector('.close-modal');
    closeModal.addEventListener('click', function() {
    // First hide the modal
     document.getElementById('confirmationModal').style.display = 'none';
    // Clear the cart contents
    document.querySelector('.modal-confirmed-order').innerHTML = null;
    // Then reload the page
 window.location.reload();
});
 
}

