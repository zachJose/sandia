window.bt_sidebar_toggler = document.querySelector('.sidebar-toggler');
window.sidebar_too = document.querySelector('.sidebar');
window.content_too = document.querySelector('.content');
window.Grid = '';
window.urlback = '../php/'
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
window.arreglo_opcion={titulo:''}
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

//cSpell:disable
window.init_dom = async (md = false) => {
    localStorage.info?'':location.href = './';
    nombre_user.innerHTML=localV(localStorage.info).data.nombre.toUpperCase()
    nombre_user2.innerHTML=localV(localStorage.info).data.nombre_pc
    inactivityTime();
    // Spinner   
    if (!md) {
        setTimeout(async () => {
            if (spinner.children.length > 0) {
                ViewsLoad('vista1.html');
                await sweetalert2_lib();
                spinner.classList.remove('show');
            }
        }, 100);
        // Sidebar Toggler
        bt_sidebar_toggler.onclick = () => {
            sidebar_too.classList.toggle("open");
            content_too.classList.toggle("open");
        }
    } else {
        ViewsLoad('vista1.html');
        await sweetalert2_lib();
    }
    t_fuente.onclick=()=>{
        document.body.classList.toggle('text-smsoft');
    }
    localStorage.info_app=localStorage.info;
    window.localStorage.setItem("urls", window.location.pathname);
}

//!inicio de gestion sessiones
window.cerrarsession = () => {
    switch_session = 1;
    window.clearTimeout(t);
    Sweetalert2.fire({
        title: "Estas Seguro?",
        text: "La Sesión se cerrara Completamente",
        icon: "warning",
        focusConfirm: true,
        allowOutsideClick: false,
        showCancelButton: true,
        cancelButtonText: `Cancelar`,
        confirmButtonText: "Cerrar Sesión",
        backdrop: ` 
                        left top
                        no-repeat
                        `
    })
        .then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                sessionStorage.clear();
                location.href = `./`;

            } else if (result.dismiss === Swal.DismissReason.cancel) {
                switch_session = 0;
                t = setTimeout(logout, t_vivo);
                toastr.sidib("Se puede continuar con el trabajo :)", "Cancelado");
            }
        });
};

window.inactivityTime = () => {
    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer;
    document.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onmousedown = resetTimer; // touchscreen presses
    document.ontouchstart = resetTimer;
    document.onclick = resetTimer; // touchpad clicks
    document.onscroll = resetTimer; // scrolling with arrow keys
    document.onkeyup = resetTimer;

}

window.logout = async (variable = "Usuario desconectado .....") => {
    console.log(t, localV(localStorage.info).exp, Date.now() / 1000);
    if (switch_session == 0) {
        window.clearTimeout(t);
        switch_session = 1;
        
        let config_sweetaler = {
            html: ` <div>
                            <h1><span style="text-transform: capitalize;">${sessionStorage.getItem("nombre")}</span></h1>
                            <form>    
                                <div class="form-group mb-3">
                                    <input type="usuario" id="user" class="form-control"  style="display:none;" autocomplete="off" placeholder="usuario" >
                                    <input type="password" id="swal-input2" class="form-control"  autocomplete="off" placeholder="Password">
                                </div>
                            </form>
                            <h4>${variable}</h4>
                            <p class="login-box-msg h6"> Ingrese nuevamente su contraseña para continuar con sus trabajo.</p>
                        </div>
                        `,
            focusConfirm: true,
            allowOutsideClick: false,
            showCancelButton: true,
            cancelButtonText: `Salir`,
            confirmButtonText: "Aceptar",
            //confirmButtonColor: JSON.parse(sessionStorage.getItem("colores"))[0],
            backdrop: ` 
                        --bs-primary
                        left top
                        no-repeat
                        `,
            preConfirm: async () => {
                let usuario = sessionStorage.getItem("user");
                let password = document.getElementById("swal-input2").value;
                let empresa = sessionStorage.getItem("empresa");
                if (sessionStorage.getItem("user") == null) {
                   
                }
                let data = JSON.stringify({
                    usuario,
                    password,
                    empresa,
                });

                let response = await fetch(`${urlback}inicio/seguridad/logueate`, {
                    method: 'POST',
                    headers: { Authorization: localStorage.getItem("info") },
                    body: data
                });
                let result = await response.json();
                if (result.codigo == 1) {
                    Sweetalert2.showValidationMessage(
                        result.messages
                    );
                } else {
                    return result;
                }
            },
        };
        
        await Sweetalert2.fire(config_sweetaler).then((result) => {
            if (result.isConfirmed) {
                window.localStorage.setItem("urls", window.location.pathname);
                window.localStorage.setItem("info", result.value.Token);
                localStorage.info_app=localStorage.info
                switch_session = 0;
                t = setTimeout(logout, t_vivo);
            } else if (result.dismiss === Sweetalert2.DismissReason.cancel) {
                localStorage.clear();
                sessionStorage.clear();
                location.href = `./`;
            }
        });
    }
}

