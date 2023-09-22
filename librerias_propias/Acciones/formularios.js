//requiere view.js, selecter.js cSpell:disable 
//funcion que recibe una formData y lo convierte en json
window.convertir_form_json = (formData) => {
    let object = {};
    formData.forEach(function (value, key) {
        let Newtxtjq = isNaN(value) || value == '' ?
            value.replace(/\b[a-z]/g, function (txtjq) {
                return txtjq;
            }).toUpperCase() :
            Number(value);
        object[key] = Newtxtjq;

    });
    return object;
};

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

//funcion que recibe una formData y lo convierte en json
window.convertir_form_json_primera_letras = (formData) => {
    let object = {};
    formData.forEach(function (value, key) {
        let Newtxtjq = isNaN(value) || value == '' ?
            value.replace(/\b[a-z]/g, function (txtjq) {
                return key.toLowerCase().includes('nombre') ? txtjq.toUpperCase() : txtjq.slice(0, 1).toUpperCase() + txtjq.slice(1).toLowerCase();
            }) :
            Number(value);
        object[key] = Newtxtjq;
    });
    return object;
};

//funcion que limpia un json de espacios anlante y atras de cada campo
window.trimJOSNN = (data, mayusculas=true) => {
    for (const property in data) {
        //console.log(typeof(data[property]))
        if (typeof (data[property]) == 'string') {
            if(mayusculas){
                Reflect.set(data, property, (data[property]).trim().toUpperCase())
            }else{
                Reflect.set(data, property, (data[property]).trim())
            }
            
        }
    }
    return data;
}
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

//formularios dinamicos depende del archivo validimput
window.validarFormularioF = (e) => {
    let id = e.target.id;
    if (e.target.id.includes('id_')) {
        return validarSelect2F(document.getElementById(id).value, id);
    } else {
        if (id.includes('_text')) {
            return validarCampoF(expresiones.texto_especial, e.target, e.target.name);
        } else if (id.includes('_email')) {
            return validarCampoF(expresiones.correo, e.target, e.target.name);
        } else if (id.includes('_doc')) {
            return validarCampoF(expresiones.alphaNumerico, e.target, e.target.name);
        } else if (id.includes('_nomb')) {
            return validarCampoF(expresiones.texto, e.target, e.target.name);
        } else if (id.includes('_dir')) {
            return validarCampoF(expresiones.direccion, e.target, e.target.name);
        } else { return true }
    }
};

window.validarCampoF = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-exclamation-circle');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
        return true;
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-exclamation-circle');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
        return false;
    }
};
window.limpiarValidacion=(campo)=>{
    document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
    document.querySelector(`#grupo__${campo} i`).classList.remove('fa-exclamation-circle');
    document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
    document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check');
    document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
}

window.validarSelect2F = (select_value, campo, requerido) => {
    if (select_value!== 'undefined' && select_value !== undefined && select_value !== null && select_value !== '') {
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-exclamation-circle');
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
        return true
    } else {
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-exclamation-circle');
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
        return false
    }
};

