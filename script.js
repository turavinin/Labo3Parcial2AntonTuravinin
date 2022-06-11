// GLOBALES
var arrayVehiculos = new Array();
var arrayHeaders = new Array("id", "fabricante", "modelo", "añoLanzamiento", "cantidadPuertas", "transmision4x4", "modificar", "eliminar");

var auto = 1;
var camioneta = 2;

var modificar = 1;
var eliminar = 2;

// ELEMENTOS
let spinner = document.getElementById("spinner");
let table = document.getElementById("table");
let tableTBody = document.getElementById("table-tbody");
let tableWrapper = document.getElementById("table-warepper");

let agregarBtn = document.getElementById("agregarBtn");

let formWrapper = document.getElementById("form-wrapper");
let form = document.getElementById("form");
let wrapperTypeForm = document.getElementById("combo-box-form");
let selectTypeForm = document.getElementById("combo-box-select-form");

let camposFormAuto = document.getElementById("camposFormAuto");
let camposFormCamioneta = document.getElementById("camposFormCamioneta");

let cancelarBtn = document.getElementById("cancelar");
let aceptarBtn = document.getElementById("aceptar");

// CLASES
class Vehiculo {
    id;
    fabricante;
    modelo;
    añoLanzamiento;

    constructor(id, fabricante, modelo, añoLanzamiento)
    {
        this.id = id||null;
        this.fabricante = fabricante.toString()||null;
        this.modelo = modelo.toString()||null;
        this.añoLanzamiento = añoLanzamiento||null;;
    }

    toJsonString(conId)
    {
        let jsonString = "";

        if(conId == true)
        {
            jsonString = `id: ${this.id.toString()},`;
        }

        return jsonString += `fabricante: ${this.fabricante}, modelo: ${this.modelo}, añoLanzamiento: ${this.añoLanzamiento.toString()}`;
    }
}

// Auto
class Auto extends Vehiculo {
    cantidadPuertas;

    constructor(id, fabricante, modelo, añoLanzamiento, cantidadPuertas){
        super(id, fabricante, modelo, añoLanzamiento);
        this.cantidadPuertas = cantidadPuertas||null;
    }

    toJsonString(conId)
    {
        let jsonString = "{";

        if(conId == true)
        {
            jsonString += `id: ${this.id.toString()},`;
        }

        return jsonString += `${super.toString()}, cantidadPuertas: ${this.cantidadPuertas.toString()}`;
    }
}

// Camioneta
class Camioneta extends Vehiculo {
    transmision4x4;

    constructor(id, fabricante, modelo, añoLanzamiento, transmision4x4){
        super(id, fabricante, modelo, añoLanzamiento);
        this.transmision4x4 = transmision4x4.toString()||null;
    }

    toJsonString(conId)
    {
        let jsonString = "{";

        if(conId == true)
        {
            jsonString += `id: ${this.id.toString()},`;
        }

        return jsonString += `${super.toString()}, transmision4x4: ${this.transmision4x4}`;
    }
}

// SPINNER
function ManageSpinner(show)
{
    if(show == true)
    {
        spinner.setAttribute("class", "show");
    }
    else
    {
        spinner.removeAttribute("class");
    }
}


// METODOS
function IniciarTabla()
{
    GetVehiculos();
}

function GetVehiculos()
{
    let endpoint = "Vehiculos/Vehiculos";

    fetch(`http://localhost:5000/${endpoint}`, { method: 'GET' }).then(function(response) {
        if(response.status == 200) 
        {
            response.json().then(function(obj)
            {
                arrayVehiculos= obj.map(ObjectToTipoPersona);
                ArmarTabla(arrayVehiculos, false);
            })
        } 
        else 
        {
          console.log('No se pudo hacer la peticion');
        }
      })
      .catch(function(error) 
      {
        console.log('Hubo un problema con la petición:' + error.message);
      });
}

// PARSEOS
function ObjectToTipoPersona(elemento)
{
    return elemento["cantidadPuertas"] != null ? ParsearAuto(elemento) : ParsearCamioneta(elemento);
}