window.resetTimer = () => {
    if (localStorage.info) {
       if (switch_session == 0) {
            if (localV(localStorage.info).exp < Date.now() / 1000) {
                console.log(t)
                window.clearTimeout(t);
                logout("Su Token Expiró.");
            } else {
                window.clearTimeout(t);
                t = setTimeout(logout, t_vivo);
            }
        }
    }else { localStorage.clear();
    sessionStorage.clear();
    location.href = `./`;
    } 
    
}
//variables para la session activa
window.switch_session = 0;
window.t_vivo = 300000;
window.t = setTimeout(logout, t_vivo);
//!fin de gestion de sessiones

//funcion que carga la vista en el dom
window.ViewsLoad = async (path = null, arriba = false) => {
    let paths = ``;
    if (arriba) {
        paths = path;
    } else {
        paths = `./vistas/${path}`;
    }
    if (path != null) {
        // console.log('entro')
        let response = await fetch(`${paths}`, {
            method: 'GET',
        }); let result = await response;
        if (result.ok) {
            result = await result.text();
            //conedor_dom.innerHTML = result;
            funcion_script_txt("conedor_dom", result);
        } else {
            alert("debe suministrar una ruta valida");
        }
    } else {
        alert("debe suministrar una ruta valida");
    }
}
/*Funcion que carga el script de una cadena en condigo html y lo agrega a un elemento determindado*/
const funcion_script_txt = (id_element, txt) => {
    document.getElementById(id_element).innerHTML = '';
    let elemento_final = null;
    let elementos_js = [];
    while (txt.includes('<script')) {
        if (txt.includes('<script>')) {
            let cadena_tempo = txt.substring(txt.indexOf('<script>'));
            cadena_tempo = cadena_tempo.substring(0, cadena_tempo.indexOf('</script>') + 9);
            //console.log(cadena_tempo);
            txt = txt.replace(cadena_tempo, '');
            let scriptT = document.createElement('script');
            scriptT.text = cadena_tempo.replace('<script>', '').replace('</script>', '');
            elemento_final = scriptT;
        } else {
            let cadena_tempo = txt.substring(txt.indexOf('<script'), txt.indexOf('</script>') + 9);
            txt = txt.replace(cadena_tempo, '');
            let src = cadena_tempo.substring(cadena_tempo.indexOf('"') + 1);
            src = src.substring(0, src.indexOf('"'));
            let scriptT = document.createElement('script');
            scriptT.setAttribute('src', src);
            document.getElementById(id_element).appendChild(scriptT);

            elementos_js = [...[scriptT], ...elementos_js]
            elementos_js.push(scriptT);
        }
    }
    document.getElementById(id_element).insertAdjacentHTML('afterbegin', txt);
    elementos_js.map(function (num) {
        document.getElementById(id_element).appendChild(num);
    })
    if (elemento_final) {
        document.getElementById(id_element).appendChild(elemento_final);
    }
}
//funcion que cambia temas de colores
window.reloadStylesheets = (tema) => {
    let cambio_style = false;
    let bootstrap_At = '';
    let style_At = '';
    if (tema == 'oscuro' || tema == 'claro') {
        bootstrap_At = `./librerias/tema/${tema}/bootstrap.min.css?reload=` + new Date().getTime();
        style_At = `./librerias/tema/${tema}/style.css?reload=` + new Date().getTime();
        cambio_style = false;
    } else {
        bootstrap_At = `./librerias/tema/bots/${tema}.min.css?reload=` + new Date().getTime();
    }
    document.querySelectorAll('link').forEach(element =>
        element.href = element.href.includes(`bootstrap.min.css`) || element.href.includes(`tema/bots`) ? bootstrap_At : element.href.includes(`style.css`) && cambio_style ? style_At : element.href
    );


}
//inicializacion de librerias
//!cargue de librerias e importaciones
window.slimselect_lib = async () => {

    if (typeof slimselect_todas_sedes !== 'function') {
        let link = document.createElement("link");
        link.href = `./librerias/slimselect/slimselect.min.css`; link.rel = "stylesheet";
        document.head.appendChild(link);
        await import("../librerias/slimselect/slimselect.min.js");
        await import("./Acciones/slimselecter.js");
    }

    //slimselect_todas_sedes(".select_demo");
    //slimselect_basico('municipios',".select_demo");
    //slimselect_basico_de_id('municipios',10, 'id_departamento', ".select_demo");
    //slimselect_basico_de_id_excluidos ('municipios',10, 'id_departamento',1, 'estado', ".select_demo");
    //slimselect_Ajax ( 'municipios', ".select_demo")
    //slimselect_Ajax_id("portafolio", ".select_demo","id_tipo_tarifario", "1")
    //slimselect_Ajax_Campos_especificos("historia_area", ".select_demo", "id,nombre,comentario");
    //slimselect_Ajax_Campos_especificos("empleados", ".select_demo",  "primer_nombre,primer_apellido,documento,usuario")
    //slimselect_Ajax_Campos_especificos_filtrados('empleados', '#nomme', "Seleccione un empleado", "primer_nombre,primer_apellido,documento,usuario",'estado', [0,1,2]);
    //slimselect_medicosc(".select_demo");
    //slimselect_pacientesc(".select_demo");
    //slimselect_medicosc_Todas_sedes_g(".select_demo");
    //slimselect_municipios(".select_demo");
    //slimselect_especialidades_sedes_agendas(".select_demo");
    //llenar_slimselect_sedes_empleado(138,".select_demo")
    //llenar_slimselect_especialidades_empleado(138,".select_demo")
    //slimselect_cruzado(".select_demo", '*', "consultorio", "pabellon", 'id_pabellon', 1, "id_sede")
    //slimselect_cruzado_invertido(".select_demo", '*', "config_programas_sedes", "programas", 'id_programa', 1, "id_sede")
    //slimselect_sede_user(".select_demo")
    //select_sede_user(".select_demo2")

}

