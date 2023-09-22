//import '../../plugins/slimselect/slimselect.min.js';   cSpell:disable 
window.slim_testing=false;
const hoja_de_estilo_slim = () => {
    let hoja = document.createElement("style");
    let colores=JSON.parse(sessionStorage.getItem("colores"))??['#343a40','#343a40'];
    hoja.innerHTML = `
        .ss-main {
            display: contents;
        }
        .ss-main .ss-single-selected .placeholder {
             background-color: transparent;
             opacity: 1;cursor: pointer;
        }
        .ss-content {
        width: 85%}
        .ss-main .ss-single-selected .placeholder .ss-disabled {
            color: #939ba2;
        }
        .ss-content .ss-list .ss-option.ss-highlighted, .ss-content .ss-list .ss-option:hover {
            color: #fff;
            background-color: ${colores[1]} !important;
        }
        .ss-main .ss-multi-selected .ss-values .ss-value {
            color: #fff;
            background-color: ${colores[1]} !important;
        }
    `;
    document.body.appendChild(hoja);
}
const agregar_text_json = (json) => {
    json.map((item) => {
        item.data = { ...item }
        if (item.text === undefined) {
            if (item.descripcion === undefined) {
                if (item.nombre === undefined) {
                    if (item.sigla === undefined) {
                        item.text = "ndeterminado";
                    } else {
                        item.text = item.sigla.toUpperCase();
                    }
                } else {
                    item.text = item.nombre.toUpperCase();
                }
            } else {
                item.text = item.descripcion.toUpperCase();
            }
        }
        item.value = item.id;
        if(item.estado==0){
            item.text=  `<div class="bg-danger">(Inactivo) ${item.text} </div>`
        }
    });
    return json;
}
const cuerpo = (result, id_or_class) => {
    result = agregar_text_json(result);
    hoja_de_estilo_slim();
    let elemento = id_or_class.includes('#') ? document.getElementById(id_or_class.replace('#', '')) : document.querySelector(id_or_class);
    if (elemento.getAttribute('placeholder')) {
        let array1 = [{ 'placeholder': true, 'text': elemento.getAttribute('placeholder') }]
        result = array1.concat(result);
    }
    elemento.removeAttribute('required');
    let select = new SlimSelect({
        select: id_or_class,
        showSearch: elemento.getAttribute('busqueda') ? false : true,// oculta el campo de busqueda del select
        searchFocus: true, // Whether or not to focus on the search input field
        searchHighlight: true,
        allowDeselect: elemento.getAttribute('allowDeselect') ? true : false,

        deselectLabel: '<i class="far fa-times-circle"></i>',
        closeOnSelect: true,

        showOptionTooltips: true,
        hideSelectedOption: true,

        searchPlaceholder: elemento.getAttribute('placeholder') ? ('Buscar ' + elemento.getAttribute('placeholder')).toUpperCase() : 'Buscar elemento',
        showContent: 'auto', // 'auto', 'up' or 'down'
        placeholder: elemento.getAttribute('placeholder') ? ('Seleccione ' + elemento.getAttribute('placeholder')).toUpperCase() : 'Buscar elemento',
        data: result,
        searchFilter: (option, search) => {
            let search_p = search.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let opcion_p = option.text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            let busqueda_search=search_p.split(" ");
            let cont_bool=false;
            busqueda_search.forEach(element => {
                cont_bool||=(opcion_p).includes(element);
            });
            return cont_bool;
        },
        beforeOpen: function () {
            //console.log(this)
            if (this.slim.list.children.length > 1) {
                //console.log(this.slim.list.children[1].classList.value.includes())
                if (!this.slim.list.children[1].classList.value.includes('ss-option-selected')) {
                    this.slim.list.children[1].classList.add('ss-highlighted');
                } else {
                    if (this.slim.list.children.length >= 2) {
                        this.slim.list.children[2].classList.add('ss-highlighted');
                    }
                }
            }
        },
    });
   let camposde = select.slim.search.container.children[0];
    let functiff = (e) => {
        //console.log(e.keyCode)
        if (e.keyCode != 40 && e.keyCode != 38) {
            if (select.slim.list.children.length > 0) {
                //console.log(select.slim.list.children)
                select.slim.list.children[0].classList.add('ss-highlighted');
            }
        }
    }
    camposde.addEventListener("keyup", functiff);

    return select;
}
const cuerpo_ajax = (urlss, id_or_class, datos = {}, headers={ Authorization: localStorage.getItem("info_app") }) => {
    let urlslim = urlss
    hoja_de_estilo_slim();
    let elemento = id_or_class.includes('#') ? document.getElementById(id_or_class.replace('#', '')) : document.querySelector(id_or_class);
    elemento.removeAttribute('required');
    elemento.innerHTML='';
    let select = new SlimSelect({
        select: id_or_class,
        allowDeselect: elemento.getAttribute('allowDeselect') ? true : false,
        hideSelectedOption: true,
        searchPlaceholder: elemento.getAttribute('placeholder') ? ('Buscar ' + elemento.getAttribute('placeholder')).toUpperCase() : 'Buscar elemento',
        showContent: 'auto', // 'auto', 'up' or 'down'
        placeholder: elemento.getAttribute('placeholder') ? ('Seleccione ' + elemento.getAttribute('placeholder')).toUpperCase() : 'Buscar elemento',
        deselectLabel: '<i class="far fa-times-circle"></i>',
        allowDeselectOption: true,
        searchPlaceholder: "Buscar",
        searchingText: 'buscando...', // Optional - Will show during ajax request
        searchFocus: true,
        searchHighlight: true,
        searchText: 'No existen conincidencias',
        ajax: async function (search, callback) {
            if (search.length < 2) {
                callback('Solo se permite busqueda despues de 3 caracteres')
                return
            }
            let data = new FormData();
            for (let key in datos) {
                data.append(key, datos[key]);
            }
            data.append('palabraClave', search);
            Reflect.set (headers,'Authorization',localStorage.getItem("info_app"));
            if(slim_testing){
                Reflect.set (headers,'testing',slim_testing);
            }
            let response = await fetch(urlslim, {
                method: "post",
                headers: headers,
                body: data
            });
            let result = await response.json();
            let resultado = [];
            result.forEach(element => {
                element.value = element.id;
                resultado.push({ ...element, ...{ 'data': element } });
            });
            if (elemento.getAttribute('placeholder')) {
                callback([{ 'placeholder': true, 'text': elemento.getAttribute('placeholder') }, ...resultado]);
            }else{
                callback([{ 'placeholder': true, 'text': `Seleccion un elemento`.toUpperCase() }, ...resultado]);
            }
        },
        searchFilter: (option, search) => {
            let search_p = search.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let opcion_p = option.text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            let busqueda_search=search_p.split(" ");
            let cont_bool=false;
            busqueda_search.forEach(element => {
                cont_bool||=(opcion_p).includes(element);
            });
            return cont_bool;//(opcion_p).includes(search_p);
        }
    })
    let camposde = select.slim.search.container.children[0];
    let functiff = (e) => {
        if (e.keyCode != 40 && e.keyCode != 38) {
            if (select.slim.list.children.length > 0) {
                //console.log(select.slim.list.children)
                select.slim.list.children[0].classList.add('ss-highlighted');
            }
        }
    }
    camposde.addEventListener("keyup", functiff);
    return select;
}

