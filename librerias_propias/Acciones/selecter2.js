//!libreria propia que usa select2, jquery, bootstrap 4 para funcionar verificar stilos por compatabilidad
/* 
  TODO: para traer la data de cualquier select2 se puede realizar esta linea de codigo
  * $('.select_otros_agendajm').select2('data'); trae json de la data contenida en el select2
  * $('.select_otros_agendajm option:selected').text(); trae cadena de la opcion seleccionada 
  * $('.select_otros_agendajm').val(); trae el id de la opción seleccionada
 */
window.select2_testing=false;
//cSpell:disable 
//!funciones de cuerpo para la configuracion del select2
window.select_agregar_text_json = (json, valid_stados = false) => {
    json.map((item) => {
        item.data = { ...item }
        item.text = item?.text ?? item?.descripcion ?? item?.nombre ?? item?.sigla ?? item?.id;
        if (Reflect.has(item, 'estado') && item.estado == 0 && valid_stados) {
            item.text = ('(Inactivo) ' + item.text).toUpperCase();
        }
    });
    return json;
}
window.Cuerpo_basico_slect2 = ({ id_or_class, result = null, id_or_class_modal = null, sajax = null, limpio = true, placeholder = false , sin_select=true}) => {
  /*
    !!width : 90% 'resolve', 'auto' ancho del campo select 
    !!dropdownAutoWidth: true o false  que las opciones no se desborden del select
    !!placeholder: lo que quieres que se muestre en el select sin seleccion
    !!allowClear :si se limpia el select de selecciones
    !!dropdownParent: si esta dentro de un modal 
    !!closeOnSelect:que se cierre al seleccionar 

    lista de atributos a select2
    !!
  */if (limpio) {
        $(id_or_class).empty();
    }
    if ($(id_or_class).length == 0) {
        console.log(`No Existe Elemento!! (${id_or_class})`);
        return;
    }
    if (typeof $(id_or_class).data() == 'object' && Reflect.has($(id_or_class).data(), 'select2')) {
        $(id_or_class).select2("destroy");
    }
    var datos = {
        //!//theme: 'bootstrap4',
        theme: 'bootstrap-5',
        //theme: "bootstrap",
        language: "es",
        width: Boolean($(id_or_class).attr("width")) ?
            $(id_or_class).attr("width") : $(id_or_class).hasClass("w-100") ?
                "100%" : "100%",
        dropdownAutoWidth: Boolean($(id_or_class).attr("dropdownAutoWidth")),
        
        placeholder: Boolean($(id_or_class).attr("placeholder")) ? $(id_or_class).attr("placeholder") : 'Seleccione  una opción',
        allowClear: Boolean($(id_or_class).attr("allow-clear")),
        closeOnSelect: Boolean($(id_or_class).attr("cerrar-selection")) ? false : true,
        minimumResultsForSearch: Boolean($(id_or_class).attr("no-busqueda")) || Boolean($(id_or_class).attr("busqueda")) ? -1 : false,
        //scrollAfterSelect:false
    }
    if (id_or_class_modal) {
        Reflect.set(datos, 'dropdownParent', id_or_class_modal != null ? $(id_or_class_modal) : false);
    }
    if (result) {
        let valid_stados = true//Boolean($(id_or_class).attr("valid-stados"))
        result = select_agregar_text_json(result, valid_stados);
        Reflect.set(datos, 'data', result);
    }
    if (sajax) {
        let aja = {
            beforeSend: sajax.beforeSend ? sajax.beforeSend :
                async function (request) {
                    request.setRequestHeader(
                        "Authorization", localStorage.getItem("info_app")
                    );
                    if(select2_testing){
                        request.setRequestHeader(
                            "Testing", select2_testing
                        );
                    }
                },
            url: sajax.url,
            type: "post",
            dataType: "json",
            delay: 250,
            data: function (params) {
                let consulta_completa = sajax.data ? sajax.data : {};
                Reflect.set(consulta_completa, 'palabraClave', params.term);
                return consulta_completa;
            },
            processResults: function (response) {
                //console.log(response);
                return {
                    results: response,
                };
            },
            cache: true,
        }
        Reflect.set(datos, 'ajax', aja);
    }
    if (Boolean(placeholder)) {
        Reflect.set(datos, 'placeholder', placeholder);
    }
    let selec_transformado = $(id_or_class).select2(datos);
    if(sin_select){
        $(id_or_class).val(null).trigger("change");
    }
    if ($(id_or_class).attr("multiple")) {
        $(id_or_class).on("change", function (e) {
            $(".select2-search__field").val('').trigger('change');
        });
    }
    $(id_or_class).on("select2:select", function (e) {
        $(`${id_or_class} + span`).removeClass("is-invalid");
    });
    return selec_transformado;
}
/* 
    *para colorear los select2 segun el tema de la empresa
*/
window.stilos_select2 = () => {
    $(document).on('focus', '.select2-selection.select2-selection--single', function (e) {
        $(this).closest(".select2-container").siblings('select:enabled').select2('open');
      });
    
      // steal focus during close - only capture once and stop propogation
      $('select.select2').on('select2:closing', function (e) {
        $(e.target).data("select2").$selection.one('focus focusin', function (e) {
          e.stopPropagation();
        });
      });
    let hoja = document.createElement("style");
    let colores=JSON.parse(sessionStorage.getItem("colores"))??['#343a40','#343a40'];
    let tmnio_fuente='font-size: 11px !important;'
    hoja.innerHTML = /*css*/`
        .select2-container--bootstrap .select2-results__option[aria-selected=true] {
                background-color: #f5f5f5;
                color: #262626;
                display:none;
        }
        .select2-container .select2-results__option[aria-selected=true] {
            background-color: #f5f5f5;
            color: #262626;
            display:none;
        }
        .select2-container--bootstrap .select2-results__option {
            padding: 6px 12px;
            text-transform: uppercase;
            ${tmnio_fuente}
        }
        .select2-container .select2-results__option {
            padding: 6px 12px;
            text-transform: uppercase;
            ${tmnio_fuente}
        }
        .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice {
            color: #fff!important;
            background: ${colores[1]} !important;
            text-transform: uppercase;
        }
        .select2-container--bootstrap5 .select2-selection--multiple .select2-selection__choice {
            color: #fff!important;
            background: ${colores[1]} !important;
            text-transform: uppercase;
        }
        .select2-container .select2-selection--multiple .select2-selection__choice {
            color: #fff!important;
            background: ${colores[1]} !important;
            text-transform: uppercase;
        }
        .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice__remove {
            color: #dad6d6;
        }
        .select2-container .select2-selection--multiple .select2-selection__choice__remove {
            color: #dad6d6;
        }
    
        .select2-container--bootstrap .select2-selection--single .select2-selection__rendered {
           
            text-transform: uppercase;
        }
        .select2-container .select2-selection--single .select2-selection__rendered {
           
            text-transform: uppercase;
        }
        .select2-container--bootstrap4 .select2-selection--single .select2-selection__rendered {
           
            text-transform: uppercase;
        }

        .select2-results__option[aria-selected] {
            ${tmnio_fuente}
        }

        .select2-container .select2-selection--single .select2-selection__rendered {
            ${tmnio_fuente}
            text-overflow:none;
        }
            
        .select2-dropdown {
            
                /*z-index: 1037;*/
        }
        .select2-container--bootstrap .select2-results__option[aria-selected=true] {
                background-color: #f5f5f5;
                color: #262626;
                display:none;
        }
        .is-invalid .select2-selection,
        .needs-validation~span>.select2-dropdown {
                border-color: red !important;
        }
        /* select2 segun el tema*/
        .select2-container--bootstrap4 .select2-results__option--highlighted,
        .select2-container--bootstrap4 .select2-results__option--highlighted.select2-results__option[aria-selected="true"] {
            background-color: ${colores[1]} !important;
        }
        .select2-container .select2-results__option--highlighted,
        .select2-container .select2-results__option--highlighted.select2-results__option[aria-selected="true"] {
            background-color: ${colores[1]} !important;
        }
        
        .select2-container--bootstrap .select2-results__option--highlighted,
        .select2-container--bootstrap .select2-results__option--highlighted.select2-results__option[aria-selected="true"] {
            background-color: ${colores[1]} !important;
        }
        .select2-container .select2-results__option--highlighted,
        .select2-container .select2-results__option--highlighted.select2-results__option[aria-selected="true"] {
            background-color: ${colores[1]} !important;
        }
        
        
        .select2-container--bootstrap4 {
            width: auto;
            flex: 1 1 auto;
        }
        
        .select2-container--bootstrap .select2-dropdown {
            border-color: ${colores[1]} !important;
        }
        .select2-container .select2-dropdown {
            border-color: ${colores[1]} !important;
        }
        
        .select2-container--bootstrap.select2-container--focus .select2-selection,
        .select2-container--bootstrap.select2-container--open .select2-selection {
            box-shadow:${colores[0]} !important;
            border-color: ${colores[1]} !important;
        }
        .select2-container.select2-container--focus .select2-selection,
        .select2-container.select2-container--open .select2-selection {
            box-shadow:${colores[0]} !important;
            border-color: ${colores[1]} !important;
        }
        
        .select2-selection__placeholder {
            color: #a4a9ad !important;
        }
        
        .select2-container--bootstrap .select2-selection--single {
            height: 31px !important;
        }
        
        .select2-container--bootstrap .select2-selection--multiple {
            min-heigth: 31px !important;
        }
        
        .select2-container--bootstrap4 .select2-selection--single {
            height: 31px !important;
            line-height: inherit;
            padding: 0 !important;
        }
        /*.select2-container--bootstrap .select2-selection--multiple .select2-search--inline .select2-search__field {
            min-width: fit-content; !important;
        }*/

        .select2-container--focus .select2-selection {
            border-color:${colores[1]} !important;
            
        }
        .select2-container--default .select2-dropdown .select2-search__field:focus, .select2-container--default .select2-search--inline .select2-search__field:focus {
       
            border: 1px solid ${colores[1]} !important;
        }
        .select2-results {
            text-align: left!important;
        }
        
        .select2-container--bootstrap-5 .select2-selection--single .select2-selection__rendered {
            padding-left: 2px  !important
           
        }
        .select2-container--bootstrap-5 .select2-selection {
            width: 100%;
            min-height: 31px !important;
            font-family: inherit;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #212529;
            background-color: #fff;
            border: 1px solid #ced4da;
            border-radius: 0.25rem;
            transition: border-color .15s ease-in-out,
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
        }
        .select2-container--bootstrap-5 .select2-selection--multiple{
            padding: 2px!important;
        }
        .select2-container--bootstrap-5 .select2-selection--single .select2-selection__rendered {
            padding-left: 2px  !important
           
        }
        .select2-container--bootstrap-5  .select2-search--inline {
            float: left;
            padding-left: 4px;
        }
        .select2-container--bootstrap-5 .select2-selection--multiple .select2-selection__rendered {
            display: flex !important;
     
            flex-direction: row!important;
            flex-wrap: wrap!important;
            padding-left: 0!important;
            margin: 0!important;
            list-style: none!important;
        }
        .select2-container--bootstrap-5 .select2-selection--multiple .select2-selection__rendered .select2-selection__choice {
                ${tmnio_fuente}
        }
        .select2-container--bootstrap-5 .select2-dropdown .select2-results__options .select2-results__option.select2-results__option--highlighted {
            color: #fff!important;
      
            background: ${colores[1]} !important;
            text-transform: uppercase;
        }
        .select2-container--bootstrap-5.select2-container--focus .select2-selection, .select2-container--bootstrap-5.select2-container--open .select2-selection {
            border-color: ${colores[1]};
            box-shadow: 0 0 0 0.25rem rgb(13 253 237 / 0%)
        }
        .select2-container--bootstrap-5 .select2-dropdown .select2-search .select2-search__field:focus {
            border-color: ${colores[1]};
            box-shadow: 0 0 0 0.25rem rgb(13 253 237 / 0%)
        }
        .select2-container--bootstrap-5 .select2-search--inline .select2-search__field {
          
            font-size: 11px;
            padding: 4px;
        }
        .select2-container--bootstrap-5 .select2-selection--multiple .select2-selection__rendered .select2-selection__choice .select2-selection__choice__remove {
            background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e") 50%/.75rem auto no-repeat;}
    `;
    document.body.appendChild(hoja);
}

