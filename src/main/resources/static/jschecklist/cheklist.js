import { Popup } from "../js/popup.js";
import { WsGrid } from "./wsgrid.js";
class Checklist
{
    #frame;
    #nameField;
    #cap;
    #workSpace;
    #colors; 
    #name;
    #id;
    constructor()
    {
        this.#frame = document.querySelector(".flexCenter");
        this.#nameField = document.querySelector(".nameField");
        this.#nameField.classList.add("show");
        this.#cap = document.querySelector(".cap");
        this.#cap.classList.add("show");
        this.#nameField.onclick = this.newText;
        this.#cap.onclick = this.newText;
        this.#createWorkSpace();
    }
    setName(text)
    {
        this.#name = text;
    }
    getName()
    {
        return this.#name;
    }
    setId(id)
    {
        this.#id = id;
    }
    changeColor(color)
    {
        this.#frame.style.background = `url(../static/backs/${color.picture}.png)`;
        this.#cap.querySelector("img").src = `../static/fingers/${color.picture}.png`;
        this.#cap.querySelector("img").id = "finger";
        this.#cap.style.borderTop = `3px solid ${color.rgb}`;
        this.#colors = color;
        WsGrid.update(null, color);
    }
    #createWorkSpace()
    {
        this.#workSpace = document.createElement("DIV");
        this.#workSpace.className = "workSpace";
        let button = document.createElement("BUTTON");
        button.innerText = "Добавить";
        button.onclick = this.#addString.bind(this);
        button.style.marginBottom = "100px";
        this.#workSpace.appendChild(button);
        WsGrid.update(this.#workSpace, null);
        this.#frame.appendChild(this.#workSpace);
    }
    #addString(e)
    {
        WsGrid.newGrid();
    }
    newText(e)
    {
        let clicked = e.target;
        if(clicked.tagName != "DIV")
        {
            while(clicked.tagName != "DIV")
            {
                clicked = clicked.parentNode;
            }
        }
        let content = clicked.querySelector("h1, h3, span");
        let flexContainer = document.createElement("DIV");
        flexContainer.style = "display:flex; flex-direction: column;";
        let tarea = document.createElement("TEXTAREA");
        tarea.style.minHeight = "150px";
        tarea.value = content.innerHTML;
        let saveButton = document.createElement("BUTTON");
        saveButton.innerText = "Сохрaнить";
        flexContainer.appendChild(tarea);
        flexContainer.appendChild(saveButton);
        let p = new Popup(flexContainer);
        tarea.focus();
        saveButton.onclick = ()=>{
            content.innerHTML = tarea.value;
            p.close();
        };
    }
    getData()
    {
        let grds = [];
        for(let g of WsGrid.allElements)
        {
            grds.push(g.grid.outerHTML);
        }
        let formdata = new FormData();
        if(Number.isInteger(this.#id))
        {
            formdata.append("id", this.#id);
        }
        formdata.append("eomCode", this.#name);
        formdata.append("nameBlock", this.#nameField.outerHTML);
        formdata.append("cap", this.#cap.outerHTML);
        formdata.append("grids", grds);
        formdata.append("colors", JSON.stringify(this.#colors));
        return formdata;
    }
    setData(loadedObject)
    {
        this.#nameField.outerHTML = loadedObject.nameBlock;
        this.#cap.outerHTML = loadedObject.cap;
        this.#colors = JSON.parse(loadedObject.colors);
        WsGrid.loadGrids(loadedObject.grids);
        this.#id = loadedObject.id;
        this.#name = loadedObject.eomCode;
        this.#nameField = document.querySelector(".nameField");
        this.#nameField.onclick = this.newText;
        this.#cap = document.querySelector(".cap");
        this.#cap.onclick = this.newText;
    }
}
export {Checklist}