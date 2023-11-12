import { settings, select, classNames, templates } from '../setting.js';
import CartProduct from './CartProduct.js';
import { utils } from '../utils.js';
//const { name } = require('browser-sync');

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();

    console.log('new Cart', thisCart);
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(
      select.cart.toggleTrigger
    );
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(
      select.cart.productList
    );
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(
      select.cart.deliveryFee
    );
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(
      select.cart.subtotalPrice
    );

    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(
      select.cart.totalPrice
    );

    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(
      select.cart.totalNumber
    );
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(
      select.cart.address
    );
  }

  initActions() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function (event) {
      event.preventDefault();
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct) {
    const thisCart = this;
    const generateHTML = templates.cartProduct(menuProduct);

    // const generateDOM = ;
    const generatedDOM = utils.createDOMFromHTML(generateHTML);

    // Dodaj wygenerowany element DOM do thisCart.dom.productList
    thisCart.dom.productList.appendChild(generatedDOM);
    //thisCart.dom.productList.appendChild(generateDOM);
    console.log('adding product', menuProduct);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    console.log('thisCart.products', thisCart.products);
    thisCart.update();
  }
  update() {
    const thisCart = this;
    const deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.deliveryFee = deliveryFee;
    let totalNumber = 0;
    thisCart.totalNumber = totalNumber;
    let subtotalPrice = 0;
    thisCart.subtotalPrice = subtotalPrice;

    for (let product of thisCart.products) {
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.price;
    }
    if (thisCart.totalNumber != 0) {
      thisCart.totalPrice = thisCart.subtotalPrice + deliveryFee;

      console.log('total price', thisCart.totalPrice);
    } else {
      thisCart.deliveryFee = 0;
      thisCart.totalPrice = 0;
    }
    let totalPrice = thisCart.totalPrice;

    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalPrice.forEach((element) => {
      element.innerHTML = totalPrice;
    });
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
  }

  remove(cartProduct) {
    const thisCart = this;

    thisCart.menuProduct = cartProduct;
    //console.log('element remove', thisCart.menuProduct);

    //thisCart.products.splice(cartProduct);
    const index = thisCart.products.findIndex(
      (item) => item.id === cartProduct.id
    );

    if (index !== -1) {
      thisCart.products.splice(index, 1);
    }
    cartProduct.dom.wrapper.remove();
    thisCart.update();

    console.log('tablica', thisCart.products);
  }

  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };
    console.log('orders', payload);

    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);
  }
}
export default Cart;
