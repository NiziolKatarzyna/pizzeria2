import { settings, select } from '../setting.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;

    thisWidget.getElements(element);

    /*if (!thisWidget.input.value) {
      thisWidget.setValue(settings.amountWidget.defaultValue);
    } else {
      thisWidget.setValue(thisWidget.input.value);
    }*/
    // thisWidget.value = settings.amountWidget.defaultValue;
    //thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();

    //console.log('AmountWidget: ', thisWidget);
  }

  getElements() {
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(
      select.widgets.amount.input
    );
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(
      select.widgets.amount.linkDecrease
    );
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(
      select.widgets.amount.linkIncrease
    );
  }

  isValid(value) {
    return (
      !isNaN(value) &&
      value <= settings.amountWidget.defaultMax &&
      value >= settings.amountWidget.defaultMin
    );
  }
  renderValue() {
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;
    thisWidget.dom.input.addEventListener('change', function (event) {
      event.preventDefault();
      //const value = thisWidget.dom.input.value;
      //thisWidget.setValue(value);
      thisWidget.value = thisWidget.dom.input.value;
    });
    thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
}

export default AmountWidget;
