const LIMITE1 = 1500; // Límite Inferior Femenino
const LIMITE2 = 2000; // Límite Superior Femenino e Inferior Masculino
const LIMITE3 = 2500; // Límite Superior Masculino

//Función flecha que retorna el porcetaje de a con respecto b 
const PORCENTAJE = (a, b) => (a*100) / b;

//Función flecha que almacena en localStorage 
const guardarLocal = (clave, valor) => { localStorage.setItem(clave, valor) };

/********DEFINICION DE CLASES********************/

//Clase GrupoAlimento 

class GrupoAlimento {
    constructor (id, nombre, unidadMedida, kcal){
        this.id= id;
        this.nombre= nombre;
        this.unidadMedida = unidadMedida;
        this.kcal= kcal;
    }
    //metodos de la clase: utilizados solo por objetos de esta clase

    getId()
    {
        return this.id;
    }

    getNombre()
    {
        return this.nombre;
    }
    getUnidadMedida()
    {
        return this.unidadMedida;
    }

    getKCal()
    {
        return this.kcal;
    }

}

//Clase Alimento

class Alimento {
    constructor (nombre, grupo, cantidad){
    this.nombre= nombre;
    this.grupo = grupo;
    this.cantidad = cantidad;
    }
    //metodo de la clase: utilizado solo por objetos de esta clase

    //Retorna el nombre del alimento y entre paréntesis la cantidad y unidad de medida del mismo
    mostrarAlimento()
    {
        return this.nombre+" ("+this.cantidad+" "+this.grupo.getUnidadMedida()+") ";
    }

    }


// cada constante GRUPOX contiene un objeto de la clase GrupoAlimento con sus atributos definidos
const GRUPO1 = new GrupoAlimento (1,"Aceites y grasas", "gramos", 9);
const GRUPO2 = new GrupoAlimento (2,"Azúcares y dulces", "gramos", 5);
const GRUPO3 = new GrupoAlimento (3,"Bebidas con alcohol o azucaradas", "mililitros", 5);
const GRUPO4 = new GrupoAlimento (4,"Carnes, Aves y Embutidos", "gramos", 2);
const GRUPO5 = new GrupoAlimento (5,"Cereales", "gramos", 4);
const GRUPO6 = new GrupoAlimento (6,"Frutas", "gramos", 4);
const GRUPO7 = new GrupoAlimento (7,"Frutos secos", "gramos", 6);
const GRUPO8 = new GrupoAlimento (8,"Huevos", "gramos", 1);
const GRUPO9 = new GrupoAlimento (9,"Lácteos y derivados", "gramos", 2);
const GRUPO10 = new GrupoAlimento (10,"Legumbres", "gramos", 3);
const GRUPO11 = new GrupoAlimento (11,"Pastelería", "gramos", 9);
const GRUPO12 = new GrupoAlimento (12,"Pescados, mariscos y crustáceos", "gramos", 2);
const GRUPO13 = new GrupoAlimento (13,"Salsas y condimentos", "gramos", 4);
const GRUPO14 = new GrupoAlimento (14,"Verduras y hortalizas", "gramos", 2);

//Arreglo que contiene todos los objetos GrupoAlimento anteriormente creados
let grupos = [ GRUPO1 , GRUPO2 , GRUPO3 , GRUPO4 , GRUPO5 , GRUPO6 , GRUPO7 , GRUPO8 , GRUPO9 , GRUPO10 , GRUPO11 , GRUPO12 , GRUPO13 , GRUPO14 ];


//Arreglo inicializado vacío que se va a ir llenando dinámicamente a medida que el usuario ingrese los datos de los alimentos
let ingesta =[];


/***************** EVENTO CHANGE DE SELECT GRUPO *****************************/

let selectGrupo = document.getElementById("grupo"); //Variable que almacena el select de los grupos de alimentos

selectGrupo.addEventListener('change', asignarUnidad); //Defino el evento change para el select 

//Función que maneja el evento change del select de grupo. 
//Según el grupo seleccionado cambia el atributo "placeholder" del input cantidad para que muestre la unidad de medida correspondiente al grupo
function asignarUnidad(){

    let grupoAlimento = document.getElementById("grupo").value;
    let cantidad = document.getElementById("cantidad");

    if (grupos.some((g) => g.getId() === Number(grupoAlimento))) //si existe el grupo del alimento ingresado por el usuario en el arreglo grupos
    {
        //busca el grupo elegido por el usuario en el arreglo grupos y lo almacena en la variable grupoSeleccionado
        let grupoSeleccionado = grupos.find((g) => g.getId() === Number(grupoAlimento)); 

        let unidad = grupoSeleccionado.getUnidadMedida();

        cantidad.placeholder= unidad; //asigna el placeholder que corresponde a la unidad de medida del grupo seleccionado por el usuario
    }
    else
    {
        cantidad.placeholder= "Ingrese la cantidad";
    }
        
}


