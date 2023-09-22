//requiere view.js, selecter.js cSpell:disable
//funcion que recibe un json y genera el html respectivo con el grid de bootstrap
window.convertir_objeto_html = (json) => {
    let textohtml = '<div class="row text-left text-start">';

    for (let propiedad in json) {
        textohtml += `<div class="primMayus col-lg-3 col-sm-12 col-md-6">
                                <label class="label-font-s-p label-margin-bottom-0  fw-bold font-weight-bold" for="start">${propiedad.replaceAll(
            "_",
            " "
        )}: </label>
                                <label class="font-italic font-weight-normal" >${json[propiedad]
            }</label>
                          </div>`;
    }
    return `${textohtml}</div>`;
};

window.json_html = ({
    json,
    col_sm = 12,
    col_md = 6,
    col_lg = 3,
    primMayus = true,
    titulo = "",
    border = false,
    text_break = false,
    abajo = false,
    linea=false,
    between=false,
    margin_0=false
}) => {
    let textohtml = `${titulo != "" ? `<h6>${titulo}</h6> <br> <div>` : ""}`;
    if (!Array.isArray(json)) {
        json = [json];
    }
    json.map(function (x) {
        textohtml += `<div class="row text-left text-start text-smsoft">`;
        for (let propiedad in x) {
            textohtml += `<div class="${primMayus ? "primMayus" : ""
                } col-lg-${col_lg} col-md-${col_md} col-sm-${col_sm}  ${border ? "border border-secondary" : ""
                } ${between?' d-flex justify-content-between ':''}">
                                            <label class="label-margin-bottom-0  fw-bold font-weight-bold ${text_break ? "text-break" : ""
                }">${propiedad.replaceAll(
                    "_",
                    " "
                )}: </label>
                                            ${abajo ? "<br>" : ""}
                                            <label class="font-weight-normal ${between?' text-right ':''} ${margin_0?"label-margin-bottom-0":""} ${text_break ? "text-break" : ""
                }" >${x[propiedad]}</label>
                                    </div>`;
        }
        textohtml += `</div> ${json.length > 1 ? linea?"<hr>":"" : ""} `;
    });
    return `${textohtml}${titulo != "" ? `</div>` : ""}`;
};
window.json_html_list = ({
    json,
    ordenada = false,
    type = "1",
    start = 1,
    reverse = false,
    primMayus = true,
    titulo = "",
    text_break = false,
    abajo = false,
    grid=false,
    col_sm = 12,
    col_md = 6,
    col_lg = 3,
    linea=false
}) => {

    let textohtml = `${titulo != "" ? `<h6>${titulo}</h6> <br>` : ""}<div>`;
    if (!Array.isArray(json)) {
        json = [json];
    }
    let classe1=grid?' class="row" ':''
    let classe2=grid?` col-lg-${col_lg} col-md-${col_md} col-sm-${col_sm} `:''
    json.map(function (x) {
        
        textohtml += ordenada
            ? `<ol type="${type}" start="${start}" ${reverse ? "reversed" : ""} ${classe1}>`
            : `<ul ${classe1}>`;
        for (let propiedad in x) {
            textohtml += `<li class="${primMayus ? "primMayus" : ""} ${classe2}">
                                            <label class="label-font-s-p label-margin-bottom-0  fw-bold font-weight-bold ${text_break ? "text-break" : ""
                }" for="start">${propiedad.replaceAll(
                    "_",
                    " "
                )}: </label>
                                            
                                            <${abajo ? "p" : "label"
                } class="font-weight-normal ${text_break ? "text-break" : ""
                }" >${x[propiedad]}</${abajo ? "p" : "label"}>
                                    </li>`;
        }
        textohtml += `${ordenada ? `</ol>` : `</ul>`} ${json.length > 1 ? linea?"<hr>":"" : ""} `;
    });

    return `${textohtml}</div>`;
};

/*************************************/
/*alerta de formato de impresion*/
window.ejecutar_alerta_formato_simple = async ( orientacion,
    { titulo, json_descipcion, json_contenido }
) => {
    /*orientacion = 'portrait','landscape'*/
    let html = await formato_simple(titulo, json_descipcion, json_contenido);
    Swal.fire({
        html: `<div id='formulario_temp'>${html}</div>`,
        width: "auto",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: '<i class="fas fa-print"></i>',
        denyButtonText: `<i class="fas fa-file-download"></i>`,
        didOpen: () => {
            $(".swal2-actions").addClass("noPrint");
            $(".swal2-popup").addClass("border0");
        },
    }).then((result) => {
        let elemtento = document.getElementById("formulario_temp");
        if (result.isConfirmed && !is_movil) {
            window.print();
        } else if (result.isConfirmed && is_movil) {
            generatePDF({ elementHTML: elemtento });
        } else if (result.isDenied) {
            generatePDF({ elementHTML: elemtento });
        }
    });
};

