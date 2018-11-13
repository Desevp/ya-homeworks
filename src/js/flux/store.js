class Store {
  constructor(defaultStore, reducer, dispatcher, emitter) {
    let store = defaultStore;

    dispatcher.register((action) => {
      store = reducer(store, action);
      emitter.emit('changeStoreEvent', store.data);
    });
  }
}
