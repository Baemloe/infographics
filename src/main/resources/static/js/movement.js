import { sendRequest } from "./request.js";
import { createElement } from "./elementCreator.js";
import { MoveUnit } from "./unit.js";
import {Tools} from "./toolsPanel.js";
class MovementElement
{
    static count = 0;
    static allMovements = [];
    id;
    fatherId;
    single;
    content = {
        text: null,
        pic: null
    }
    htmlElements = {
        element: null, 
        tarea: null, 
        picture: null, 
        img: null,
        single: null, 
        list: null,
        saveButton: null
    }
    constructor(obj, load = false)
    {
        this.#createElement();
        if(load)
        {
            this.loadingFromObj(obj);
            this.htmlElements.saveButton.onclick = this.update.bind(this);
        }
        else
        {
            this.htmlElements.saveButton.onclick = this.save.bind(this);
            this.#notSaved();
        }
        this.htmlElements.saveButton.addEventListener("click", this.#saved.bind(this));
        this.htmlElements.tarea.addEventListener("input", this.#notSaved.bind(this));
        this.htmlElements.picture.addEventListener("change", this.#notSaved.bind(this));
        this.htmlElements.list.addEventListener("change", this.#notSaved.bind(this));
    }
    #createElement()
    {
        this.htmlElements.element = createElement("DIV", "draggableElement");
        let inputs = createElement("DIV");
        inputs.style.display = "flex";
        inputs.style.flexDirection = "column";
        this.htmlElements.tarea = createElement("TEXTAREA");
        inputs.appendChild(this.htmlElements.tarea);
        this.htmlElements.picture = createElement("INPUT", null, null,"max-width:200px;");
        this.htmlElements.picture.type = "file";
        this.htmlElements.picture.accept = "image/png, image/jpeg, image/svg+xml";
        inputs.appendChild(this.htmlElements.picture);
        this.htmlElements.element.appendChild(inputs);
        this.htmlElements.img = createElement("IMG", null, null, "max-width: 100px; max-height: 90%;");
        this.htmlElements.element.appendChild(this.htmlElements.img);
        this.htmlElements.picture.addEventListener("change", (e)=>{
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.onload = (e)=>{
                this.htmlElements.img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
        this.htmlElements.list = createElement("select");
        this.htmlElements.list.appendChild(createElement("OPTION", null, "destructor"));
        for(let one of Tools.storage)
        {
            if(one instanceof MoveUnit)
            {
                this.htmlElements.list.appendChild(createElement("OPTION", null, "#" + one.number));
            }
        }
        this.htmlElements.element.appendChild(this.htmlElements.list);
        this.htmlElements.saveButton = createElement("BUTTON", null, "Сохранить", null);
        this.htmlElements.element.appendChild(this.htmlElements.saveButton);
        this.htmlElements.element.appendChild(createElement("BUTTON", null, "Удалить", null, (e)=>{
            e.target.parentNode.parentNode.removeChild(e.target.parentNode);
            MovementElement.allMovements.splice(MovementElement.allMovements.indexOf(this), 1);
            this.writeElements();
        }));
        document.getElementById("insideMainDivFlex").insertBefore(this.htmlElements.element, document.getElementById("addButton"));
    }
    async save()
    {
        this.content.text = this.htmlElements.tarea.value;
        this.fatherId = this.htmlElements.list.value;
        MovementElement.allMovements.push(this);
        this.htmlElements.saveButton.onclick = this.update.bind(this);
        if(this.htmlElements.picture.files.length > 0)
        {
            await this.asyncInit(this.htmlElements.picture.files[0]);
        }
        this.writeElements();
        localStorage.setItem("lastChange", new Date());  
    }
    async update()
    {
        this.content.text = this.htmlElements.tarea.value;
        this.fatherId = this.htmlElements.list.value;
        if(this.htmlElements.picture.files.length > 0)
        {
            await this.asyncInit(this.htmlElements.picture.files[0]);
        }
        this.writeElements();  
        localStorage.setItem("lastChange", new Date());
    }
    loadingFromObj(obj)
    {
        this.content.text = obj.content.text;
        this.content.pic = obj.content.pic;
        this.fatherId = obj.fatherId;
        this.htmlElements.tarea.value = this.content.text;
        for(let selected of this.htmlElements.list.options)
        {
            if(selected.text == obj.fatherId)
            {
                selected.selected = true;
                break;
            }
        }
        if(this.content.pic != null)
        {
            if(this.content.pic.includes(".svg"))
            {
                async function e(name, img){
                    let req = await fetch("/getimage/"+ name);
                    let file = await req.text();
                    let url = btoa(file);
                    img.src = 'data:image/svg+xml;base64,' + url;
                    };
                e(this.content.pic, this.htmlElements.img);
                }
            else
            {
                this.htmlElements.img.src = "/getimage/"+ this.content.pic;
            }
        }
    }
    writeElements()
    {
        localStorage.setItem("draggable", JSON.stringify(MovementElement.allMovements));
    }
    #notSaved()
    {
        this.htmlElements.element.style.border = "thick double #6c5e62";
    }
    #saved()
    {
        this.htmlElements.element.style.border = null;
    }
    async asyncInit(pic)
    {
        let fDat = new FormData();
        fDat.append("file", pic);
        let imgid =  await sendRequest("/image/" + localStorage.getItem("id"), "POST", fDat);
        this.content.pic = imgid;
    }
    static loadDraggable()
    {
        if(localStorage.getItem("draggable") != "null" && localStorage.getItem("draggable") != null)
        {
            MovementElement.allMovements = JSON.parse(localStorage.getItem("draggable"));
            let newArray = [];
            for(let i of MovementElement.allMovements)
            {
                let unit = new MovementElement(i, true);
                newArray.push(unit);
            }
            MovementElement.allMovements = newArray;
        }
    }
}
export {MovementElement}