//*homologa los seudonimos valriables
const hoologacion_campo = (campo) => {
    return campo.includes('id_ciudad') || campo.includes('id_municipio') ?
        'municipios' :
        campo.includes('id_sede') ?
            'sede' :
            campo.includes('id_bodega') ?
                'bodega' :
                campo.includes('id_portafolio') ?
                    'portafolio' :
                    campo.includes('id_agenda') ?
                        'agendas' :
                        campo;
}

//!select basicos
   /*
    * funcion encargada de aplicar estilos y configuracion basica a un select ya creado
    */
window.select2_transformar = (id_or_class, id_or_class_modal = false) => {
    //console.log(id_or_class, id_or_class_modal);
    return Cuerpo_basico_slect2({ id_or_class, id_or_class_modal, limpio: false });
}
/**
 * 
 * @param {*} result objeto enviado para las opciones de un selesct 
 * @param {*} id_or_class  clase o id del objeto selesct que se desea convertir
 * @param {*} id_or_class_modal solo si el select2 esta dentro de un modal
 * @returns un select de busqueda sobre un json enviado 
 */
window.select2_json = async (result, id_or_class, id_or_class_modal = null) => {
    return Cuerpo_basico_slect2({ id_or_class, result, id_or_class_modal });
}



/**
 * arma un select con un contenido segun el seudonimo (Criterio de programador) este excluye los inactivos
 * @param {*} campo seudonimo
 * @param {*} id_or_class // id o clase dle objeto select 
 * @param {*} id_or_class_modal // id o clase del modar si esta el caso que este dentro de un modal
 * @returns 
 */
