import { mainCart } from '../data/cart.js';
import { getDeliveryOption } from '../data/deliveryOptions.js';
import { getProduct } from '../data/products.js';
import formatCurrency from '../utils/money.js';
import { addOrder } from '../data/orders.js';

export function renderPaymentSummary() {
  // Calculating total price and including taxes
  let itemsPriceCents = 0;
  let shippingPriceCents = 0;

  mainCart.cart.forEach(cartItem => {
    let product = getProduct(cartItem.productId);
    itemsPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = itemsPriceCents + shippingPriceCents;
  const estimatedTaxCents = totalBeforeTaxCents / 10;
  const orderTotalCents = totalBeforeTaxCents + estimatedTaxCents;

  // Generating HTML
  let paymentSummaryHTML = '';

  paymentSummaryHTML += `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div class="js-items-quantity">Items (0):</div>
      <div class="payment-summary-money">$${formatCurrency(itemsPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(estimatedTaxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(orderTotalCents)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;

  // Displaying HTML
  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;

  // Items Quantity
  function updateItemsQuantity() {
    let cartQuantity = mainCart.updateCartQuantity();

    document.querySelector('.js-items-quantity')
      .innerHTML = `Items (${cartQuantity}):`;
  }
  updateItemsQuantity();

  // Place Order
  document.querySelector('.js-place-order')
    .addEventListener('click', async () => {
      try {
        const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cart: mainCart.cart
          })
        });

        const order = await response.json();
        addOrder(order);

      } catch (error) {
        console.log('Unexpected error. Please try again later.')
      }

      window.location.href = 'orders.html';
    });
}