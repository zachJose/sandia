//requiere view.js, selecter.js
//data_tablas dinamicas con paginacion y flitros especiales
window.colors_bg = [
    'bg-sidi',
    'bg-sidib',
    'bg-primary',
    'bg-info',
    'bg-success',
    'bg-danger',
    'bg-warning',
    'bg-secondary',
    'bg-light border-primary',
    'bg-dark',
    'bg-white border-success',
    'bg-transparent border-info'
];

window.stilos_dtables = () => {
    let hoja = document.createElement("style");
    let colores = JSON.parse(sessionStorage.getItem("colores")) ?? ['#343a40', '#343a40'];
    let tmnio_fuente = 'font-size: 11px !important;'
    hoja.innerHTML = /*css*/`
    /*data tables egun el tema */
    .dataTables_wrapper .label-font-s-p {
        ${tmnio_fuente}
    }
    td.sorting_1{
        padding:0;
    }
    td.sorting_1 button{
            padding-top: 0!important;
            padding-bottom: 0!important;
            margin-top: 0!important;
            margin-bottom: 0!important;
    }
    .dt-button-collection .dropdown-menu{
        display:block;
        z-index: 1036;
    }
    .buttons-columnVisibility, .buttons-collection{
        padding:0;
        padding-left:4;
        padding-right:4;

    } 
    .dt-button-collection .dropdown-menu .dropdown-item {
        display: block;
        width: 100%;
        padding:0;
        margin:0;
        clear: both;
        font-weight: 400;
        color: black;
        text-align: inherit;
        white-space: nowrap;
        border: 0;
    }
    .dt-button-collection .dropdown-menu .dropdown-item.active, .dropdown-item:active {
        color: #fff;
        text-decoration: none;
        background-color: ${colores[0]};
    }
    
    .place_dark::placeholder{
        color: black;
       
        outline:0;
        ${tmnio_fuente}
        font-weight: bold;
    }
    .span_dark{
        color: black !important;
        ${tmnio_fuente}
        font-weight: bold !important;
        border:none !important;
    }

    .place_dark{
        padding:0;
        outline: none;
        background-color: rgba(255, 255, 255, 0);
        border: 0;
        width: 100%;
        min-width: 100px;
    }

    .dataTables_scrollBody table thead th {
        border-bottom: 4px solid #ffffff00 !important;
    }

        .dataTables_info {
            text-decoration: ${colores[1]} !important;
        }
        
        .page-item.active .page-link {
            color: #fff;
            background-color: ${colores[1]} !important;
            border-color: ${colores[1]} !important;
        }
        
        .page-item a {
            border: none !important;
            color: ${colores[1]} !important;
        }
        
        .page-item.active .page-link {
            color: #fff !important;
            border-radius: 5px !important;
            background-color: ${colores[1]} !important;
            border-color: ${colores[1]} !important;
        }
        
        a.page-link {
            color: ${colores[1]};
        }
        
        .dataTables_scroll {
            min-height: 500px;
        }
        
        .border-b {
            border-bottom: 2px solid ${colores[1]} !important;
        }
        /*fin datatables*/
        
    `;
    document.body.appendChild(hoja);
}

window.colors = [
    'blue',
    'indigo',
    'purple',
    'pink',
    'red',
    'orange',
    'yellow',
    'green',
    'teal',
    'cyan',
    'white',
    'gray',
    'gray-dark',
    '#007bff54',
    '#dc354573',
    '#28a74573',
    '#ffc1074d',
    'rgba(75, 192, 192)',
    'rgba(75, 192, 192, 0.2)',
    'rgb(220, 53, 69)',
    'rgb(220, 53, 69, 0.37)'
]


/* funciones sortables*/
window.obtener_elementos_sorttable = (id_or_class) => {
    let arreglo = [];
    for (let index = 0; index < $(id_or_class)[0].children.length; index++) {
        const contenido = $(id_or_class)[0].children[index].innerText;
        const id = $(id_or_class)[0].children[index].attributes.resp.value;
        const elementos = JSON.parse($(id_or_class)[0].children[index].attributes.elementos.value);
        arreglo.push({ orden: index + 1, id, elementos, text: contenido });
    }
    return arreglo
}

window.pintar_sorttable_id = async (campo, campofil, id, id_element, grid = false, col = 'col-2', icons = 'fas fa-list-ol') => {
    let user = {
        campo: campo,
        campofil: campofil,
        filcont: id
    };
    let response = await fetch(urlback + 'Maestros/PrincipalController/select_data_id', {
        method: 'POST',
        headers: { 'Authorization': localStorage.getItem('info_app'), 'Sede-Select': sessionStorage.getItem('id_sede') },
        body: JSON.stringify(user)
    });
    let result = await response.json();
    let elemento_papa = document.getElementById(id_element);
    elemento_papa.innerHTML = '';
    let clase = '';
    if (grid) {
        clase = col;
        elemento_papa.classList.add('row', 'text-uppercase');
    } else {
        clase = 'list-group-item';
        elemento_papa.classList.add('list-group', 'list-group-sm', 'text-uppercase');
    }
    let contador = 0;
    result.forEach((element) => {
        contador = contador >= colors_bg.length ? 0 : contador;
        let ttextt = Reflect.has(element, 'descripcion') ? element.descripcion : '';
        let cards = ``;
        if (!grid) {
            cards = `<div class= 'alert  '>`
            for (let [key, value] of Object.entries(element)) {
                if (!(key.includes('id_') || key == 'id' || key.includes('d_at'))) {

                    cards += `<div class='list-group-item ${colors_bg[contador]}' >${key}: ${value}</div>`
                }
            }
            cards += `</div>`
        }
        else {
            cards = `<div class="small-box ${colors_bg[contador]}">
                            <div class="inner">
                            <h3>${element.id}</h3>
                            <p>${element.descripcion}</p>
                            </div>
                            <div class="icon">
                            <i class="fas fa-list-ol"></i>
                            </div>
                            <a elementos='${JSON.stringify(element)}' class="small-box-footer sorttable_masinfo">
                            More info <i class="fas fa-arrow-circle-right"></i>
                            </a>
                        </div>`;
        }
        elemento_papa.innerHTML += `<div class="${clase}" id="${id_element + '_' + element.id}" resp="${element.id}" elementos='${JSON.stringify(element)}' text="${ttextt}" >${cards}</div>`;
        contador++;
    });

    let sort = new Sortable(document.getElementById(id_element), {
        animation: 150,
        ghostClass: 'blue-background-class',
        onEnd: (x) => {
            console.log('se movió un elemento', x);
        }
    });

    /*document.getElementsByClassName('sorttable_masinfo').addEventListener(function (e) {
        console.log(this.attributes.elementos.value);
    });*/
    return sort;
}

window.pintar_sorttable_json = async (result, id_element, grid = false) => {
    let elemento_papa = document.getElementById(id_element);
    elemento_papa.innerHTML = '';
    let clase = '';
    if (grid) {
        clase = col;
        elemento_papa.classList.add('row', 'text-uppercase');
    } else {
        clase = 'list-group-item';
        elemento_papa.classList.add('list-group', 'list-group-sm', 'text-uppercase');
    }
    let contador = 0;
    result.forEach((element) => {
        contador = contador >= colors_bg.length ? 0 : contador;
        let ttextt = Reflect.has(element, 'descripcion') ? element.descripcion : '';
        let cards = ``;
        if (!grid) {
            cards = `<div class= 'alert  '>`
            for (let [key, value] of Object.entries(element)) {
                if (!(key.includes('id_') || key == 'id' || key.includes('d_at'))) {

                    cards += `<div class='list-group-item ${colors_bg[contador]}' >${key}: ${value}</div>`
                }
            }
            cards += `</div>`
        }
        else {
            cards = `<div class="small-box ${colors_bg[contador]}">
                            <div class="inner">
                            <h3>${element.id}</h3>
                            <p>${element.descripcion}</p>
                            </div>
                            <div class="icon">
                            <i class="fas fa-list-ol"></i>
                            </div>
                            <a elementos='${JSON.stringify(element)}' class="small-box-footer sorttable_masinfo">
                            More info <i class="fas fa-arrow-circle-right"></i>
                            </a>
                        </div>`;
        }
        elemento_papa.innerHTML += `<div class="${clase}" id="${id_element + '_' + element.id}" resp="${element.id}" elementos='${JSON.stringify(element)}' text="${ttextt}" >${cards}</div>`;
        contador++;
    });

    let sort = new Sortable(document.getElementById(id_element), {
        animation: 150,
        ghostClass: 'blue-background-class',
        onEnd: (x) => {
            console.log('se movió un elemento', x);
        }
    });
}

window.cambiar_estados = async (dato, campo, columna) => {
    let response = await fetch(`${urlback}Maestros/PrincipalController/cambiar_estados`, {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('info_app'),
            'Campo2': dato.id,
            'Campo': campo,
            'campo4': columna,
            'Campo3': dato[columna] == 1 ? 0 : 1
        },
    });
    let result = await response;
    if (result.ok) {
        let resspp = await response.json();
        guardar_bitacora(resspp.id, `Se cambio estado desde tabla ${campo}`, 'Cambio de estado');
        return resspp;
    } else {
        let resspp = await response.json();
        return false;
    }
}



/*tablas dinamicas principales*/

