const setAuthenticated = function (authenticated) {
  return {
    type: "SET", state: {
      isAuthenticated: authenticated
    }
  }
};

module.exports = { setAuthenticated };
