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
      errorMessage: "",
      loggedIn: false,
      loggedOut: true,
      loginUser() {
        if (this.username.length > 3) {
          this.loggedIn = true;
          this.loggedOut = false;
          //local storage to store usernames and cart id
          const cartInfo = JSON.parse(localStorage.getItem(this.username + "_cartId"));
          //if another user is logged in, should display their exixting or new cart
          if (cartInfo) {
            this.cartId = cartInfo;
            this.showCart();
          } else {
            this.createCart().then(() => {
              this.showCart();
            });
          }
        } else {
          this.errorMessage = "Username must be at least 4 characters long.";
          setTimeout(() => {
            this.errorMessage = "";
          }, 2000);
        }
      },
      logOut() {
        if (confirm("Do you want to logout?")) {
          this.loggedIn = false;
          this.loggedOut = true;
          this.username = "";
          this.cartId = "";
          localStorage.removeItem(this.username + "_cartId");
        }
      },
      createCart() {
        const cartInfo = JSON.parse(localStorage.getItem(this.username + "_cartId"));
        if (cartInfo) {
          this.cartId = cartInfo;
        } else {
          const createCartUrl = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`;
          return axios.get(createCartUrl).then((result) => {
            this.cartId = result.data.cart_code;
            localStorage.setItem(this.username + "_cartId",JSON.stringify(this.cartId) );
          });
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
          }
        );
      },
      removePizza(pizzaId) {
        return axios.post(
          "https://pizza-api.projectcodex.net/api/pizza-cart/remove",
          {
            cart_code: this.cartId,
            pizza_id: pizzaId,
          }
        );
      },
      pay(amount) {
        return axios.post(
          "https://pizza-api.projectcodex.net/api/pizza-cart/pay",
          {
            cart_code: this.cartId,
            amount: amount,
          }
        );
      },
      showCart() {
        this.getCart().then((result) => {
          const cartData = result.data;
          this.cartPizzas = cartData.pizzas;
          this.cartTotal = cartData.total;
          this.count = cartData.pizzas.reduce(
            (total, pizza) => total + pizza.qty,
            0
          );
        });
      },
      init() {
        axios
          .get("https://pizza-api.projectcodex.net/api/pizzas")
          .then((result) => {
            this.pizzas = result.data.pizzas;
          });
        if (!this.cartId) {
          this.createCart().then(() => {
            this.showCart();
          });
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
      payForCart() {
        this.pay(this.paymentAmount).then((result) => {
          if (result.data.status === "failure") {
            this.errorMessage = result.data.message;
            setTimeout(() => {
              this.errorMessage = "";
            }, 2000);
          } else {
            this.message = "Successfully paid!";
            setTimeout(() => {
              this.paymentAmount = "";
              this.message = "";
              this.cartId = "";
              this.cartPizzas = [];
              this.cartTotal = 0;
              this.count = 0;
              localStorage.removeItem("cartId");
              this.createCart();
            }, 2000);
          }
        });
      },
    };
  });
});