/***************** EVENTO CLICK DE BUTTON AGREGAR *****************************/

let agregar = document.getElementById("agregar"); //Variable que almacena el button agregar

agregar.addEventListener('click', agregarAlPlato); //Defino el evento click para el button agregar

//Función que maneja el evento click del button agregar. 
//Toma del DOM el alimento, grupo y cantidad, crea el objeto alimento a partir de estos valores y lo agrega al arreglo ingesta. 
//Luego llama a la función guardaLocal para almacenarlo en el localStorage y por último llama a la función mostrarEnPlato para visualizarlo 
function agregarAlPlato()
{

    let nombreAlimento = document.getElementById("nombreAlimento").value;
    let grupoAlimento = document.getElementById("grupo").value;
    let cantidad = document.getElementById("cantidad").value;
    
    if (grupos.some((g) => g.getId() === Number(grupoAlimento)) &&  nombreAlimento!="" && Number(cantidad)!=0) //si existe el grupo del alimento ingresado por el usuario en el arreglo grupos
    {

        //busca el grupo elegido por el usuario en el arreglo grupos y lo almacena en la variable grupoSeleccionado
        let grupoSeleccionado = grupos.find((g) => g.getId() === Number(grupoAlimento)); 

        //Crea un objeto Alimento con el nombre, grupo y cantidad ingresada por el usuario
        let alimento = new Alimento(nombreAlimento.toUpperCase(), grupoSeleccionado, cantidad);
        
        //Agrega el objeto alimento creado en el arreglo ingesta
        ingesta.push(alimento);

        let i=ingesta.length-1;
        //guarda el alimento en el localStorage llamando a la funcion
        guardarLocal(i, JSON.stringify(ingesta[i]));

        if (ingesta.length == 1)
        {
            let tablaPlato= document.getElementById("tablaPlato");
            tablaPlato.classList.remove('d-none');
        }

        //llama a la función mostrarEnPlato para visualizarlo en la tablaPlato
        mostrarEnPlato(alimento);
    
    }
}

//Función que muestra en pantalla el alimento ingerido con su cantidad
function mostrarEnPlato(a)
{
    
    let plato= document.getElementById("plato");

    //crea un elemento tr por el alimento que viene por parámetro
    let tr = document.createElement("tr");
    //carga la información del tr usando plantillas literales
    tr.innerHTML = `<td><b> ${a.nombre}</b></td><td><b> ${a.cantidad} ${a.grupo.getUnidadMedida()}</b></td><td><i class="bi-trash3" onclick="eliminar(this)"></i></td>`;
    //agrega el tr al plato
    plato.appendChild(tr);

    //limpia los elementos para la proxima carga
    document.getElementById("nombreAlimento").value="";
    document.getElementById("grupo").value="0";
    document.getElementById("cantidad").value="";
    document.getElementById("cantidad").placeholder="Ingrese la cantidad";
}

/***************** EVENTO CLICK DE ICONO ELIMINAR *****************************/

//Función que maneja el evento click insertado en el ícono de borrar de cada fila de la tabla
//Elimina un alimento de la tabla de alimentos ingeridos (tablaPlato). Parámetro id es el nodo "i" del DOM
function eliminar(id) {

    let fila = id.parentNode.parentNode; // variable que almacena la fila a eliminar

    let tabla = document.getElementById("tablaPlato"); //variable que almacena la tabla donde se encuentra la fila a eliminar
    
    let indice= fila.rowIndex; //variable que almacena el indice de la fila en la tabla

    tabla.deleteRow(indice); //borra la fila de la tabla según el índice

    ingesta.splice(indice-1,1); //borra el elemento del arreglo ingesta. El índice es menos uno ya que el arreglo comienza del cero y la tabla del uno

    if (ingesta.length == 0) // si el arreglo ingesta no tiene ningun alimento, oculto la tablaPlato
    {
        let tablaPlato= document.getElementById("tablaPlato");
        tablaPlato.className += " d-none";
    }


}

/***************** EVENTO CLICK DE BUTTON CALCULAR *****************************/

let calcular = document.getElementById("calcular"); //Variable que almacena el button calcular

