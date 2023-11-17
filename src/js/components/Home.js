class Home {
  constructor(element) {
    const thisHome = this;
    thisHome.dom = element;
    thisHome.render(element);
    thisHome.getElement();
    thisHome.imageAnimationOrder.addEventListener('click', () =>
      thisHome.redirectToOrder()
    );
    thisHome.imageAnimationBooking.addEventListener('click', () =>
      thisHome.redirectToBooking()
    );
  }
  render(element) {
    const thisHome = this;
    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.imageAnimationOrder = document.querySelector('#animation1');
    thisHome.imageAnimationBooking = document.querySelector('#animation2');

    const elem = document.querySelector('.main-carousel');
    console.log(elem);

    thisHome.dom.carousel = new Flickity(elem, {
      wrapAround: true,
      groupCells: 2,
      autoPlay: true,
      imagesLoaded: true,
      lazyLoad: true,
    });
  }
  redirectToOrder() {
    const thisHome = this;
    thisHome.orderLink = document.querySelector('a[href="#order"]');
    thisHome.orderLink.click();
  }
  redirectToBooking() {
    const thisHome = this;
    thisHome.bookingLink = document.querySelector('a[href="#booking"]');
    thisHome.bookingLink.click();
  }

  getElement() {
    const thisHome = this;
    thisHome.orderLink = document.querySelector('a[href="#order"]');
  }
}

export default Home;
