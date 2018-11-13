function reduce(store, action) {
  const newStore = reducer(store, action);
  return newStore;
}

function reducer(store, action) {
  switch(action.type) {
  case 'navigationEvent':
  return {
    store,
    data: action.tab
  };
  default:
    return store;
  }
}