window.chartjs_lib = async () => {
    if (typeof Chart !== 'function') {
        let link = document.createElement("link");
        link.href = `./librerias/chart.js/Chart.min.css`; link.rel = "stylesheet";
        document.head.appendChild(link);
        await import("../librerias/chart.js/Chart.min.js");
    }
}

window.gridjs_lib = async () => {
    if (typeof Grid !== 'function') {
        let link = document.createElement("link");
        link.href = `./librerias/grid_js/mermaid.min.css`; link.rel = "stylesheet";
        document.head.appendChild(link);
        await import("../librerias/grid_js/gridjs.Z.js");
    }
}

window.tabulator_lib = async () => {
    if (typeof Tabulator !== 'function') {
        let link = document.createElement("link");
        link.href = `./librerias/tabulator/tabulator_bootstrap5.min.css`; link.rel = "stylesheet";
        document.head.appendChild(link);
        await import("../librerias/tabulator/tabulator.min.js");
        await import(`./tablesdata.js?v=${new Date().getTime()}`);
        stilos_dtables();
    }
}

window.fullcalendar_lib = async () => {
    if (typeof FullCalendar !== 'object') {
        let link = document.createElement("link");
        link.href = `./librerias/fc2/main.css`; link.rel = "stylesheet";
        document.head.appendChild(link);
        await import("../librerias/fc2/main.js");
        await import("../librerias/fc2/locales-all.min.js");
    }
}

window.sweetalert2_lib = async () => {

    if (typeof Sweetalert2 !== 'function') {
        let link = document.createElement("link");
        link.href = `./librerias/sweetalert2/sweetalert2_theme-bootstrap-4_bootstrap-4.css`; link.rel = "stylesheet";
        document.head.appendChild(link);
        await import("../librerias/sweetalert2/sweetalert2.all.min.js");
    }
}
//ejemplos de librerias 
window.fullcalendar_excute = async () => {
    let calendarEl = document.getElementById('calendario');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        locale: "es-us",
        themeSystem: "bootstrap",
        navLinks: true,
        nowIndicator: true, //linea indicadora del dia y la hora

        initialView: 'dayGridMonth',// 'dayGridMonth',//initialView: 'timelineWeek',
        selectable: true,
        headerToolbar: {
            left: 'title',
            center: 'today',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        slotDuration: '00:10',
        slotLabelFormat: [
            //se visualizara de esta manera 01:00 AM en la columna de horas
            {
                hour: "2-digit",
                minute: "2-digit",
                omitZeroMinute: false,
                hour12: true,
            },
        ],
        eventTimeFormat: {
            hour: "2-digit",
            minute: "2-digit",
            omitZeroMinute: false,
            hour12: true,
        },
    });
    calendar.render();
}

