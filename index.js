<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pizza Order</title>
    <script src="//unpkg.com/alpinejs" defer></script>
    <!-- Include Tailwind CSS via CDN -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f2f5;
        }

        .counter-widget {
            text-align: center;
            padding: 20px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            background-color: #fff;
            width: 300px;
        }
    </style>
</head>
<body>
    <div x-data="Cart()">
        <div class="counter-widget">
            <h1 class="text-xl font-semibold mb-4">Pizza Order</h1>
            <div x-show="orderActive">
                <div x-show="smallPizzaOrder" class="mb-2">Small Pizza x <span x-text="smallPizzaQuantity"></span> - R<span x-text="smallPizzaTotal.toFixed(2)"></span></div>
                <div x-show="mediumPizzaOrder" class="mb-2">Medium Pizza x <span x-text="mediumPizzaQuantity"></span> - R<span x-text="mediumPizzaTotal.toFixed(2)"></span></div>
                <div x-show="largePizzaOrder" class="mb-2">Large Pizza x <span x-text="largePizzaQuantity"></span> - R<span x-text="largePizzaTotal.toFixed(2)"></span></div>
                <hr class="my-2">
                <div>Total Cost: R<span x-text="totalCost.toFixed(2)"></span></div>
            </div>
            <div class="space-y-4" x-show="!orderActive">
                <button @click="buy('small')" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">Add Small Pizza</button>
                <button @click="buy('medium')" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">Add Medium Pizza</button>
                <button @click="buy('large')" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">Add Large Pizza</button>
            </div>
            <div x-show="orderActive">
                <button @click="removeCart('small')" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none">Remove Small Pizza</button>
                <button @click="removeCart('medium')" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none">Remove Medium Pizza</button>
                <button @click="removeCart('large')" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none">Remove Large Pizza</button>
                <button @click="checkout()" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none">Checkout</button>
            </div>
            <div x-show="paymentReady">
                <input type="number" x-model="payment" placeholder="Enter payment amount" class="px-4 py-2 mt-4 w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200">
                <button @click="pay()" class="px-4 py-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">Pay</button>
                <div x-show="thankYouText" class="mt-4 text-green-600">Thank you for your payment!</div>
                <div x-show="insufficientText" class="mt-4 text-red-600">Insufficient payment amount.</div>
                <div x-text="getChange()" class="mt-2 text-blue-600"></div>
            </div>
            <div x-show="thankYouText || insufficientText" class="mt-4">
                <button @click="reset()" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none">Reset</button>
            </div>
        </div>
    </div>

    <script>
        function Cart() {
            return {
                // Cart properties
                totalCost: 0,
                smallPizzaPrice: 49.00,
                mediumPizzaPrice: 79.00,
                largePizzaPrice: 119.00,
                smallPizzaTotal: 0,
                mediumPizzaTotal: 0,
                largePizzaTotal: 0,
                smallPizzaOrder: false,
                mediumPizzaOrder: false,
                largePizzaOrder: false,
                smallPizzaQuantity: 0,
                mediumPizzaQuantity: 0,
                largePizzaQuantity: 0,
                orderActive: false,
                paymentReady: false,
                thankYouText: false,
                insufficientText: false,
                payment: 0,

                // Cart methods
                addCart(pizzaSize) {
                    // Increment pizza total based on size
                    switch (pizzaSize) {
                        case 'small':
                            this.smallPizzaTotal += this.smallPizzaPrice;
                            this.smallPizzaQuantity++;
                            break;
                        case 'medium':
                            this.mediumPizzaTotal += this.mediumPizzaPrice;
                            this.mediumPizzaQuantity++;
                            break;
                        case 'large':
                            this.largePizzaTotal += this.largePizzaPrice;
                            this.largePizzaQuantity++;
                            break;
                    }
                },
                removeCart(pizzaSize) {
                    // Decrement pizza total based on size
                    switch (pizzaSize) {
                        case 'small':
                            if (this.smallPizzaTotal > 0) {
                                this.smallPizzaTotal -= this.smallPizzaPrice;
                                this.smallPizzaQuantity--;
                                this.smallPizzaTotal = this.priceFormat(this.smallPizzaTotal);
                                this.smallPizzaOrder = this.smallPizzaTotal !== 0;
                            }
                            break;
                        case 'medium':
                            if (this.mediumPizzaTotal > 0) {
                                this.mediumPizzaTotal -= this.mediumPizzaPrice;
                                this.mediumPizzaQuantity--;
                                this.mediumPizzaTotal = this.priceFormat(this.mediumPizzaTotal);
                                this.mediumPizzaOrder = this.mediumPizzaTotal !== 0;
                            }
                            break;
                        case 'large':
                            if (this.largePizzaTotal > 0) {
                                this.largePizzaTotal -= this.largePizzaPrice;
                                this.largePizzaQuantity--;
                                this.largePizzaTotal = this.priceFormat(this.largePizzaTotal);
                                this.largePizzaOrder = this.largePizzaTotal !== 0;
                            }
                            break;
                    }
                },
                buy(pizzaSize) {
                    // Set pizza order based on size
                    switch (pizzaSize) {
                        case 'small':
                            this.smallPizzaOrder = true;
                            this.smallPizzaQuantity++;
                            break;
                        case 'medium':
                            this.mediumPizzaOrder = true;
                            this.mediumPizzaQuantity++;
                            break;
                        case 'large':
                            this.largePizzaOrder = true;
                            this.largePizzaQuantity++;
                            break;
                    }
                    this.addCart(pizzaSize);
                    this.orderActive = true;
                },
                getTotalCost() {
                    // Calculate total cost and update order status
                    this.totalCost = this.smallPizzaTotal + this.mediumPizzaTotal + this.largePizzaTotal;
                    this.orderActive = this.totalCost !== 0;
                    return 'R' + this.totalCost.toFixed(2);
                },
                priceFormat(price) {
                    return parseFloat(price.toFixed(2));
                },
                checkout() {
                    this.paymentReady = true;
                },
                pay() {
                    try {
                        this.payment = parseFloat(this.payment);
                        if (isNaN(this.payment)) {
                            return alert('Invalid input, please enter a valid number');
                        }
                    } catch (error) {
                        alert(error.message);
                    }

                    if (this.payment >= this.totalCost) {
                        // Show thank you text for 10 seconds
                        this.thankYouText = true;
                        setTimeout(() => {
                            this.thankYouText = false;
                        }, 10000);

                        // Reset cart after 8 seconds
                        setTimeout(() => {
                            this.reset();
                        }, 8000);
                    } else {
                        // Show insufficient text for 3 seconds
                        this.insufficientText = true;
                        setTimeout(() => {
                            this.insufficientText = false;
                        }, 3000);
                    }
                },
                reset() {
                    // Reset all cart properties to their initial values
                    this.totalCost = 0;
                    this.smallPizzaTotal = 0;
                    this.mediumPizzaTotal = 0;
                    this.largePizzaTotal = 0;
                    this.smallPizzaOrder = false;
                    this.mediumPizzaOrder = false;
                    this.largePizzaOrder = false;
                    this.smallPizzaQuantity = 0;
                    this.mediumPizzaQuantity = 0;
                    this.largePizzaQuantity = 0;
                    this.orderActive = false;
                    this.paymentReady = false;
                    this.thankYouText = false;
                    this.insufficientText = false;
                    this.payment = 0;
                },
                getChange() {
                    this.getTotalCost();
                    this.change = this.payment - this.totalCost;
                    if (this.change > 0) {
                        return 'Here is your change R' + this.change.toFixed(2);
                    } else {
                        return '';
                    }
                }
            };
        }

        document.addEventListener('alpine:init', () => {
            Alpine.data('cart', Cart);
        });
    </script>
</body>
</html>
