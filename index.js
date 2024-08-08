document.addEventListener('DOMContentLoaded', () => {
    const products = {
        'order-page-Potato': 400,
        'order-page-Yam': 200,
        'order-page-carrot': 350,
        'order-page-Onion': 400,
        'order-page-Raddish': 250,
        'order-page-Cassava': 200,
        'order-page-apple': 1500,
        'order-page-Banana': 1000,
        'order-page-Mango': 400,
        'order-page-DragonFruit': 1200,
        'order-page-Grapes': 1900,
        'order-page-Mangosteen': 1650,
        'order-page-chicken': 2000,
        'order-page-crab': 2300,
        'order-page-mutton': 3500,
        'order-page-tuna': 2400,
        'order-page-squid': 1200,
        'order-page-salmon': 2000,
        'order-page-condensedmilk': 800,
        'order-page-cheese': 3000,
        'order-page-yogurt': 300,
        'order-page-ghee': 1200,
        'order-page-IceCream': 1300,
        'order-page-milk': 400,
        'order-page-flour': 350,
        'order-page-butter': 800,
        'order-page-sugar': 350,
        'order-page-baking-powder': 800,
        'order-page-vanilla-extract': 250,
        'order-page-cocoa-powder': 550
    };

    const inputs = document.querySelectorAll('.order-section input[type="number"]');
    
    function updateOrderSummary() {
        let totalAmount = 0;
        const orderSummaryBody = document.getElementById('order-summary-body');
        orderSummaryBody.innerHTML = '';

        inputs.forEach(input => {
            const quantity = parseFloat(input.value) || 0;
            if (quantity > 0) {
                const productId = input.id;
                const unitPrice = products[productId];
                const totalPrice = unitPrice * quantity;

                totalAmount += totalPrice;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${input.previousElementSibling.textContent.split(':')[0]}</td>
                    <td>${quantity}</td>
                    <td>${unitPrice}</td>
                    <td>${totalPrice}</td>
                `;
                orderSummaryBody.appendChild(row);
            }
        });

        document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
    }

    function saveToFavorites() {
        const favorites = {};
        inputs.forEach(input => {
            const quantity = parseFloat(input.value) || 0;
            if (quantity > 0) {
                favorites[input.id] = quantity;
            }
        });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Favorites saved successfully!');
    }

    function applyFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites'));
        if (favorites) {
            inputs.forEach(input => {
                if (favorites[input.id] !== undefined) {
                    input.value = favorites[input.id];
                } else {
                    input.value = 0;
                }
            });
            updateOrderSummary();
            alert('Favorites applied successfully!');
        } else {
            alert('No favorites found!');
        }
    }

    function goToCheckout() {
        const totalCost = document.getElementById('total-amount').textContent;
        const orderItems = Array.from(document.querySelectorAll('#order-summary-body tr')).map(row => {
            const cells = row.children;
            return {
                name: cells[0].textContent,
                quantity: cells[1].textContent,
                unitPrice: cells[2].textContent,
                totalPrice: cells[3].textContent
            };
        });
        const queryString = new URLSearchParams({
            totalCost: totalCost,
            orderItems: JSON.stringify(orderItems)
        }).toString();
        window.location.href = `checkout.html?${queryString}`;
    }

    // Add event listeners for buttons
    document.getElementById('favourites_button').addEventListener('click', saveToFavorites);
    document.getElementById('apply_favourites_button').addEventListener('click', applyFavorites);
    document.getElementById('order-page-button-checkout').addEventListener('click', goToCheckout);

    // Empty the order summary table on page refresh
    const orderSummaryBody = document.getElementById('order-summary-body');
    orderSummaryBody.innerHTML = '';
});

// Codes for the checkout page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('checkout.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const totalCost = urlParams.get('totalCost');
        const orderItems = JSON.parse(urlParams.get('orderItems'));

        if (totalCost && orderItems) {
            const orderSummaryBody = document.getElementById('checkout-summary-table');
            let totalAmount = 0;

            orderItems.forEach(item => {
                totalAmount += parseFloat(item.totalPrice);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice}</td>
                    <td>${item.totalPrice}</td>
                `;
                orderSummaryBody.appendChild(row);
            });

            document.getElementById('total-cost').textContent = totalAmount.toFixed(2);
        }

        document.getElementById('checkout-form').addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const address = document.getElementById('address').value.trim();
            const deliveryMethod = document.getElementById('delivery-method').value;
            const paymentMethod = document.getElementById('payment-method').value;

            if (name && address && deliveryMethod && paymentMethod) {
                const thankYouMessage = document.getElementById('thank-you-message');
                const purchaseTime = document.getElementById('purchase-time');
                const expectedDeliveryDate = document.getElementById('expected-delivery-date');
                const checkoutHeading = document.getElementById('checkout-heading');
                const now = new Date();

                const deliveryDate = calculateExpectedDeliveryDate(2);

                purchaseTime.textContent = now.toLocaleString();
                expectedDeliveryDate.textContent = deliveryDate;
                thankYouMessage.style.display = 'block';
                document.getElementById('checkout-form').style.display = 'none';
                
                checkoutHeading.classList.add('fade-out');

                setTimeout(() => {
                    thankYouMessage.style.opacity = '1';
                    thankYouMessage.style.transform = 'translateY(0)';
                }, 1000);
            }
        });

        function calculateExpectedDeliveryDate(days) {
            const date = new Date();
            date.setDate(date.getDate() + days);
            return date.toISOString().split('T')[0];
        }

        // Empty the order summary table on page refresh
        const orderSummaryBody = document.getElementById('order-summary-body');
        orderSummaryBody.innerHTML = '';
    }
});