function ParsearVehiculo(obj, tipoVehiculo)
{
    if(tipoVehiculo == 1)
    {
        return ParsearAuto(obj);
    }
    else if(tipoVehiculo == 2)
    {
        return ParsearCamioneta(obj);
    }
}

function ParsearAuto(obj)
{
    return new Auto(obj["id"], obj["fabricante"], obj["modelo"], obj["añoLanzamiento"], obj["cantidadPuertas"]);
}

function ParsearCamioneta(obj)
{
    return new Camioneta(obj["id"], obj["fabricante"], obj["modelo"], obj["añoLanzamiento"], obj["transmision4x4"]);
}


// TABLA
function ArmarTabla(arrayVehiculos, borrarPreviamente = false)
{
    if(borrarPreviamente == true)
    {
        while (table.firstChild) 
        {
            table.removeChild(table.lastChild);
        }
    }

    ArmarTablaHeader();
    LlenarTabla(arrayVehiculos);
    CrearEventosBtnAccion();

    ManageSpinner(false);
}

function ArmarTablaHeader()
{
    let tHead = document.createElement('thead');
    tHead.setAttribute("id","table-thead");

    let tr = document.createElement('tr');
    tr.setAttribute("id","tr");

    arrayHeaders.forEach(element => 
    {
        let th = CrearElementoConIdYTexto("th", "th-td", element.toUpperCase(), false, element);
        tr.appendChild(th);
        tHead.appendChild(tr);
        table.appendChild(tHead);
    });
}

function CrearElementoConIdYTexto(elemento, id, texto, esButton = false, name = null, atrNuevo = null, valorAtrNuevo = null)
{
    let element = document.createElement(elemento);
    element.setAttribute("id", id);

    let text = document.createTextNode(texto);
    element.appendChild(text);

    if(esButton == true)
    {
        element.setAttribute("class", "headerButton");
    }

    if(atrNuevo != null)
    {
        element.setAttribute(atrNuevo, valorAtrNuevo);
    }

    if(name != null)
    {
        element.setAttribute("name", name);
    }

    return element;
}

function LlenarTabla(arrayVehiculos)
{
    let tBody = document.createElement('tbody');
    tBody.setAttribute("id","table-tbody");

    let tr;

    arrayVehiculos.forEach(vehiculo => {

        tr = document.createElement('tr');
        tr.setAttribute("id","tr-body");

        if(vehiculo instanceof Auto)
        {
            arrayTd = new Array();
            EvaluarColumnaYPushearTd(arrayTd, "id", vehiculo.id, vehiculo.id);
            EvaluarColumnaYPushearTd(arrayTd, "fabricante", vehiculo.fabricante, vehiculo.id);
            EvaluarColumnaYPushearTd(arrayTd, "modelo", vehiculo.modelo, vehiculo.id);
            EvaluarColumnaYPushearTd(arrayTd, "añoLanzamiento", vehiculo.añoLanzamiento, vehiculo.id);
            EvaluarColumnaYPushearTd(arrayTd, "cantidadPuertas", vehiculo.cantidadPuertas, vehiculo.id);
            EvaluarColumnaYPushearTd(arrayTd, "transmision4x4", "N/A", vehiculo.id);
            EvaluarColumnaYPushearTd(arrayTd, "modificar", "Modificar", vehiculo.id, true, "btnAccion", 1);
            EvaluarColumnaYPushearTd(arrayTd, "eliminar", "Eliminar", vehiculo.id, true, "btnAccion", 2);
            
            AppendChilds(tr, arrayTd);
            tBody.appendChild(tr);
        }
        else if(vehiculo instanceof Camioneta)
        {
            arrayTd = new Array();
            EvaluarColumnaYPushearTd(arrayTd, "id", vehiculo.id, vehiculo.id);
            EvaluarColumnaYPushearTd(arrayTd, "fabricante", vehiculo.fabricante, vehiculo.id);
            EvaluarColumnaYPushearTd(arrayTd, "modelo", vehiculo.modelo, vehiculo.id);
            EvaluarColumnaYPushearTd(arrayTd, "añoLanzamiento", vehiculo.añoLanzamiento, vehiculo.id);
            EvaluarColumnaYPushearTd(arrayTd, "cantidadPuertas", "N/A", vehiculo.id);
            EvaluarColumnaYPushearTd(arrayTd, "transmision4x4", vehiculo.transmision4x4, vehiculo.id);
            EvaluarColumnaYPushearTd(arrayTd, "modificar", "Modificar", vehiculo.id, true, "btnAccion", 1);
            EvaluarColumnaYPushearTd(arrayTd, "eliminar", "Eliminar", vehiculo.id, true, "btnAccion", 2);

            AppendChilds(tr, arrayTd);
            tBody.appendChild(tr);
        }

        table.appendChild(tBody);
    });
}

