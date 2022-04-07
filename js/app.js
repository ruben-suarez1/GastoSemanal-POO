// variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

//clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id != id );
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto( cantidad ) {
    //extrayendo los valores 
    const { presupuesto, restante } = cantidad;

    //agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success')
        }

        //mensaje error
        divMensaje.textContent = mensaje;

        //inertar en el html
        document.querySelector('.primario').insertBefore( divMensaje, formulario );

        //quitar del HTML
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos) {

        this.limpiarHTML();//elimina el html previo

         //iterar sobre los gastos
         gastos.forEach( gasto => {

            const {cantidad, nombre, id} = gasto;

            //crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            //agregar el html del gasto
            nuevoGasto.innerHTML = `${nombre} <span> $ ${cantidad} </span>`;

            //boton de borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            btnBorrar.innerHTML = '&times;'

            nuevoGasto.appendChild(btnBorrar);

            //agregar al HTML
            gastoListado.appendChild(nuevoGasto);
            
         })
    }

    //borrar html 
    limpiarHTML() {
        while( gastoListado.firstChild ) {
            gastoListado.removeChild(gastoListado.firstChild);
        } 
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        //comprobar el 256%
        if( ( presupuesto / 4 ) > restante ) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if( ( presupuesto / 2 ) > restante ) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //si el total es 0 o menor
        if(restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

//instanciar
const ui = new UI();

let presupuesto;

//funciones
function preguntarPresupuesto() {

    const presupuestoUsuario = prompt('¿ cual es tu presupuesto ?');

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario))
    {
        window.location.reload();
    } 
    
    //presupuesto valido 
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}

//añade gastos
function agregarGasto(e) {
    e.preventDefault();

    //leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //valida 
    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if(cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;
    }

    //generar un objeto gasto
    const gasto = { nombre, cantidad, id: Date.now() }

    //añade nuevo gasto
    presupuesto.nuevoGasto( gasto );

    ui.imprimirAlerta('Gasto agregado Correctamente');

    //imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    
    //reinicia el formulario
    formulario.reset();

}

function eliminarGasto (id) {
    //elimina de la clase
    presupuesto.eliminarGasto(id);

    //elimina los gastos html
    const { gastos, restante } = presupuesto;

    ui.mostrarGastos( gastos );
    
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}