/*maestro , cadena , identificador,   
excluidos = [ 'descripcion,'valor'
' valor_residual'
' id_grupo_activo'
' fecha_compra'
' usuario_creacion'
' id_tipo_activo'
' codigo_interno'
' estado'
]estas columnas no saldran en el formulario, importante verificar si son requeridos bd
desactivados: [] columnas que esten aca saldran desactivados en el formulario
 dependientes:[['id_modulos', 'id_menu_procesos'],['id_menu_procesos', 'id_opciones']] [[a,b], [c,d]] donde decimos que b depende de a y d depende de C
'centro_costos', '',`Actualizar_centro_de_costos`, tabla_dtl_centro_costos.row(this).data(),3,3,3,'1700');*/
window.convertir_objeto_formulario_json = async ({
    maestro, 
    cadena='', 
    identificador, 
    elementos = null, 
    id=null,
    col_sm = 12, 
    col_md = 6, 
    col_lg = 3, 
    width = 'auto',
    excluidos = [],
    dependientes=[], 
    desactivados=[],
    dimension=true,
    mayusculas=true, 
    result=null,//columnas de la tabla , 
    funcion=null
}) => {
    //console.log(maestro, cadena, identificador, elementos, col_sm, col_md, col_lg, width);
    let iconos = '<i class="far fa-save"></i>';
    let registro = null;
    let user = {
        maestro,
    };
    if(!result){
        let response = await fetch(
            `${urlback}Maestros/PrincipalController/conf_campo_estado`, {
            method: "POST",
            headers: { Authorization: localStorage.getItem("info_app") },
            body: JSON.stringify(user),
        }
        );
        result = await response.json();
    }
    if (result.length == 4) {
        width = '600'
    } else if (dimension && result.length >= 6) {
        width = '60%';
        col_sm = 12;//1
        col_md = 6;//2
        col_lg = 3;//4
    }
    let seleccionables = [];
    let campos = [];

    if (elementos != null) {
        iconos = '<i class="fas fa-edit"></i>';
        registro = elementos;
        cadena += `<input type="hidden" name="${identificador}_id" id="${identificador}_id" class="form-control form-control-sm">`;
        campos.push({
            n_campo: 'id',
            id_select: `${identificador}_id`,
        });
    }else if (id != null) {
        iconos = '<i class="fas fa-edit"></i>';
        let dato1 = { id, campo:maestro };
        let consulta = await fetch(
            `${urlback}Maestros/PrincipalController/buscar_uno_id`, {
            method: 'POST',
            headers: { 'Authorization': localStorage.getItem('info_app'), 'Sede-Select': sessionStorage.getItem('id_sede') },
            body: JSON.stringify(dato1)
        });
        registro = await consulta.json();
        cadena += `<input type="hidden" name="${identificador}_id" id="${identificador}_id" class="form-control form-control-sm">`;
        campos.push({
            n_campo: 'id',
            id_select: `${identificador}_id`,
        });
    }

    let contenido_formado = await cont_formulario({result, identificador, col_sm, col_md, col_lg, excluidos, desactivados});
    cadena += contenido_formado.cadena;
    campos = [...campos, ...contenido_formado.campos];

    seleccionables = [...seleccionables, ...contenido_formado.seleccionables];
    const { value: formValues } = await Swal.fire({
        title: `<h5 class="bd-content-title text-uppercase">
       ${iconos} ${identificador.replaceAll("_", " ")}</h5>`,
        width: width,
        html: `<form id="${identificador}" name="${identificador}" class="row text-left" >${cadena} </form>`,
        confirmButtonText: 'Guardar ' + (registro == null ? '<i class="far fa-save"></i>' : '<i class="far fa-edit"></i>'),
        focusConfirm: true,
        customClass: {htmlContainer:'m-0 overflow-hidden', container: 'm-0', title:'p-0'},
        didOpen: () => {
            seleccionables.map(async function (x) {
                let eject=registro != null && registro[x.n_campo] != null;
                if(eject){
                    await llenar_select2_basico_de_id (x.n_campo.includes('ciudad') || x.n_campo.includes('municipio')?'municipios': x.n_campo.includes('sede')? 'sede':x.n_campo,registro[x.n_campo], 'id',"#" + x.id_select,".swal2-modal");
                    let funct= dependientes.find(element=> element[1]==x.n_campo);
                    if(funct){
                        if(funct.length>0 && funct[1]==x.n_campo){
                            await selecterAjaxS_M_id(x.n_campo, "#" + x.id_select, x.n_campo, funct[0], registro[funct[0]],".swal2-modal")
                        }
                    }else{
                        if (x.n_campo.includes('ciudad') || x.n_campo.includes('municipio')) {
                            await selecter_municipios("#" + x.id_select, 'Seleccione municipio', ".swal2-modal");
                            //console.log(registro[x.n_campo], "#" + x.id_select);
                        }else if (x.n_campo.includes('sede')) {
                            await selecterAjaxS_M('sede', "#" + x.id_select, x.n_campo, ".swal2-modal");
                           
                        }else{
                            await selecterAjaxS_M(x.n_campo, "#" + x.id_select, x.n_campo, ".swal2-modal");
                        }
                    }
                    $("#" + x.id_select).val(registro[x.n_campo]).trigger('change');
                }else{
                    if (x.n_campo.includes('ciudad') || x.n_campo.includes('municipio')) {
                        await selecter_municipios("#" + x.id_select, 'Seleccione municipio', ".swal2-modal");
                    }else if (x.n_campo.includes('sede')) {
                        await selecterAjaxS_M('sede', "#" + x.id_select, x.n_campo, ".swal2-modal");
                    }else{
                        await selecterAjaxS_M(x.n_campo, "#" + x.id_select, x.n_campo, ".swal2-modal");
                    }
                }
                $("#" + x.id_select).on("select2:close", function (e) {
                    if (x.requerido == 0) {
                        validarSelect2F($("#" + x.id_select).val(), x.id_select);
                    }
                });
            });
            dependientes.map(async function(y){
                if(y.length>0){
                    if($("#" + identificador+'_'+y[0]).length>0){
                        $("#" + identificador+'_'+y[0]).on("select2:select", async function (e) {
                            let data = e.params.data;
                            if($("#" + identificador+'_'+y[1]).length>0){
                                selecterAjaxS_M_id(y[1],"#" + identificador+'_'+y[1] , y[1], y[0], data.id,".swal2-modal")
                            }else{
                                console.log('dependientes mal configurados:'+y[0]+' '+y[1]);
                            }
                        });
                    }else{
                        console.log('dependientes mal configurados:'+y[0]+' '+y[1]);
                    }
                }else{
                    console.log('dependientes mal configurados:', y);
                }
            });
            
            campos.map(function (x) {
                if (x.id_select != `${identificador}_id`) {
                    if (x.requerido == 0) {
                        document.getElementById(x.id_select).addEventListener('keyup', validarFormularioF);
                        document.getElementById(x.id_select).addEventListener('blur', validarFormularioF);
                    }
                }
            });
            for (const property in registro) {
                
                let i = property; let item = registro[property];
                let tip = result.find(element => element.nombre_columna == property);
                if (tip != undefined && tip.tipo == 'datetime2') {
                    $(`[name="${identificador}_${i}"]`).val(item.replaceAll(' ', 'T')).trigger("change");
                } else if (tip != undefined && tip.tipo == 'bit') {
                    $(`[name="${identificador}_${i}"]`).prop('checked', item == 0 ? 0 : 1);
                } else {
                    $(`[name="${identificador}_${i}"]`).val(item).trigger("change");
                }
            }
            eval(funcion);//`intervalo();bloquear();confirmar();`
        },
        preConfirm: () => {
            let respuesta = {};
            let validados = true;
            seleccionables.map(function (x) {
                if (document.getElementById(x.id_select).value == "") {
                    if (x.requerido == 0) {
                        validados = validados && false;
                        validarSelect2F($("#" + x.id_select).val(), x.id_select);
                    } else {
                        validados = validados && true;
                    }
                } else {
                    validados = validados && true;
                }
            });
            campos.map(function (x) {
               
                if (document.getElementById(x.id_select).value == '' && x.requerido != 0) {
                    //console.log(x, registro);
                    if (!x.n_campo.includes('id_')) {
                        respuesta[`${x.n_campo}`] = '';
                    } else {
                        respuesta[`${x.n_campo}`] = null;
                    }
                } else {
                    let tip = result.find(element => element.nombre_columna == x.n_campo);
                    if (tip != undefined && tip.tipo == 'bit') {
                        if ($(`#${x.id_select}`).is(':checked')) {
                            respuesta[`${x.n_campo}`] = 1;
                        } else {
                            respuesta[`${x.n_campo}`] = 0;
                        }
                    } else {
                        respuesta[`${x.n_campo}`] = document.getElementById(x.id_select).value;
                    }
                }
                if (x.id_select != `${identificador}_id`) {
                    let e = { target: document.getElementById(x.id_select) }
                    if (x.requerido == 0) {
                        validarFormularioF(e)
                        validados = validados && validarFormularioF(e);
                    }
                }
            });

            let elemento_form = document.getElementById(identificador);

            if (!elemento_form.reportValidity() || !validados) {
                Swal.showValidationMessage(
                    `Verifique la informacion ingresada en el formulario`
                );
            } else {
                if (registro != null && Reflect.has(registro, 'id') && registro.id != '') {
                    let cambios = {};
                    Reflect.set(cambios, 'id', respuesta['id']);
                    for (const property in respuesta) {
                        if (registro[property] != respuesta[property]) {
                            Reflect.set(cambios, property, respuesta[property])
                        }
                    }
                    //console.log(cambios, mayusculas);
                    return trimJOSNN(cambios, mayusculas);
                } else {
                    return trimJOSNN(respuesta, mayusculas);
                }
            }
        },
    });
    if (formValues) {
        let data = {
            campo: maestro,
            registro: formValues,
        };
        //console.log(data);
        if (registro != null) {
            if (result.find(element => element.nombre_columna == 'usuario_actualizacion') != undefined) {
                Reflect.set(formValues, 'usuario_actualizacion', sessionStorage.getItem('user'));
            } else if (result.find(element => element.nombre_columna == 'usuario_actualizar') != undefined) {
                Reflect.set(formValues, 'usuario_actualizar', sessionStorage.getItem('user'));
            } else if (result.find(element => element.nombre_columna == 'usuario_modificacion') != undefined) {
                Reflect.set(formValues, 'usuario_modificacion', sessionStorage.getItem('user'));
            }
        } else {
            if (result.find(element => element.nombre_columna == 'usuario_creador') != undefined) {
                Reflect.set(formValues, 'usuario_creador', sessionStorage.getItem('user'));
            } else if (result.find(element => element.nombre_columna == 'usuario_crear') != undefined) {
                Reflect.set(formValues, 'usuario_crear', sessionStorage.getItem('user'));
            } else if (result.find(element => element.nombre_columna == 'usuario_creacion') != undefined) {
                Reflect.set(formValues, 'usuario_creacion', sessionStorage.getItem('user'));
            }
        }
        if (Object.keys(formValues).length > 1) {
            let responseuf = await fetch(`${urlback}Maestros/PrincipalController/create`, {
                method: 'POST',
                headers: { 'Authorization': localStorage.getItem('info_app'), 'Sede-Select': sessionStorage.getItem('id_sede') },
                body: JSON.stringify(data)
            });
            let img = await responseuf;
            if (img.ok) {
                let img2 = await img.json();
                let den = { ...img2 };
                Reflect.deleteProperty(den, 'act');
                Reflect.deleteProperty(den, 'id');
                let cont_bit = JSON.stringify(den).replaceAll('"', '').replaceAll('{', '<li>').replaceAll(`,`, `</li><li>`).replaceAll(`}`, `</li>`).replaceAll(`:`, `:`);
                guardar_bitacora(img2.id, cont_bit, registro != null ? 'Actualizar' : 'Crear');
                return img2;
            } else {//message
                let respuesta = await img.json()
                //console.log(respuesta, respuesta.message, respuesta.message.split('El valor de la clave duplicada es '));
            }
        } else {
            return false;
        }

    }
};