/*ejemeplos
let data =
    {
        id_or_class: id_or_class,
        descripcion: "preguntas",
        url_controller: `${urlback}Agendamedica/AgendasController/report_op_asignacion`,
        columnas: ['programa', 'medico', 'especialidad', 'anio', 'mes', 'n_dia', 'dia', 'cupo_total', 'max_citas', 'asignadas', 'diferencia'],
        agrup_columns:[0, 1, 2],
        columnas_ocult: [0, 1, 2, 3, 4],
        campo:  document.querySelector('input[name="op_cal"]:checked').value=='max_citas'?'max_citas':'evento_diario',//'citas',
        campo_filt,
        filt_cont,
        acumuladores: 1,// si se planea tener el total de una coluna o la cantidad de registros de un grupo   
        columnas_suma: [9, 10],
        columnas_contar: [5], //1=sumar->2=contar
        totales_generales:[10,7]
    }
o
     let data =
    {
        id_or_class: id_or_class,
        descripcion: "porcentajes",
        //url_controller: `${urlback}Agendamedica/AgendasController/report_op_asignacion`,
        columnas: colummnas,
        agrup_columns:[0, 2],
        columnas_ocult: [0, 1, 2, 3, 4,5,6,7,8,9,10],
        campo: document.querySelector('input[name="op_cal"]:checked').value=='max_citas'?'max_citas':'evento_diario',
        campo_filt,
        filt_cont,
        acumuladores: 1,// si se planea tener el total de una coluna o la cantidad de registros de un grupo   
        columnas_suma: [colummnas.indexOf(document.querySelector('input[name="op_cal"]:checked').value),9, 10 ],
        //1=sumar->2=contar
        //columnas_contar: [5], //1=sumar->2=contar
        //totales_generales:[9,10,colummnas.indexOf(document.querySelector('input[name="op_cal"]:checked').value)]
         porcentage:true,
         //porcentages:['%Ocupacion',70,1, [columnas_suma[columnas_suma.length-1],columnas_suma[columnas_suma.length-2]]]//label, alerta de colores mayor de 70 verde menor de 70 rojo se intercambian si el tercer valor es 1
    

    }
*/

window.pivot_dinamic = async (
    {
        id_or_class,
        descripcion,
        url_controller = `${urlback}maestros/Principalcontroller/data_pivote`,
        columnas = [],
        agrup_columns = [0],
        columnas_ocult = [0],
        acumuladores = 0,// si se planea tener el total de una coluna o la cantidad de registros de un grupo   
        columnas_suma = [],
        dinero = 0,//si lo que se suma es dinero=1
        campo = 0,
        columnas_contar = [], //1=sumar->2=contar
        campo_filt = null,
        filt_cont = null,
        up_cal = '',
        totales_generales = [],
        porcentage = false,
        porcentages = ['%Ocupacion', 70, 0, [columnas_suma[1], columnas_suma[0]]]//label, alerta de colores mayor de 70 verde menor de 70 rojo se intercambian si el tercer valor es 1
    }) => {
    // dtatttsum();
    //!columns=['nombre','apellido', etc...]
    //!agrup_columns=[0,2,5,7] las columnas por las que se a agrupar
    let columnas_def = [];
    if (!columnas.length == 0) {
        $(`${id_or_class}`).empty().append(`<table  style="width:100%;border-top:0" id='tabla_${descripcion}' class="display text-nowrap table table-striped table-bordered table-sm label-font-s-p "></table>`);
        $(`${id_or_class} table`).append(`<thead></thead> <tfoot></tfoot>`);
        $(`${id_or_class} table thead`).append(`<tr></tr>`);
        $(`${id_or_class} table tfoot`).append(`<tr></tr>`);


        columnas.map(x => {
            columnas_def.push({ data: x });
            $(`#tabla_${descripcion} thead tr`).append(` <th style="width:auto; " class=" border-b label-font-s-p text-left">${x.replaceAll('diferencia', 'disponible').replaceAll('n_dia', '#_dia').toUpperCase().replaceAll('_', ' ')}</th>`);
            $(`#tabla_${descripcion} tfoot tr`).append(` <th style="width:auto; " class=" border-0 border-top border-bottom label-font-s-p text-left"></th>`);

        });
    }
    let order_column = [];
    for (let index = 0; index < agrup_columns.length; index++) {
        const element = agrup_columns[index];
        order_column.push([element, 'asc'])
    } if (agrup_columns.length == 0) {
        order_column = [0, 'asc']
    }
    let table = $(`#tabla_${descripcion}`).DataTable({
        language: {
            processing: "Procesando...",
            searchPlaceholder: `Buscar ${descripcion.replaceAll('_', ' ').toLowerCase()}`,
            lengthMenu: "Mostrar _MENU_ registros",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            infoEmpty: "",
            infoFiltered: "(total _MAX_ registros)",
            search: ``,
            infoThousands: ",",
            loadingRecords: "Cargando...",

            paginate: {
                first: "<i class='fas fa-caret-left'></i>",
                last: "<i class='fas fa-caret-right'></i>",
                next: "<i class='fas fa-angle-right'></i>",
                previous: "<i class='fas fa-angle-left'></i>",
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente",

            },
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
        },
        response: true,
        processing: true,
        serverSide: true,

        ajax: {
            beforeSend: function (request) {
                request.setRequestHeader(
                    "Authorization",
                    localStorage.getItem("info_app")
                );
            },
            url: `${url_controller}`,
            type: 'POST',
            headers: {
                'Authorization': localStorage.getItem('info_app'),
                'Ruta': arreglo_opcion.titulo,
                'Campofilt': campo_filt,
                'Filtcont': filt_cont,
                'Campo': campo,
            }
        },
        columns: columnas_def,//[{data:'columna1'}, {data:'columna2'}] nombres de columnas visibles en la posicion reglamentaria 
        columnDefs: [
            {
                targets: ["_all"],
                sortable: false,
                render: function (data, type, row, meta) {
                    let campofil = meta.settings.aoColumns[meta.col].data;
                    if (campofil == 'diferencia') {
                        if (data >= 0) {
                            return `<span class="badge badge-pill rounded-pill badge-success bg-success float-right">${data}</span>`;
                        } else {
                            return `<span class="badge badge-pill rounded-pill badge-danger bg-danger float-right">${data}</span>`;
                        }
                    }
                    if (!isNaN(data) && campofil != 'n_dia') {
                        //console.log(campofil);
                        return `<span class="float-right">${data}</span>`;
                    }
                    return data;
                }
            }, { visible: false, targets: columnas_ocult },
            {
                targets: columnas_suma,
                render: function (data, type, row, meta) {
                    if (!isNaN(data)) {
                        return `<span class="float-right">${format_numero_cadena(data)}</span>`;
                    }
                    return data;
                }
            }
        ],
        order: order_column,//[[0, 'asc'], [1, 'asc'], [2, 'asc']],
        iDisplayLength: -1,
        aLengthMenu: [
            [5, 10, 15, 20, -1],
            [5, 10, 15, 20, "Todos"]
        ],
        drawCallback: function (settings) {
            let api = this.api();
            let rows = api.rows({ page: 'current' }).nodes();
            let last = null;
            let sumados = {};
            let contados = {};
            for (let index = 0; index < totales_generales.length; index++) {
                $(api.column(totales_generales[index]).footer()).html(
                    'Total: <span class="float-right"> ' + api.column(totales_generales[index], { page: 'current' }).data().sum() + '</span>'
                )
            }

            for (let index = 0; index < columnas_suma.length; index++) {
                Reflect.set(sumados, columnas_suma[index], 0);
            }
            for (let index = 0; index < columnas_contar.length; index++) {
                Reflect.set(contados, columnas_contar[index], 0);
            }

            for (let index = 0; index < agrup_columns.length; index++) {
                let fushion = api.column([agrup_columns[index]], { page: 'current' }).data();
                if (api.column([agrup_columns[index]], { page: 'current' }).data()) {
                    api.column([agrup_columns[index]], { page: 'current' }).data().each(function (group, i, x) {
                        if (acumuladores != 0) {
                            for (let isC in sumados) {
                                sumados[isC] += api.column([isC], { page: 'current' }).data()[i];
                            }
                            for (let isC in contados) {
                                contados[isC] += 1;
                            }
                            if ((i != 0 || fushion[i] != fushion[i + 1]) && agrup_columns[index] == agrup_columns[agrup_columns.length - 1]) {
                                if (fushion[i] != fushion[i + 1]) {
                                    let largo_colspan = (columnas.length - columnas_ocult.length) - (columnas_contar.length + columnas_suma.length) + (porcentage ? -1 : 0);
                                    let cadena_after = ` <tr class="${colors_bg[8]} fondo_stdr border border-warning"> 
                                    <td colspan="${largo_colspan}">${porcentage ? group : 'Totales'}</td>`;
                                    for (let isC in contados) {
                                        let titulos = columnas[isC]
                                            .replaceAll('diferencia', 'disponible')
                                            .replaceAll('n_dia', '#_dia')
                                            .toUpperCase().replaceAll('_', ' ');
                                        cadena_after += `<td class="font-weight-bold" >${titulos}:<span class="badge badge-pill rounded-pill badge-info bg-info float-right">${contados[isC]}</span></td>`;
                                    }
                                    for (let isC in sumados) {
                                        let titulos = columnas[isC]
                                            .replaceAll('diferencia', 'disponible')
                                            .replaceAll('n_dia', '#_dia')
                                            .toUpperCase().replaceAll('_', ' ');
                                        cadena_after += `<td class="font-weight-bold">${titulos}:<span class="badge badge-pill rounded-pill badge-warning bg-warning float-right">${format_numero_cadena(sumados[isC])}</span></td>`;
                                    }
                                    if (porcentage) {
                                        let calculo = Math.round((sumados[porcentages[3][0]] / sumados[porcentages[3][1]]) * 100);
                                        let pintura = '';
                                        if (calculo >= porcentages[1]) {
                                            if (porcentages[2] == 1) {
                                                pintura = 'badge-danger bg-danger'
                                            } else {
                                                pintura = 'badge-success bg-success'
                                            }
                                        } else {
                                            if (porcentages[2] == 1) {
                                                pintura = 'badge-success bg-success'
                                            } else {
                                                pintura = 'badge-danger bg-danger'
                                            }

                                        }
                                        cadena_after += `<td class="font-weight-bold">${porcentages[0]}:<span class="badge badge-pill rounded-pill ${pintura} float-right">${calculo}%</span></td>`;
                                    }
                                    cadena_after += `</tr>`;
                                    $(rows).eq(i).after(cadena_after);
                                    for (let isC in sumados) {
                                        sumados[isC] = 0;
                                    }
                                    for (let isC in contados) {
                                        contados[isC] = 0;
                                    }

                                }
                            }
                        }
                        if (last !== group) {
                            if (porcentage && index != 0) {
                                //$(rows).eq(i).before(`<tr class="${colors_bg[index]} fondo_stdr"><td colspan="100">${group}</td></tr>`);
                                if (agrup_columns[index] == agrup_columns[agrup_columns.length - 1]) {
                                    $(rows).eq(i).before($(`#tabla_${descripcion} thead tr`).html());
                                }
                            } else {
                                $(rows).eq(i).before(`<tr class="${colors_bg[index]} fondo_stdr"><td colspan="100">${group}</td></tr>`);
                                if (agrup_columns[index] == agrup_columns[agrup_columns.length - 1]) {
                                    $(rows).eq(i).before($(`#tabla_${descripcion} thead tr`).html());
                                }
                            }
                            last = group;
                        }
                    });
                    //se igualan a 0 todos los contadores
                    for (let isC in sumados) {
                        sumados[isC] = 0;
                    }
                    for (let isC in contados) {
                        contados[isC] = 0;
                    }
                }
            }




        },
        initComplete: function () {
            $('#column3_search').on('keyup', function () {
                table
                    .columns(3)
                    .search(this.value)
                    .draw();
            });
        }
    });
    if (agrup_columns.length > 0) {
        $(`#tabla_${descripcion} thead`).addClass('invisible');
    }

    return table;
}

