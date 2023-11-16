import { classNames, select, settings, templates } from '../setting.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();

    let selectedTableId = 0;
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

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.datePicker.wrapper
    );

    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.hourPicker.wrapper
    );

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(
      select.booking.tables
    );
    thisBooking.dom.allTables =
      thisBooking.dom.wrapper.querySelector('.floor-plan');
    console.log('table', thisBooking.dom.allTables);
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmountWidget = new AmountWidget(
      thisBooking.dom.peopleAmount
    );
    thisBooking.hoursAmountWidget = new AmountWidget(
      thisBooking.dom.hoursAmount
    );
    thisBooking.datePickerWidget = new DatePicker(thisBooking.dom.datePicker);

    thisBooking.hourPickerWidget = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.peopleAmount.addEventListener('click', function (event) {
      event.preventDefault();
    });

    thisBooking.dom.hoursAmount.addEventListener('click', function (event) {
      event.preventDefault();
    });
    thisBooking.dom.wrapper.addEventListener('updated', function (event) {
      event.preventDefault();

      thisBooking.updateDOM();
    });
    thisBooking.dom.allTables.addEventListener('click', function (event) {
      event.preventDefault();

      thisBooking.initTables(event);
    });
  }

  getData() {
    const thisBooking = this;

    const startDateParam =
      settings.db.dateStartParamKey +
      '=' +
      utils.dateToStr(thisBooking.datePickerWidget.minDate);

    const endDateParam =
      settings.db.dateEndParamKey +
      '=' +
      //utils.dateToStr(thisBooking.dom.dataPicker.maxDate);
      utils.dateToStr(thisBooking.datePickerWidget.maxDate);
    //utils.dateToStr(new Date());

    const params = {
      booking: [startDateParam, endDateParam],
      eventsCurrent: [startDateParam, endDateParam, settings.db.notRepeatParam],
      eventsRepeat: [endDateParam, settings.db.repeatParam],
    };
    // console.log('getData params', params);

    const urls = {
      booking:
        settings.db.url +
        '/' +
        settings.db.bookings +
        '?' +
        params.booking.join('&'),
      eventsCurrent:
        settings.db.url +
        '/' +
        settings.db.events +
        '?' +
        params.eventsCurrent.join('&'),
      eventsRepeat:
        settings.db.url +
        '/' +
        settings.db.events +
        '?' +
        params.eventsRepeat.join('&'),
    };

    //console.log('url', urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponses) {
        const bookingResponse = allResponses[0];
        const eventCurrentResponse = allResponses[1];
        const eventRepeatResponse = allResponses[2];
        return Promise.all([
          bookingResponse.json(),
          eventCurrentResponse.json(),
          eventRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        /* console.log('new', bookings);
        console.log('one', eventsCurrent);
        console.log('daily', eventsRepeat);*/
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }
  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;
    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    const minDate = thisBooking.datePickerWidget.minDate;
    const maxDate = thisBooking.datePickerWidget.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (
          let loopDate = minDate;
          loopDate <= maxDate;
          loopDate = utils.addDays(loopDate, 1)
        ) {
          thisBooking.makeBooked(
            utils.dateToStr(loopDate),
            item.hour,
            item.duration,
            item.table
          );
        }
      }
      //console.log('this booking booked', thisBooking.booked);
    }
    console.log('parsedata', thisBooking.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;
    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (
      let hourBlock = startHour;
      hourBlock < startHour + duration;
      hourBlock += 0.5
    ) {
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM() {
    const thisBooking = this;
    thisBooking.date = thisBooking.datePickerWidget.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPickerWidget.value);

    let allAvailable = false;
    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined' ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] ===
        'undefined'
    ) {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        !allAvailable &&
        thisBooking.booked[thisBooking.date] &&
        thisBooking.booked[thisBooking.date][thisBooking.hour] &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
        console.log('add', table);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
        console.log('remove', table);
      }
    }
  }

  initTables(event) {
    const thisBooking = this;
    thisBooking.selectedTableId = event.target.getAttribute(
      settings.booking.tableIdAttribute
    );
    const bookedTable = event.target.classList.contains(
      classNames.booking.tableBooked
    );
    const selectedTable = event.target;

    thisBooking.selectedTables = document.querySelectorAll('.table');
    const isSelected = selectedTable.classList.contains(
      classNames.booking.tableSelected
    );

    if (parseInt(thisBooking.selectedTableId) > 0) {
      thisBooking.selectedTables.forEach((table) => {
        table.classList.remove(classNames.booking.tableSelected);
      });
      if (bookedTable) {
        alert('Stolik zajęty');
      }
      if (isSelected) {
        selectedTable.classList.remove(classNames.booking.tableSelected);
      } else {
        selectedTable.classList.add(classNames.booking.tableSelected);
        console.log('table selected', thisBooking.selectedTables);
      }
    }
  }
}

export default Booking;
