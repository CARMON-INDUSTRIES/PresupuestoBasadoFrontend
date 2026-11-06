import Swal from 'sweetalert2'
export async function confirmarRiesgo(text, confirmButtonText = 'Eliminar') {
  const result = await Swal.fire({ title: 'Confirma antes de continuar', text, icon: 'warning', showCancelButton: true, confirmButtonText, cancelButtonText: 'Conservar', focusCancel: true, confirmButtonColor: '#691b31' })
  return result.isConfirmed === true
}
export async function eliminarConConfirmacion(list, index, description) {
  const item = list[index]
  if (item === undefined || !(await confirmarRiesgo(description))) return
  const current = list.indexOf(item)
  if (current >= 0) list.splice(current, 1)
}
