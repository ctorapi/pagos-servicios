window.COPENET_UTILS = (() => {
  const APP_STATE_KEY = 'copenet_demo_state';

  function sanitizePhoneNumber(phone) {
    return String(phone || '').replace(/\D/g, '');
  }

  function parseAmountToNumber(amount) {
    if (!amount) return NaN;
    const normalized = String(amount).replace(/[^\d.,]/g, '').replace(',', '.');
    return Number.parseFloat(normalized);
  }

  function formatCurrencyGTQ(amount) {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2
    }).format(amount || 0);
  }

  function generateRandomCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < length; i += 1) {
      const idx = Math.floor(Math.random() * chars.length);
      code += chars[idx];
    }

    return code;
  }

  function persistState(state) {
    try {
      sessionStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
    } catch {
      // Se ignoran errores de persistencia para no romper el demo.
    }
  }

  function readPersistedState() {
    try {
      const raw = sessionStorage.getItem(APP_STATE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  return {
    sanitizePhoneNumber,
    parseAmountToNumber,
    formatCurrencyGTQ,
    generateRandomCode,
    persistState,
    readPersistedState
  };
})();
