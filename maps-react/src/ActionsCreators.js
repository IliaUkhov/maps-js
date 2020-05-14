const setUser = function (user) {
  return {
    type: "SET", state: {
      user: user
    }
  }
};

module.exports = { setUser };
