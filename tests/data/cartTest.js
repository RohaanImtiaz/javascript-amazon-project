import { cart, addToCart, loadFromStorage } from '../../scripts/data/cart.js';

describe('test suite: addToCart', () => {
  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  beforeEach(() => {
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId1,
        quantity: 1,
        deliveryOptionId: '1'
      }]);
    });
    loadFromStorage();
  });

  it('adds an existing product to the cart', () => {
    addToCart(productId1);
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual(productId1);
    expect(cart[0].quantity).toEqual(2);
  });

  it('adds a new product to the cart', () => {
    addToCart(productId2);
    expect(cart.length).toEqual(2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[1].productId).toEqual(productId2);
    expect(cart[1].quantity).toEqual(1);
  });
});

/*
describe('', () => {
  it('', () => {

  });

  it('', () => {

  });
});
*/