export class prueba {//cSpell:disable -->

    _urlp = "";
    constructor(url) {
        this._urlp = url + "base/";
    }
   

    async tipos_documento() {
        let user = {
            campo: "mae_pais",
        };
        let response = await fetch(
            `${urlback}base/select_data`, {
            method: "POST",
            headers: { Authorization: localStorage.getItem("info_app") },
            body: JSON.stringify(user),
        }
        );
        let result = await response.json();
        return result;
    }
    async tipos_documento2() {
        let response = await fetch(`https://zthor.alwaysdata.net/agenda/php/base`, {
            method: 'GET',
        }); let result = await response.json();
        return result;
    }

   


}