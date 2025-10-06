import Swal from 'sweetalert2'
import api from 'src/boot/api'

export async function verificarProgreso(to, from, next) {
  try {
    // Solo aplicamos la verificación si el usuario va al inicio del registro
    if (to.path === '/formulario-alineacion' || to.path === '/') {
      const { data } = await api.get('/ProgresoUsuario/ultimo') // 🔥 tu endpoint de progreso

      if (data && !data.completo) {
        await Swal.fire({
          title: 'Registro incompleto',
          text: `Te quedaste en la sección: ${data.seccionActual}`,
          icon: 'warning',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#691b31',
        })

        // Redirige automáticamente al paso donde se quedó
        next(data.rutaContinuar || '/formulario-alineacion')
        return
      }
    }

    next() // continúa normalmente
  } catch (error) {
    console.error('Error verificando progreso:', error)
    next()
  }
}