/* ejemplo de uso  deben estar bien creadas las relaciones de las tablas 
tabla_json({campo: 'admision',
id_or_class: '.tabla_demo',
descripcion: "sexos",
campo_filt: 'created_at,primer_nombre',
filt_cont: "'2022-10-14'<'2022-10-20',doralina",
columnas_ocultas: ['sede', 'cliente','regimen', 'periodo', 'tipo_contratos_cliente','autorizacion', 'portafolio', 'portafolio_med', 'estado'],
 columnas_extras: [
                {
                    searchable: false,
                    data: `btn`,
                    contenido: `<i class="fas fa-exclamation-circle"></i>`,
                    defaultContent: `(row.admision|| row.citas_atendidas==0?'<button type="button" title="ver detalle admision" class="ver_det_adm_rpt btn btn-outline btn-sm"><i class="fas fa-info-circle"></i></button>':'<button type="button" title="ver detalle admision" class="crear_det_adm_rpt btn btn-outline btn-sm"><i class="fas fa-file-invoice"></i></button>')`,
                    width: '20px'
                }, 
                {
                    searchable: false,
                    data: `btn2`,
                    contenido: `quedan <i class="fas fa-yin-yang"></i>`,
                    defaultContent: `'<span class="badge badge-pill rounded-pill '+(row.cantidad_citas-row.citas_atendidas ==0?' badge-success bg-success':' badge-danger bg-danger')+'">'+(row.cantidad_citas-row.citas_atendidas)+'</span>'`,
                    width: '20px'
                }
            ],
responsive_table: false,
botones_table : true,
multifiltro: true,
text:false,
order: false,
largo_table : false,
botones_generales: true,
totales_generales:[8, 17],
table_bordered:false
})
*/
window.tabla_json = async ({
    campo = '',
    id_or_class, //clase o id  del div contenedor .X #x
    descripcion, //nombre o descricp mn
    campo_filt = null, //filtros 
    filt_cont = null, //foltros, pueden ser arreglos
    columnas_ocultas = [],// columnas ocultas nombres
    responsive_table = false, //la tabla sea responsive
    botones_table = true, //botones de accion en la tabla 
    largo_table = true, //cantidad de registros 
    busqueda_table = true, //busqueda general
    paginacion_table = true, //visual de la paginacion
    multifiltro = false, //filtros por columnas
    modales = null, //importante si pertence a algun modal
    order = true, //si quiere ordenar la tabla [[ 0, 'asc' ], [ 1, 'asc' ]]
    ordering = true,//siquiere activar ordenamiento por columnas
    pageLength = 10, //la cantidad e registros apra el primer cargue 
    info = true, //informacion footer sobre registros y filtros 
    scrollX = false,
    scrollY = false,
    text = false, //label despues del cuadro de busqueda en un multifiltro
    text_nowrap = false, //si el texto es muy ancho hace salto de linea
    botones_generales = false, //botones de excel, pdf e impresion
    columnas_dinero = [],
    columnas_extras = false, //![{buscar:9(columna al buscar), searchable: false (si se busca o no), data: 'Nombre columna', defaultContent: `valor _prederminado puede ser un elemento html`}]
    xls = false,
    pdf = false,
    colvis = false,
    colvis2 = false,
    copy = false,
    print = false,
    csv = false,
    refescar=false,
    totales_generales = [],//totales generales
    table_bordered = false,
    mayuscula = false,
    columna_V = false,// [{nombre_columna:'',tipo:''}]
    url_controller = `${urlback}maestros/Principalcontroller/tabla_reff`,
    testting = false,
    table_striped = true,
    select=false
}) => {
    let result = [];
    //verificamos si se envia el head si no se busca en un servicio especifico
    if (columna_V) {
        result = columna_V;
    } else {
        let response = await fetch(`${urlback}maestros/PrincipalController/head_estado/${campo}`, {
            method: 'GET',
            headers: { 'Authorization': localStorage.getItem('info_app'), 'Sede-Select': sessionStorage.getItem('id_sede') },
        });
        result = await response.json();
    }
 

    //se genera la estructura de la tabal en HTML
    $(`${id_or_class}`).empty().append(`<table style="width: 100%;" id='tabla_${descripcion}' class="table table-sm  ${table_bordered ? 'table-bordered' : ' '} label-font-s-p ${text_nowrap ? 'text-nowrap' : ''} ${table_striped ? 'table-striped' : ''} ${responsive_table ? 'dt-responsive nowrap' : ''} "></table>`);
    $(`${id_or_class} table`).append(`<thead class="text-nowrap"></thead>`);
    $(`${id_or_class} table thead`).append(`<tr></tr>`);

    let columnas = [];
    //se definen las columnas y sus posibles mascaras
    columnas = mascaras({ descripcion, campo, multifiltro, result, columnas, totales_generales, columnas_ocultas }).columnas;
    //se colocan los botones y
    columnas = botones_columnas({ columnas, descripcion, responsive_table, botones_table, columnas_extras, totales_generales, modales });
    //se definen las normas de configuracion basica
    let json_table = config_tablas({
        descripcion, columnas, pageLength, order, paginacion_table, info, responsive_table,
        largo_table, scrollX, url_controller, campo, campo_filt, filt_cont, scrollY, ordering,select
    });
    //se define el aspecto de cada celda de la tabla
    json_table = { ...definicion_columnas({ testting, campo, json_table, descripcion, mayuscula, columnas_dinero, columnas_extras }) };
    //si configuracion de los botones excel pdf y print⬇️
    if (botones_generales) {
        json_table = { ...botones_generales_tabla({ json_table, xls, pdf, print, colvis, copy, csv, colvis2,  refescar }) };
    }
    //genera los input y select si se requieren si es multiflitro
    if (multifiltro && !responsive_table) {
        json_table = { ...eventos_filtrado({ descripcion, modales, json_table, multifiltro, columnas_extras, botones_table, responsive_table }) };
    }
    //si existen totales generales ⬇️
    if (totales_generales.length > 0) {
        json_table = { ...totales_generales_tabla({ json_table, descripcion, id_or_class, totales_generales, columnas_dinero }) };
    }
    //solo muestra en consola los datos si es necesario ⬇️
    if (testting) {
        console.log('Configuracion:', json_table);
        console.log('Columnas:', columnas);
    }
    //**se genera la datatable.
    let tabla_prueba = $(`#tabla_${descripcion}`).DataTable(json_table);
    despues_de_generar_tabla({responsive_table,descripcion,id_or_class,botones_generales, busqueda_table});
    return tabla_prueba;

}
//funciones tablas

