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
            this.smallPizzaTotal = this.priceFormat(this.smallPizzaTotal);
            break;
          case 'medium':
            this.mediumPizzaTotal += this.mediumPizzaPrice;
            this.mediumPizzaTotal = this.priceFormat(this.mediumPizzaTotal);
            break;
          case 'large':
            this.largePizzaTotal += this.largePizzaPrice;
            this.largePizzaTotal = this.priceFormat(this.largePizzaTotal);
            break;
        }
      },
      removeCart(pizzaSize) {
        // Decrement pizza total based on size
        switch (pizzaSize) {
          case 'small':
            if (this.smallPizzaTotal > 0) {
              this.smallPizzaTotal -= this.smallPizzaPrice;
              this.smallPizzaTotal = this.priceFormat(this.smallPizzaTotal);
              this.smallPizzaOrder = this.smallPizzaTotal !== 0;
            }
            break;
          case 'medium':
            if (this.mediumPizzaTotal > 0) {
              this.mediumPizzaTotal -= this.mediumPizzaPrice;
              this.mediumPizzaTotal = this.priceFormat(this.mediumPizzaTotal);
              this.mediumPizzaOrder = this.mediumPizzaTotal !== 0;
            }
            break;
          case 'large':
            if (this.largePizzaTotal > 0) {
              this.largePizzaTotal -= this.largePizzaPrice;
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
            break;
          case 'medium':
            this.mediumPizzaOrder = true;
            break;
          case 'large':
            this.largePizzaOrder = true;
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
        this.orderActive = false;
        this.paymentReady = false;
        this.thankYouText = false;
        this.insufficientText = false;
        this.payment = 0;
      },getChange(){
        this.getTotalCost();
        this.change=this.payment-this.totalCost;
        if(this.change>0){
          return 'Here is your change R'+this.change.toFixed(2);
        }else{
          return '';
        }
      }
    };
  }

  document.addEventListener('alpine:init', () => {
    Alpine.data('cart', Cart);
  });