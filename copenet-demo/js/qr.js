window.COPENET_QR = (() => {
  function generateQRCode(payload, targetElementId) {
    const target = document.getElementById(targetElementId);
    if (!target) return false;

    target.innerHTML = '<p>Cargando código QR...</p>';

    if (!window.QRCode) {
      target.innerHTML = '<p>No fue posible cargar la librería QR.</p>';
      return false;
    }

    try {
      target.innerHTML = '';
      new window.QRCode(target, {
        text: payload,
        width: 190,
        height: 190,
        colorDark: '#0b1020',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.M
      });
      return true;
    } catch {
      target.innerHTML = '<p>Error al generar el código QR.</p>';
      return false;
    }
  }

  return { generateQRCode };
})();
