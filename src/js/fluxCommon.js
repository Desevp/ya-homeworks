class App {
  constructor() {
    this._globalEmitter = new EventEmitter();
    this._dispatcher = new Dispatcher();
    this._initViews();
    this._initStore();
  }
  _initViews() {
    new Button(this._globalEmitter, this._dispatcher);
    new Label(this._globalEmitter, this._dispatcher);
  }
  _initStore() {
    const defaultStore = {
      name: '',
      events: []
    };
    this._store = new Store(defaultStore, reduce, this._dispatcher, this._globalEmitter);
  }
}

const app = new App();
