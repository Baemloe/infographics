import {GridCreator} from "./gridCreate.js";
import {Unit, MoveUnit, ArrowUnit, Combiner} from "./units.js";
import {DraggableElement} from "./draggableElements.js";
import {Loader} from "./loader.js";
import {Popup} from "./popup.js";
class App
{
    static #grid;
    static #data;
    static sizes;
    static #move = new Map();
    static #draggage = new Map();
    static #dragField;
    static #arrows = [];
    static #combiners = [];
    static async initContinue(dataId)
    {
        try
        {
            
        document.getElementById("mainFrame").style.minHeight = document.documentElement.clientHeight - 2 + "px";
        document.getElementById("mainFrame").className = "flexCenter";
        document.body.style.margin = 0;
        this.#data = await Loader.loading(dataId);
        this.#grid = await CalcPosition.Calc(this.#data.size.x, this.#data.size.y, this.#data);
        this.sizes = this.#data.size; 
        await this.infosInit();
        document.getElementById("mainFrame").style.backgroundImage = "url(../static/backs/" + this.#data.colors.background + ".png)";
        for(let element in this.#data.elements)
        {
            switch(this.#data.elements[element].type)
            {
                case "static":
                    let un = new Unit(this.#data.elements[element], this.#grid);
                    await un.init(this.#data.elements[element]);
                    break;
                case "move":
                    let move = new MoveUnit(this.#data.elements[element], this.#grid);
                    this.#move.set(move.init(this.#data.elements[element]), move);
                    break;
                case "combiner":
                    this.#combiners.push(this.#data.elements[element]);
                    break;
                default:
                    this.#arrows.push(this.#data.elements[element]);
                    break;
            }
        }
        ArrowUnit.Factory(this.#arrows,this.#grid);
        Combiner.Factory(this.#combiners, this.#grid);
        await this.draggableInit();
        await this.buttonInit();
        }
        catch(exept)
        {
            console.log(exept);
        }
    }
    static async addChild(child, father)
    {
        let typo;
        try
        {
            typo = father.dataset.type;
        }
        catch
        {
            typo = undefined;
        }
        switch(typo)
        {
            case "moveField":
                
                if(this.#move.get(father).single === "true")
                {
                    await this.#move.get(father).addDraggage(this.#draggage.get(child));
                    this.#draggage.get(child).oneStyle();
                }
                else
                {
                    await this.#move.get(father).addDraggage(this.#draggage.get(child));
                    this.resizeChilds(await this.#move.get(father).resizeChilds());
                }
                break;
            case "dragChild":
                father = father.parentNode;
            case "draggage":
                father = father.parentNode;
                if(father.dataset.type == "moveField")
                {
                    if(this.#move.get(father).single === "false")
                    {
                        await this.#move.get(father).addDraggage(this.#draggage.get(child));
                        this.#draggage.get(child).manyStyle();
                        this.resizeChilds(await this.#move.get(father).resizeChilds());
                    }
                    else
                    {   
                        let fafch = father.firstChild;
                        this.#dragField.appendChild(fafch);
                        this.#draggage.get(fafch).defaultStyle();
                        await this.#move.get(father).addDraggage(this.#draggage.get(child));
                        this.#draggage.get(child).oneStyle();
                        break;
                    }
                }
                else if(father == this.#dragField)
                {
                    await this.#dragField.appendChild(child);
                    this.#draggage.get(child).defaultStyle();
                }
                break;
                default:
                await this.#dragField.appendChild(child);
                this.#draggage.get(child).defaultStyle();
                break;
        }
        document.onpointermove = null;
    }
    static async infosInit()
    {
        let nameField = document.createElement("DIV");
        nameField.classList.add("nameField");
        let name = document.createElement("H1");
        name.innerHTML = this.#data.infos.eomName;
        nameField.appendChild(name);
        this.#grid.parentNode.insertBefore(nameField, this.#grid);
        let cap = document.createElement("DIV");
        cap.className = "cap";
        cap.style = `border-top: 3px solid ${this.#data.colors.generalColor};`;
        let finger = document.createElement("IMG");
        finger.src = "../static/fingers/" + this.#data.colors.background + ".png";
        finger.style.float = "left";
        cap.appendChild(finger);
        let h3 = document.createElement("H3");
        h3.innerHTML = this.#data.infos.description;
        cap.appendChild(h3);
        let minih3 = document.createElement("H3");
        minih3.style.fontWeight = "500";
        minih3.style.fontSize = "1.3rem";
        if(this.#data.infos.miniText)
        {
        minih3.innerHTML = this.#data.infos.miniText;
        cap.appendChild(minih3);
        }
        this.#grid.parentNode.insertBefore(cap, this.#grid);
    }
    static shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
    }
    static async draggableInit()
    {
        this.#dragField = document.createElement("DIV");
        this.#dragField.className = "draggableField";
        this.#dragField.style.border = `2px solid ${this.#data.colors.generalColor}`;
        this.#grid.parentNode.appendChild(this.#dragField);
        App.shuffle(this.#data.draggable);
        for(let delement of this.#data.draggable)
        {
            let drag = new DraggableElement(delement, this.#data.colors, this.#dragField);
            this.#draggage.set(drag.element, drag);
        }
    }
    static async buttonInit()
    {
        let button = document.createElement("BUTTON");
        button.innerText = "Проверить";
        button.style.background = this.#data.colors.gradient;
        button.style.color = "white";
        button.style.boxShadow = "0 0 0 0";
        button.style.border = "0";
        button.style.transform = "scale(1.3, 1.3)";
        button.style.marginBottom = "13px";
        button.style.boxSizing = "border-box";
        button.onmouseover = ()=>
        {
            button.style.background = "white";
            button.style.color = this.#data.colors.generalColor;
            button.style.border = `1px solid ${this.#data.colors.generalColor}`;
        }
        button.onmouseout = ()=>
        {
            button.style.background = this.#data.colors.gradient;
            button.style.color = "white";
            button.style.border = "0";
        }
        button.onclick = ()=>{
            let result = true;
            for(let mmm of this.#move.keys())
            {
                let fieldId = "#" + mmm.dataset.id;
                for(let child of mmm.childNodes)
                {
                    if(this.#draggage.get(child).fatherId !== fieldId)
                    {
                        result = false;
                        break;
                    }
                }
            }
            if(result)
            {
                for(let noneDrags of this.#dragField.childNodes)
                {
                    if(this.#draggage.get(noneDrags).fatherId !== "destructor")
                    {
                        result = false;
                        break;
                    }
                }
            }
            this.showResults(result);
        };
        this.#grid.parentNode.appendChild(button);
    }
    static removeGrid(element)
    {
        if(element.dataset.type == "moveField" && this.#move.get(element).single === "false")
        {
            this.#move.get(element).sizeHandler();
        }
    }
    static showResults(result)
    {
        
        let p = document.createElement("P");
        p.innerText = result == true? `Вс${this.#data.colors.background == "green"? "ё": "е"} верно! Молодец!`: `Повтори эту тему и попробуй ещ${this.#data.colors.background == "green"? "ё": "е"} раз!`;
        p.style.color = "white";
        p.style.fontSize = "17pt";
        let img = document.createElement("IMG");
        img.src = "../static/cats/" + result + ".png";
        img.style.maxWidth = "7vw";
        img.style.marginLeft = "4vw";
        for(let m of this.#move)
        {
            m[0].style.border = `2px solid ${result?"#8CDD24":"#F83A3A"}`;
        }
        let pop = new Popup([p, img], `display: flex; justify-content: space-around; background: ${this.#data.colors.gradient}`);
    }
    static async changeColor(turn = true)
    {
        for(let oneMove of this.#move)
        {
            if(turn)
            {
                oneMove[0].style.background = "";
                oneMove[0].className += " " + this.#data.colors.background;
            }
            else
            {
                oneMove[0].style.background = "white";
                oneMove[0].className = "unit"
            }
        }
    }
    static resizeChilds(childs)
    {
        for(let child of childs)
        {
            this.#draggage.get(child).manyStyle();
        }
    }
}
class CalcPosition
{
    static async Calc(x, y)
    {
        let gc = new GridCreator();
        let grid = await gc.cr(x, y);
        document.getElementById("mainFrame").innerHTML = null;
        document.getElementById("mainFrame").appendChild(grid);
        grid.style.width = this.clc(grid.clientWidth, y) + "px";
        let hgh = grid.clientWidth * 0.562857142857;
        grid.style.height = this.clc(hgh, x) + "px";
        gc.updateToPixels(grid);
        return grid;
    }
    static clc(length, count)
    {
        let newLlength = length - (length % count);
        return newLlength;
    }
}
export {App}