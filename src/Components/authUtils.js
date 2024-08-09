export const getToken = (state) => {
    const tokenFromRedux = state.auth?.token;
    if (tokenFromRedux) {
      return tokenFromRedux;
    }
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    return userFromLocalStorage?.accessToken;
  };
  