const cuerpo_ajax_eval_datos = (urlss, id_or_class, datos = {},) => {
    let urlslim = urlss
    hoja_de_estilo_slim();
    let elemento = id_or_class.includes('#') ? document.getElementById(id_or_class.replace('#', '')) : document.querySelector(id_or_class);
    elemento.innerHTML='';
    let select = new SlimSelect({
        select: id_or_class,
        allowDeselect: elemento.getAttribute('allowDeselect') ? true : false,
        hideSelectedOption: true,

        searchPlaceholder: elemento.getAttribute('placeholder') ? ('Buscar ' + elemento.getAttribute('placeholder')).toUpperCase() : 'Buscar elemento',
        showContent: 'auto', // 'auto', 'up' or 'down'
        placeholder: elemento.getAttribute('placeholder') ? ('Seleccione ' + elemento.getAttribute('placeholder')).toUpperCase() : 'Buscar elemento',

        deselectLabel: '<i class="far fa-times-circle"></i>',
        allowDeselectOption: true,
        searchPlaceholder: "Buscar",
        searchingText: 'buscando...', // Optional - Will show during ajax request
        searchFocus: true,
        searchHighlight: true,
        searchText: 'No existen conincidencias',
        ajax: async function (search, callback) {
            if (search.length < 2) {
                callback('Solo se permite busqueda despues de 3 caracteres')
                return
            }
            let data = new FormData();
            for (let key in datos) {
                data.append(key, eval(datos[key]));
            }
            data.append('palabraClave', search);
            let response = await fetch(urlslim, {
                method: "post",
                headers: { Authorization: localStorage.getItem("info_app") },
                body: data
            });
            let result = await response.json();
            let resultado = [];
            result.forEach(element => {
                element.value = element.id;
                resultado.push({ ...element, ...{ 'data': element } });
            });
            if (elemento.getAttribute('placeholder')) {
                callback([{ 'placeholder': true, 'text': elemento.getAttribute('placeholder') }, ...resultado]);
            }

        },
        searchFilter: (option, search) => {
            let opcion_p = option.text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            let search_p = search.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return (opcion_p).includes(search_p);
        }
    })
    let camposde = select.slim.search.container.children[0];
    let functiff = (e) => {
        if (e.keyCode != 40 && e.keyCode != 38) {
            if (select.slim.list.children.length > 0) {
                //console.log(select.slim.list.children)
                select.slim.list.children[0].classList.add('ss-highlighted');
            }
        }
    }
    camposde.addEventListener("keyup", functiff);

    return select;
}

