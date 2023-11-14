import { select, templates } from '../setting.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

//import { utils } from '../utils.js';
class Booking {
  constructor(element) {
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
  }
  render(element) {
    const thisBooking = this;
    const generateHTML = templates.bookingWidget(element);
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = generateHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.peopleAmount
    );

    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.hoursAmount
    );

    thisBooking.dom.dataPicker = document.querySelector(
      select.widgets.datePicker.wrapper
    );
    console.log('kal', thisBooking.dom.dataPicker);

    thisBooking.dom.hourPicker = document.querySelector(
      select.widgets.hourPicker.wrapper
    );
    console.log('hou', thisBooking.dom.hourPicker);
  }
  initWidgets() {
    const thisBooking = this;
    thisBooking.dom.peopleAmountWidget = new AmountWidget(
      thisBooking.dom.peopleAmount
    );
    thisBooking.dom.hoursAmountWidget = new AmountWidget(
      thisBooking.dom.hoursAmount
    );
    thisBooking.dom.dataPickerWidget = new DatePicker(
      thisBooking.dom.dataPicker
    );
    thisBooking.dom.hourPickerWidget = new HourPicker(
      thisBooking.dom.hourPicker
    );

    thisBooking.dom.peopleAmount.addEventListener('click', function (event) {
      event.preventDefault();
    });

    thisBooking.dom.hoursAmount.addEventListener('click', function (event) {
      event.preventDefault();
    });
  }
}
export default Booking;