/*formato simple con tabla*/
window.formato_simple = async (titulo, json_descipcion, json_contenido) => {
    contenido = `<div class = "container">
        ${await titulo_empresa_logo(titulo)} 
        ${descripcion_formato(json_descipcion)}
        ${contenido_formato(json_contenido)} 
       
            <div class="row">
                <div
                    style="width: 50%; text-decoration: underline; text-align: left; padding-left: 50px; margin-top: 15px;">
                    ${sessionStorage.getItem("nombre")}<br>
                    <label style="float: left;">QUIEN ENTREGA <br><span>CC</span></label>
                </div>
                <div style="width: 50%; text-align: left; margin-top: 15px;">
                    <span style="text-decoration: underline; float: left; ">_______________________________</span><br>
                    <label style="float: left;" for="">QUIEN RECIBE<br><span>CC</span></label>
                </div>
            </div>
        </div>`;
    return contenido;
};

/*
    solo carga la informacion de la empresa y la sede seleccionada
    titulo= titulo del formato 
*/
window.titulo_empresa_logo = (titulo) => {
    let seD = $("#sede_seleccionada_usuario")
        .data()
        .select2.options.options.data.find(
            (element) => element.id == $("#sede_seleccionada_usuario").val()
        );
    let emp = localV(localStorage.getItem("info_app")).data;
    let contenido = `<div class="row">
            <div  class = 'col-2 text-left text-start '">
                <img src="${emp.logo_ruta
        }" onerror="this.src='../dist/img/logo.png'"style="height:80px;">
            </div>
            <div class = 'col-8 text-center'>
                <h6 style="font-weight: bold !important; ">${emp.nombre_corto_empresa.toUpperCase()}<br>
                    ${seD.direccion.toUpperCase()}<br>
                    ${titulo.toUpperCase()}</h6>
            </div>
            <div class = 'col-2 text-right' style="padding-right: 15px;">

                <h6 class= 'text-right text-end text-muted'>
                    
                    ${moment().format("MM-DD-YYYY")}<br>
                    <span class='text-right'>${moment().format(
            "HH:mm"
        )}</span><br>
                    ${sessionStorage.getItem("user").toUpperCase()}
                </h6>
            </div>
    </div> <br>`;
    return contenido;
};
window.titulo_legal = (titulo,detalle =false) => {
    let emp = localV(localStorage.getItem("info_app")).data;
    let contenido= `<div class="text-smsoft font-weight-bolder d-flex justify-content-between">
    <img src="${emp.logo_ruta
    }" onerror="this.src='../dist/img/logo.png'"style="height:80px;">

    <h6 class="text-center" style="font-weight: bold !important; ">${emp.nombre_corto_empresa.toUpperCase()}<br>${titulo.toUpperCase()}</h6>
    <h6 class= 'text-right text-end text-muted'>
                    
                    ${moment().format("MM-DD-YYYY")}<br>
                    <span class='text-right'>${moment().format(
            "HH:mm"
        )}</span><br>
                    ${sessionStorage.getItem("user").toUpperCase()}<br>
                    ${detalle?detalle+'<br>':''}
                </h6>
    </div>`
    return contenido;
};

window.titulo_empres_logo_ajax_PPl = async (titulo, detalle = "", id_sede = null) => {
    let seD ={};
    if (id_sede != null) {
        let response = await fetch(
            `${urlback}Maestros/PrincipalController/datos_sede`,
            {
                method: "GET",
                headers: {
                    Authorization: localStorage.getItem("info_app"),
                    "Sede-Select": id_sede,
                },
            }
        );
        seD = await response.json();
    }else{
        seD = $("#sede_seleccionada_usuario").data().select2.options.options.data.find(
            (element) => element.id == $("#sede_seleccionada_usuario").val()
        );
    }
    let emp = localV(localStorage.getItem("info_app")).data;
    let contenido = `<div class="row text-uppercase">
            <div  class = 'col-2 text-left text-start'">
                <img src="${emp.logo_ruta
        }" onerror="this.src='../dist/img/logo.png'"style="height:80px;">
            </div>
            <div class = 'col-8 text-center'>
                <h6 style="font-weight: bold !important; ">${emp.nombre_corto_empresa}<br>
                    ${emp.nit_empresa}<br>
                    ${seD.direccion}<br>
                    SEDE DE ATENCION: ${seD.nombre}<br>
                    CODIGO DE HABILITACIÓN ${seD.codigo_habilitacion
            ? seD.codigo_habilitacion
            : "(No Registrado)."
        }<br>
                    ${titulo}</h6>
            </div>
            <div class = 'col-2 text-right' style="padding-right: 15px;">
                <h6 class= 'text-right text-end text-muted'>
                    ${moment().format("MM-DD-YYYY")}<br>
                    <span class='text-right'>${moment().format("hh:mm a")}</span><br>
                    ${sessionStorage.getItem("user")}<br>
                    ${detalle}<br>
                </h6>
            </div>
    </div> <br>`;
    return contenido;
};
/*
 json={}    
    se ocupa en el area de descripcion del formato y recibe un json {}
    dos columnas y la data 
*/