//? para enmascarar las columnas de la tabla
var mascaras = ({ descripcion, multifiltro = false, campo = '',tables_data = false, result, columnas, totales_generales, columnas_ocultas = [] }) => {
    result.forEach(element => {
        let cl = element.nombre_columna.replaceAll('id_', '').replaceAll('_', ' ');
        if (element.nombre_columna == 'start' || element.nombre_columna == 'start_agenda') {
            cl = 'F. Inicial';
            if (campo.includes('citas')) {
                cl = 'F. Atencion';
            }
        }
        if (element.nombre_columna == 'startime') {
            cl = 'Hora Inicial';
        }
        if (element.nombre_columna == 'evento_diario') {
            cl = 'CITAS DIARIAS';
        }
        if (element.nombre_columna == 'endtime') {
            cl = 'Hora Final';
        }
        if (element.nombre_columna == 'diashabiles') {
            cl = 'DIAS DE ATENCION';
        }
        if (element.nombre_columna == 'id_tipo_contratos_cliente') {
            cl = 'Tipo';
        }
        if (element.nombre_columna == 'usuario_asignacion') {
            cl = 'U. Asigna.';
        }
        if (element.nombre_columna == 'id_motivos_cancelacion_cita') {
            cl = 'Motivo Cancelar';
        }
        if (element.nombre_columna == 'usuario_cancelar') {
            cl = 'U. Cancela.';
        }
        if (element.nombre_columna == 'cups') {
            cl = 'cups/cum';
        }
        if (element.nombre_columna == 'usuario_confirmacion') {
            cl = 'U. Confirma.';
        }
        if (element.nombre_columna == 'usuario_atencion') {
            cl = 'U. Atiende.';
        }
        if (element.nombre_columna == 'id_empleado') {
            cl = 'usuario';
        }
        if (element.nombre_columna == 'end' || element.nombre_columna == 'end_agenda') {
            cl = 'F. Final';
        }
        if (element.nombre_columna == 'title') {
            cl = 'TITULO';
        }
        if (element.nombre_columna == 'id_config_contratos_cliente') {
            cl = 'Contrato';
        }
        if (element.nombre_columna == 'numero_autorizacion') {
            cl = 'N. Autorización';
        }
        let acncho = element.tipo.includes('bit') || element.tipo.includes('tinyint') || element.tipo.includes('decimal') ? '10px' :
            element.nombre_columna == 'descripcion' || element.nombre_columna.includes('id_') ? 'auto' : element.capacidad < 100 ? '100px' : 'auto'
        acncho = element.nombre_columna == 'id'?'10px':element.nombre_columna == 'descripcion' || element.nombre_columna.includes('id_') ? 'auto' : element.tipo.includes('bit') || element.tipo.includes('tinyint') || element.tipo.includes('decimal') ? '10px' : element.capacidad < 100 ? '100px' : 'auto'
        let colu = {
            data: element.nombre_columna.replaceAll('id_', ''),
            name: element.tipo,
            title: filtro_columna({ descripcion, cl, tipo: element.tipo, campo, multifiltro, tables_data}),
            mascara: cl.toUpperCase(),
            nombre_real: element.nombre_columna,
            visible: !columnas_ocultas.includes(element.nombre_columna.replace('id_', '')),
            className: (element.tipo == 'decimal' || element.tipo == 'int') && !element.nombre_columna.includes('id_') ? "text-right text-nowrap" : element.tipo == 'bit' || element.tipo == 'tinyint' ? 'text-center' : element.tipo == 'date' ? 'text-center' : "text-left",
            orderable: element.tipo == 'text' ? false : true,
            width: acncho
        }
        if (element.nombre_columna.includes('estado')) {
            $(`#tabla_${descripcion} thead tr`).prepend(` <th style="width:${acncho}; " label-print="${cl.toUpperCase()}" class=" border-b label-font-s-p ${(element.tipo == 'decimal' || element.tipo == 'int') && !element.nombre_columna.includes('id_') ? "text-right text-nowrap" : element.tipo == 'bit' || element.tipo == 'tinyint' ? 'text-right text-nowrap' : element.tipo == 'date' ? 'text-center' : "text-left"}">${cl.toUpperCase()}</th>`);
            columnas.unshift(colu)
            if (totales_generales.length > 0) {
                $(`#tabla_${descripcion} tfoot tr`).prepend(` <th style="width:${acncho}; " class=" border-t border-top border-bottom label-font-s-p text-left"></th>`);
            }
        } else {
            $(`#tabla_${descripcion} thead tr`).append(` <th  label-print="${cl.toUpperCase()}" class=" border-b label-font-s-p ${(element.tipo == 'decimal' || element.tipo == 'int') && !element.nombre_columna.includes('id_') ? "text-right" : element.tipo == 'bit' || element.tipo == 'tinyint' ? 'text-right' : element.tipo == 'date' ? 'text-center' : "text-left"}">${cl.toUpperCase()}</th>`);
            columnas.push(colu)
            if (totales_generales.length > 0) {
                $(`#tabla_${descripcion} tfoot tr`).append(` <th  class=" border-t border-top border-bottom label-font-s-p text-left"></th>`);
            }
        }


    });
    return { columnas };
}
//? cpara crear los botones de ayuda y las columnas extra
var botones_columnas = ({ columnas, descripcion, responsive_table = false, botones_table = false, columnas_extras = [], totales_generales = [], modales = false }) => {

    //se agregan las columnas extras
    if (columnas_extras) {
        let column_EXT = [...columnas_extras]
        //columnas_extras=[{data: 'Nombre columna', defaultContent: `valor _prederminado puede ser un elemento html`}];
        column_EXT.reverse();
        column_EXT.forEach(extra => {
            Reflect.set(extra, 'name', extra.name ?? 'none');
            Reflect.set(extra, 'searchable', extra.searchable ?? false);
            Reflect.set(extra, 'orderable', extra.orderable ?? false);
            Reflect.set(extra, 'width', extra.width ?? "auto");
            Reflect.set(extra, 'busqueda_activa', extra.busqueda_activa ?? false);
            Reflect.set(extra, 'mascara', extra.contenido ?? extra.data.toUpperCase());

            if (extra.busqueda_activa) {
                Reflect.set(extra, 'title', filtro_columna({ descripcion, cl: extra.contenido ?? extra.data.toUpperCase(), tipo: extra.name, multifiltro: true }));
            }
            columnas.unshift(extra);

            /*data: element.nombre_columna.replaceAll('id_', ''),
            name: element.tipo,
            mascara: cl.toUpperCase(),
            nombre_real: element.nombre_columna,
            visible: !columnas_ocultas.includes(element.nombre_columna.replace('id_', '')),
            className: (element.tipo == 'decimal' || element.tipo == 'int') && !element.nombre_columna.includes('id_') ? "text-right" : element.tipo == 'bit' || element.tipo == 'tinyint' ? 'text-center' : element.tipo == 'date' ? 'text-center' : "text-left",
            orderable: element.tipo == 'text' ? false : true,
            width: acncho*/

            $(`#tabla_${descripcion} thead tr`).prepend(` <th label-print="${extra.data.toUpperCase()}" class=" border-b label-font-s-p " ${extra.searchable ? ' busqueda="true" ' : ''} >${extra.contenido ?? extra.data}</th>`);
            if (totales_generales.length > 0) {
                $(`#tabla_${descripcion} tfoot tr`).prepend(` <th  class=" border-t border-top border-bottom label-font-s-p text-left"></th>`);
            }
        });
    }
    //se agregan los botones de accion
    if (botones_table) {
        columnas.unshift({
            data: 'Acciones', name: 'none', searchable: false,
            orderable: false,
            title: "Acciones",
            defaultContent:/*html*/`
        <button title="Editar Registro" type='button' class='editarRt_${descripcion} btn btn-outline btn-sm p-0'><i class="far fa-edit"></i></button>
        <button type='button'  title="Cancelar Registro" class='cancelarRt_${descripcion} btn btn-outline btn-sm'><i class="far fa-calendar-times"></i></button> 
        <button type='button' title="Eliminar Registro" class=' eliminarRt_${descripcion} btn btn-outline btn-sm p-0'><i class='fas fa-trash-alt'></i></button>`,
            width: modales != '.swal2-modal' ? "10px" : "60px"

        })
        $(`#tabla_${descripcion} thead tr`).prepend(` <th label-print="Acciones" class=" border-b label-font-s-p d-print-none ">ACCIONES</th>`);
        if (totales_generales.length > 0) {
            $(`#tabla_${descripcion} tfoot tr`).prepend(` <th class=" border-t border-top border-bottom label-font-s-p text-left"></th>`);
        }
    }
    //se abre espacio para la lupa si es responsive
    if (responsive_table) {
        columnas.unshift({ data: 'Responsiv', name: 'none', searchable: false, defaultContent: `<i class="far fa-plus-square"></i>`, orderable: false, width: "10px" })
        $(`#tabla_${descripcion} thead tr`).prepend(` <th label-print="" class=" border-b d-print-none"><i class="fas fa-search-plus"></i></th>`);
        if (totales_generales.length > 0) {
            $(`#tabla_${descripcion} tfoot tr`).prepend(` <th  class=" border-t border-top border-bottom label-font-s-p text-left"></th>`);
        }
    }
    return columnas;
}
//? cuando existen multifiltros activos en la tabla
var opciones_estado_segun_campo = (descripcion, campo, title) => {
    let cadena = ``;
    if (campo.toLowerCase().includes('cita') && title == 'estado') {
        cadena = `<option value="1"><span class="badge badge-pill rounded-pill badge-warning bg-warning">Reservada</span></option>
            <option value="2"><span class="badge badge-pill rounded-pill badge-danger bg-danger">Perdida</span></option>
            <option value="3"><span class="badge badge-pill rounded-pill badge-info bg-info">Confirmada</span></option>
            <option value="4"><span class="badge badge-pill rounded-pill badge-success bg-success">Atendida</span></option>
            <option value="5"><span class="badge badge-pill rounded-pill badge-primary bg-primary">No atendida</span></option>
            <option value="6"><span class="badge badge-pill rounded-pill badge-secondary bg-secondary">Cancelada</span></option>`;
    } else if (campo.toLowerCase().includes('empleados') && title == 'estado') {
        cadena = ` 
            <option value="1"><span class="badge badge-pill rounded-pill badge-warning bg-warning">ACTIVO</span></option>
            <option value="0"><span class="badge badge-pill rounded-pill badge-danger bg-danger">INACTIVO</span></option>
            <option value="2"><span class="badge badge-pill rounded-pill badge-secondary bg-secondary">NUEVO</span></option>`
    } else if (campo.toLowerCase().includes('folio') && title == 'estado') {
        cadena = `<option value="1"><span class="badge badge-pill rounded-pill badge-success bg-success">ABIERO</span></option>
            <option value="2"><span class="badge badge-pill rounded-pill badge-secondary bg-secondary">CERRADO</span></option>`
    } else if (campo.toLowerCase().includes('config_cupos') && title == 'estado') {
        cadena = `
            <option value="1"><span class="badge badge-pill rounded-pill badge-warning bg-warning">Asignados</span></option>
            <option value="2"><span class="badge badge-pill rounded-pill badge-secondary bg-secondary">Cancelados</span></option>
            <option value="3"><span class="badge badge-pill rounded-pill badge-danger bg-danger">Vencidos</span></option>
            <option value="4"><span class="badge badge-pill rounded-pill badge-success bg-success">Completos</span></option>`
    } else if (campo.toLowerCase().includes('requisicion') && title == 'estado') {
        cadena = `
            <option value="1"><span class="badge badge-pill rounded-pill badge-warning bg-warning">Solicitada</span></option>
            <option value="2"><span class="badge badge-pill rounded-pill badge-danger bg-danger">Cancelada</span></option>
            <option value="3"><span class="badge badge-pill rounded-pill badge-primary bg-primary">Parcialmente entregada</span></option>
            <option value="4"><span class="badge badge-pill rounded-pill badge-success bg-success">Completada</span></option>
            <option value="5"><span class="badge badge-pill rounded-pill badge-secondary bg-secondary">NEGADA</span></option>
            `
    } else if (campo.toLowerCase().includes('autorizaciones') && title == 'estado') {
        cadena = ` 
            <option value="1"><span class="badge badge-pill rounded-pill badge-info bg-info">Facturado</span></option>
            <option value="0"><span class="badge badge-pill rounded-pill badge-danger bg-danger">Anulado</span></option>
            `
    } else {
        return {
            select: false, cadena: `
            <input class="form-control form-control-sm place_dark" autocomplete="off" type="text" placeholder="&#xf002; ${title.toUpperCase()}"/>
            `}
    }
    return {
        select: true,
        cadena: `<select  busqueda="-1"  allow-clear="true" width="resolve" class="form-select form-select-sm place_dark select_estados_search_${descripcion}${title.replaceAll(' ', '_').toLowerCase()}"  placeholder="${title.toUpperCase()}">
                ${cadena}  </select>`
    };
}
var filtro_columna = ({ descripcion, cl, tipo, campo, multifiltro, modales = false}) => {
    let cadena = `<div class="float-left d-none">${cl}</div>`;
    if (!multifiltro) {
        return cl;
    }
    if (tipo == 'bit' && campo.toLowerCase().includes('autorizaciones') && cl.toLowerCase() == 'estado') {
        cadena = ` ${cadena} <select  busqueda="-1"  allow-clear="1" width="resolve" class="form-select form-select-sm place_dark select_estados_search_${descripcion}${cl.replaceAll(' ', '_').toLowerCase()}"  placeholder="${cl.toUpperCase()}">
            <option value="1"><span class="badge badge-pill rounded-pill badge-info bg-info">Admisionado</span></option>
            <option value="0"><span class="badge badge-pill rounded-pill badge-danger bg-danger">Anulado</span></option>
            </select>`
    }
    else if (tipo == 'bit' && cl.toLowerCase() == 'estado') {
        cadena = `${cadena}
                    <select  busqueda="-1"  allow-clear="1" width="resolve" class="form-select form-select-sm place_dark select_estados_search_${descripcion}${cl.replaceAll(' ', '_').toLowerCase()}"  placeholder="${cl.toUpperCase()}">
                        <option value="1"><span class="badge badge-pill rounded-pill badge-warning bg-warning">ACTIVO</span></option>
                        <option value="0"><span class="badge badge-pill rounded-pill badge-danger bg-danger">INACTIVO</span></option>
                    </select>`;
        //select2_transformar(`.select_estados_search_${descripcion}${cl.replaceAll(' ', '_').toLowerCase()}`, modales);
    } else if (tipo == 'varchar' && cl.toLowerCase() == 'estado') {
        cadena = `${cadena}
                    <select  busqueda="-1"  allow-clear="1" width="resolve" class="form-select form-select-sm place_dark select_estados_search_${descripcion}${cl.replaceAll(' ', '_').toLowerCase()}"  placeholder="${cl.toUpperCase()}">
                        <option value="ACTIVO"><span class="badge badge-pill rounded-pill badge-warning bg-warning">ACTIVO</span></option>
                        <option value="INACTIVO"><span class="badge badge-pill rounded-pill badge-danger bg-danger">INACTIVO</span></option>
                    </select>`;
        // select2_transformar(`.select_estados_search_${descripcion}${cl.replaceAll(' ', '_').toLowerCase()}`, modales);
    } else if (tipo == 'bit') {
        cadena = `${cadena}
                    <select  busqueda="-1"  allow-clear="1" width="resolve" class="form-select form-select-sm place_dark select_estados_search_${descripcion}${cl.replaceAll(' ', '_').toLowerCase()}"  placeholder="${cl.toUpperCase()}">
                        <option value="1"><span class="badge badge-pill rounded-pill badge-warning bg-warning">SI</span></option>
                        <option value="0"><span class="badge badge-pill rounded-pill badge-danger bg-danger">NO</span></option>
                    </select>`;
        //select2_transformar(`.select_estados_search_${descripcion}${cl.replaceAll(' ', '_').toLowerCase()}`, modales);
    } else if (tipo == 'tinyint') {
        let contenido = opciones_estado_segun_campo(descripcion, campo, cl.toLowerCase())
        cadena = `${cadena} ${contenido.cadena}`;
        if (contenido.select) {
           // select2_transformar(`.select_estados_search_${descripcion}${cl.replaceAll(' ', '_').toLowerCase()}`, modales);
        }
    } else if (tipo.includes('date')) {
        let magia = ` onfocus="(this.type='date');" onblur="(this.type='text');" `
        cadena = `${cadena}
                <input class="form-control form-control-sm place_dark"  type="text" placeholder="&#xf002; ${cl.toUpperCase()}" ${magia}/>
                 `;
    } else {
        cadena = `${cadena}
                <input class="form-control form-control-sm place_dark" autocomplete="off" type="text" placeholder="&#xf002; ${cl.toUpperCase()}"/>
                `;
    }
    return cadena;
}