window.llenar_select2_basico = async (campo, id_or_class, id_or_class_modal = null) => {
    campo = hoologacion_campo(campo);
    let user = {
        campo,
    };
    let urlS = `${urlback}Maestros/PrincipalController/select_data`;
    let response = await fetch(urlS, {
        method: "POST",
        headers: { Authorization: localStorage.getItem("info_app") },
        body: JSON.stringify(user),
    });
    let result = await response.json();
    return await Cuerpo_basico_slect2({ id_or_class, result, id_or_class_modal });
}
/**
 * arma un select con un contenido segun el seudonimo (Criterio de programador) 
 * @param {*} campo seudonimo
 * @param {*} id_or_class // id o clase dle objeto select 
 * @param {*} id_or_class_modal // id o clase del modar si esta el caso que este dentro de un modal
 * @returns 
 */
window.llenar_select2_basico_todos = async (campo, id_or_class, id_or_class_modal = null) => {
    campo = hoologacion_campo(campo);
    let user = {
        campo,
    };
    let urlS = `${urlback}Maestros/PrincipalController/select_data_todos`;
    let response = await fetch(urlS, {
        method: "POST",
        headers: { Authorization: localStorage.getItem("info_app") },
        body: JSON.stringify(user),
    });
    let result = await response.json();
    return await Cuerpo_basico_slect2({ id_or_class, result, id_or_class_modal });
}

