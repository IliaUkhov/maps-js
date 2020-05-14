const reducer = (state = {}, action) => {
  switch (action.type) {
    case "SET":
      return action.state
    default:
      return state
  }
}

export default reducer