window.slimselect_transformar = (id_or_class) => {
    hoja_de_estilo_slim();
    let elemento = id_or_class.includes('#') ? document.getElementById(id_or_class.replace('#', '')) : document.querySelector(id_or_class);
    if (elemento.getAttribute('placeholder')) {
        elemento.innerHTML += '<option data-placeholder="true"></option>';
    }
    let select = new SlimSelect({
        select: id_or_class,

        showSearch: elemento.getAttribute('busqueda') ? false : true,// oculta el campo de busqueda del select
        searchFocus: false, // Whether or not to focus on the search input field
        searchHighlight: true,

        allowDeselect: true,

        deselectLabel: '<i class="far fa-times-circle"></i>',
        closeOnSelect: true,

        showOptionTooltips: true,
        hideSelectedOption: true,

        searchPlaceholder: elemento.getAttribute('placeholder') ? ('Buscar ' + elemento.getAttribute('placeholder')).toUpperCase() : 'Buscar elemento',
        showContent: 'auto', // 'auto', 'up' or 'down'
        placeholder: elemento.getAttribute('placeholder') ? ('Seleccione ' + elemento.getAttribute('placeholder')).toUpperCase() : 'Buscar elemento',
    });
    return select;
};

window.slimselect_todas_sedes = async (id_or_class) => {
    let urlS = `${urlback}maestros/principalcontroller/select_sedes_todas`;
    let response = await fetch(urlS, {
        method: "get",
        headers: { Authorization: localStorage.getItem("info_app") },
    });
    let result = await response.json();
    return cuerpo(result, id_or_class);
};

/**
 * Funcion que segun un campo seleccionado de un maestro genera un select con la informacion solicitada
 * @param {*} campo=sexos
 * @param {*} campo=municipios
 * @param {*} campo=departamento
 * funciona para select2 que esten dentro de un swithalert2
 */