/*
result=[{nobligatorio: 1, nombre_columna: 'id_modelo', tipo: 'int', capacidad: 4}]
*/
window.cont_formulario = async(
    {   
        maestro=null,
        result=null,
        identificador='formulario_dinamico', 
        col_sm = 12, 
        col_md = 6, 
        col_lg = 3,  
        excluidos = [], 
        desactivados=[]
    }) => {
        
    let cadena = '';
    let campos = [];
    let seleccionables = [];
    let checkbox=[];
    if(maestro){
        let user = {
            maestro,
        };
        let response = await fetch(
            `${urlback}Maestros/PrincipalController/conf_campo_estado`, {
            method: "POST",
            headers: { Authorization: localStorage.getItem("info_app") },
            body: JSON.stringify(user),
        }
        );
        result = await response.json();
    }
    if(result){
        result.forEach((element) => {
            let tvalidacion = '';
            let nomb_label = element.nombre_columna == ('title') ? 'titulo' : element.nombre_columna;
            nomb_label = element.nombre_columna == ('start') ? 'f.inicial' : nomb_label;
            nomb_label = element.nombre_columna == ('end') ? 'f.final' : nomb_label;
            nomb_label = element.nombre_columna == ('cups') ? 'cups/cum' : nomb_label;
            //console.log(excluidos, nomb_label ,element);
            if ( excluidos.length==0 || (!excluidos.includes(nomb_label)) || (element.nobligatorio==0)) {
                
                
                cadena += `<div class="col-lg-${element.tipo == "text" ? 12:col_lg} col-sm-${element.tipo == "text" ? 12:col_sm} col-md-${element.tipo == "text" ? 12:col_md} " id="grupo__${identificador}_${element.nombre_columna}"> 
                            <i class="fas fa-exclamation-circle formulario__validacion-estado"></i>              
                                <div class="form-group form_group_val">
                                        <div class="control-group input-append">
                                            <label class=" formulario__label text-truncate label-font-s-p label-margin-bottom-0 text-uppercase" >▹${nomb_label.includes('ruta')?'Nombre Archivo':nomb_label.replaceAll("id_", "").replaceAll("_", " ")}${element.nobligatorio == 0 ? '<span class="text-danger">* </span>' : ""} </label>`;

                if (!element.nombre_columna.indexOf("id_")) {
                    seleccionables.push({
                        n_campo: element.nombre_columna,
                        id_select: `${identificador}_${element.nombre_columna}`,
                        requerido: element.nobligatorio
                    });
                    cadena += `<select id="${identificador}_${element.nombre_columna}" name="${identificador}_${element.nombre_columna}"  class="form-select form-control-sm" ${element.nobligatorio == 0 ? "required" : ""} placeholder="${element.nombre_columna
                        .replaceAll("id_", "")
                        .replaceAll("_", " ").toUpperCase()}"  ${desactivados.includes(nomb_label)? 'disabled':''} ></select>
                                </div>
                            </div>
                            <small class="text-muted formulario__input-error text-danger">Se debe seleccionar una de las Opciones </small>
                        </div>`;
                }
                else if (element.tipo == "time") {

                    let agregar_evento_onchange = '';
                    if (element.nombre_columna.includes('inicial')) {
                        agregar_evento_onchange = `onchange = '$("#${identificador}_${element.nombre_columna.replace('inicial', 'final')}").attr("min", $(this).val());'`;
                    }
                    if (element.nombre_columna.includes('start')) {
                        agregar_evento_onchange = `onchange = '$("#${identificador}_${element.nombre_columna.replace('estar', 'end')}").attr("min", $(this).val());'`;
                    }
                    if (element.nombre_columna.includes('startime')) {
                        agregar_evento_onchange = `onchange = '$("#${identificador}_${element.nombre_columna.replace('esta', 'end')}").attr("min", $(this).val());'`;
                    }

                    cadena += ` <input type="time"  class="form-control form-control-sm" id="${identificador}_${element.nombre_columna
                        }" ${agregar_evento_onchange} name="${identificador}_${element.nombre_columna}" ${element.nobligatorio == 0 ? "required" : ""}  ${desactivados.includes(nomb_label)? 'disabled':''} >     
                                        </div>
                                    <small class="text-muted formulario__input-error text-danger">Seleccione una hora especifica</small>
                                    </div>
                                </div>`;
                }
                else if (element.tipo == "bit") {
                    checkbox.push({
                        n_campo: element.nombre_columna,
                        id_select: `${identificador}_${element.nombre_columna}`,
                        requerido: element.nobligatorio
                    });
                    cadena += `<br><div class="custom-control custom-switch">
                                    <input ${element.nombre_columna.includes('estado') ? 'checked' : ''} type="checkbox" class="custom-control-input" name="${identificador}_${element.nombre_columna
                        }" id="${identificador}_${element.nombre_columna}"  ${desactivados.includes(nomb_label)? 'disabled':''} >
                                                <label class="custom-control-label label-font-s-p" for="${identificador}_${element.nombre_columna
                        }" >Activo e inactivo</label>
                                            </div> 
                                        </div>
                                    </div>
                                    <small  class="text-muted formulario__input-error text-danger">Estas opciones traen un valor por defecto.</small>
                                </div>`;
                }
                else if (element.tipo == "datetime2") {
                    let agregar_evento_onchange = '';
                    if (element.nombre_columna.includes('inicial')) {
                        agregar_evento_onchange = `onchange = '$("#${identificador}_${element.nombre_columna.replace('inicial', 'final')}").attr("min", $(this).val());'`;
                    }
                    if (element.nombre_columna.includes('start')) {
                        agregar_evento_onchange = `onchange = '$("#${identificador}_${element.nombre_columna.replace('estar', 'end')}").attr("min", $(this).val());'`;
                    }
                    cadena += ` 
                                        <input type="datetime-local" ${element.nobligatorio == 0 ? "required" : ""} id="${identificador}_${element.nombre_columna
                        }" name="${identificador}_${element.nombre_columna
                        }"   ${agregar_evento_onchange} class="form-control form-control-sm"  ${desactivados.includes(nomb_label)? 'disabled':''} >     
                                    </div>
                                    <small class="text-muted formulario__input-error text-danger">Seleccione una fecha</small>
                                </div>
            
                            </div>`;
                }
                else if (!element.tipo.indexOf("date")) {

                    let agregar_evento_onchange = '';
                    if (element.nombre_columna.includes('inicial')) {
                        agregar_evento_onchange = `onchange = '$("#${identificador}_${element.nombre_columna.replace('inicial', 'final')}").attr("min", $(this).val());'`;
                    }
                    if (element.nombre_columna.includes('start')) {
                        agregar_evento_onchange = `onchange = '$("#${identificador}_${element.nombre_columna.replace('estar', 'end')}").attr("min", $(this).val());'`;
                    }
                    if (element.nombre_columna.includes('fecha_nacimiento')) {
                        agregar_evento_onchange = `max = "${moment().format("YYYY-MM-DD")}"`
                    }
                    cadena += `
                                        <input type="date" ${element.nobligatorio == 0 ? "required" : ""} id="${identificador}_${element.nombre_columna
                        }" name="${identificador}_${element.nombre_columna
                        }"  ${agregar_evento_onchange} class="form-control form-control-sm"  ${desactivados.includes(nomb_label)? 'disabled':''} >     
                                    </div>
                                    <small class="text-muted formulario__input-error text-danger">Seleccione una fecha</small>
                                </div>
            
                            </div>`;
                }
                else if (element.nombre_columna.includes('color')) {
                    cadena += `
                                        <input type="color" ${element.nobligatorio == 0 ? "required" : ""} id="${identificador}_${element.nombre_columna
                        }" name="${identificador}_${element.nombre_columna
                        }"  class="form-control form-control-sm"  ${desactivados.includes(nomb_label)? 'disabled':''} >     
                                    </div>
                                    <small class="text-muted formulario__input-error text-danger">Seleccione una fecha</small>
                                </div>
                            </div>`;

                }
                else if (element.nombre_columna.includes("email") || element.nombre_columna.includes("correo")) {
                    tvalidacion = '_email';
                    cadena += ` 
                                        <input placeholder="${element.nombre_columna
                            .replaceAll("id_", "")
                            .replaceAll("_", " ").toUpperCase()}" type="email" minlength="2" maxlength="${element.tipo == "nvarchar" ? element.capacidad / 2 : element.capacidad
                        }" ${element.nobligatorio == 0 ? "required" : ""} id="${identificador}_${element.nombre_columna
                        }_email" name="${identificador}_${element.nombre_columna
                        }"  class="form-control form-control-sm"  ${desactivados.includes(nomb_label)? 'disabled':''} >  
                
                                    </div>
                                    <small class="text-muted formulario__input-error text-danger"> Email Debe cumplir el formato XX..@dominio.XXX</small>
                                </div>
                            </div>`;
                }
                else if (element.tipo == "int" || element.tipo == "decimal") {
                    tvalidacion = '_number'; //int=10 digitos
                    cadena += `
                            <input placeholder="${element.nombre_columna
                            .replaceAll("id_", "")
                            .replaceAll("_", " ").toUpperCase()}" type="number"  ${element.tipo == "decimal" && !element.nombre_columna.includes("valor")? 'step="0.01"':''} 
                            ${element.nobligatorio == 0 ? "required" : ""} id="${identificador}_${element.nombre_columna
                        }${tvalidacion}" name="${identificador}_${element.nombre_columna
                        }"  class="form-control form-control-sm " value='0'  ${desactivados.includes(nomb_label)? 'disabled':''} >  
                
                                    </div>
                                    <small class="text-muted formulario__input-error text-danger">${element.tipo
                        } Tiene un limite de ${element.tipo == "nvarchar" ? element.capacidad / 2 : element.capacidad
                        } Caracteres</small>
                                </div>
                        </div>`;
                }
                else if(element.tipo == "text" ){
                

                    tvalidacion = '_text';
                
                    cadena += `
                    <textarea ${element.nobligatorio == 0 ? "required" : ""}
                        placeholder="${element.nombre_columna
                            .replaceAll("id_", "")
                            .replaceAll("_", " ").toUpperCase()}"
                            ${desactivados.includes(nomb_label)? 'disabled':''} 
                            id="${identificador}_${element.nombre_columna}${tvalidacion}" 
                            name="${identificador}_${element.nombre_columna}"
                        
                        class="form-control form-control-sm" rows="3"></textarea>
                
                                    </div>
                                    <small class="text-muted formulario__input-error text-danger">${element.tipo
                        } Tiene un limite de ${element.tipo == "nvarchar" ? element.capacidad / 2 : element.capacidad
                        } Caracteres</small>
                                </div>
                                
                            </div>`;
                }
                else {
                    tvalidacion = '_text';
                    if (element.nombre_columna.includes('_nombre') || element.nombre_columna.includes('_apellido')) {
                        tvalidacion = '_nomb';
                    } else if (element.nombre_columna.includes('direcci')) {
                        tvalidacion = '_dir';
                    } else if (element.nombre_columna.includes('document')) {
                        tvalidacion = '_doc';
                    }
                    cadena += `
                                    <input placeholder="${element.nombre_columna
                            .replaceAll("id_", "")
                            .replaceAll("_", " ").toUpperCase()}" type="${element.tipo
                        }" minlength="1" maxlength="${element.tipo == "nvarchar" ? element.capacidad / 2 : element.capacidad
                        }" ${element.nobligatorio == 0 ? "required" : ""} id="${identificador}_${element.nombre_columna
                        }${tvalidacion}" name="${identificador}_${element.nombre_columna
                        }"  class="form-control form-control-sm"  ${desactivados.includes(nomb_label)? 'disabled':''} >  
                
                                    </div>
                                    <small class="text-muted formulario__input-error text-danger">${element.tipo
                        } Tiene un limite de ${element.tipo == "nvarchar" ? element.capacidad / 2 : element.capacidad
                        } Caracteres</small>
                                </div>
                                
                            </div>`;
                }
                campos.push({
                    n_campo: element.nombre_columna,
                    id_select: `${identificador}_${element.nombre_columna}${tvalidacion}`,
                    requerido: element.nobligatorio
                });
            }

        });
    }else{
        console.log('error de configuracion verificar informacion de funcion')
    }
    //console.log({ cadena, seleccionables, campos });
    return { cadena, seleccionables, campos, checkbox }
}