calcular.addEventListener('click', calcularKCalorias); //Defino el evento click para el button calcular

//Función que maneja el evento click del button calcular. 
//Calcula las kCal consumidas de los alimentos de la ingesta(arreglo), según el grupo al que pertenecen y las cantidades
//Luego muestra el resultado llamando a la función mostrarResultado
function calcularKCalorias()
{
    let kcal = 0;


    //recorre el arreglo ingesta, calcula las kcal de cada alimento y las acumula en la variable kcal
    ingesta.forEach(alim => {

        // si el grupo es el 3, el 6 o el 14 , el cálculo es diferente a los demás grupos
        if ((alim.grupo.id == 3) || (alim.grupo.id == 6) || (alim.grupo.id == 14 ))
        {
            kcal += alim.grupo.kcal*(alim.cantidad/10);
        } 
        else
        {
            kcal += alim.grupo.kcal*alim.cantidad;
        }
    });

    //llama a la función mostrarResultado para visualizarlo en resultado
    mostrarResultado(kcal);

    console.log(ingesta); //visualiza el arreglo en consola
}


/***************** LIBRERIA SWEETALERT ***************************************/
//Muestra según el sexo y el acumulado de Kcal(contadorIngestaDiaria), si se encuentra dentro o fuera de los límites de la IDR (ingesta diaria recomendada) 
function mostrarResultado(contadorIngestaDiaria)
{
    let sexo = document.getElementById("sexo").value;

  
    if (sexo!= 0)
    {
        if ((sexo == 1) && (contadorIngestaDiaria < LIMITE1))
        {
            Swal.fire({icon: 'info',title: 'Su ingesta del día fue de '+contadorIngestaDiaria+' kcal',
                        text: 'Esto equivale al '+PORCENTAJE(contadorIngestaDiaria,LIMITE1).toFixed(2)+'% de la IDR.'});
        }
        else if ((sexo == 2) && (contadorIngestaDiaria < LIMITE2))
        {
            Swal.fire({ icon: 'info',
                        title: 'Su ingesta del día fue de '+contadorIngestaDiaria+' kcal',
                        text:  'Esto equivale al '+PORCENTAJE(contadorIngestaDiaria,LIMITE2).toFixed(2)+'% de la IDR.'});
        }
        else if ((sexo == 1) && (contadorIngestaDiaria > LIMITE1) && (contadorIngestaDiaria < LIMITE2))
        {
            Swal.fire({ icon: 'info',
                        title: 'Su ingesta del día fue de '+contadorIngestaDiaria+' kcal',
                        text: 'Se encuentra dentro de la IDR, entre 1500 y 2000 kcal/día en las mujeres.'
            });
        }
        else if ((sexo == 2) && (contadorIngestaDiaria > LIMITE2) && (contadorIngestaDiaria < LIMITE3))
        {
            Swal.fire({ icon: 'info',
                        title: 'Su ingesta del día fue de '+contadorIngestaDiaria+' kcal',
                        text: 'Se encuentra dentro de la IDR, entre 2000 y 2500 kcal/día en los hombres.'
            });
        } 
        else
        {
            Swal.fire({ icon: 'warning',
                        title: 'Su ingesta del día fue de '+contadorIngestaDiaria+' kcal',
                        text: 'Le recomendamos que reduzca la misma.'})
        }

    }
}

/***************** EVENTO CLICK DE BUTTON DESHACER *****************************/
/***************** LIBRERIA SWEETALERT ***************************************/

