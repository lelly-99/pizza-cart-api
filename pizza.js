document.addEventListener("alpine:init", () => {
  Alpine.data("pizzaCartApi", () => {
    return {
      title: "Pizza Cart API",
      username: "lelly-99",
      pizzas: [],
      cartId: "SnL6UPNEEo",
      cartPizzas: [],
      cartTotal: 0.0,
      getCart() {
        const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;
        return axios.get(getCartURL);
      },
      showCart() {
        this.getCart().then((result) => {
          const cartData = result.data;
          this.cartPizzas = cartData.pizzas;
          this.cartTotal = cartData.total;
        });
      },
      init() {
        axios
          .get("https://pizza-api.projectcodex.net/api/pizzas")
          .then((result) => {
            this.pizzas = result.data.pizzas;
          });
        this.showCart();
      },
    };
  });
});
