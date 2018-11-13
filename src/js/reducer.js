function reduce(store, action) {
  const newStore = reducer(store, action);
  return newStore;
}

function reducer(store, action) {
  switch(action.type) {
  case 'testEvent':
  return {
    store,
    data: action.data
  };
  default:
    return store;
  }
}
