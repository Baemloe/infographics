import { createElement } from "./elementCreator.js";
class AddInfo
{
    static statusof = false;
    eomName;
    description;
    miniText;
    text_block = 
    {
        position: null,
        text: null,
        picture: null,
        text_location: null
    }
    #data = {
        name: null,
        desc: null,
        minis: null
    }
    constructor(window)
    {
        this.#createForm(window);
        this.#load();
    }
    #createForm(window)
    {
        let namelabel = createElement("LABEL");
        namelabel.innerText = "Название ЭОМа:";
        this.#data.name = createElement("INPUT", "infos");
        this.#data.desc = createElement("TEXTAREA", "infos", null, "min-height: 150px;");
        this.#data.minis = createElement("TEXTAREA", "infos", null, "min-height: 150px;");
        let descLabel = createElement("LABEL");
        window.appendChild(namelabel);
        window.appendChild(this.#data.name);
        descLabel.innerText = "Описание задания:";
        window.appendChild(descLabel);
        let miniLabel = createElement("LABEL");
        miniLabel.innerText = "Ниже описания мелкий текст:";
        window.appendChild(this.#data.desc);
        window.appendChild(miniLabel);
        window.appendChild(this.#data.minis);
        let save = createElement("BUTTON", null, "Сохранить", null, this.#write.bind(this));
        window.appendChild(save);
    }
    #write()
    {
        this.eomName = this.#data.name.value;
        this.description = this.#data.desc.value;
        this.miniText = this.#data.minis.value;
        this.#checks();
        localStorage.setItem("infos", JSON.stringify(this));
        document.body.removeChild(document.querySelector(".popUpBack"));
    }
    #load()
    {
        let data = JSON.parse(localStorage.getItem("infos"));
        if(data != null)
        {
            this.eomName = data.eomName;
            this.#data.name.value = this.eomName;
            this.description = data.description;
            this.#data.desc.value = this.description;
            if(data.miniText != undefined)
            {
                this.miniText = data.miniText;
                this.#data.minis.value = this.miniText;
            }
            this.#checks();
        }
    }
    static status()
    {
        this.check();
        return AddInfo.statusof;
    }
    static check()
    {
        if(this.eomName.length > 0 && this.description.length > 0)
        {
            AddInfo.status = true;
        }
        else
        {
            AddInfo.status = false;
        }
    }
    #checks()
    {
        if(this.eomName.length > 0 && this.description.length > 0)
        {
            AddInfo.status = true;
        }
        else
        {
            AddInfo.status = false;
        }
    }
}
export {AddInfo}