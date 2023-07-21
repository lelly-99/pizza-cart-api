document.addEventListener("alpine:init", () => {
    Alpine.data("pizzaCartApi", () => {
      return {
        title: "Pizza Cart API",
        username: "",
        pizzas: [],
        count: 0,
        cartId: "",
        cartPizzas: [],
        cartTotal: 0.0,
        paymentAmount: "",
        message: "",
        errorMessage: '',
        login(){
            if(this.username.length > 3){
                this.createCart();
            } else {
               alert('Username must contain atleast four characters!') 
            }
        },
        createCart(){
            if(!this.username){
                this.cartId
            }
            const createCartUrl = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`
            const cartId = localStorage['cardId']
            if(cartId){
                this.cartId = cartId
            }else {
                return axios.get(createCartUrl).then(result => {
                    this.cartId = result.data.cart_code;
                    localStorage['cardId'] = this.cartId
                })
            }
        },
        getCart() {
          const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;
          return axios.get(getCartURL);
        },
        addPizza(pizzaId) {
          return axios.post(
            "https://pizza-api.projectcodex.net/api/pizza-cart/add",
            {
              cart_code: this.cartId,
              pizza_id: pizzaId,
            },
          );
        },
        removePizza(pizzaId) {
          return axios.post(
            "https://pizza-api.projectcodex.net/api/pizza-cart/remove",
            {
              cart_code: this.cartId,
              pizza_id: pizzaId,
            },
          );
        },
        pay(amount){
            return axios.post(
                "https://pizza-api.projectcodex.net/api/pizza-cart/pay",
                {
                  cart_code: this.cartId,
                  amount: amount,
                },
              );
        },
        showCart() {
          this.getCart().then((result) => {
            const cartData = result.data;
            this.cartPizzas = cartData.pizzas;
            this.cartTotal = cartData.total;
            this.count = cartData.pizzas.reduce((total, pizza) => total + pizza.qty, 0);
          });
        },
        init() {
          axios
            .get("https://pizza-api.projectcodex.net/api/pizzas")
            .then((result) => {
              this.pizzas = result.data.pizzas;
            });
          if (!this.cartId){
            this.createCart().then(() => {
                this.showCart();
            })
          }
          this.showCart();
        },
        addPizzaToCart(pizzaId) {
          this.addPizza(pizzaId).then(() => {
            this.showCart();
          });
        },
        removePizzaFromCart(pizzaId) {
          this.removePizza(pizzaId).then(() => {
            this.showCart();
          });
        },
        payForCart(){
            this.pay(this.paymentAmount).then(result => {
                if (result.data.status === 'failure'){
                    this.errorMessage = result.data.message;
                    setTimeout(() => {
                        this.errorMessage = "";
                    }, 2000);
                }else {
                    this.message = "Successfully paid!"
                    setTimeout(() => {
                        this.paymentAmount = ""
                        this.message = "";
                        this.cartId = "";
                        this.cartPizzas = [];
                        this.cartTotal = 0
                        this.count = 0
                        localStorage['cartId'] = ''
                        this.createCart()
                    }, 2000);
                }
            })
        }
      };
    });
  });
  