window.tabulator_excute = async () => {
    var table = new Tabulator("#tabla_tabulator", { layout: "fitDataStretch" });
    var table2 = new Tabulator("#tabla_tabulator2", {
        autoColumns: true,//verifica primero la data y asume las columnas
        layout: "fitDataStretch",
        ajaxURL: "https://jsonplaceholder.typicode.com/albums",
        pagination: "local",
        paginationSize: 6,//total en pantalla
        paginationSizeSelector: [1, 3, 6, 8, 10],//filtro de paginacion
        movableColumns: false,//permite mover las columnas de la tabla
        paginationCounter: "rows",
        ajaxConfig: {
            contentType: 'application/json; charset=utf-8',
            headers: {
                'x-probot1': '123',
                'x-probot2': '456',
                'zsacsacsac': '00ddf00'
            },
            type: 'POST',
            ajaxParams: { key1: "value1", key2: "value2" }


        },//ajaxParams:{key1:"value1", key2:"value2"}

    }); 


       // parses JSON response into native JavaScript objects
    


   
    localStorage.info_app=localStorage.info
    let conf_tabla = {
        campo: 'pais',//'profesional_servicios', //'emp_mae_empleados',
        id_or_class: ".pum",
        descripcion: "paises",
        ordering:true,
        //campo_filt: 'id_agenda',
        //filt_cont: va,
    // columnas_ocultas: ['profesional', 'agenda'],
        responsive_table: false,
        testting:true
    };

    let men = await tabla_json(conf_tabla);
}

window.grid_excute = async () => {
    new gridjs.Grid({
        columns: ['Name', 'Email'],
        data: [
            ['John', 'john@example.com'],
            ['Mike', 'mike@gmail.com']
        ],
        className: {
            td: '',
            table: 'table table-striped'
        }
    }).render(document.getElementById('table'));

}

window.char_excute = async () => {
    let arreglo_canvas = document.querySelectorAll(".chartjs_ed");
    arreglo_canvas.forEach(element => {
        if (element.id.includes('chart')) {
            if (element.id.includes('line')) {
                new Chart(element.getContext("2d"), {
                    type: "line",
                    data: {
                        labels: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
                        datasets: [{
                            label: "Salse",
                            fill: false,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            data: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15]
                        }]
                    },
                    options: {
                        responsive: true
                    }
                });
            } else if (element.id.includes('bar')) {
                new Chart(element, {
                    type: "bar",
                    data: {
                        labels: ["Italy", "France", "Spain", "USA", "Argentina"],
                        datasets: [{
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)'
                            ],
                            data: [55, 49, 44, 24, 15]
                        }]
                    },
                    options: {
                        responsive: true
                    }
                });
            } else if (element.id.includes('pie')) {
                new Chart(element, {
                    type: "pie",
                    data: {
                        labels: ["Italy", "France", "Spain", "USA", "Argentina"],
                        datasets: [{
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)'
                            ],
                            data: [55, 49, 44, 24, 15]
                        }]
                    },
                    options: {
                        responsive: true
                    }
                });

            } else if (element.id.includes('doughnut')) {
                new Chart(element, {
                    type: "doughnut",
                    data: {
                        labels: ["Italy", "France", "Spain", "USA", "Argentina"],
                        datasets: [{
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)'
                            ],
                            data: [55, 49, 44, 24, 15]
                        }]
                    },
                    options: {
                        responsive: true
                    }
                });
            }
        } else if (element.id.includes('worldwide-sales') || element.id.includes('salse-revenue')) {
            if (element.id.includes('worldwide-sales')) {
                new Chart(element, {
                    type: "bar",
                    data: {
                        labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
                        datasets: [{
                            label: "USA",
                            data: [15, 30, 55, 65, 60, 80, 95],
                            backgroundColor: 'rgba(255, 205, 86, 0.2)',
                            borderColor: 'rgb(255, 205, 86)',

                        },
                        {
                            label: "UK",
                            data: [8, 35, 40, 60, 70, 55, 75],
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgb(255, 159, 64)'
                        },
                        {
                            label: "AU",
                            data: [12, 25, 45, 55, 65, 70, 60],
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgb(255, 99, 132)'
                        }
                        ]
                    },

                    options: {
                        responsive: true
                    }
                });
            } else {
                new Chart(element, {
                    type: "line",
                    data: {
                        labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
                        datasets: [{
                            label: "Salse",
                            data: [15, 30, 55, 45, 70, 65, 85],
                            backgroundColor: 'rgba(255, 193, 7, 0.27)',
                            fill: true
                        },
                        {
                            label: "Revenue",
                            data: [99, 135, 170, 130, 190, 180, 270],
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: true
                        }
                        ]
                    },
                    options: {
                        responsive: true
                    }
                });


            }
        }
    });
}