window.descripcion_formato = (json) => {
    let contenido_total = '<div class="row">';
    let count = 0;
    for (const property in json) {
        if (json[property]) {
            contenido_total += `<div class = 'col-${count % 2 == 0 ? "8" : "4"
                }  text-left text-start' style= "font-size: 13px" >`;
            contenido_total += `<label class='fw-bold font-weight-bolder'>${property
                .toUpperCase()
                .replaceAll("_", "&nbsp;")
                .replaceAll(
                    " ",
                    "&nbsp;"
                )}&nbsp;:&nbsp;</label>&nbsp;&nbsp;<label class="font-weight-normal text-break">${isNaN(json[property])
                    ? json[property].toUpperCase().replaceAll(" ", "&nbsp;")
                    : json[property]
                }</label>`;
            contenido_total += `</div>`;
            count++;
        }
    }
    contenido_total += `</div>`;
    return contenido_total;
};

window.descripcion_formato_6 = (json) => {
    let contenido_total = '<div class="row">';

    for (const property in json) {
        if (json[property]) {
            contenido_total += `<div class = 'col-lg-6  text-left text-start' style= "font-size: 13px" >`;
            contenido_total += `<label>${property
                .toUpperCase()
                .replaceAll("_", "&nbsp;")
                .replaceAll(
                    " ",
                    "&nbsp;"
                )}&nbsp;:&nbsp;</label>&nbsp;&nbsp;<label class="font-weight-normal">${isNaN(json[property])
                    ? json[property].toUpperCase().replaceAll(" ", "&nbsp;")
                    : json[property]
                }</label>`;
            contenido_total += `</div>`;
        }
    }
    contenido_total += `</div><br>`;
    return contenido_total;
};

/*
    muestra el contenido en una lista segun el json y si se lenvia el valor tabla:true muestra la informacion como unatabla de registros
    json= {tabla:true,json:[{},{}]}
    json= {tabla:false,json:{}}
    json= {tabla:false,json:[{},{}]}
*/
window.contenido_formato = (json) => {
    let tabla = json.tabla;
    if (!Reflect.has(json, "tabla") || tabla == null) {
        tabla = false;
    }

    json = json.json;

    if (tabla == true && Array.isArray(json) && json.length > 0) {
        let array = Object.keys(json[0]);
        let thead = "<thead><tr>";
        let tbody = "<tbody>";
        for (let index = 0; index < array.length; index++) {
            thead += `<th class="border-b" scope="col" >${array[index]
                .replaceAll("id_", "")
                .toUpperCase()
                .replaceAll("_", " ")
                .replaceAll(" ", "&nbsp;")}</th>`;
        }
        thead += "</tr></thead>";

        for (let index_i = 0; index_i < json.length; index_i++) {
            tbody += `<tr>`;
            for (let index = 0; index < array.length; index++) {
                const element = json[index_i][array[index]];

                tbody += `<td> <label class="font-weight-normal ${(isNaN(element)
                    ? element.toUpperCase().replaceAll(" ", "&nbsp;")
                    : element
                ).length > 20
                    ? "text-break "
                    : ""
                    } text-justify ">${isNaN(element)
                        ? element.toUpperCase().replaceAll(" ", "&nbsp;")
                        : element
                    } </label></td>`;
            }
            tbody += `</tr>`;
        }
        tbody += "</tbody>";
        let tabla = `<div style="width: 100%; font-size: 13px;"><table class="table table-striped table-sm label-font-s-p text-left text-start">${thead}${tbody}</table> </div> `;

        return tabla;
    } else if (!Array.isArray(json)) {
        let contenido_total =
            '<div class="row text-left text-start"><div style="width: 100%; font-size: 13px;"> ';
        for (const property in json) {
            if (json[property]) {
                contenido_total += `<label>${property
                    .replaceAll("id_", "")
                    .toUpperCase()
                    .replaceAll("_", " ")
                    .replaceAll(" ", "&nbsp;")}</label>&nbsp;&nbsp;<span>${isNaN(json[property])
                        ? json[property].toUpperCase().replaceAll(" ", "&nbsp;")
                        : json[property]
                    }</span>`;
            }
        }
        contenido_total += "</div></div>";

        return contenido_total;
    } else {
        let contenido_total =
            '<div class="row text-left text-start"><div style="width: 100%; font-size: 13px;">';
        json.map((item) => {
            for (const property in item) {
                if (item[property]) {
                    contenido_total += `<label>${property
                        .replaceAll("id_", "")
                        .toUpperCase()
                        .replaceAll("_", " ")
                        .replaceAll(" ", "&nbsp;")}</label>&nbsp;&nbsp;<span>${isNaN(item[property])
                            ? item[property].toUpperCase().replaceAll(" ", "&nbsp;")
                            : item[property]
                        }</span>`;
                }
            }
            contenido_total += "";
        });
        contenido_total += "</div></div>";
        return contenido_total;
    }
};