function EvaluarColumnaYPushearTd(arrayTd, columnaEvaluada, valorElemento, idElemento, esButton = false, atrNuevo = null, valorAtrNuevo = null)
{
    let td = CrearElementoConIdYTexto("td", "th-td", valorElemento, esButton, idElemento, atrNuevo, valorAtrNuevo);
    arrayTd.push(td);
}

function AppendChilds(parentElement, arrayOfElements)
{
    arrayOfElements.forEach(element => {
        parentElement.appendChild(element);
    });
}

// FORM
function IniciarForm(tipoVehiculo, esModificar = false, id = null){

    if(esModificar && id != null)
    {
        let vehiculo= ObtenerVehiculoPorId(id);
        tipoVehiculo = ObtenerTipoVehiculo(vehiculo);
        LlenarCamposForm(vehiculo);
    }

    if(!esModificar)
    {
        LimpiarCamposForm();
    }
    

    MostrarOcultarCamposForm(tipoVehiculo, esModificar);
    // MostrarOcultarBotonesForm(esModificar);

    ManejarTabla(true);
    formWrapper.style.visibility = "visible";
}

function LlenarCamposForm(vehiculo)
{
    document.getElementById("inId").value = vehiculo.id;
    document.getElementById("inFabricante").value = vehiculo.fabricante;
    document.getElementById("inModelo").value = vehiculo.modelo;
    document.getElementById("inAñoLanzamiento").value = vehiculo.añoLanzamiento;
    document.getElementById("inCantidadPuertas").value = vehiculo.cantidadPuertas;
    document.getElementById("inTransmision4x4").value = vehiculo.transmision4x4;
}

function LimpiarCamposForm()
{
    document.getElementById("inId").value = "";
    document.getElementById("inFabricante").value = "";
    document.getElementById("inModelo").value = "";
    document.getElementById("inAñoLanzamiento").value = "";
    document.getElementById("inCantidadPuertas").value = "";
    document.getElementById("inTransmision4x4").value = "";
}

function MostrarOcultarCamposForm(tipoVehiculo, esModificar)
{
    if(tipoVehiculo == auto)
    {
        camposFormCamioneta.style.display = "none";
        camposFormAuto.style.display = "block";
    }
    else
    {
        camposFormCamioneta.style.display = "block";
        camposFormAuto.style.display = "none";
    }

    if(esModificar == true)
    {
        selectTypeForm.setAttribute("disabled", "true")
    }
    else
    {
        selectTypeForm.removeAttribute("disabled");
    }

    selectTypeForm.value = tipoVehiculo;
}

function ObtenerVehiculoPorId(id)
{
    return arrayVehiculos.find(x => x.id == id);
}

function ObtenerTipoVehiculo(elemento)
{
    if(!isNaN(elemento["cantidadPuertas"]))
    {
        return 1;
    }

    return 2;
}

function OcultarForm()
{
    formWrapper.style.visibility = "hidden";
    ManageSpinner(false);
    ManejarTabla(false);
}

function ManejarTabla(ocultar = false)
{
    if(ocultar==true)
    {
        tableWrapper.style.visibility = "hidden";
    }
    else
    {
        tableWrapper.style.visibility = "visible";
    }
}

