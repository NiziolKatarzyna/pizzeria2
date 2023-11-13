import { settings, select } from '../setting.js';

class AmountWidget {
  constructor(element) {
    const thisWidget = this;

    thisWidget.getElements(element);

    if (!thisWidget.input.value) {
      thisWidget.setValue(settings.amountWidget.defaultValue);
    } else {
      thisWidget.setValue(thisWidget.input.value);
    }

    thisWidget.initActions();

    //console.log('AmountWidget: ', thisWidget);
  }

  getElements(element) {
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(
      select.widgets.amount.input
    );
    thisWidget.linkDecrease = thisWidget.element.querySelector(
      select.widgets.amount.linkDecrease
    );
    thisWidget.linkIncrease = thisWidget.element.querySelector(
      select.widgets.amount.linkIncrease
    );
  }
  setValue(value) {
    const thisWidget = this;

    const newValue = parseInt(value);

    /*TODO: Add validation*/
    if (
      thisWidget.value !== newValue &&
      !isNaN(newValue) &&
      newValue <= settings.amountWidget.defaultMax &&
      newValue >= settings.amountWidget.defaultMin
    ) {
      thisWidget.value = newValue;
    }

    thisWidget.input.value = thisWidget.value;
    thisWidget.announce();
  }
  initActions() {
    const thisWidget = this;
    thisWidget.input.addEventListener('change', function (event) {
      event.preventDefault();
      const value = thisWidget.input.value;
      thisWidget.setValue(value);
      console.log(value);
    });
    thisWidget.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
  announce() {
    const thisWidget = this;
    const event = new Event('updated', { bubbles: true });
    thisWidget.element.dispatchEvent(event);
  }
}

export default AmountWidget;