/**
 * arma un select con un contenido segun el seudonimo (Criterio de programador) filtra el contenido y solo crea opciones segun el criterio
 * @param {*} campo seudonimo
 * @param {*} filcont //campos o propiedad porla que se filtra el json
 * @param {*} campofil //filtros del select2
 * @param {*} id_or_class // id o clase dle objeto select 
 * @param {*} id_or_class_modal // id o clase del modar si esta el caso que este dentro de un modal
 * @returns 
 */
window.llenar_select2_basico_de_id = async (campo, filcont, campofil, id_or_class, id_or_class_modal = null) => {
    campo = hoologacion_campo(campo);
    let user = {
        campo,
        filcont,
        campofil,
    };
    let urlS = `${urlback}Maestros/PrincipalController/select_data_id`;
    let response = await fetch(urlS, {
        method: "POST",
        headers: { Authorization: localStorage.getItem("info_app") },
        body: JSON.stringify(user),
    });
    let result = await response.json();
    return await Cuerpo_basico_slect2({ id_or_class, result, id_or_class_modal });
}
/**
 * arma un select con un contenido segun el seudonimo (Criterio de programador) filtra el contenido y solo crea opciones segun el criterio
 * @param {*} campo seudonimo
 * @param {*} filcont //campos o propiedad porla que se filtra el json
 * @param {*} campofil //filtros del select2
 * @param {*} filexc //filtro de excluidos
 * @param {*} campoexc //campos o propiedad porla que se excluye el json
 * @param {*} id_or_class // id o clase dle objeto select 
 * @param {*} id_or_class_modal // id o clase del modar si esta el caso que este dentro de un modal
 * @returns 
 */
window.llenar_select2_basico_de_id_excluidos = async (campo, filcont, campofil, filexc, campoexc, id_or_class, id_or_class_modal = null) => {
    campo = hoologacion_campo(campo);
    let user = {
        campo,
        filcont,
        campofil,
        filexc,
        campoexc
    };
    let urlS = `${urlback}Maestros/PrincipalController/select_data_id`;
    let response = await fetch(urlS, {
        method: "POST",
        headers: { Authorization: localStorage.getItem("info_app") },
        body: JSON.stringify(user),
    });
    let result = await response.json();
    return await Cuerpo_basico_slect2({ id_or_class, result, id_or_class_modal });
}
//TODO: select de busqueda pocos recursos no contienen todas las opciones en su propiedad 
//°este tipo de select demora menos en la renderizacion html
/**
 * select de busqueda directa sin filtros
 * @param {*} campo seudonimo
 * @param {*} infselect pleaceholder "opcional"
 * @param {*} id_or_class // id o clase dle objeto select 
 * @param {*} id_or_class_modal // id o clase del modar si esta el caso que este dentro de un modal
 * @returns 
 */