//lib que usas jquery
window.cargar_lib_datatables = async () => {
    if (typeof tabla_dinamica_json !== 'function') {
        //si no fue importada se importa el modulo de la siguiente manera.
        let css = [
            "librerias/datatables_full/dataTables.bootstrap5.min.css"
        ];
        css.map(function (x) {
            let link = document.createElement("link");
            link.href = x; link.rel = "stylesheet";
            document.getElementsByTagName("head")[0].appendChild(link);
        });
       
        await import(`../librerias/jquery/code.jquery.com_jquery-3.7.1.min.js`);
        await import(`../librerias/datatables_full/datatables.min.js`);

        await jQuery.fn.dataTable.Api.register('sum()', function () {
            return this.flatten().reduce(function (a, b) {
                if (typeof a === 'string') {
                    a = a.replace(/[^\d.-]/g, '') * 1;
                }
                if (typeof b === 'string') {
                    b = b.replace(/[^\d.-]/g, '') * 1;
                }
                return a + b;
            }, 0);
        });
        await import(`./Acciones/tablesdata.js?v=${new Date().getTime()}`);
        stilos_dtables();
    } else {
        await jQuery.fn.dataTable.Api.register('sum()', function () {
            return this.flatten().reduce(function (a, b) {
                if (typeof a === 'string') {
                    a = a.replace(/[^\d.-]/g, '') * 1;
                }
                if (typeof b === 'string') {
                    b = b.replace(/[^\d.-]/g, '') * 1;
                }
                return a + b;
            }, 0);
        });
    }
}
window.cargar_lib_select2 = async () => {
    if (typeof stilos_select2 !== 'function') {
        let link = document.createElement("link");
        link.href = "librerias/select2/css/select2.min.css"; link.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);

        let link4 = document.createElement("link");
        link4.href = "librerias/select2/css/select2-bootstrap5.min.css"; link4.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link4);
       
        if($()==undefined){
            await import(`../librerias/jquery/code.jquery.com_jquery-3.7.1.min.js`);
        }
        
        await import("../librerias/select2/js/select2.full.min.js");
        await import("../librerias/select2/js/i18n/es.js");
        await import(`./Acciones/selecter2.js?v=${ new Date().getTime()}`);
        stilos_select2();
    }
}

//socket
/*window.url_socket = window.location.origin
window.win = navigator.platform.indexOf('Win') > -1;
window.socket = io(url_socket, { transport: ["websocket", "polling", "flashsocket"], });

window.socketIOd = (socket) => {
    socket.emit('mi_id', {
        id_empresa: 1,
        id: Math.floor(Math.random() * 99),
        user: "fed" + Math.floor(Math.random() * 99),
        id_cargo: Math.floor(Math.random() * 99),
        id_perfil: Math.floor(Math.random() * 99),
        id_sede: Math.floor(Math.random() * 99)
    });

    socket.on('mi_id', function (data) {
        console.log('mi id:', data)
    });

    socket.on('en_linea2', function (data) {
        toastresp('mi id es:', data, "bg-info");
        console.log('mi id es:', data)

    });

    socket.on('en_linea', function (data) {
        console.log('en linea:', data)
    });
    socket.on('alerta', function (data) {
        console.log(data.texto, 'INFORMACIÓN');
    });
    socket.on('cerrar_sesion', function (data) {

    });

}*/

//material-dashBard
window.minibar = () => {
    if (body.className.includes('g-sidenav-hidden')) {
        body.classList.add('g-sidenav-pinned');
        body.classList.remove('g-sidenav-hidden');
    } else {
        body.classList.add('g-sidenav-hidden');
        body.classList.remove('g-sidenav-pinned');
    }
}

