class Tarea {
  constructor(id, titulo, completada = false) {
    this.id = id
    this.titulo = titulo
    this.completada = completada
  }

  crearElemento() {
    const elemento = document.createElement('li')
    elemento.className = 'tarea'
    elemento.dataset.id = this.id

    const casilla = document.createElement('input')
    casilla.type = 'checkbox'
    casilla.checked = this.completada
    casilla.dataset.accion = 'completar'
    casilla.setAttribute('aria-label', `Completar ${this.titulo}`)

    const texto = document.createElement('span')
    texto.className = 'tarea-texto'
    texto.textContent = this.titulo
    texto.classList.toggle('completada', this.completada)

    const editor = document.createElement('input')
    editor.className = 'editor'
    editor.type = 'text'
    editor.maxLength = 100
    editor.value = this.titulo
    editor.setAttribute('aria-label', `Editar ${this.titulo}`)
    editor.hidden = true

    const botonEditar = document.createElement('button')
    botonEditar.type = 'button'
    botonEditar.dataset.accion = 'editar'
    botonEditar.textContent = 'Editar'

    const botonCancelar = document.createElement('button')
    botonCancelar.type = 'button'
    botonCancelar.dataset.accion = 'cancelar'
    botonCancelar.textContent = 'Cancelar'
    botonCancelar.hidden = true

    const botonEliminar = document.createElement('button')
    botonEliminar.type = 'button'
    botonEliminar.dataset.accion = 'eliminar'
    botonEliminar.className = 'eliminar'
    botonEliminar.textContent = 'Eliminar'
    botonEliminar.setAttribute('aria-label', `Eliminar ${this.titulo}`)

    elemento.append(
      casilla,
      texto,
      editor,
      botonEditar,
      botonCancelar,
      botonEliminar,
    )
    return elemento
  }
}

const tareas = []
let siguienteId = 1

const formulario = document.querySelector('#formularioTarea')
const campoTitulo = document.querySelector('#tituloTarea')
const listaTareas = document.querySelector('#listaTareas')
const mensaje = document.querySelector('#mensaje')
const resumen = document.querySelector('#resumen')

function mostrarTareas() {
  listaTareas.replaceChildren()
  tareas.forEach((tarea) => listaTareas.append(tarea.crearElemento()))

  const pendientes = tareas.filter((tarea) => !tarea.completada).length
  resumen.textContent =
    tareas.length === 0
      ? 'No hay tareas todavía.'
      : `${tareas.length} tarea(s), ${pendientes} pendiente(s).`
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault()
  const titulo = campoTitulo.value.trim()

  if (!titulo) {
    mensaje.textContent = 'Escribe una tarea antes de agregarla.'
    campoTitulo.focus()
    return
  }

  tareas.push(new Tarea(siguienteId, titulo))
  siguienteId += 1
  campoTitulo.value = ''
  mensaje.textContent = ''
  mostrarTareas()
  campoTitulo.focus()
})

listaTareas.addEventListener('click', (evento) => {
  const control = evento.target.closest('button, input[type="checkbox"]')
  if (!control) return

  const elemento = control.closest('.tarea')
  const tarea = tareas.find((item) => String(item.id) === elemento.dataset.id)
  if (!tarea) return

  const accion = control.dataset.accion

  if (accion === 'completar') {
    tarea.completada = control.checked
    mostrarTareas()
    return
  }

  if (accion === 'editar') {
    elemento.querySelector('.tarea-texto').hidden = true
    const editor = elemento.querySelector('.editor')
    editor.hidden = false
    editor.focus()
    control.dataset.accion = 'guardar'
    control.textContent = 'Guardar'
    elemento.querySelector('[data-accion="cancelar"]').hidden = false
    mensaje.textContent = ''
    return
  }

  if (accion === 'guardar') {
    const titulo = elemento.querySelector('.editor').value.trim()
    if (!titulo) {
      mensaje.textContent = 'El nombre de la tarea no puede estar vacío.'
      elemento.querySelector('.editor').focus()
      return
    }

    tarea.titulo = titulo
    mensaje.textContent = ''
    mostrarTareas()
    return
  }

  if (accion === 'cancelar') {
    mensaje.textContent = ''
    mostrarTareas()
    return
  }

  if (accion === 'eliminar') {
    tareas.splice(tareas.indexOf(tarea), 1)
    mensaje.textContent = ''
    mostrarTareas()
  }
})

mostrarTareas()
