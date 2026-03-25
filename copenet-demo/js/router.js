window.COPENET_ROUTER = (() => {
  const defaultState = {
    currentScreen: 'home',
    history: [],
    formValues: {
      operadora: '',
      telefono: '',
      monto: ''
    },
    transactionCode: '',
    qrPayload: null
  };

  const state = {
    ...defaultState,
    ...(window.COPENET_UTILS.readPersistedState() || {})
  };

  function setState(nextPartial = {}) {
    Object.assign(state, nextPartial);
    window.COPENET_UTILS.persistState(state);
  }

  function navigateTo(screenName, params = {}) {
    if (state.currentScreen) {
      state.history.push({ screen: state.currentScreen, params: {} });
    }
    setState({ currentScreen: screenName, ...params });
    window.COPENET_APP.renderScreen();
  }

  function goBack() {
    const previous = state.history.pop();
    if (!previous) {
      setState({ currentScreen: 'home' });
      window.COPENET_APP.renderScreen();
      return;
    }

    setState({ currentScreen: previous.screen });
    window.COPENET_APP.renderScreen();
  }

  function resetToHome() {
    setState({
      currentScreen: 'home',
      history: [],
      formValues: { operadora: '', telefono: '', monto: '' },
      transactionCode: '',
      qrPayload: null
    });
    window.COPENET_APP.renderScreen();
  }

  return {
    state,
    setState,
    navigateTo,
    goBack,
    resetToHome
  };
})();
