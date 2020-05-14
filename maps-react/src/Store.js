import reducer from "./Reducers";
const redux = require("redux");

var store = redux.createStore(reducer);
store.dispatch({
  type: "SET", state:	{
    user:	null,
    newPointInput: ""
  }
});

export default store