window.selecterAjaxS = async (campo, id_or_class, infselect = false, id_or_class_modal = null) => {
    campo = hoologacion_campo(campo);
    let sajax = { url: `${urlback}Maestros/PrincipalController/buscar_like_general/${campo}` }
    return await Cuerpo_basico_slect2({ id_or_class, id_or_class_modal, sajax, limpio: false, placeholder: infselect ? infselect : false });
}
/**
 * select de busqueda directa sin filtros
 * @param {*} campo seudonimo
 * @param {*} infselect pleaceholder "opcional"
 * @param {*} id_or_class // id o clase dle objeto select 
 * @param {*} id_or_class_modal // id o clase del modar si esta el caso que este dentro de un modal
 * @returns 
 */
window.selecterAjaxS_M = async (campo, id_or_class, infselect, id_or_class_modal = null) => {
    campo = hoologacion_campo(campo);
    let sajax = { url: `${urlback}Maestros/PrincipalController/buscar_like_general/${campo}` }
    return await Cuerpo_basico_slect2({ id_or_class, id_or_class_modal, sajax, limpio: false, placeholder: infselect ? infselect : false });
}
/**
 * este genra un select de busqueda a un campo filtrado mas especifico
 * @param {*} campo 
 * @param {*} id_or_class id o clase dle objeto select 
 * @param {*} infselect pleaceholder "opcional"
 * @param {*} filtro filtro al json respuesta
 * @param {*} contenido contenido del filtro
 * @param {*} id_or_class_modal id o clase del modar si esta el caso que este dentro de un modal
 * @returns 
 */
window.selecterAjaxS_M_id = async (campo, id_or_class, infselect = false, filtro, contenido, id_or_class_modal = null) => {
    campo = hoologacion_campo(campo);
    let sajax = {
        url: `${urlback}Maestros/PrincipalController/buscar_like_general_id/${campo}`,
        data: { filtro, contenido }
    }
    return await Cuerpo_basico_slect2({ id_or_class, id_or_class_modal, sajax, limpio: false, placeholder: infselect ? infselect : false });
}
window.selecter_Ajax_Campos_especificos = async (campo, id_or_class, infselect = false, conjunto, id_or_class_modal = null) => {
    campo = hoologacion_campo(campo);
    let sajax = {
        url: `${urlback}Maestros/PrincipalController/buscar_like_Campos_especificos/${campo}`,
        data: { arreglo: conjunto }
    }
    return await Cuerpo_basico_slect2({ id_or_class, id_or_class_modal, sajax, limpio: false, placeholder: infselect ? infselect : false });
}
window.selecter_Ajax_Campos_especificos_m = async (campo, id_or_class, infselect = false, conjunto, id_or_class_modal = null) => {
    campo = hoologacion_campo(campo);
    let sajax = {
        url: `${urlback}Maestros/PrincipalController/buscar_like_Campos_especificos/${campo}`,
        data: { arreglo: conjunto }
    }
    return await Cuerpo_basico_slect2({ id_or_class, id_or_class_modal, sajax, limpio: false, placeholder: infselect ? infselect : false });
}
window.selecter_Ajax_Campos_especificos_todos = async (campo, id_or_class, infselect = false, conjunto, id_or_class_modal = null) => {
    campo = hoologacion_campo(campo);
    let sajax = {
        url: `${urlback}Maestros/PrincipalController/buscar_like_Campos_especificos_todos/${campo}`,
        data: { arreglo: conjunto }
    }
    return await Cuerpo_basico_slect2({ id_or_class, id_or_class_modal, sajax, limpio: false, placeholder: infselect ? infselect : false });
}
window.selecter_Ajax_Campos_especificos_filtrados = async (campo, id_or_class, infselect, conjunto, campofil, filcont, id_or_class_modal = null) => {
    campo = hoologacion_campo(campo);
    let sajax = {
        url: `${urlback}Maestros/PrincipalController/buscar_like_Campos_especificos_filtrados/${campo}`,
        data: {
            filcont,
            campofil,
            arreglo: conjunto
        }
    }
    return await Cuerpo_basico_slect2({ id_or_class, id_or_class_modal, sajax, limpio: false, placeholder: infselect ? infselect : false });
}