window.slimselect_maestro = async (campo, id_or_class) => {
    let user = {
        campo,
    };
    let response = await fetch(
        `${urlback}maestros/principalcontroller/select_data`, {
        method: "POST",
        headers: { Authorization: localStorage.getItem("info_app") },
        body: JSON.stringify(user),
    }
    );
    let result = await response.json();
    return cuerpo(result, id_or_class);
};

window.slimselect_basico = async (campo, id_or_class) => {
    let user = {
        campo,
    };
    let urlS = `${urlback}maestros/principalcontroller/select_data`;
    let response = await fetch(urlS, {
        method: "POST",
        headers: { Authorization: localStorage.getItem("info_app") },
        body: JSON.stringify(user),
    });
    let result = await response.json();
    return cuerpo(result, id_or_class);
};

/**
 * funcion que convierte un select a un select2 con un filtro integrado donde 
 * @param {*} campo  informacion :municipios
 * @param {*} filcont 10
 * @param {*} campofil id_departamento
 * @param {*} id_or_class_select clase del select 
 */
window.slimselect_basico_de_id = async (campo, filcont, campofil, id_or_class) => {
    let user = {
        campo,
        filcont,
        campofil,
    };
    let urlS = `${urlback}maestros/principalcontroller/select_data_id`;
    let response = await fetch(urlS, {
        method: "POST",
        headers: { Authorization: localStorage.getItem("info_app") },
        body: JSON.stringify(user),
    });
    let result = await response.json();
    return cuerpo(result, id_or_class);

};

/**
 * funcion que convierte un select a un select2 con un filtro integrado donde 
 * @param {*} campo  informacion :municipios
 * @param {*} filcont 10
 * @param {*} campofil id_departamento
 * @param {*} filexc 1
 * @param {*} campoexc estado
 * @param {*} id_or_class_select clase del select 
 */
window.slimselect_basico_de_id_excluidos = async (campo, filcont, campofil, filexc, campoexc, id_or_class) => {
    let user = {
        campo,
        filcont,
        campofil,
        filexc,
        campoexc
    };
    let urlS = `${urlback}maestros/principalcontroller/select_data_id`;
    let response = await fetch(urlS, {
        method: "POST",
        headers: { Authorization: localStorage.getItem("info_app") },
        body: JSON.stringify(user),
    });
    let result = await response.json();
    return cuerpo(result, id_or_class);
};

window.slimselect_Ajax = async (campo, id_or_class) => {

    if (campo.includes("ciudad")) {
        campo = "municipios";
    } if (campo.includes("portafolio")) {
        campo = "portafolio";
    } if (campo == "id_agenda") {
        campo = "agendas";
    }
    let urls = `${urlback}maestros/principalcontroller/buscar_like_general/${campo}`;
    let select = await cuerpo_ajax(urls, id_or_class)
    return select;
};

window.slimselect_Ajax_id = async (campo, id_or_class, filtro, contenido) => {
    if (campo.includes("ciudad")) {
        campo = "municipios";
    } if (campo.includes("portafolio")) {
        campo = "portafolio";
    } if (campo == "id_agenda") {
        campo = "agendas";
    }
    let urls = `${urlback}maestros/principalcontroller/buscar_like_general_id/${campo}`;
    let dato = { filtro, contenido }
    let select = await cuerpo_ajax(urls, id_or_class, dato);
    return select;
};
//solo activos
window.slimselect_Ajax_Campos_especificos = async (campo, id_or_class, conjunto) => {
    if (campo.includes("ciudad")) {
        campo = "municipios";
    } if (campo.includes("portafolio")) {
        campo = "portafolio";
    } if (campo == "id_agenda") {
        campo = "agendas";
    }
    let urls = `${urlback}maestros/principalcontroller/buscar_like_Campos_especificos/${campo}`;
    let dato = { arreglo: conjunto }
    let select = await cuerpo_ajax(urls, id_or_class, dato);
    return select;
};
//activos e inactivos
window.slimselect_Ajax_Campos_especificos_todos = async (campo, id_or_class, conjunto) => {
    if (campo.includes("ciudad")) {
        campo = "municipios";
    } if (campo.includes("portafolio")) {
        campo = "portafolio";
    } if (campo == "id_agenda") {
        campo = "agendas";
    }
    let urls = `${urlback}maestros/principalcontroller/buscar_like_Campos_especificos_todos/${campo}`;
    let dato = { arreglo: conjunto }
    let select = await cuerpo_ajax(urls, id_or_class, dato);
    return select;
};

