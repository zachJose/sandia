import { prueba } from './pruebas.class.js';//cSpell:disable -->
let container = [];
let dato = new prueba(urlback);
let tabla= [];
window.inicializacion_pruebas =  () => {
  container = document.getElementById('contenedor_pruebas');
  btn_pruebas.onclick = () => {
    ejecutarselect();//select y tabla
    btn_pruebas.remove();
    juii();//formulario
    vista();//html grid - listas ordenadas
    sortable_demo();
  }
};
const ejecutarselect=async ()=>{
  let tipos_documentos= await dato.tipos_documento();
  console.log(tipos_documentos);
  //select slimselect
  //documentacion en dist/js/slimselecter.js
  await slimselect_Ajax_Campos_especificos_filtrados('empleados', '#select_pruebas', "Seleccione un empleado", "primer_nombre,primer_apellido,documento,usuario",'estado', [0,1,2,3]);
  //select select2
  //documentacion en dist/js/selecter.js
  await selecter_Ajax_Campos_especificos_filtrados('empleados', '#select_prueba_2', "Seleccione un empleado", "primer_nombre,primer_apellido,documento,usuario",'estado', [0,1,2]);
  //tablas
  let conf_tabla = {
      campo: 'manuales_usuarios',
      id_or_class: `#tabla_pruebas`,
      descripcion: "manuales",
      columnas_ocultas: [],
      responsive_table: false,
      botones_table: true,
      multifiltro: false, 
      info: false,
      //campo_filt,
      //filt_cont,
      pageLength:4,
      largo_table: false,
      table_bordered:false
  };
   //documentacion en dist/js/tablesdata.js
  tabla = await tabla_json(conf_tabla);
}
const juii = async (formulario='formularioDemo') => {
  await slimselect_lib();
  let sd = await cont_formulario({
    maestro: 'contratos_cliente', excluidos: ['id_portafolio_med', 'periodo'],
    desactivados: ['estado', 'id_paciente']
  });
  document.getElementById(formulario).innerHTML += sd.cadena;
  sd.seleccionables.map(async function (num) {
    let nombre =
      num.n_campo.includes('municipio') || num.n_campo.includes('ciudad') ?
        'municipio' :
        num.n_campo.includes('sede') ?
          'sede'
          : num.n_campo.includes('departamento') ?
            'departamento'
            : num.n_campo;
    await slimselect_basico(nombre, '#' + num.id_select);
  });
}
const vista = (contess='contess')=>{
  let josn = [{ "id": 11, "nombre": "DESARROLLO", "logo_ruta": "../archivo/empresa/11/logo.png", "color2": "#33c922", "color1": "#363a3a" },
  { "id": 11, "nombre": "DESARROLLO", "logo_rutanombre_fdgfdvdf_df_fd_d_d_ffvdfvfd_fvfvdfv_dfvfdvdfv_dfvdf": "../archivo/empresa/11/logo.png", "color2": "#33c922", "color1": "#363a3a" }];
  document.getElementById(contess).innerHTML = json_html({ json: josn, col_sm: 12, col_md: 6, col_lg: 3, primMayus: true, titulo: 'Grid', border: false, text_break: true, abajo: true });
  document.getElementById(contess).innerHTML +='<hr>'
  document.getElementById(contess).innerHTML +=json_html_list({json:josn, abajo:false, titulo:'Lista Variable',abajo:true, ordenada: true});
}
const sortable_demo=async (sortablea='sortablea')=>{
  await pintar_sorttable_id ('programas', 'estado', '1', sortablea, true,'col-2', 'fas fa-list-ol')
}


