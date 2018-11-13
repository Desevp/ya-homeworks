class Button extends View {
  constructor(emitter, dispatcher) {
    super(dispatcher);
    const button = document.querySelector('#testButton');

    button.addEventListener('click', ()=> {
      const value = Math.random();

      dispatcher.dispatch({
        type: 'testEvent',
        data: value
      });
    });
  }
}

class Label extends View {
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
    document.querySelector('.test1').innerHTML = this._data;
  }
}
