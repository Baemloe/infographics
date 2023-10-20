import { AddInfo } from "./information.js";
import { createElement } from "./elementCreator.js";
class Saver
{
    #openWind;
    #svButton;
    #playerButton;
    constructor(button = null)
    {
        if(button != null)
        {
            this.#openWind = button;
            let div = createElement("DIV", "saveBlock", null, "display:flex; flex-direction: column;");
            this.#svButton = createElement("BUTTON", null, "Скачать", null, this.save.bind(this));
            this.#playerButton = createElement("BUTTON", null, "Запустить в плеере", null, this.openToPlayer.bind(this));
            div.appendChild(this.#svButton);
            div.appendChild(this.#playerButton);
            document.body.appendChild(div);
        }
    }
    async autoSave()
    {
        let body = this.#createFormData();
        let req = await fetch("/saveeom", {method: "POST", body: body});
        let result = await req.text();
        return result;
    }
    async save(e)
    {
            let body = this.#createFormData();
            let req = await fetch("/saveeom", {method: "POST", body: body});
            let result = await req.text();
            let req2 = await fetch("/getzip/" + localStorage.getItem("id"));
            let url = URL.createObjectURL(await req2.blob());
            let a = document.createElement("a");
            a.href = url;
            a.download = localStorage.getItem("name") + ".zip";
            a.click();
            URL.revokeObjectURL(url);                
    }
    async openToPlayer()
    {
        await this.autoSave();
        location.href = "/player/" + localStorage.getItem("id");
    }
    #createFormData()
    {
        let fd = new FormData();
        fd.append("id", localStorage.getItem("id") == null? 0: localStorage.getItem("id"));    
        fd.append("size", localStorage.getItem("unit"));
        fd.append("colors", localStorage.getItem("colors"));
        fd.append("infos", localStorage.getItem("infos"));
        fd.append("elements", localStorage.getItem("elements"));
        fd.append("draggable", localStorage.getItem("draggable"));
        fd.append("name", localStorage.getItem("name"));
        return fd;
    }
}
export {Saver}