//TODO Funciones nuevas select 2 
//select cruzado inner join
window.select2_cruzado = async (id_or_class, select, campo, campo2, relacion, filcont, campofil, infselect = false, id_or_class_modal = null) => {
    campo = hoologacion_campo(campo);
    campo2 = hoologacion_campo(campo2);
    let json_espc_datos = {
        select,//: '*', 
        campo,//: 'conf_especialidad', 
        campo2,// : 'especialidades',
        relacion,// :'id_especialidad',
        filcont,//: data.id,
        campofil,//: 'id_empleado'
    };
    let response = await fetch(`${urlback}Maestros/PrincipalController/select_data_id_join_invertido`, {
        method: 'POST',
        headers: { 'Authorization': localStorage.getItem('info_app') },
        body: JSON.stringify(json_espc_datos)
    }); let result = await response.json();
    return await Cuerpo_basico_slect2({ id_or_class, result, id_or_class_modal, placeholder: infselect ? infselect : false });
}
window.select2_cruzado_invertido = async (id_or_class, select, campo, campo2, relacion, filcont, campofil, infselect = false, id_or_class_modal = null) => {
    campo = hoologacion_campo(campo);
    campo2 = hoologacion_campo(campo2);
    let json_espc_datos = {
        select,//: '*', 
        campo,//: 'conf_especialidad', 
        campo2,// : 'especialidades',
        relacion,// :'id_especialidad',
        filcont,//: data.id,
        campofil,//: 'id_empleado'
    };

    let response = await fetch(`${urlback}Maestros/PrincipalController/select_data_id_join`, {
        method: 'POST',
        headers: { 'Authorization': localStorage.getItem('info_app') },
        body: JSON.stringify(json_espc_datos)
    }); let result = await response.json();
    return await Cuerpo_basico_slect2({ id_or_class, result, id_or_class_modal, placeholder: infselect ? infselect : false });
}
//!verion final de las anteriores
window.selecter_dinamico_ajax = async (campo, id_or_class, infselect = false, conjunto, campofil, filcont, id_or_class_modal = null, sin_select=true) => {
    campo = hoologacion_campo(campo);
    let sajax = {
        url: `${urlback}Maestros/PrincipalController/buscar_like_dinamico/${campo}`,
        data: {
            arreglo: conjunto
        },
        beforeSend: async function (request) {
            request.setRequestHeader(
                "Authorization", localStorage.getItem("info_app")
            );
            request.setRequestHeader(
                "filtcont", filcont
            );
            request.setRequestHeader(
                "campofilt", campofil
            );
        }
    }
    return await Cuerpo_basico_slect2({ id_or_class, id_or_class_modal, sajax, limpio: false, placeholder: infselect ? infselect : false, sin_select});
}
window.selecter_dinamico_ajax_join = async (caso,campo,campo2,id_or_class, conjunto,relacion,relacion2,campofil, filcont, campofil2, filcont2,id_or_class_modal = null, sin_select=true) => {
    campo = hoologacion_campo(campo);
    campo2 = hoologacion_campo(campo2);
    let sajax = {
        url: `${urlback}Maestros/PrincipalController/buscar_like_dinamico_join/${caso}`,
        data: {
            arreglo: conjunto
        },
        beforeSend: async function (request) {
            request.setRequestHeader(
                "Authorization", localStorage.getItem("info_app")
            );
            request.setRequestHeader(
                "relacion", relacion
            );
            request.setRequestHeader(
                "relacion2", relacion2
            );
            request.setRequestHeader(
                "filtcont", filcont
            );
            request.setRequestHeader(
                "campofilt", campofil
            );
            request.setRequestHeader(
                "filtcont2", filcont2
            );
            request.setRequestHeader(
                "campofilt2", campofil2
            );
            request.setRequestHeader(
                "campo", campo
            );
            request.setRequestHeader(
                "campo2", campo2
            );
        }
    }
    return await Cuerpo_basico_slect2({ id_or_class, id_or_class_modal, sajax, limpio: false, placeholder: false, sin_select});
}



//funciones select2 Generan select2 con la data búsqueda='Infinity'
//procesos útiles para el select2 
/*
    traer la data que contiene el select2 un json de todas sus opciones
    $('#sede_seleccionada_usuario').data().select2.options.options.data
    datos de la opción seleccionada
    $('#sede_seleccionada_usuario').data().select2.options.options.data.find(element => element.id == $('#sede_seleccionada_usuario').val());
*/