function GetData(validar = true){

    let vehObj = [];
    vehObj.id = document.getElementById("inId").value;
    vehObj.fabricante = document.getElementById("inFabricante").value;
    vehObj.modelo = document.getElementById("inModelo").value;
    vehObj.añoLanzamiento = document.getElementById("inAñoLanzamiento").value;
    vehObj.cantidadPuertas = document.getElementById("inCantidadPuertas").value;
    vehObj.transmision4x4 = document.getElementById("inTransmision4x4").value;
    let tipoVeh = selectTypeForm.value;

    if(validar == true)
    {
        let esValid = ValidarData(vehObj, tipoVeh)

        if(esValid)
        {
            return vehObj;
        }
    }
    else if(validar == false)
    {
        return vehObj;
    }

    return null;
}

// AGREGAR
function AgregarVehiculo()
{
    let obj = GetData();

    if(obj != null)
    {
        let vehiculo = ParsearVehiculo(obj, selectTypeForm.value);

        EnviarNuevoVehiculo(vehiculo);
        return;
    }

    ManageSpinner(false);
}

function EnviarNuevoVehiculo(vehiculo)
{
    let json2 = JSON.stringify(vehiculo);

    let xhttp = new XMLHttpRequest();
    let endpoint = vehiculo instanceof Auto ? "Vehiculos/InsertarAuto" : "Vehiculos/InsertarCamioneta";

    xhttp.onload = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            let respuesta = JSON.parse(this.responseText);

            AgregarPersonaArrayYActualizar(vehiculo, respuesta.id)
        }
        else
        {
            alert("Error de sistema. Pruebe de nuevo.");
        }
    }

    xhttp.open("PUT", `http://localhost:5000/${endpoint}`);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(json2);
}

function AgregarPersonaArrayYActualizar(vehiculo, id)
{
    vehiculo.id = id;
    arrayVehiculos.push(vehiculo);

    ArmarTabla(arrayVehiculos, true);
        
    OcultarForm();
}

// MODIFICAR
function ModificarVehiculo()
{
    let obj = GetData();

    if(obj != null)
    {
        let vehiculo = ParsearVehiculo(obj, selectTypeForm.value)

        EnviarExistente(vehiculo);
        return;
    }

    OcultarForm(false);
}

async function EnviarExistente(vehiculo)
{
    let endpoint = vehiculo instanceof Auto ? "Vehiculos/ModificarAuto" : "Vehiculos/ModificarCamioneta";

    try
    {
        let http = await fetch(`http://localhost:5000/${endpoint}`, 
        {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(vehiculo)
        });

        let response = await http.text();

        if(http.status == 200)
        {
            ActualizarVehiculoArray(vehiculo)
        }
        else
        {
            alert("No se pudo realizar la operación. Intente de nuevo.");
            OcultarForm();
        }
    }
    catch(ex)
    {
        alert("Error de sistema. Intente de nuevo.");
        OcultarForm();
    }
}

function ActualizarVehiculoArray(vehiculo)
{
    let indexVehiculo = ObtenerIndexDeVehiculoPorId(vehiculo.id);

    arrayVehiculos[indexVehiculo].fabricante = vehiculo.fabricante;
    arrayVehiculos[indexVehiculo].modelo = vehiculo.modelo;
    arrayVehiculos[indexVehiculo].añoLanzamiento = vehiculo.añoLanzamiento;
    arrayVehiculos[indexVehiculo].cantidadPuertas = vehiculo.cantidadPuertas;
    arrayVehiculos[indexVehiculo].transmision4x4 = vehiculo.transmision4x4;

    ArmarTabla(arrayVehiculos, true);
    OcultarForm();
}

function ObtenerIndexDeVehiculoPorId(id)
{
    return arrayVehiculos.findIndex(x => x.id == id);
}

// ELIMINAR
function EliminarVehiculo()
{
    let obj = GetData();

    EnviarEliminar(obj.id);
}