document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
        document.querySelector('.sidenav').setAttribute("style", "z-index:1021;");
        new SlimSelect({
            select: '#select_sed_papa',
            settings: {
                placeholderText: 'Seleccione sede',
            }
        });
        if (win && document.querySelector('#sidenav-scrollbar')) {
            var options = {
                damping: '0.5'
            }
            Scrollbar.init(document.querySelector('#sidenav-scrollbar'), options);
        }
    }
};



//!iniciando funciones necesarias 
window.mostrar_pdf_aletr = (ruta, titulo) => {
    let configuracion = {
        title: `${titulo}`.toUpperCase(),
        html: `<embed src="${ruta}" type="application/pdf" width="100%" height="600px" />`,
        showCancelButton: true,
        width: '90%',
        showCloseButton: true,
        cancelButtonText: 'Regresar',
        showConfirmButton: false

    }
    Swal.fire(configuracion);
}
//funcion especial de codificacion
window.localV = (token) => {
    let base64Url = token.split(`.`)[1];
    let base64 = base64Url.replace(/-/g, `+`).replace(/_/g, `/`);
    let jsonPayload = decodeURIComponent(
        atob(base64)
            .split(``)
            .map(function (c) {
                return `%` + (`00` + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(``)
    );
    return JSON.parse(jsonPayload);
};

//funcion que copia el texto de un input
window.copyText = (idInput) => {
    let copyText = document.getElementById(`${idInput}`);
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
};

//verifica dos json confirmando cambios en la informacion
window.verificar_cambios_json = (json_actual, json_anterior) => {
    let cambios = {};
    for (const property in json_actual) {
        if (json_anterior[property] != json_actual[property]) {
            Reflect.set(cambios, property, json_actual[property])
        }
    }
    return cambios;
}

//funcion para asignar un formato aun numero d eimput text 000.000.000.000 puntos d emiles 
//<input type="text" onkeyup="format(this)" onchange="format(this)">
window.format = (input) => {
    var num = input.value.replace(/\./g, '');
    if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/, '');
        input.value = num;
    }
    else {
        alert('Solo se permiten numeros');
        input.value = input.value.replace(/[^\d\.]*/g, '');
    }
}

///formatos de miles a una cadena '000000000'=>'000.000.000.000'
window.format_numero_cadena = (cadena) => {
    let num = cadena;
    if (num == 0) {
        return '0';
    } else if (num) {
        if (!isNaN(num)) {
            num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            num = num.split('').reverse().join('').replace(/^[\.]/, '');
            return num;
        }
        else {
            return num.replace(/[^\d\.]*/g, '');
        }
    }

}

window.convertir_form_json_normaltext = (formData) => {
    let object = {};
    formData.forEach(function (value, key) {
        let Newtxtjq = isNaN(value) || value == '' ?
            value.replace(/\b[a-z]/g, function (txtjq) {
                return txtjq;
            }) :
            Number(value);
        object[key] = Newtxtjq;

    });
    return object;
};

//funcion que limpia un json de espacios anlante y atras de cada campo
window.trimJOSNNS = ({data, minuscula=false, mayusculas=false, primera_mayus=false}) => {
    for (const property in data) {
        if (typeof (data[property]) == 'string') {
            if(mayusculas){
                Reflect.set(data, property, (data[property]).trim().toUpperCase())
            }else if(minuscula){
                Reflect.set(data, property, (data[property]).trim().toLowerCase())
            }else if(primera_mayus){
                Reflect.set(data, property, (data[property].charAt(0).toUpperCase() + data[property].slice(1)).trim())
            }else{
                Reflect.set(data, property, (data[property]).trim())
            }
            
        }
    }
    return data;
}

window.fuente_extraña = (string_c) => {
    let traduccion = {
        a: '🅰', b: '🅱', c: '🅲', d: '🅳', e: '🅴', f: '🅵', g: '🅶', h: '🅷', i: '🅸', j: '🅹', k: '🅺', l: '🅻',
        m: '🅼', n: '🅽', ñ: '🅽', o: '🅾', p: '🅿', q: '🆀', r: '🆁', s: '🆂', t: '🆃', u: '🆄', v: '🆅', w: '🆆',
        x: '🆇', y: '🆈', z: '🆉'
    }
    let cadena='';
    string_c.split('').map(function(x) {
        if(Reflect.has(traduccion, x.toLowerCase())){
            cadena+=traduccion[x.toLowerCase()]
        }else{
            cadena+=x
        }
    });
    return cadena;
}