window.slimselect_dinamico_ajax=async (campo, id_or_class, infselect, conjunto,campofil, filcont) => {
    if (campo.includes("ciudad")) {
        campo = "municipios";
    } if (campo.includes("portafolio")) {
        campo = "portafolio";
    } if (campo == "id_agenda") {
        campo = "agendas";
    }
    let urls = `${urlback}maestros/principalcontroller/buscar_like_dinamico/${campo}`;
    let dato = { arreglo: conjunto }
    let headers={
        Authorization:localStorage.getItem("info_app"),
        filtcont:filcont,
        campofilt:campofil
    }
    let select = await cuerpo_ajax(urls, id_or_class, dato, headers);
    return select;
};

window.slimselect_pacientes=async(id_or_class)=>{
    let urls = urlback + "Agendamedica/AgendasController/buscar_like_paciente";
    let select = await cuerpo_ajax(urls, id_or_class);
    return select;
}
/**
 *
 * select2 de busqueda rapida con campos especificos
 */
window.slimselect_Ajax_Campos_especificos_filtrados= async(campo, id_or_class, infselect, conjunto,campofil, filcont) => {
        if (campo.includes("ciudad")) {
            campo = "municipios";
        } if (campo.includes("portafolio")) {
            campo = "portafolio";
        } if (campo == "id_agenda") {
            campo = "agendas";
        }
        let urls = `${urlback}maestros/principalcontroller/buscar_like_Campos_especificos_filtrados/${campo}`;
        let dato = { filcont,
            campofil,
            arreglo: conjunto}
        let select = await cuerpo_ajax(urls, id_or_class, dato);
        return select;
};

//Casos especiales para no cargar toda la data en un select este es un select de busqueda y trae los datos segun el cuadro de busqueda
window.slimselect_medicosc = async (id_or_class) => {
    let urls = `${urlback}Agendamedica/AgendasController/buscar_like_profesional`;
    let dato = { id_sede: `sessionStorage.getItem('id_sede')` }
    let select = await cuerpo_ajax_eval_datos(urls, id_or_class, dato);
    return select;
};

window.slimselect_pacientesc = async (id_or_class) => {
    let urls = `${urlback}Agendamedica/AgendasController/buscar_like_paciente`;
    let select = await cuerpo_ajax(urls, id_or_class);
    return select;
};

window.slimselect_medicosc_Todas_sedes_g = async (id_or_class) => {
    let urls = `${urlback}Agendamedica/AgendasController/buscar_like_profesional_Todas_sedes`;
    let select = await cuerpo_ajax(urls, id_or_class);
    return select;
};


//caso especial municipio o ciudad con el departamento select2 ajax 
window.slimselect_municipios = async (id_or_class) => {
    let urls = `${urlback}maestros/principalcontroller/buscar_like_municipios`;
    let select = await cuerpo_ajax(urls, id_or_class);
    return select;
};

//caso especial municipio o ciudad con el departamento select2 ajax 
window.slimselect_especialidades_sedes_agendas = async (id_or_class) => {
    let urls = `${urlback}maestros/principalcontroller/buscar_like_especialidades_sedes`;
    let dato = { id_sede: `sessionStorage.getItem('id_sede')` }
    let select = await cuerpo_ajax_eval_datos(urls, id_or_class, dato);
    return select;
};
//selecciona los servicios dependiendo si es un laboratorio
window.slimselect_PruebasTipo = async (id_or_class, tipo) => {
    let urls = `${urlback}HistoriaAmbulatoria/ModeloController/buscar_like_tipo`;
    let dato = { tipo }
    let select = await cuerpo_ajax(urls, id_or_class, dato);
    return select;
};

