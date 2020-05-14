import reducer from "./Reducers";
const redux = require("redux");

var store = redux.createStore(reducer);
store.dispatch({
  type: "SET", state:	{
    isAuthenticated:	false,
  }
});

export default store