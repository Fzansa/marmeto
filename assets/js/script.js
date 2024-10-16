let dataArr;
async function getCartData() {
    let url = 'https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889';

    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        dataArr = [...data.items];
        renderCartItems(dataArr);

    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
}




function renderCartItems(cartItems) {
    const tbody = document.getElementById('cart-items');
    tbody.innerHTML = '';

    cartItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.image}" alt="${item.product_title}" /></td>
            <td>${item.product_title}</td>
            <td class="price" data-price="${item.price}" >Rs. ${item.price.toLocaleString()}</td>
            <td><input type="number" value="${item.quantity}" class="quantity" data-id="${item.id}" min="1"/></td>
            <td class="dark subtotal">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
            <td><i class="fa-solid fa-trash remove-btn" data-id="${item.id}"></i></td>
        `;
        tbody.appendChild(tr);
    });

    updateCartTotal(cartItems); 
    addEventListeners();
}

function updateCartTotal(cartItems) {
    const subAmount = document.getElementById('subAmount');
    const totalAmount = document.getElementById('totalAmount');
    let totalPrice = 0;

    cartItems.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    subAmount.innerHTML = `Rs. ${totalPrice.toLocaleString()}`;
    totalAmount.innerHTML = `Rs. ${totalPrice.toLocaleString()}`;
}

function addEventListeners() {
    const removeButtons = document.querySelectorAll('.remove-btn');
    const quantityInputs = document.querySelectorAll('.quantity');

    // Handle removal of items
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const itemId = this.getAttribute('data-id');
            removeCartItem(itemId);
        });
    });

    // Handle quantity changes
    quantityInputs.forEach(quantity => {
        quantity.addEventListener('input', function () {
            const newQuantity = parseInt(this.value);
            const itemId = this.getAttribute('data-id');
            updateItemQuantity(itemId, newQuantity);
        });
    });
}

function removeCartItem(itemId) {
    dataArr = dataArr.filter(item => item.id != itemId);
    renderCartItems(dataArr);  // Re-render cart items after removal
}

function updateItemQuantity(itemId, newQuantity) {
    dataArr = dataArr.map(item => {
        if (item.id == itemId) {
            item.quantity = newQuantity;
        }
        return item;
    });
    renderCartItems(dataArr);  // Re-render cart items after quantity change
}

// Initialize fetching and rendering of cart data
getCartData();

function openMenu() {
    let menuContainer = document.getElementsByClassName('menuContainer');
    menuContainer[0].classList.toggle('open');
}