var eventos_filtrado = ({json_table, multifiltro, columnas_extras = [], botones_table, responsive_table, modales = false }) => {
    let new_json = { ...json_table };
    Reflect.set(new_json, 'initComplete',
        function () {
            if (multifiltro) {
                if (columnas_extras) {
                    let cantidad = (botones_table ? 1 : 0) + (responsive_table ? 1 : 0);
                    let largo = columnas_extras.length;
                    let arreglo_pos = [];
                    for (let index = cantidad; index < largo + cantidad; index++) {
                        arreglo_pos.push(index);
                    }
                    let columnasS = this.api().columns();
                    let reset = this.api();
                    this.api().columns().every(function () {
                        let that = this;
                        $('input', this.header()).on('keyup change clear', function () {
                            if (that.search() !== this.value) {
                                if (arreglo_pos.includes(that[0][0]) && columnas_extras[that[0][0] - cantidad].busqueda_activa) {
                                    columnasS.column(columnas_extras[that[0][0] - cantidad].buscar).search(this.value).draw();
                                } else {
                                    that.search(this.value).draw();
                                }
                            }
                        });
                        $('select', this.header()).on('change clear', function () {
                            if (that.search() !== this.value) {
                                that.search(this.value).draw();
                            }
                        });
                        let elemento_select2 = $('select', this.header());
                        if (elemento_select2.length > 0) {
                            for (let index = 0; index < elemento_select2[0].classList.length; index++) {
                                if (elemento_select2[0].classList[index].includes('select_estados_search_')) {
                                    select2_transformar(`.${elemento_select2[0].classList[index]}`, modales);
                                }
                            }
                        }
                    });
                } else {
                    this.api().columns().every(function () {
                        let that = this;
                        $('input', this.header()).on('keyup change clear', function () {
                            if (that.search() !== this.value) {
                                that.search(this.value).draw();
                            }
                        });
                        $('select', this.header()).on('change clear', function () {
                            if (that.search() !== this.value) {
                                that.search(this.value).draw();
                            }
                        });
                        let elemento_select2 = $('select', this.header());
                        if (elemento_select2.length > 0) {
                            for (let index = 0; index < elemento_select2[0].classList.length; index++) {
                                if (elemento_select2[0].classList[index].includes('select_estados_search_')) {
                                    select2_transformar(`.${elemento_select2[0].classList[index]}`, modales);
                                }
                            }
                        }
                    });
                }
            }
        });
    return new_json;
}

