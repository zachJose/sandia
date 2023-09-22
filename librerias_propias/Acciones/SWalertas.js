window.swal_dinamico = async ({
    title = false,
    html = 'es requerida la variable HTML',
    confirmButtonText = 'Confirmar',
    cancelButtonText = 'Cancelar',
    showConfirmButton = true,
    showCancelButton = true,
    showCloseButton = true,
    confirmButtonColor = '#3085d6',
    cancelButtonColor = '#d33',
    position = 'center', //'top', 'top-start', 'top-end', 'center', 'center-start', 'center-end', 'bottom', 'bottom-start', or 'bottom-end'.
    didOpen = false,
    preConfirm = false,
    footer = false,
    width = 'auto',
    container_html=false
}) => {
    let configuracion={title, html, width,
        confirmButtonText,
        cancelButtonText,
        showConfirmButton,
        showCancelButton,
        showCloseButton,
        confirmButtonColor,
        cancelButtonColor,
        position, //'top', 'top-start', 'top-end', 'center', 'center-start', 'center-end', 'bottom', 'bottom-start', or 'bottom-end'.
        didOpen,
        preConfirm,
        footer}
        if(container_html){
            Reflect.set(configuracion,'customClass', {htmlContainer:'overflow-hidden'})
        }
        
    await Swal.fire(configuracion)
}