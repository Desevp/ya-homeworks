class Dispatcher {
  constructor(){
    this._stores = [];
  }

  register(callback) {
    this._stores.push(callback);
  }

  dispatch(action) {
    this._stores.forEach(callback => {
      callback(action);
    });
  }
}
