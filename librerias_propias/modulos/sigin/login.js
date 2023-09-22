window.init_login=async()=>{
    console.log('entro')
    localStorage.info?location.href = './accion.html':'';
    if (typeof Sweetalert2 !== 'function') {
        let link = document.createElement("link");
        link.href = `./librerias/sweetalert2/sweetalert2_theme-bootstrap-4_bootstrap-4.css`; link.rel = "stylesheet";
        document.head.appendChild(link);
        await import("../../../librerias/sweetalert2/sweetalert2.all.min.js");
    }
    login();
}
const fuente_extraña = (string_c) => {
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
const convertir_form_json_normaltext = (formData) => {
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

const login=(Texto="🅱🅸🅴🅽🆅🅴🅽🅸🅳🅾")=>{
    let cadena=Texto.toLowerCase()=='taller'?
            `<span><i class="animate__animated animate__wobble animate__infinite fas fa-wrench"></i></span>
            <span><i class="animate__animated animate__tada animate__infinite fas fa-toolbox"></i></span>`:
            Texto.toLowerCase()=='tienda'?
            `
            <span class="animate__animated animate__wobble animate__infinite">🥫</span>
            <span class="animate__animated animate__tada animate__infinite">🥕</span>
            `
            :
            ``
            Sweetalert2.fire(
                {
                    title:`
                    <div class="d-flex justify-content-end social_icon">
                    <span class="animate__animated animate__jello">
                    ${fuente_extraña(Texto)}
                    </span>
                    ${cadena}
                    </div> `,
                    showCancelButton: false,
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                    allowOutsideClick: false,
                    backdrop:false,
                    html:`<form id="formulario_login">
                            <div class="form-floating mb-3">
                                <input type="text" required  class="form-control form-control-sm" id="floatingInput" name="usuario" placeholder="Nombre de usuario">
                                <label for="floatingInput">Nombre de Usuario</label>
                            </div>
                            <div class="form-floating mb-4">
                                <input type="password" required class="form-control form-control-sm" id="floatingPassword" name='password'
                                    placeholder="Password">
                                <label for="floatingPassword">Contraseña</label>
                            </div>
                        </form>`,
                        didOpen: () => {
                           
                        },
                        preConfirm: async () => {
                            if(formulario_login.reportValidity()){
                                let formulario= convertir_form_json_normaltext (new FormData(formulario_login));
                                let response = await fetch('../sand/inicio/seguridad/logueate', {
                                method: 'POST',
                                headers: { 'Authorization': localStorage.getItem('info') , 'Sede-Select': sessionStorage.getItem('id_sede')},
                                body: JSON.stringify(formulario)
                                });
                                let result = await response.json();
                                if(result.codigo==0){
                                    return (result);
                                }else{
                                    Sweetalert2.showValidationMessage(
                                        result.messages
                                      )
                                }
                            }else{
                                Sweetalert2.showValidationMessage(
                                    `Faltan Campos`
                                  )
                            }
                        }
                }
            ).then((result) => {
                if (result.isConfirmed) {
                    localStorage.info=result.value.Token;
                    location.href ='./accion.html';
                }
              })
}