//?configuracion general de la tabla
var config_tablas = ({
    descripcion, columnas,
    pageLength, order, paginacion_table,
    info, responsive_table, largo_table,
    scrollX, url_controller,
    campo, campo_filt, filt_cont, scrollY, ordering = true, tables_data = false, select=false}) => {

    let json_table = {
        select,
        language: {
            "lengthMenu": "Registros _MENU_",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sSearch": "Buscar:",
            searchPlaceholder: `Buscar ${descripcion.replaceAll('_', ' ').toLowerCase()}`,
            paginate: {
                first: "<i class='fas fa-caret-left'></i>",
                last: "<i class='fas fa-caret-right'></i>",
                next: "<i class='fas fa-angle-right'></i>",
                previous: "<i class='fas fa-angle-left'></i>",
            },
            colReorder: true,
            infoThousands: ",",
            "sProcessing": "Procesando...",
            infoThousands: ",",
            loadingRecords: "Cargando...",
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente",
            },
        },
        pageLength: pageLength,
        processing: true,

        ordering: ordering,

        //autoFill: true,

        destroy: true,
        paging: paginacion_table,
        info: info,
        autoWidth: true,
        responsive: responsive_table,
        lengthChange: largo_table,
        searching: true,
        columns: [...columnas],
        aLengthMenu: [
            [5, 10, 15, 20, -1],
            [5, 10, 15, 20, "Todos"]
        ]
    };
    if (!tables_data) {
        Reflect.set(json_table, 'serverSide', true)
        Reflect.set(json_table, 'ajax', {
            beforeSend: function (request) {
                request.setRequestHeader(
                    "Authorization",
                    localStorage.getItem("info_app")
                );
            },
            url: url_controller,
            type: 'POST',
            headers: { 'Authorization': localStorage.getItem('info_app'), 'Ruta': arreglo_opcion.titulo, 'Campo': campo, 'Campofilt': campo_filt, 'Filtcont': filt_cont },//token de Atorizacion
        });
        Reflect.set(json_table, 'response', true)
    }
    if (order != true && order != false) {
        Reflect.set(json_table, 'order', order);
    }
    scrollY = columnas.length > 10 ? scrollY : false;
    if ((scrollY) && !responsive_table) {
        if (scrollY) {
            Reflect.set(json_table, 'scrollCollapse', true);
            Reflect.set(json_table, 'scrollX', scrollX);
            Reflect.set(json_table, 'scrollY', scrollY);
        }
    }


    return json_table;
}

//?definicion y formatos de las columnas 
var definicion_columnas = ({ json_table, campo = '', tables_data = false, descripcion, mayuscula, columnas_dinero = [], columnas_extras = [], testting = true }) => {
    let new_json = { ...json_table };
    let columnDefs = [
        {
            targets: "_all",
            render: function (data, type, row, meta) {
                
                if(data==null&&!meta.settings.aoColumns[meta.col].defaultContent){
                  return ['int','decimal'].includes(meta.settings.aoColumns[meta.col].name)?0:'';
                }
                let campofil = 'estado';
                let tiponame = 'varchar';
                if (tables_data) {
                    campofil = meta.settings.aoColumns[meta.col].data;
                    tiponame = meta.settings.aoColumns[meta.col].name;
                    if (meta.settings.aoColumns[meta.col].defaultContent) {
                        return meta.settings.aoColumns[meta.col].defaultContent;
                    }
                } else {
                    campofil = meta.settings.oAjaxData.columns[meta.col].data;
                    tiponame = meta.settings.oAjaxData.columns[meta.col].name;
                }
                //console.log(data, campofil, meta.settings.aoColumns[meta.col].defaultContent);
                if (data == undefined) {
                    if (Object.keys(row).includes(`id_${campofil.replaceAll(' ', '_')}`)) {
                        let data = row[`id_${campofil.replaceAll(' ', '_')}`];
                        if (testting) {
                            console.log(`revisar las relaciones en la columna: id_${campofil.replaceAll(' ', '_')} o ${campofil.replaceAll(' ', '_')}`)
                        }
                        return data ?? '';
                    }
                }
                if (data == "null") {
                    return '';
                }
                data = data && isNaN(data) ? (mayuscula ? data.toUpperCase() : data) : data;
                if (columnas_dinero.includes(meta.col)) {

                    return data ? `<p class="text-right m-0">$${format_numero_cadena(`${data}`)}</p>` : data;
                }
                if (columnas_extras && columnas_extras.find(element => element.data.toLowerCase() == campofil.toLowerCase())) {
                    let ecu = columnas_extras.find(element => element.data.toLowerCase() == campofil.toLowerCase()).defaultContent
                    let expo = '';
                    eval(`expo= ${ecu}`)
                    return expo;
                } else if (campofil == 'archivo' || campofil.includes('url_') || campofil.includes('_url') || campofil == 'foto') {
                    return `<a onclick="mostrar_pdf_aletr('${data}', '${data}')" class="dropdown-item">
                                    <i class="fas fa-file"></i>  VER ARCHIVO...
                            </a>`;
                } else if (campofil.includes('id_')) {
                    return data;
                } else if (campofil == 'dias_habiles' || campofil == 'diashabiles') {
                    return convertir_dias_arreglo_texto(data);
                } else if (campofil == 'anulado') {
                    if (data == 1) {
                        return '<span class=" badge badge-pill rounded-pill badge-danger bg-danger">SI</span>'
                    } else if (data == 0) {
                        return '<span class=" badge badge-pill rounded-pill badge-secondary bg-secondary">NO</span>'
                    }
                } else if (campofil == 'no_usa_historia') {
                    if (data == 1) {
                        return '<span culumna="' + campofil + '" class="estados' + descripcion + ' badge badge-pill rounded-pill badge-secondary bg-secondary">NO</span>'
                    } else if (data == 0) {
                        return '<span culumna="' + campofil + '" class="estados' + descripcion + ' badge badge-pill rounded-pill badge-success bg-success">SI</span>'
                    }
                } else if (campofil == 'facturado') {
                    if (data == 1) {
                        return '<span class="badge badge-pill rounded-pill badge-success bg-success">SI</span>'
                    } else if (data == 0) {
                        return '<span class="badge badge-pill rounded-pill badge-secondary bg-secondary">NO</span>'
                    }
                } else if (tiponame != 'bit' && campofil == 'estado' && campo.includes('empleados')) {
                    if (data == 1) {
                        return '<span class="badge badge-pill rounded-pill badge-success bg-success">ACTIVO</span>';
                    } else if (data == 0) {
                        return '<span class="badge badge-pill rounded-pill badge-danger bg-danger">INACTIVO</span>';
                    } else if (data == 2) {
                        return '<span class="badge badge-pill rounded-pill badge-secondary bg-secondary">NUEVO</span>';
                    } else {
                        return 'indeterminado'
                    }
                } else if (tiponame != 'bit' && campofil == 'estado' && campo.toLowerCase() == 'folio') {
                    if (data == 1) {
                        return '<span culumna="' + campofil + '" class="estados' + descripcion + ' badge badge-pill rounded-pill badge-secondary bg-secondary">ABIERTO</span>';
                    } else if (data == 2) {
                        return '<span culumna="' + campofil + '" class="estados' + descripcion + ' badge badge-pill rounded-pill badge-success bg-success">CERRADO</span>';
                    } else {
                        return 'indeterminado'
                    }
                } else if (tiponame != 'bit' && campofil == 'estado' && campo.toLowerCase() == 'config_cupos') {
                    if (data == 1) {
                        return '<span culumna="' + campofil + '" class="estados' + descripcion + ' badge badge-pill rounded-pill cupo-asignado">ASIGNADO</span>';
                    } else if (data == 2) {
                        return '<span culumna="' + campofil + '" class="estados' + descripcion + ' badge badge-pill rounded-pill cupo-cancelado">Cancelado</span>';
                    } else if (data == 3) {
                        return '<span culumna="' + campofil + '" class="estados' + descripcion + ' badge badge-pill rounded-pill cupo-vencido">Vencidos</span>';
                    } else if (data == 4) {
                        return '<span culumna="' + campofil + '" class="estados' + descripcion + ' badge badge-pill rounded-pill cupo-completo">Completos</span>';
                    } else {
                        return 'indeterminado'
                    }
                } else if (tiponame == 'bit' && campofil == 'estado' && campo.toLowerCase() == 'autorizaciones') {
                    if (data == 1) {
                        return '<span culumna="' + campofil + '" class=" estados' + descripcion + ' badge badge-pill rounded-pill badge-info bg-info">ADMISIONADO</span>';
                    } else if (data == 0) {
                        return '<span culumna="' + campofil + '" class=" estados' + descripcion + ' badge badge-pill rounded-pill badge-danger bg-danger">ANULADO</span>';
                    } else {
                        return data
                    }
                } else if (tiponame == 'bit' && campofil == 'estado') {
                    if (data == 1) {
                        return '<span culumna="' + campofil + '" class=" estados' + descripcion + ' badge badge-pill rounded-pill badge-success bg-success">ACTIVO</span>';
                    } else if (data == 0) {
                        return '<span culumna="' + campofil + '" class=" estados' + descripcion + ' badge badge-pill rounded-pill badge-danger bg-danger">INACTIVO</span>';
                    } else {
                        return 'indeterminado'
                    }
                } else if (tiponame == 'varchar' && campofil == 'estado') {
                    if (data == 1) {
                        return '<p class="text-center m-0"><span culumna="' + campofil + '" class=" estados' + descripcion + ' badge badge-pill rounded-pill badge-success bg-success">ACTIVO</span></p>';
                    } else if (data == 0) {
                        return '<p class="text-center m-0"><span culumna="' + campofil + '" class=" estados' + descripcion + ' badge badge-pill rounded-pill badge-danger bg-danger">INACTIVO</span></p>';
                    } else {
                        return 'indeterminado'
                    }
                } else if (tiponame == 'time') {
                    return moment(data, 'HH:mm:ss.SSS').format('hh:mm a');
                } else if (tiponame == 'date') {
                    return data;
                } else if (tiponame == 'bit') {
                    if (data == 1) {
                        return '<span culumna="' + campofil + '" class="estados' + descripcion + ' badge badge-pill rounded-pill badge-success bg-success">SI</span>';
                    } else {
                        return '<span culumna="' + campofil + '" class="estados' + descripcion + ' badge badge-pill rounded-pill badge-danger bg-danger">NO</span>';
                    }
                } else if (campo.includes('citas')) {
                    if (campofil == 'estado') {
                        if (data == 1) {
                            return '<span class="badge badge-pill rounded-pill cita-reservada">Reservada</span>';
                        }
                        else if (data == 2) {
                            return '<span class="badge badge-pill rounded-pill cita-perdida">Perdida</span>';
                        }
                        else if (data == 3) {
                            return '<span class="badge badge-pill rounded-pill cita-confirmada">Confirmada</span>';
                        }
                        else if (data == 4) {
                            return '<span class="badge badge-pill rounded-pill cita-atendida">Atendida</span>';
                        }
                        else if (data == 5) {
                            return '<span class="badge badge-pill rounded-pill cita-no-atendida">No atendida</span>';
                        } else if (data == 6) {
                            return '<span class="badge badge-pill rounded-pill cita-cancelada">Cancelada</span>';
                        } else if (data > 6) {
                            return '<span class="badge badge-pill rounded-pill cita-cancelada">Cancelada</span>';
                        }
                    } else if (campofil == 'start') {
                        return moment(data).format('DD MMM YY hh:mm A');
                    } else if (campofil == 'end') {
                        return moment(data).format('DD MMM YY hh:mm A');
                    } else {
                        return data;
                    }
                } else if (campo.includes('requisicion')) {
                    if (campofil == 'estado') {
                        if (data == 1) {
                            return '<span class="badge badge-pill rounded-pill badge-warning bg-warning">Solicitada</span>';
                        }
                        else if (data == 2) {
                            return '<span class="badge badge-pill rounded-pill badge-danger bg-danger">Cancelada</span>';
                        }
                        else if (data == 3) {
                            return '<span class="badge badge-pill rounded-pill badge-primary bg-primary">Parcialmente Entregada</span>';
                        }
                        else if (data == 4) {
                            return '<span class="badge badge-pill rounded-pill badge-success bg-success">Completada</span>';
                        }
                        else if (data == 5) {
                            return '<span class="badge badge-pill rounded-pill badge-secondary bg-secondary">Negada</span>';
                        }
                    } else {
                        return data;
                    }
                } else if(!campo.includes('id_')&&tiponame == 'varchar'){
                    return isNaN(data) ? data : `<p class="text-right m-0">${data}</p>`;
                }
                else {
                    return isNaN(data) ? data : `<p class="m-0">${data}</p>`;
                }
            }
        },
    ];
    Reflect.set(new_json, 'columnDefs', columnDefs);
    return new_json;
}

