const FENRIR_SWAL_CLASSES = {
  popup: 'fenrir-swal-popup',
  title: 'fenrir-swal-title',
  htmlContainer: 'fenrir-swal-text',
  confirmButton: 'btn btn-fenrir-primary fenrir-swal-btn',
  cancelButton: 'btn btn-fenrir-secondary fenrir-swal-btn',
  denyButton: 'btn btn-fenrir-secondary fenrir-swal-btn',
  actions: 'fenrir-swal-actions',
};

function createFenrirSwal() {
  if (typeof Swal === 'undefined') {
    return {
      fire: async () => ({ isConfirmed: false }),
    };
  }

  return Swal.mixin({
    customClass: FENRIR_SWAL_CLASSES,
    buttonsStyling: false,
    reverseButtons: true,
  });
}

export const fenrirSwal = createFenrirSwal();

export function fenrirConfirmDelete(options = {}) {
  return fenrirSwal.fire({
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    customClass: {
      ...FENRIR_SWAL_CLASSES,
      confirmButton: 'btn btn-fenrir-danger fenrir-swal-btn',
    },
    ...options,
  });
}

export function fenrirConfirmAction(options = {}) {
  return fenrirSwal.fire({
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    ...options,
  });
}

export function fenrirAlertSuccess(options = {}) {
  return fenrirSwal.fire({
    icon: 'success',
    confirmButtonText: 'Aceptar',
    ...options,
  });
}

export function fenrirAlertError(title, text) {
  return fenrirSwal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'Aceptar',
  });
}