window.llenar_slimselect_sedes_empleado = async (campo, id_or_class) => {
    let user = {
        campo,
    };
    let urlS = `${urlback}Agendamedica/AgendasController/select_data_sedes`;
    let response = await fetch(urlS, {
        method: "POST",
        headers: { Authorization: localStorage.getItem("info_app") },
        body: JSON.stringify(user),
    });
    let result = await response.json();
    return cuerpo(result, id_or_class);
};

//especialidades de in id empleado especifico
window.llenar_slimselect_especialidades_empleado = async (campo, id_or_class) => {
    let user = {
        campo,
    };
    let urlS = `${urlback}Agendamedica/AgendasController/select_data_especialidades`;
    let response = await fetch(urlS, {
        method: "POST",
        headers: { Authorization: localStorage.getItem("info_app") },
        body: JSON.stringify(user),
    });
    let result = await response.json();
    return cuerpo(result, id_or_class);

};

window.slimselect_cruzado = async (id_or_class, select, campo, campo2, relacion, filcont, campofil) => {
    let json_espc_datos = {
        select,//: '*', 
        campo,//: 'conf_especialidad', 
        campo2,// : 'especialidades',
        relacion,// :'id_especialidad',
        filcont,//: data.id,
        campofil,//: 'id_empleado'
    };
    let response = await fetch(`${urlback}maestros/principalcontroller/select_data_id_join_invertido`, {
        method: 'POST',
        headers: { 'Authorization': localStorage.getItem('info_app') },
        body: JSON.stringify(json_espc_datos)
    });
    let result = await response.json();
    return cuerpo(result, id_or_class);
};

window.slimselect_cruzado_invertido = async (id_or_class, select, campo, campo2, relacion, filcont, campofil) => {
    let json_espc_datos = {
        select,//: '*', 
        campo,//: 'conf_especialidad', 
        campo2,// : 'especialidades',
        relacion,// :'id_especialidad',
        filcont,//: data.id,
        campofil,//: 'id_empleado'
    };

    let response = await fetch(`${urlback}maestros/principalcontroller/select_data_id_join`, {
        method: 'POST',
        headers: { 'Authorization': localStorage.getItem('info_app') },
        body: JSON.stringify(json_espc_datos)
    });
    let result = await response.json();
    return cuerpo(result, id_or_class);

};

/**
 * se necesitan las variables globales  sede_refresh y arreglo_opcion
 * Funcion creada para cambiar sedes de uuarios con un select cualquiera convirtiendolo en un select2
 * actualizando la variable session y asignando el valor el de la sede seleccionada
 */
window.slimselect_sede_user = async (id_or_class) => {
    let response = await fetch(
        `${urlback}maestros/principalcontroller/select_data_sedes`, {
        method: "GET",
        headers: { Authorization: localStorage.getItem("info_app") },
    });
    let result = await response.json();
    let select = cuerpo(result, id_or_class);

    /*select.beforeOnChange= (info) => {
        console.log(info)
    }*/
    select.onChange = (info) => {
        if (info && !info.placeholder) {
            if (Array.isArray(info)) {
                info.map(function (x) {
                    console.log(x.data);
                });
            } else {
                var data = info.data
                cambiar_sede(data.id, data.nombre);
                if (sede_refresh) {
                    ViewsLoadNoMod(arreglo_opcion.path, arreglo_opcion.titulo, arreglo_opcion.modulo, arreglo_opcion.m_opcion, arreglo_opcion.m_proceso, sede_refresh);
                }
            }
        }
    };
    select.set(sessionStorage.getItem("id_sede"));
    cambiar_sede(sessionStorage.getItem("id_sede"), select.data.data.find(element => element.id == select.selected()).data.nombre);
    return select;
};
/* crear nueva opcion slim select de un ajax 
let new_option={id:registro[element.n_campo],text:registro[element.n_campo.replace('id_', '')],value:registro[element.n_campo], selected:true};
document.getElementById(element.id_select).slim.addData(new_option);
  setear un slimselect o limpiarlo        
document.getElementById(element.id_select).slim.setSelected('undefined');
document.getElementById(element.id_select).slim.setSelected(1);
para taer la data seleccionada 
document.getElementById('productos_general_id_marcas_productos').slim.data.getSelected()
*/

