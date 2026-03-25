window.COPENET_APP = (() => {
  const appEl = document.getElementById('app');
  const data = window.COPENET_DATA;
  const router = window.COPENET_ROUTER;
  const utils = window.COPENET_UTILS;
  const qr = window.COPENET_QR;

  function renderOptionCards(items, clickAttrName) {
    return `
      <div class="stack fade">
        ${items
          .map(
            (item) => `
            <button class="card" data-${clickAttrName}="${item.id}" type="button">
              <div class="icon-badge">${item.icon || item.logo || item.flag}</div>
              <div class="card-main">
                <p class="card-title">${item.title || item.name || item.label}</p>
              </div>
              <span class="arrow" aria-hidden="true">›</span>
            </button>
          `
          )
          .join('')}
      </div>
    `;
  }

  function renderHome() {
    appEl.innerHTML = `
      <section>
        <h2 class="screen-title">Selecciona una opción</h2>
        <p class="screen-subtitle">Ingresa al módulo deseado para continuar.</p>

        ${renderOptionCards(data.homeOptions, 'home-nav')}

        <div class="bottom-actions">
          <div class="action-row">
            <button class="btn btn-ghost" type="button" data-cancelar>Cancelar</button>
          </div>
        </div>
      </section>
    `;
  }

  function renderServicios() {
    appEl.innerHTML = `
      <section>
        <div class="toolbar">
          <button class="btn btn-secondary" type="button" data-back>Regresar</button>
          <button class="btn btn-ghost" type="button" data-cancelar>Cancelar</button>
        </div>
        <h2 class="screen-title">Pagos de Servicios</h2>
        <p class="screen-subtitle">Selecciona el servicio que deseas pagar.</p>
        ${renderOptionCards(data.services, 'servicio-id')}
      </section>
    `;
  }

  function renderCooperativas() {
    appEl.innerHTML = `
      <section>
        <div class="toolbar">
          <button class="btn btn-secondary" type="button" data-back>Regresar</button>
          <button class="btn btn-ghost" type="button" data-cancelar>Cancelar</button>
        </div>
        <h2 class="screen-title">Cooperativas</h2>
        <p class="screen-subtitle">Elige una cooperativa para continuar.</p>
        ${renderOptionCards(data.cooperatives, 'coop-id')}
      </section>
    `;
  }

  function renderCripto() {
    appEl.innerHTML = `
      <section>
        <div class="toolbar">
          <button class="btn btn-secondary" type="button" data-back>Regresar</button>
          <button class="btn btn-ghost" type="button" data-cancelar>Cancelar</button>
        </div>
        <h2 class="screen-title">Cripto</h2>
        <p class="screen-subtitle">Selecciona el activo digital que deseas operar.</p>
        ${renderOptionCards(data.cryptoOptions, 'cripto-id')}
      </section>
    `;
  }

  function renderTransferencias() {
    appEl.innerHTML = `
      <section>
        <div class="toolbar">
          <button class="btn btn-secondary" type="button" data-back>Regresar</button>
          <button class="btn btn-ghost" type="button" data-cancelar>Cancelar</button>
        </div>
        <h2 class="screen-title">Transferencias Internacionales</h2>
        <p class="screen-subtitle">Selecciona un país de destino.</p>

        <div class="grid-countries fade">
          ${data.transferCountries
            .map(
              (country) => `
                <button class="card" type="button" data-country-id="${country.id}">
                  <span class="country-flag">${country.flag}</span>
                  <div class="card-main">
                    <p class="card-title">${country.name}</p>
                  </div>
                  <span class="arrow" aria-hidden="true">›</span>
                </button>
              `
            )
            .join('')}
        </div>
      </section>
    `;
  }

  function renderFormularioRecarga() {
    const current = router.state.formValues;

    appEl.innerHTML = `
      <section>
        <div class="toolbar">
          <button class="btn btn-secondary" type="button" data-back>Regresar</button>
          <button class="btn btn-ghost" type="button" data-cancelar>Cancelar</button>
        </div>

        <h2 class="screen-title">Recargas de Teléfono</h2>
        <p class="screen-subtitle">Ingresa los datos de tu recarga</p>

        <form id="recarga-form" class="form-card fade" novalidate>
          <div class="form-group">
            <label for="operadora">Operadora</label>
            <select id="operadora" name="operadora" class="select">
              <option value="">Selecciona operadora</option>
              <option value="Tigo" ${current.operadora === 'Tigo' ? 'selected' : ''}>Tigo</option>
              <option value="Claro" ${current.operadora === 'Claro' ? 'selected' : ''}>Claro</option>
            </select>
            <small class="error-msg" id="error-operadora"></small>
          </div>

          <div class="form-group">
            <label for="telefono">Número de teléfono</label>
            <input
              id="telefono"
              name="telefono"
              class="input"
              type="tel"
              placeholder="+502 5555 5555"
              value="${current.telefono || ''}"
              inputmode="tel"
              autocomplete="tel"
            />
            <small class="error-msg" id="error-telefono"></small>
          </div>

          <div class="form-group">
            <label for="monto">Monto a recargar</label>
            <input
              id="monto"
              name="monto"
              class="input"
              type="text"
              placeholder="Q25.00"
              value="${current.monto || ''}"
              inputmode="decimal"
            />
            <small class="error-msg" id="error-monto"></small>
          </div>

          <div class="amount-chips" aria-label="Montos rápidos">
            <button class="chip" type="button" data-monto="25">Q25</button>
            <button class="chip" type="button" data-monto="50">Q50</button>
            <button class="chip" type="button" data-monto="100">Q100</button>
          </div>

          <div class="action-row">
            <button class="btn btn-primary" type="submit">Generar QR</button>
            <button class="btn btn-ghost" type="button" data-cancelar>Cancelar</button>
            <button class="btn btn-secondary" type="button" data-back>Regresar</button>
          </div>
        </form>
      </section>
    `;
  }

  function renderConfirmacionQR() {
    const payload = router.state.qrPayload;
    const code = router.state.transactionCode;

    if (!payload || !code) {
      router.resetToHome();
      return;
    }

    const isRecarga = payload.type === 'recarga_telefono';
    const title = isRecarga ? 'Confirmación de Recarga' : 'Confirmación de Pago Demo';

    const summaryRows = isRecarga
      ? `
        <div class="meta-item"><span>Operadora</span><span>${payload.operadora}</span></div>
        <div class="meta-item"><span>Número de teléfono</span><span>${payload.telefono}</span></div>
        <div class="meta-item"><span>Monto</span><span>${utils.formatCurrencyGTQ(payload.monto)}</span></div>
      `
      : `
        <div class="meta-item"><span>Módulo</span><span>${payload.modulo || 'Pago demo'}</span></div>
        <div class="meta-item"><span>Detalle</span><span>${payload.detalle || 'Transacción de demostración'}</span></div>
        <div class="meta-item"><span>Monto</span><span>${utils.formatCurrencyGTQ(payload.monto || 0)}</span></div>
      `;

    appEl.innerHTML = `
      <section>
        <div class="pill-success">● Transacción lista para confirmar</div>
        <h2 class="screen-title">${title}</h2>
        <p class="screen-subtitle">Código de referencia: <span class="ref-code">${code}</span></p>

        <article class="qr-card fade">
          <div id="qrContainer" class="qr-box">
            <p>Cargando código QR...</p>
          </div>
        </article>

        <article class="summary-card" style="margin-top: 12px">
          <h3 style="margin: 0 0 8px; font-size: 1rem">Resumen de transacción</h3>
          <div class="meta">
            ${summaryRows}
          </div>
        </article>

        <div class="bottom-actions">
          <div class="action-row">
            <button class="btn btn-primary" type="button" data-aceptar>Aceptar</button>
            <button class="btn btn-secondary" type="button" data-home>Volver al inicio</button>
          </div>
        </div>
      </section>
    `;

    const payloadString = JSON.stringify(payload, null, 2);
    const qrOk = generateQRCode(payloadString, 'qrContainer');
    if (!qrOk) {
      const box = document.getElementById('qrContainer');
      box.innerHTML = '<p>No se pudo generar el código QR. Intenta nuevamente.</p>';
    }
  }

  function validateRecargaForm() {
    const formData = getRecargaFormData();
    const errors = {};

    if (!formData.operadora) {
      errors.operadora = 'Selecciona una operadora.';
    }

    const telefonoLimpio = utils.sanitizePhoneNumber(formData.telefono);
    if (!telefonoLimpio) {
      errors.telefono = 'Ingresa un número de teléfono.';
    } else if (telefonoLimpio.length < 8) {
      errors.telefono = 'El número debe tener al menos 8 dígitos.';
    }

    const montoNumero = utils.parseAmountToNumber(formData.monto);
    if (!formData.monto) {
      errors.monto = 'Ingresa el monto a recargar.';
    } else if (!Number.isFinite(montoNumero) || montoNumero <= 0) {
      errors.monto = 'El monto debe ser numérico y mayor a 0.';
    }

    paintValidationErrors(errors);

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  function getRecargaFormData() {
    const operadora = document.getElementById('operadora')?.value?.trim() || '';
    const telefono = document.getElementById('telefono')?.value?.trim() || '';
    const monto = document.getElementById('monto')?.value?.trim() || '';

    const formValues = { operadora, telefono, monto };
    router.setState({ formValues });

    return formValues;
  }

  function paintValidationErrors(errors) {
    const fields = ['operadora', 'telefono', 'monto'];
    fields.forEach((name) => {
      const input = document.getElementById(name);
      const errorEl = document.getElementById(`error-${name}`);
      const msg = errors[name] || '';

      if (errorEl) errorEl.textContent = msg;
      if (input) {
        input.classList.toggle('error', Boolean(msg));
        if (msg) {
          input.setAttribute('aria-invalid', 'true');
        } else {
          input.removeAttribute('aria-invalid');
        }
      }
    });
  }

  function bindGlobalEvents() {
    function openDemoQR(modulo, detalle) {
      const code = generateRandomCode(8);
      const montoDemo = Number((Math.random() * 175 + 25).toFixed(2));
      const payload = {
        type: 'demo_pago',
        modulo,
        detalle,
        monto: montoDemo,
        codigo: code
      };

      router.setState({ transactionCode: code, qrPayload: payload });
      router.navigateTo('confirmacion_qr');
    }

    appEl.addEventListener('click', (event) => {
      const btn = event.target.closest('button');
      if (!btn) return;

      if (btn.hasAttribute('data-back')) {
        router.goBack();
        return;
      }

      if (btn.hasAttribute('data-cancelar')) {
        router.resetToHome();
        return;
      }

      if (btn.hasAttribute('data-home') || btn.hasAttribute('data-aceptar')) {
        router.resetToHome();
        return;
      }

      const homeNav = btn.getAttribute('data-home-nav');
      if (homeNav === 'servicios') router.navigateTo('servicios');
      if (homeNav === 'cooperativas') router.navigateTo('cooperativas');
      if (homeNav === 'cripto') router.navigateTo('cripto');
      if (homeNav === 'transferencias') router.navigateTo('transferencias');

      const serviceId = btn.getAttribute('data-servicio-id');
      if (serviceId === 'recarga_telefono') {
        router.navigateTo('formulario_recarga');
      } else if (serviceId) {
        const selected = data.services.find((item) => item.id === serviceId);
        openDemoQR('Pagos de Servicios', selected?.title || 'Servicio');
      }

      const coopId = btn.getAttribute('data-coop-id');
      if (coopId) {
        const selected = data.cooperatives.find((item) => item.id === coopId);
        openDemoQR('Cooperativas', selected?.name || 'Cooperativa');
      }

      const criptoId = btn.getAttribute('data-cripto-id');
      if (criptoId) {
        const selected = data.cryptoOptions.find((item) => item.id === criptoId);
        openDemoQR('Cripto', selected?.label || 'Operación cripto');
      }

      const countryId = btn.getAttribute('data-country-id');
      if (countryId) {
        const selected = data.transferCountries.find((item) => item.id === countryId);
        openDemoQR(
          'Transferencias Internacionales',
          `Envío de fondos a ${selected?.name || 'destino internacional'}`
        );
      }

      const chipAmount = btn.getAttribute('data-monto');
      if (chipAmount) {
        const montoInput = document.getElementById('monto');
        if (montoInput) {
          montoInput.value = chipAmount;
          montoInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    });

    appEl.addEventListener('input', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (['operadora', 'telefono', 'monto'].includes(target.id)) {
        getRecargaFormData();
        validateRecargaForm();
      }
    });

    appEl.addEventListener('submit', (event) => {
      if (!(event.target instanceof HTMLFormElement)) return;
      if (event.target.id !== 'recarga-form') return;

      event.preventDefault();
      const validation = validateRecargaForm();
      if (!validation.isValid) return;

      const values = getRecargaFormData();
      const code = generateRandomCode(8);
      const payload = {
        type: 'recarga_telefono',
        operadora: values.operadora,
        telefono: utils.sanitizePhoneNumber(values.telefono),
        monto: utils.parseAmountToNumber(values.monto),
        codigo: code
      };

      router.setState({ transactionCode: code, qrPayload: payload });
      router.navigateTo('confirmacion_qr');
    });
  }

  function navigateTo(screenName, params = {}) {
    router.navigateTo(screenName, params);
  }

  function goBack() {
    router.goBack();
  }

  function resetToHome() {
    router.resetToHome();
  }

  function generateRandomCode(length = 8) {
    return utils.generateRandomCode(length);
  }

  function generateQRCode(payload, targetElementId) {
    return qr.generateQRCode(payload, targetElementId);
  }

  function renderScreen() {
    const { currentScreen } = router.state;

    switch (currentScreen) {
      case 'home':
        renderHome();
        break;
      case 'servicios':
        renderServicios();
        break;
      case 'cooperativas':
        renderCooperativas();
        break;
      case 'cripto':
        renderCripto();
        break;
      case 'transferencias':
        renderTransferencias();
        break;
      case 'formulario_recarga':
        renderFormularioRecarga();
        break;
      case 'confirmacion_qr':
        renderConfirmacionQR();
        break;
      default:
        renderHome();
        break;
    }
  }

  function initApp() {
    bindGlobalEvents();
    renderScreen();
  }

  return {
    initApp,
    navigateTo,
    goBack,
    resetToHome,
    renderScreen,
    renderHome,
    renderServicios,
    renderCooperativas,
    renderCripto,
    renderTransferencias,
    renderFormularioRecarga,
    renderConfirmacionQR,
    bindGlobalEvents,
    validateRecargaForm,
    getRecargaFormData,
    generateRandomCode,
    generateQRCode
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  window.COPENET_APP.initApp();
});