//?botones especiales de impresion y exportar datos
var botones_generales_tabla = ({ json_table, xls = false, pdf = false, print = false, colvis = false, copy = false, csv = false, colvis2 = false , refescar=false}) => {
    let new_json = { ...json_table };
    Reflect.set(new_json, 'dom', 'Bfrtilp');
    let format = {
        body: function (data, row, column, node) {
           return node.textContent.replaceAll('$', '')./*replaceAll('.', '').*/trim();
        },
        header: function (data, row, node) {
            let cadena = node.getAttribute('label-print');
            let limites = cadena.indexOf(`\n`);
            return limites > 0 ? cadena.substring(0, limites) : cadena.trim();
        }
    }
    let arreglobotones = [];
    if (copy) {
        arreglobotones.push({
            extend: 'copyHtml5',
            text: '<i class="far fa-copy"></i> ',
            titleAttr: 'copiar contenido de la tabla',
            className: 'btn btn-primary btn-sm', exportOptions: {
                columns: ':visible',
                format: {
                    header: function (data, row, node) {
                        let cadena = node.getAttribute('label-print');
                        let limites = cadena.indexOf(`\n`);
                        return limites > 0 ? cadena.substring(0, limites) : cadena.trim();
                    }
                }
            }
        });
    }
    if (csv) {
        arreglobotones.push({
            extend: 'csv',
            text: '<i class="fas fa-file-csv"></i> ',
            titleAttr: 'Archivo cvs',
            className: 'btn btn-secondary btn-sm',
            exportOptions: {
                columns: ':visible',
                format
            }
        });
    }
    if (xls) {
        arreglobotones.push({
            extend: 'excelHtml5',
            text: '<i class="fas fa-file-excel"></i> ',
            titleAttr: 'Exportar a Excel',
            className: 'btn btn-success  btn-sm',
            exportOptions: {
                columns: ':visible',
                format
            }
        })
    }
    if (pdf) {
        arreglobotones.push({
            extend: 'pdfHtml5',
            text: '<i class="fas fa-file-pdf"></i> ',
            titleAttr: 'Exportar a PDF',
            className: 'btn btn-danger btn-sm',
            orientation: 'landscape',
            exportOptions: {
                columns: ':visible',
                format
            }
        });
    }
    if (print) {
        arreglobotones.push({
            extend: 'print',
            text: '<i class="fa fa-print"></i> ',
            titleAttr: 'Imprimir',
            className: ' btn btn-info btn-sm',
            orientation: 'auto',
            autoPrint: false,
            exportOptions: {
                columns: ':visible',
                format
            }
        });
    }
    if (colvis) {
        arreglobotones.push({
            extend: 'colvisRestore',
            text: '<i class="fas fa-columns"></i> ',
            titleAttr: 'restaurar columnas',
            className: 'btn btn-sm'
        }, {
            extend: 'columnsToggle',
            className: 'btn btn-warning',
        });
    }
    if (colvis2) {
        arreglobotones.push({
            text: '<i class="fas fa-columns"></i> Columnas',
            titleAttr: 'columnas',
            className: 'btn btn-warning btn-sm colvis_sm',
            extend: 'colvis'
        }, {
            extend: 'colvisRestore',
            text: '<i class="fas fa-columns"></i> ',
            titleAttr: 'restaurar columnas',
            className: 'btn btn-sm'
        });
    }
    if (refescar) {
        arreglobotones.push({
            text: '<i class="fas fa-retweet"></i> ',
            action: function ( e, dt, node, config ) {
                console.log()
                dt.ajax.reload(dt);
            },
            titleAttr: 'Refrescar informacion',
            className: 'btn btn-info btn-sm'
        });
    }

    /*arreglobotones.push({
        text: '<i class="fas fa-retweet"></i> ',
        action: function ( e, dt, node, config ) {
            console.log( e, dt, node )
        },
        titleAttr: 'Refrescar informacion',
        className: 'btn btn-info btn-sm'
    });*/
    
    Reflect.set(new_json, 'buttons', arreglobotones);
    return new_json;
}

//?totales generales de la tabla
var totales_generales_tabla = ({ json_table, descripcion, id_or_class, totales_generales, columnas_dinero }) => {
    let new_json = { ...json_table };
    $(`${id_or_class} table`).append(`<tfoot></tfoot>`);
    $(`${id_or_class} table tfoot`).append(`<tr></tr>`);
    json_table.columns.forEach(element => {
        $(`#tabla_${descripcion} tfoot tr`).append(` <th style="width:auto; " class=" border-0 border-top border-bottom label-font-s-p text-left"></th>`);
    });
    Reflect.set(new_json, 'drawCallback', function (settings) {
        let api = this.api();
        for (let index = 0; index < totales_generales.length; index++) {
            $(api.column(totales_generales[index]).footer()).html(
                '<span class="float-right"> ' + `${columnas_dinero.includes(totales_generales[index]) ? '$' : ''}` + format_numero_cadena(api.column(totales_generales[index], { page: 'current' }).data().sum()) + '</span>'
            )
        }
    });
    return new_json;
}
//?Accion despues de genera la tabla importante para la renderizacion
var despues_de_generar_tabla=({responsive_table,descripcion,id_or_class,botones_generales,busqueda_table})=>{
    if (botones_generales) {
        $(`${id_or_class}`).prepend(`<div class='d-flex justify-content-between'id="tabla_${descripcion}_row"></div>`);
        $(`#tabla_${descripcion}_filter`).prependTo($(`#tabla_${descripcion}_row`));
        $(`#tabla_${descripcion}_wrapper .dt-buttons`).addClass('align-items-center').prependTo($(`#tabla_${descripcion}_row`));
        $(`#tabla_${descripcion}_length`).prependTo($(`#tabla_${descripcion}_row`));
        $(`${id_or_class}`).append(`<div class='d-flex justify-content-between'id="tabla_${descripcion}_row2"></div>`);
        $(`#tabla_${descripcion}_info`).prependTo($(`#tabla_${descripcion}_row2`));
        $(`#tabla_${descripcion}_paginate`).prependTo($(`#tabla_${descripcion}_row2`));
        $(`${id_or_class} .btn`).addClass('btn-sm')
    }
    //removemos la busqueda general
    if (!busqueda_table) {
        $(`#tabla_${descripcion}_filter`).remove();
    }
    if (!responsive_table) {
        if (botones_generales) {
            $(`#tabla_${descripcion}_wrapper`).addClass('overflow-auto');
        } else {
            $(`#tabla_${descripcion}`).parent().addClass('overflow-auto');
        }
    }
}
//fin de funciones propiedades

