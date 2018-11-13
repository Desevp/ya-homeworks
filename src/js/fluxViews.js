class Nav {
  constructor(key) {
    this._key = key;
    this.activeSwitchClass = 'nav__item--is-active';
    this.activeContentClass = 'nav__content-item--is-active';
    this.switchItems = document.querySelectorAll(`.nav__item[data-${this._key}]`);
    this.contentItems = document.querySelectorAll(`.nav__content[data-${this._key}]`);

    this.initTab();
  }

  initTab() {
    let currentValue= localStorage.getItem(this._key);
    if (!currentValue) {
      currentValue = this.switchItems[0].dataset[this._key];
    }

    this.currentItem = document.querySelector(`.nav__item[data-${this._key}=${currentValue}]`);
    this.currentItem.classList.add(this.activeSwitchClass);
    this.toggleContent(currentValue);
  }

  toggleNav(item) {
    this.currentItem.classList.remove(this.activeSwitchClass);
    item.classList.add(this.activeSwitchClass);
    this.currentItem = item;
    localStorage.setItem(this._key, item.dataset[this._key]);
  }

  toggleContent(value) {
    const currentItem = document.querySelector(`.${this.activeContentClass}[data-${this._key}]`);
    if (currentItem) {
      currentItem.classList.remove(this.activeContentClass);
    }
    const activeContentItem = document.querySelector(`.nav__content-item[data-${this._key}=${value}]`);
    activeContentItem.classList.add(this.activeContentClass);
  }
}

const nav = new Nav('tab');

class NavItems extends View {
  constructor(emitter, dispatcher) {
    super(dispatcher);

    for (var i = 0; i < nav.switchItems.length; i++) {
      nav.switchItems[i].addEventListener('click', (e)=> {
        nav.toggleNav(e.target)

        dispatcher.dispatch({
          type: 'navigationEvent',
          tab: e.target.dataset['tab']
        });
      });
    }
  }
}

class NavContent extends View {
  constructor(emitter, dispatcher) {
    super(emitter, dispatcher);
    this._data = undefined;
    emitter.subscribe('changeStoreEvent', (data) => {
      this._setData(data);
      this._redraw();
    })
  }
  _setData(data) {
    this._data = data;
  }
  _redraw() {
    nav.toggleContent(this._data);
  }
}
