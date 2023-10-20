import {Popup} from "../js/popup.js";
import { createElement } from "./elementCreator.js";
import { sendRequest } from "./request.js";
import { Tools } from "./toolsPanel.js";
class UnitFather
{
    htmlElement;
    style;
    grid;
    content = {text: null, pic: null};
    constructor(element, style)
    {
        this.htmlElement = element;
        this.style = style;
        this.htmlElement.className = "unit";
        document.querySelector(".generalGrid").appendChild(this.htmlElement);
        this.htmlElement.style = style;
        this.grid = this.htmlElement.style.gridArea;
    }
    deleteButt()
    {
        this.htmlElement.innerHTML = null;
        let dBut = document.createElement("button");
        dBut.innerText = "Удалить";
        dBut.onclick = this.#deleteBlock.bind(this);
        this.htmlElement.appendChild(dBut);
    }
    #deleteBlock(e)
    {
        Tools.StorageDeleter(e.target.parentNode);
        this.#localStorageDeleter();
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    }
    localStorageUpdater()
    {
        let fromStorMap = new Map(Object.entries(JSON.parse(localStorage.getItem("elements"))));
        fromStorMap.set(this.grid, this.getWriteObject());
        localStorage.setItem("elements", JSON.stringify(Object.fromEntries(fromStorMap)));
        localStorage.setItem("lastChange", new Date());
    }
    getWriteObject(){}
    #localStorageDeleter()
    {
        let fromStorMap = new Map(Object.entries(JSON.parse(localStorage.getItem("elements"))));
        fromStorMap.delete(this.grid);
        localStorage.setItem("elements", JSON.stringify(Object.fromEntries(fromStorMap)));
        localStorage.setItem("lastChange", new Date());
    }
}
class StaticUnit extends UnitFather
{
    getWriteObject()
    {
        let obj = {
            type: "static",
            style: this.style,
            grid: this.grid,
            content: this.content
        };
        return obj;
    }
    contentInside()
    {
        this.htmlElement.innerHTML = null;
        let cBut = document.createElement("button");
        cBut.innerText = "Заполнить контентом";
        cBut.onclick = ()=>{new Popup(this.#createForm());};
        this.htmlElement.appendChild(cBut);
    }
    showContent(inner)
    {
        this.htmlElement.innerHTML = null;
        if(inner != null)
        {
            this.content = inner;
        }
        if(this.content.pic != null){
                let imgg = document.createElement("IMG");
                if(this.content.pic.includes(".svg"))
                {
                    async function e(name){
                        let req = await fetch("/getimage/"+ name);
                        let file = await req.text();
                        let url = btoa(file);
                        imgg.src = 'data:image/svg+xml;base64,' + url;
                    };
                    e(this.content.pic);
                }
                else
                {
                    imgg.src = "/getimage/"+ this.content.pic;
                }
                imgg.className = "insideImg";
                this.htmlElement.appendChild(imgg);
        }
        if(this.content.text != null && this.content.text.length > 0)
        {
            let p = document.createElement("SPAN");
            p.innerHTML = this.content.text;
            this.htmlElement.appendChild(p);
        }  
        this.resize();
    }
    resize()
    {
        switch(this.htmlElement.childNodes.length)
        {
            case 1:
                if(this.htmlElement.firstChild.tagName === "SPAN")
                {
                    let maxSize = this.htmlElement.clientWidth - (this.htmlElement.clientWidth / 100 * 20);
                    if(this.htmlElement.firstChild.clientWidth >= maxSize)
                    {
                        this.htmlElement.firstChild.style.fontSize = maxSize / this.htmlElement.firstChild.clientWidth * 100 + "%";
                    }
                }
                else
                {
                    this.htmlElement.firstChild.style.maxWidth = "95%";
                    this.htmlElement.firstChild.style.maxHeight = "95%";
                }
                break;
            case  2:
                let genSize = 0;
                for(let child of this.htmlElement.childNodes)
                {
                    
                    if(child.tagName == "IMG")
                    {
                        child.style.maxHeight = "65%";
                        genSize += child.clientHeight;
                    }
                    if(child.tagName == "SPAN")
                    {
                        if(child.clientHeight >= this.htmlElement.clientHeight / 100 * 40)
                        {
                            let maxHeight = this.htmlElement.clientHeight / 100 * 40;
                            child.style.fontSize = maxHeight / child.clientHeight * 100 + "%";
                            child.style.margin = "1px";
                        }
                        let maxSize = this.htmlElement.clientWidth - (this.htmlElement.clientWidth / 100 * 20);
                        if(child.clientWidth >= maxSize)
                        {
                            child.style.fontSize = maxSize / child.clientWidth * 100 + "%";
                        }
                        genSize += child.clientHeight;
                    }
                    if((this.htmlElement.clientHeight - (this.htmlElement.clientHeight / 100 * 50)) <= genSize)
                    {
                        this.htmlElement.querySelector("IMG").style.maxHeight = "50%";
                        this.htmlElement.querySelector("SPAN").className = "insideP";
                    }
                }
                break;
        }
    }
    #createForm()
    {
        let input = document.createElement("TEXTAREA");
        input.id = "tField";
        input.style.minWidth = "250px";
        let picInp = document.createElement("input");
        picInp.id = "picField";
        picInp.type = "file";
        picInp.accept = "image/png, image/jpeg, image/svg+xml";
        picInp.style.minWidth = "250px";
        let img = document.createElement("IMG");
        img.style.width = "100px";
        img.id = "prevImg";
        picInp.addEventListener("change", (e)=>{
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.onload = (e)=>{
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
        let deletePicButton = document.createElement("button");
        deletePicButton.innerText = "Удалить картинку";
        deletePicButton.onclick = ()=>
        {
            this.content.pic = null;
            img.src = "";
        }
        let subm = document.createElement("BUTTON");
        subm.innerText = "Сохранить";
        subm.onclick = this.#writeContent.bind(this);
        let back = document.createElement("DIV");
        back.style = "display:flex; align-items:center; justify-content: center; flex-direction: column;";
        back.appendChild(input);
        if(this.content.text != null && this.content.text != "")
        {
            input.value = this.content.text;
        }
        back.appendChild(document.createElement("BR"));
        back.appendChild(picInp);
        back.appendChild(document.createElement("BR"));
        back.appendChild(img);
        back.appendChild(document.createElement("BR"));
        back.appendChild(deletePicButton);
        if(this.content.pic != null)
        {
            img.src = "/getimage/" + this.content.pic;
        }
        back.appendChild(document.createElement("BR"));
        back.appendChild(subm);
        return back;
    };
    async #writeContent()
    {

        this.content.text = document.getElementById("tField").value;
        if(document.getElementById("picField").value != "")
        {
            let file = document.getElementById("picField").files[0];
            let fDat = new FormData();
            fDat.append("file", file);
            this.content.pic = await sendRequest("/image/" + localStorage.getItem("id"), "POST", fDat);        
        }
        super.localStorageUpdater();
        this.showContent();
        document.body.removeChild(document.querySelector(".popUpBack"));
    }
}
class MoveUnit extends UnitFather
{
    static moveCount = 0;
    number;
    single = true;
    constructor(element, style, content, single = null)
    {
        super(element, style);
        if(content == null)
        {
            MoveUnit.moveCount++;
            this.content.text = MoveUnit.moveCount;
        }
        else
        {
            this.content.text = content.text;
            MoveUnit.moveCount = this.content.text;
        }
        if(single != null)
        {
            this.single = single;
        }
        this.number = this.content.text;
        this.showContent();
    }
    getWriteObject()
    {
        let obj = {
            type: "move",
            style: this.style,
            grid: this.grid,
            content: this.content,
            single: this.single
        };
        return obj;
    }
    contentInside(){}
    showContent()
    {
        this.htmlElement.innerHTML = "#"+ this.number;
        let single = createElement("SELECT", null, null, null);
        let tr = createElement("OPTION", null, "одиночный", null);
        tr.value = true;
        let fls = createElement("OPTION", null, "множественный", null);
        fls.value = false;
        single.appendChild(tr);
        single.appendChild(fls);
        this.htmlElement.appendChild(single);
        single.style.maxWidth = this.htmlElement.offsetWidth - (this.htmlElement.offsetWidth / 100 * 20) + "px";
        single.onchange = ()=>{this.single = single.value; super.localStorageUpdater();};
        if(this.single != null)
        {
            single.value = this.single;
        }
    }
}
class ArrowUnit extends UnitFather
{
    direction;
    constructor(element, style, direction)
    {
        super(element, style);
        this.direction = direction;
        let w = this.htmlElement.getBoundingClientRect().width;
        let h = this.htmlElement.getBoundingClientRect().height;
        this.#paintLine(direction);
    }
    getWriteObject()
    {
        let obj = {
            type: "arrow_" + this.direction,
            style: this.style,
            grid: this.grid,
            content: JSON.parse(localStorage.getItem("colors")).secondColor
        };
        return obj;
    }
    contentInside(){this.htmlElement.innerHTML = null; this.#paintLine(this.direction);}
    showContent(){this.htmlElement.innerHTML = null; this.#paintLine(this.direction);}
    deleteButt()
    {
        super.deleteButt();
        this.htmlElement.firstChild.innerText = "";
        this.htmlElement.firstChild.style = "width: 100%; height: 100%; border: 1px solid red; background: rgba(255, 99, 71, 10); padding: 0;";//"padding: 0; font-size: 6pt; color: red; background: white;";
    }
    #paintLine(direction)
    {
        let svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.setAttribute("width", this.htmlElement.getBoundingClientRect().width);
        svg.setAttribute("height", this.htmlElement.getBoundingClientRect().height);
        let line = document.createElementNS("http://www.w3.org/2000/svg","line")
        if(direction == "horizontal")
        {
            line.setAttribute('x1', '0');
            line.setAttribute('y1', Math.floor(this.htmlElement.getBoundingClientRect().height / 2));
            line.setAttribute('x2', Math.floor(this.htmlElement.getBoundingClientRect().width));
            line.setAttribute('y2', Math.floor(this.htmlElement.getBoundingClientRect().height / 2));
            line.setAttribute('stroke', JSON.parse(localStorage.getItem("colors")).secondColor);
        }
        else
        {
            line.setAttribute('x1', Math.floor(this.htmlElement.getBoundingClientRect().width / 2));
            line.setAttribute('y1', "0");
            line.setAttribute('x2', Math.floor(this.htmlElement.getBoundingClientRect().width / 2));
            line.setAttribute('y2', Math.floor(this.htmlElement.getBoundingClientRect().height));
            line.setAttribute('stroke', JSON.parse(localStorage.getItem("colors")).secondColor);
        }
        line.setAttribute('stroke-width', '2');
        line.style.zIndex = 250;    
        svg.appendChild(line);
        this.htmlElement.appendChild(svg);
        this.content = this.htmlElement.innerHTML;
    }
}
class ArrowCombiner extends UnitFather
{
    coordinates = {
        top: false,
        left: false,
        right: false,
        bottom: false
    };
    constructor(element, style)
    {
        super(element,style);
        this.#checkSize(this.htmlElement.style.gridArea);
        this.#getCombineCoords();
    }
    #checkSize(grid)
    {
        let values = grid.split("/");
        if(values[2] > values[0] + 1 || values[2] < values[0])
        {
            values[2] = values[0] + 1;
        }
        if(values[3] > values[1] + 1 || values[3] < values[1])
        {
            values[3] = values[1] + 1;
        }
        this.htmlElement.style.gridArea = `${values[0]}/${values[1]}/${values[2]}/${values[3]}`;
    }
    contentInside(){this.htmlElement.innerHTML = null; this.#getCombineCoords();}
    showContent(){this.htmlElement.innerHTML = null; this.#getCombineCoords();}
    deleteButt()
    {
        super.deleteButt();
        this.htmlElement.firstChild.innerText = "";
        this.htmlElement.firstChild.style = "width: 100%; height: 100%; border: 1px solid red; background: rgba(255, 99, 71, 10); padding: 0;";
    }
    #getCombineCoords()
    {
        let val = this.htmlElement.style.gridArea.split("/");
        let toFind = {
            top: parseInt(val[0]),
            left: parseInt(val[1]),
            bottom: parseInt(val[2]),
            right: parseInt(val[3])
        };
        let elements = new Map(Object.entries(JSON.parse(localStorage.getItem("elements"))));
        for(let element of elements)
        {
            if(element[1].type.includes("arrow"))
            {
                let cells = element[0].split("/");
                    if(parseInt(cells[2]) == toFind.top)
                    {
                        if(parseInt(cells[1]) == toFind.left)
                        {
                        this.coordinates.top = true;
                        }
                    }
                    if(parseInt(cells[0]) == toFind.bottom)
                    {
                        if(parseInt(cells[1]) == toFind.left)
                        {
                        this.coordinates.bottom = true;
                        }
                    }
                    if(parseInt(cells[1]) == toFind.right)
                    {
                        if(parseInt(cells[0]) == toFind.top)
                        {
                        this.coordinates.right = true;
                        }
                    }
                    if(parseInt(cells[3]) == toFind.left)
                    {
                        if(parseInt(cells[0]) == toFind.top)
                        {
                        this.coordinates.left = true;
                        }
                    }
            }
        }
        this.#combine();
    }
    #combine()
    {
        this.htmlElement.style.width = this.htmlElement.getBoundingClientRect().width + "px";
        this.htmlElement.style.height = this.htmlElement.getBoundingClientRect().height + "px";
        this.htmlElement.style.overflow = "hidden";
        let svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.setAttribute("width", this.htmlElement.getBoundingClientRect().width);
        svg.setAttribute("height", this.htmlElement.getBoundingClientRect().height);
        if(this.coordinates.top)
        {
            let line = document.createElementNS("http://www.w3.org/2000/svg","line");
            line.setAttribute('x1', Math.floor(this.htmlElement.getBoundingClientRect().width / 2));
            line.setAttribute('y1', "0");
            line.setAttribute('x2', Math.floor(this.htmlElement.getBoundingClientRect().width / 2));
            line.setAttribute('y2', Math.floor(this.htmlElement.getBoundingClientRect().height / 2));
            line.setAttribute('stroke', JSON.parse(localStorage.getItem("colors")).secondColor);
            line.setAttribute('stroke-width', '2');
            line.style.zIndex = 250;
            svg.appendChild(line);
        }
        if(this.coordinates.right)
        {
            let line = document.createElementNS("http://www.w3.org/2000/svg","line");
            line.setAttribute('x1', Math.floor(this.htmlElement.getBoundingClientRect().width / 2));
            line.setAttribute('y1', Math.floor(this.htmlElement.getBoundingClientRect().height / 2));
            line.setAttribute('x2', Math.floor(this.htmlElement.getBoundingClientRect().width + 1));
            line.setAttribute('y2', Math.floor(this.htmlElement.getBoundingClientRect().height / 2));
            line.setAttribute('stroke', JSON.parse(localStorage.getItem("colors")).secondColor);
            line.setAttribute('stroke-width', '2');
            line.style.zIndex = 250;
            svg.appendChild(line);
        }
        if(this.coordinates.bottom)
        {
            let line = document.createElementNS("http://www.w3.org/2000/svg","line");
            line.setAttribute('x1', Math.floor(this.htmlElement.getBoundingClientRect().width / 2));
            line.setAttribute('y1', Math.floor(this.htmlElement.getBoundingClientRect().height / 2));
            line.setAttribute('x2', Math.floor(this.htmlElement.getBoundingClientRect().width / 2));
            line.setAttribute('y2', Math.floor(this.htmlElement.getBoundingClientRect().height + 1));
            line.setAttribute('stroke', JSON.parse(localStorage.getItem("colors")).secondColor);
            line.setAttribute('stroke-width', '2');
            line.style.zIndex = 250;
            svg.appendChild(line);
        }
        if(this.coordinates.left)
        {
            let line = document.createElementNS("http://www.w3.org/2000/svg","line");
            line.setAttribute('x1', "0");
            line.setAttribute('y1', Math.floor(this.htmlElement.getBoundingClientRect().height / 2));
            line.setAttribute('x2', Math.floor(this.htmlElement.getBoundingClientRect().width / 2));
            line.setAttribute('y2', Math.floor(this.htmlElement.getBoundingClientRect().height / 2));
            line.setAttribute('stroke', JSON.parse(localStorage.getItem("colors")).secondColor);
            line.setAttribute('stroke-width', '2');
            line.style.zIndex = 250;
            svg.appendChild(line);
        }
        this.htmlElement.appendChild(svg);
    }
    getWriteObject()
    {
        let obj = {
            type: "combiner",
            style: this.style,
            grid: this.grid,
            content: this.coordinates,
            color: JSON.parse(localStorage.getItem("colors")).secondColor
        };
        return obj;
    }
}

export {StaticUnit, MoveUnit, ArrowUnit, ArrowCombiner}