async function EnviarEliminar(idVeh)
{
    let endpoint = "Vehiculos/EliminarVehiculo";
    let idJson = `{"id":${idVeh}}`;
    try
    {
        let http = await fetch(`http://localhost:5000/${endpoint}`, 
        {
            method: 'DELETE',
            headers: {'Content-Type' : 'application/json'},
            body: idJson
        });

        let response = await http.text();

        if(http.status == 200)
        {
            EliminarVehiculoDeArray(idVeh);
        }
        else
        {
            alert("No se pudo realizar la operación. Intente de nuevo.");
            OcultarForm();
        }
    }
    catch(ex)
    {
        alert("Error de sistema. Intente de nuevo.");
        OcultarForm();
    }
}

function EliminarVehiculoDeArray(id)
{
    let index = ObtenerIndexDeVehiculoPorId(id);
    arrayVehiculos.splice(index, 1);

    ArmarTabla(arrayVehiculos, true);

    OcultarForm();
}

// VALIDACION
function ValidarData(vehiculo, tipoVehiculo)
{
    if(!StringValido(vehiculo.fabricante))
    {
        alert("El fabricante no es valido.");
        return false;
    }

    if(!StringValido(vehiculo.modelo))
    {
        alert("El modelo no es valido.");
        return false;
    }

    if (!NumeroValido(vehiculo.añoLanzamiento) || vehiculo.añoLanzamiento <= 1920)
    {
        alert("El año de lanzamiento no es valido.");
        return false;
    }

    if(tipoVehiculo == 1)
    {
        if (!NumeroValido(vehiculo.cantidadPuertas) || vehiculo.cantidadPuertas < 2)
        {
            alert("La cantidad de puertas no es valida.");
            return false;
        }
    }
    else if(tipoVehiculo == 2)
    {
        if(!StringValido(vehiculo.transmision4x4) && (vehiculo.transmision4x4 != "SI" || vehiculo.transmision4x4 != "NO"))
        {
            alert("La especificacion de transmision 4x4 no es valida.");
            return false;
        }
    }

    return true;
}

function NumeroValido(number, esFloat = false)
{
    if(esFloat)
    {
        number = parseFloat(number.replace(/,/g,'.'));
    }

    if(number == "" || isNaN(number))
    {
        return false;
    }

    return true;
}

function StringValido(string)
{
    if(string == null || string == undefined || string.trim() == "")
    {
        return false;
    }

    return true;
}

// EVENTOS
function Iniciar()
{
    ManageSpinner(true);
    IniciarTabla();
}

function CrearEventosBtnAccion()
{
    let btns = document.querySelectorAll(".headerButton");

    Array.from(btns).forEach(btn => {
        btn.addEventListener('click', function(){
            let accion = btn.getAttribute("btnaccion");
            if(accion == modificar)
            {
                aceptarBtn.setAttribute("name", "modificar");
                IniciarForm(0, true, btn.attributes["name"].value);
            } 
            else if (accion == eliminar)
            {
                aceptarBtn.setAttribute("name", "eliminar");
                IniciarForm(0, true, btn.attributes["name"].value);
            }
        })
    });
}

document.addEventListener("load", Iniciar());

agregarBtn.addEventListener("click", function(){
    IniciarForm(1);
})

cancelarBtn.addEventListener("click", function(){
    OcultarForm();
})

selectTypeForm.addEventListener('change', function(){
    MostrarOcultarCamposForm(selectTypeForm.value)
})

aceptarBtn.addEventListener('click', function(){
    let valorId = document.getElementById("inId").value;
    
    let accion = aceptarBtn.getAttribute("name");
    ManageSpinner(true);
    if(accion == null)
    {
        AgregarVehiculo();
    }
    else if(accion == "modificar")
    {
        ModificarVehiculo();
        aceptarBtn.removeAttribute("name");
    }
    else if(accion == "eliminar")
    {
        EliminarVehiculo();
        aceptarBtn.removeAttribute("name");
    }
})