let deshacer = document.getElementById("deshacer"); //Variable que almacena el button deshacer

  deshacer.addEventListener('click', deshacerCambios); //Defino el evento click para el button deshacer

  //Función que maneja el evento click del button deshacer.
  //Recupera los datos del localStorage y vuelve la tablaPlato al estado anterior 
  function deshacerCambios()
  {

    Swal.fire({
        title: 'Esta seguro?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sí, deshacer!',
        denyButtonText: `No, no lo hagas!`,
        icon: 'question',
    }).then((result) => {

        if (result.isConfirmed) {
        
            //Limpia los elemento necesarios para volver atras: tablaPlato, resultado y el arreglo ingesta
            document.getElementById("plato").innerHTML="";
            ingesta.splice(0,ingesta.length);

            //toma del DOM el plato 
            let plato= document.getElementById("plato");

            //Recorre el localStorage al reverso 
            for (let i = localStorage.length-1; i >= 0 ; i--) {
            
                let clave = localStorage.key(i);
                let datos = JSON.parse(localStorage.getItem(clave)); // obtiene los datos con parse

                //crea un elemento tr por cada alimento recuperado 
                let tr = document.createElement("tr");
                //carga la información del tr usando plantillas literales
                tr.innerHTML = `<td><b> ${datos.nombre}</b></td><td><b> ${datos.cantidad} ${datos.grupo.unidadMedida}</b></td><td><i class="bi-trash3" onclick="eliminar(this)"></i></td>`;
                //agrega el tr al plato
                plato.appendChild(tr);
                
                //busca el grupo recuperado del elemento del localStorage en el arreglo grupos y lo almacena en la variable grupo
                let grupo = grupos.find((g) => g.getId() === Number(datos.grupo.id)); 

                //Crea un objeto Alimento con el nombre, grupo y cantidad recuperado del localStorage
                let alimento = new Alimento(datos.nombre.toUpperCase(), grupo, datos.cantidad);

                //Agrega el objeto alimento creado en el arreglo ingesta
                ingesta.push(alimento);

                if (ingesta.length == 1) // Muestro el encabezado de la tabla si es el primer alimento del arreglo ingesta
                {
                    let tablaPlato= document.getElementById("tablaPlato");
                    tablaPlato.classList.remove('d-none');
                }
            }

            Swal.fire('Hecho!', '', 'success')
        } 
        else if (result.isDenied) {
            Swal.fire('Cambios no realizados', '', 'info')
        }
    });

}

/***************** EVENTO CLICK DE BUTTON LIMPIAR *****************************/
/***************** LIBRERIA SWEETALERT ***************************************/

let limpiar = document.getElementById("limpiar"); //Variable que almacena el button limpiar

limpiar.addEventListener('click', limpiarElPlato); //Defino el evento click para el button limpiar

//Función que maneja el evento click del button limpiar.
//Limpia los elementos: arreglo ingesta, tablaPlato, resultado y localStorage
function limpiarElPlato()
{
    
    Swal.fire({
        title: 'Esta seguro que desea limpiar el plato?',
        text: "Esto no puede ser revertido!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, limpiar!'
    }).then((result) => {
        if (result.isConfirmed) {
            let cantidadAlimentos = ingesta.length;
            ingesta.splice(0,cantidadAlimentos);

            document.getElementById("plato").innerHTML= "";
            document.getElementById("tablaPlato").className += " d-none"; //oculto el encabezado de la tablaPlato
    
            localStorage.clear();

            Swal.fire('Hecho!', '', 'success')
            'Vacío!',
            'Su plato está limpio.',
            'success'
        
        }
    });
    
}    


/***************** FETCH  *****************************/

const listaGrupo = document.querySelector("#grupo");
//archivo Json local. Si no funciona se puede usar la siguiente línea
//fetch('https://lucibrasca.github.io/grupos.json')

//Completa el select de los grupos desde un archivo json usando fetch
fetch('grupos.json')
.then((response) => response.json())
.then((data) => {
    data.forEach((grupo) => {

    if (grupo.id == 1)
        listaGrupo.innerHTML += `<option value="${grupo.id}" selected>${grupo.nombre}</option>`;
    else
        listaGrupo.innerHTML += `<option value="${grupo.id}">${grupo.nombre}</option>`;

    } ) 
});



const carrousel = document.querySelector(".carousel-inner");
//Arma un carousel de imagenes de platos desde una API usando fetch
fetch('https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast')
.then((response) => response.json())
.then((data) => { 
    
    let cont=0;
    data.meals.forEach((alimento) => { 
    
    const {strMeal, strMealThumb, idMeal} = alimento;
    cont++;
    if (cont == 1)
        carrousel.innerHTML += `<div class="carousel-item active"><img class="d-block w-100" src="${strMealThumb}"></div>`;
    else
        carrousel.innerHTML += `<div class="carousel-item"><img class="d-block w-100" src="${strMealThumb}" ></div>`;
    
    });

 });


/***************** LIBRERIA TOASTIFY   *****************************/
//Utiliza la funcion setInterval para reiterar la llamada a una notificación Toastify 
setInterval(() => {
    Toastify({
        text: 'La OMS recomienda un aporte calórico para el adulto sano  de 1500 a 2000 kcal/día para la mujer y de 2000 a 2500 kcal/día para el hombre.',
        duration: 5000,
        gravity: 'top',
        position: 'right',
        style: {
            background: 'linear-gradient(to right, #00b09b, #96c92d)'
            }
    }).showToast();
}, 10000);

