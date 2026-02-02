class Cart {
  cart;
  #localStorageKey; // Private property

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  // Private method
  #loadFromStorage() {
    this.cart = JSON.parse(localStorage.getItem(this.#localStorageKey));

    if (!this.cart) {
      this.cart = [{
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: '1'
      }, {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: '2'
      }];
    }
  }

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cart));
  }

  addToCart(productId) {
    const cartItem = this.cart.find(item => productId === item.productId);

    if (cartItem)
      cartItem.quantity++;
    else {
      this.cart.push({
        productId, // shorthand
        quantity: 1,
        deliveryOptionId: '1'
      });
    }

    this.saveToStorage();
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.productId !== productId);

    this.saveToStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    const cartItem = this.cart.find(item => productId === item.productId);
    cartItem.deliveryOptionId = deliveryOptionId;

    this.saveToStorage();
  }

  updateCartQuantity() {
    let cartQuantity = 0;

    this.cart.forEach(cartItem => {
      cartQuantity += cartItem.quantity;
    });

    return cartQuantity;
  }
}

export const mainCart = new Cart('cart');
const businessCart = new Cart('cart-business');

console.log("Main Cart:", mainCart);