//adaptacion v2

/**
 * 
 * 
 *  let elemento = document.getElementById('#nomme'.replace('#', ''));
            select = new SlimSelect({
                  select: '#nomme',
                  settings: {
                        //contend de busqueda
                        openPosition: 'auto', // 'auto', 'up' or 'down'
                        contentPosition: 'absolute', // 'absolute' or 'relative'
                        //placeholder
                        placeholderText: elemento.getAttribute('placeholder') ? (elemento.getAttribute('placeholder')).toUpperCase() : 'buscar alguna coincidencia!',
                        //permite deseleccionar
                        allowDeselect: elemento.getAttribute('allowDeselect') ? true : false,

                        // campo de busqueda
                        showSearch: elemento.getAttribute('busqueda') ? false : true,// oculta el campo de busqueda del select
                        searchPlaceholder: 'buscar alguna coincidencia!',
                        searchText: 'No se encuantra ninguna coincidencia!!',
                        searchHighlight: true,
                        searchingText: 'Buscando',
                        //cerrar al seleccionar
                        closeOnSelect: true,
                        //mostrar ayuda de opcion
                        showOptionTooltips: true,
                        //ocultar opcion seleccionada
                        hideSelected: true,

                  },
                  /*data: [
                         { 'placeholder': true, 'text': elemento.getAttribute('placeholder') },
                         { text: 'Value 11' },
                         { text: 'Value 22' },
                         { text: 'Value 32' }
                   ],* /
                   events: {
                    search: (search, currentData) => {
                          return new Promise(async (resolve, reject) => {
                                if (search.length < 2) {
                                      return reject('se busca despues de 2 caracteres'.toUpperCase())
                                } else {
                                      let urls = `${urlback}maestros/principalcontroller/buscar_like_general/municipios`;
                                      let data = new FormData();
                                      data.append('palabraClave', search);
                                      let response = await fetch(urls, {
                                            method: "post",
                                            headers: { Authorization: localStorage.getItem("info_app") },
                                            body: data
                                      });
                                      let result = await response.json();
                                      return resolve([{ 'placeholder': true, 'text': elemento.getAttribute('placeholder') }, ...result]);
                                }
                          });
                    },
                    searchFilter: (option, search) => {
                          let opcion_p = option.text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                          let search_p = search.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                          return (opcion_p).includes(search_p);
                    },
                    beforeOpen: function () {
                          console.log(select.render.content)
                          if (select.render.content.list.children.length > 1) {
                                select.render.content.list.children[1].classList.add('ss-highlighted');
                                console.log(select.render.content.list.children[1].classList.value);
                          }
                    },
                    beforeChange: (newVal, oldVal) => {
                          console.log(newVal)
                    
                          //return false // this will stop the change from happening
                    }
              }

        });
        let camposde = select.render.content.search.input;
        let functiff = (e) => {
              console.log(e.keyCode);
             if (e.keyCode != 40 && e.keyCode != 38) {
              let ke = new KeyboardEvent('keypress', {
                          keyCode: 40 ,which :40
                    });
                    document.body.dispatchEvent(ke);
                   // select.render.content.list.children[0]
                    //select.render.content.list.children[0].classList.add('ss-highlighted');
                    if (e.keyCode == 13) {
                          console.log(select.render.content.list.children);
                         select.render.content.list.children[0].click();
                    }
             }
             
        }
        camposde.addEventListener("keyup", functiff);
        //para reafirmar los colores de la empresa
 * 
 *  */ 