import { mainCart } from '../data/cart.js';
import { getProduct } from '../data/products.js';
import formatCurrency from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  mainCart.cart.forEach(cartItem => {
    // Product
    let product = getProduct(cartItem.productId);

    // Delivery Option
    let deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

    // DayJS Library
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const formattedDate = deliveryDate.format('dddd, MMMM D');

    // Generating HTML
    cartSummaryHTML += `
    <div class="cart-item-container
    js-cart-item-container-${product.id}">
      <div class="delivery-date">
        Delivery date: ${formattedDate}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${product.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-price">
            ${product.getPrice()}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${product.id}">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${product.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(product, cartItem)}
        </div>
      </div>
    </div>
  `;
  });

  function deliveryOptionsHTML(product, cartItem) {
    let html = '';

    deliveryOptions.forEach(deliveryOption => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const formattedDate = deliveryDate.format('dddd, MMMM D');

      const formattedPrice = (deliveryOption.priceCents === 0) ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)}`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
      <div class="delivery-option js-delivery-option" 
        data-product-id="${product.id}" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${product.id}">
        <div>
          <div class="delivery-option-date">
            ${formattedDate}
          </div>
          <div class="delivery-option-price">
            ${formattedPrice} Shipping
          </div>
        </div>
      </div>
    `;
    });

    return html;
  }

  // Displaying HTML
  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  // Checkout Quantity
  function updateCheckoutQuantity() {
    let cartQuantity = mainCart.updateCartQuantity();

    document.querySelector('.js-checkout-items')
      .innerHTML = `${cartQuantity} items`;
  }
  updateCheckoutQuantity();

  // Delete Product
  document.querySelectorAll('.js-delete-link')
    .forEach(link => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        mainCart.removeFromCart(productId);
        updateCheckoutQuantity();
        renderPaymentSummary();

        document.querySelector(`.js-cart-item-container-${productId}`)
          .remove();
      });
    });

  // Update Product
  document.querySelectorAll('.js-update-link')
    .forEach(link => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        console.log(productId);
      });
    });

  // Choose Delivery Option
  document.querySelectorAll('.js-delivery-option')
    .forEach(option => {
      option.addEventListener('click', () => {
        const { productId, deliveryOptionId } = option.dataset;
        mainCart.updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
}