window.eliminar_registro = async (dato, texto, ubicado, tabla = null) => {
    let data = dato;
    let texto_m = 'Si, Eliminar ' + texto;
    let descripcion = data.titulo ? data.titulo : data.descripcion ? data.descripcion : data.nombre ? data.nombre : data.detalle ? data.detalle : '';
    await Swal.fire({
        title: `${ubicado}`,
        text: 'Seguro que desea eliminar ' + texto + ': ' + descripcion,
        showCancelButton: true,
        allowOutsideClick: false,
        cancelButtonText: 'Cancelar',
        width: 'auto',
        confirmButtonText: texto_m,
        showClass: {
            popup: 'animate__animated animate__fadeInUp'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            let cadena = {
                id: data.id,
                ruta_archivo: data.archivo
            }
            let response = await fetch(`${urlback}Maestros/PrincipalController/borrar_registro`, {
                method: 'POST',
                headers: { 'Authorization': localStorage.getItem('info_app'), 'Sede-Select': sessionStorage.getItem('id_sede'), 'Campo': texto },
                body: JSON.stringify(cadena)
            });
            let result = await response.json();
            if (result.act == 3) {
                if (tabla) {
                    tabla.draw();
                }
                toastr.success(`${texto + ': ' + descripcion} eliminado de la base de datos!`, 'Procedimiento exitoso');

            } else {
                toastr.error(`${texto + ': ' + descripcion} no se puede eliminar!`, 'Ya existen movimientos relacionados con este registro');
            }
        }
    })

}


window.tbla_data = async ({
    json,
    id_or_class, //clase o id  del div contenedor .X #x
    descripcion, //nombre o descricp mn
    responsive_table = false, //la tabla sea responsive
    botones_table = false, //botones de accion en la tabla 
    largo_table = false, //cantidad de registros 
    busqueda_table = false, //busqueda general
    paginacion_table = false, //visual de la paginacion
    pageLength = -1, //la cantidad e registros apra el primer cargue 
    multifiltro = false, //filtros por columnas
    order = false, //si quiere ordenar la tabla
    ordering = false,
    columnas_reales = [],
    info = false, //informacion footer sobre registros y filtros 
    scrollX = false,
    text_nowrap = false, //si el texto es muy ancho hace salto de linea
    botones_generales = false, //botones de excel, pdf e impresion
    xls = true,
    pdf = true,
    colvis = true,
    colvis2=true,
    copy = true,
    print = true,
   
    mayuscula = false,
    csv = true,
    totales_generales = [],//totales generales
    columnas_dinero = [],
    table_bordered = false,
    testting = true,
    table_striped = true, modales = false,
    select=false
}) => {
    let inteaccion = [...json]
    $(`${id_or_class}`).empty().append(`<table style="width: 100%;" id='tabla_${descripcion}' class=" table table-sm ${table_bordered ? 'table-bordered' : ' '} label-font-s-p ${text_nowrap ? 'text-nowrap' : ''}  ${table_striped ? 'table-striped' : ''} ${responsive_table ? 'dt-responsive nowrap' : ''} "></table>`);
    $(`${id_or_class} table`).append(`<thead class="text-nowrap"></thead>`);
    $(`${id_or_class} table thead`).append(`<tr></tr>`);
    let result = [];

    if (json.length > 0) {
        if (columnas_reales.length == 0) {
            columnas_reales = Object.keys(json[0]);
        }
        result = columnas_reales.map((element) => {
            return {
                nobligatorio: 1,
                nombre_columna: element,
                tipo: "varchar",
                capacidad: 1000
            }
        })
    } else { return; }

    let columnas = [];
    columnas = mascaras({ descripcion, multifiltro, result, columnas, totales_generales }).columnas;
    columnas = botones_columnas({ columnas, descripcion, responsive_table, botones_table, totales_generales, modales });
    let json_table = config_tablas({
        descripcion, columnas, pageLength, order, paginacion_table, info, responsive_table,
        largo_table, scrollX, scrollY, ordering, tables_data: true, select,
    });
    Reflect.set(json_table, 'data', json);
    json_table = { ...definicion_columnas({ json_table, descripcion, mayuscula, columnas_dinero, tables_data: true }) };
    if (botones_generales) {
        json_table = { ...botones_generales_tabla({ json_table, xls, pdf, print, colvis,colvis2, copy, csv }) }
    }
    if (multifiltro && !responsive_table) {
        json_table = { ...eventos_filtrado({ descripcion, modales, json_table, multifiltro, botones_table, responsive_table }) };
    }
    if (totales_generales.length > 0) {
        json_table = { ...totales_generales_tabla({ json_table, descripcion, id_or_class, totales_generales, columnas_dinero }) };
    }
    if (testting) {
        console.log(`config:`, json_table);
        console.log(`conlumnas:`, columnas);
        console.log(`data:`, json);
    }
    let obj_tabla = $(`#tabla_${descripcion}`).dataTable(json_table);
    despues_de_generar_tabla({responsive_table,descripcion,id_or_class,botones_generales,busqueda_table});

    return obj_tabla;
    
}

/*
 * evento para modificar contenido de una celda en un datatables
    TODO:    tabla.on("draw",function (z, x) {
    TODO:           tabla.columns.adjust();
    TODO:       for (var i = 0; i < tabla.rows().count(); i++) {
    TODO:            let row = tabla.row(i);
    TODO:           let estado = row.data().estado;
    TODO:          if (estado === 1) {
    TODO:              tabla.cell(i, 1).data(`caso 1`);
    TODO:            }else{
    TODO:               tabla.cell(i, 1).data(`caso 2`);
    TODO:            }
    TODO:        }
    TODO:    });
**/
/*
 * evento al darle click a un boton d ela tabla
            tabla.on("click", "button.editarRt_"+campo, async function () {
                let arreglo = tabla.row($(this).parents("tr")).data();
            });
*/
/*
 * evento al darle click a un registro de la tabla
          tabla.on("click", 'tbody tr', async function () {
                let arreglo = tabla.row(this).data();
                $(this).addClass('bg-sidib').siblings().removeClass('bg-sidib');
            });
*/

/*
* evento al darle click a unspan de activo e inactivo
tabla.on("click", "span.estados"+campo, async function () {
    let arreglo = tabla.row($(this).parents("tr")).data();
    await cambiar_estados(arreglo, campo, this.getAttribute('culumna'));
    tabla.draw();
    toastr.success('se cambio la columna '+(this.getAttribute('culumna').replaceAll('_',' '))+' del registro '+(Reflect.has(arreglo,'descripcion')?arreglo.descripcion:Reflect.has(arreglo,'nombre')?arreglo.nombre:Reflect.has(arreglo,'titulo')?arreglo.titulo:''), 'Cambio de opción Proceso exitoso');
  });
*/
/*
* ejemplo de uso tables*/

/* ejemplo de uso tbla_data
    let objtt = []
        let user = {
            campo: 'admision',
            filcont:5797,
            campofil:'id_paciente',
        };
        let urlS = `${urlback}Maestros/PrincipalController/select_data_id`;
        let response = await fetch(urlS, {
            method: "POST",
            headers: { Authorization: localStorage.getItem("info_app") },
            body: JSON.stringify(user),
        });
        objtt = await response.json();


        await cargar_lib_datatables();
        let config_table = {
            json: objtt,
            id_or_class: '.tanan', //clase o id  del div contenedor .X #x
            descripcion: 'tabla_especial',
            botones_table: true,
            scrollX: true,
            order: true,
            botones_generales: true,
            text_nowrap: true,
            paginacion_table: true,
            pageLength: 10,
            totales_generales: [20],
            columnas_dinero: [20]
        }
        let elemento_tabla = await tbla_data(config_table);
        elemento_tabla.on("click", 'tbody tr', async function () {
            $(this).addClass('bg-primary').siblings().removeClass('bg-primary');
            let data = { ...elemento_tabla.api().row(this).data() };
            Reflect.deleteProperty(data, 'Acciones');
            Reflect.deleteProperty(data, 'Responsiv');
            console.log(data);
        });
        elemento_tabla.on("click", `button.editarRt_${config_table.descripcion}`, async function () {
            let data = { ...elemento_tabla.api().row($(this).parents('tr')).data() };
            Reflect.deleteProperty(data, 'Acciones');
            Reflect.deleteProperty(data, 'Responsiv');
            console.log(data);
        });

    */