window.imprim2 = (contenido) => {
    var mywindow = window.open("", "PRINT" /*, 'height=600,width=800'*/);
    mywindow.document.write(
        '<html><head> <link rel="stylesheet" href="../dist/css/adminlte.min.css" /><link rel="stylesheet" href="../dist/css/medintegral.css" />'
    );
    //mywindow.document.write(' <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">');
    mywindow.document.write("");
    mywindow.document.write("</head><body>");
    mywindow.document.write(contenido.trim());
    mywindow.document.write("</body></html>");
    mywindow.document.close(); // necesario para IE >= 10
    mywindow.focus(); // necesario para IE >= 10
    mywindow.onload = function () {
       mywindow.print();
       mywindow.close();
    };

    return true;
};

window.descripcion_formato_tabla = (json) => {
    //console.log(json);
    let contenido_total = `<div class="row">
    <div class="col-lg-12">
       <table class="label-font-s-p text-left text-start" style="width: 100%; border:0 solid silver; border-collapse: collapse; font-family:Arial; font-size:13px;">
          <thead >`;
    let count = 0;
    for (const property in json) {
        if (json[property]) {
            if (count == 0) {
                contenido_total += `<tr>`;
            }
            contenido_total += `<td style="border:0 solid #ffffff00; border-collapse: collapse; padding-left:3px; box-sizing: border-box;"><b>${property
                .toUpperCase()
                .replaceAll("_", "&nbsp;")
                .replaceAll(" ", "&nbsp;")}:</b></td>`;
            contenido_total += `<td class='text-left text-start word-break text-break' style="border-right:8px solid #ffffff00; border-collapse: collapse; padding-left:3px; box-sizing: border-box;">${isNaN(json[property])
                ? json[property].toUpperCase().replaceAll(" ", "&nbsp;")
                : json[property]
                }</td>`;
            count++;
            if (count == 2) {
                contenido_total += `</tr>`;
                count = 0;
            }
        }
    }
    contenido_total += `
          </thead>
       </table>
    </div>
  </div> <br>`;
    return contenido_total;
};
//Descarga en PDF

window.jsPDFlib = async () => {
    if (typeof jspdf !== "object") {
        await import("../../../plugins/generatePDF/caanvas.js");
        await import("../../../plugins/generatePDF/jspdf.umd.min.js");
    }
};
//! elementHTML = Document.elementById('');
//!orientacion= 'p' vertical  'l' horizontal, tamano=tipo de pagina, nombre= opcional
window.generatePDF = ({
    elementHTML,
    orientacion = "p",
    tamano = "letter",
    nombre = "archivo",
    margin = 10,
    ver = true,
    fuente = "Arial",
}) => {
    // Obtener el contenido HTML que se va a convertir a PDF
    // Crear un nuevo objeto jsPDF
    let { jsPDF } = window.jspdf;
    let doc = new jsPDF(orientacion, "mm", tamano);
    let scale =
        (doc.internal.pageSize.width - margin * 2) / elementHTML.scrollWidth;
    elementHTML.style.fontFamily = fuente;
    doc.html(elementHTML, {
        margin: margin,
        html2canvas: {
            scale: scale,
        },
        callback: function (doc) {
            if (ver) {
                for (let i = 1; i <= doc.getNumberOfPages(); i++) {
                    doc.setFontSize(7);
                    doc.setPage(i);
                    doc.text(
                        `${i} de ` + doc.internal.getNumberOfPages(),
                        doc.internal.pageSize.getWidth() - (margin + 5),
                        doc.internal.pageSize.getHeight() - (margin - 2),
                        { baseline: "bottom" }
                    );
                }
                doc.output("dataurlnewwindow", { filename: `${nombre}.pdf` });
            } else {
                doc.save(`${nombre}.pdf`);
            }
        },
    });
};
