import {App} from "./app.js";
class Unit
{
    htmlUnit;
    constructor(obj, grid)
    {
        this.htmlUnit = document.createElement("DIV");
        this.htmlUnit.style = obj.style;
        this.htmlUnit.className = "unit";
        grid.appendChild(this.htmlUnit);
    }
    async init(obj)
    {
        if(obj.content.text != null && obj.content.text.length > 0)
        {
            let p = document.createElement("SPAN");
            p.style.marginLeft = "8px";
            p.style.marginRight = "8px";
            p.innerHTML = obj.content.text;
            this.htmlUnit.appendChild(p);
        }
        if(obj.content.pic != null)
        {
            let img = document.createElement("IMG");
            img.className = "imgs";
            if(obj.content.pic.includes(".svg"))
            {
                async function e(name){
                    let req = await fetch("/getimage/"+ name);
                    let file = await req.text();
                    let url = btoa(file);
                    img.src = 'data:image/svg+xml;base64,' + url;
                    };
                e(obj.content.pic);
                }
            else
            {
                img.src = "/getimage/"+ obj.content.pic;
            }
            this.htmlUnit.insertBefore(img, this.htmlUnit.firstChild);
        }
        setTimeout(this.resize.bind(this), 200);
    }
    resize()
    {
        switch(this.htmlUnit.childNodes.length)
        {   
            case 1:
                if(this.htmlUnit.firstChild.tagName === "SPAN")
                {
                    let maxSize = this.htmlUnit.clientWidth - (this.htmlUnit.clientWidth / 100 * 20);
                    if(this.htmlUnit.firstChild.clientWidth >= maxSize)
                    {
                        this.htmlUnit.firstChild.style.fontSize = maxSize / this.htmlUnit.firstChild.clientWidth * 100 + "%";
                    }
                    if(this.htmlUnit.firstChild.scrollHeight >= this.htmlUnit.clientHeight)
                    {
                            let perc = this.htmlUnit.clientHeight / this.htmlUnit.firstChild.scrollHeight * 100;
                            let fperc = this.htmlUnit.firstChild.style.fontSize.split("%");
                            let newFS = perc / 100 * fperc[0];
                            this.htmlUnit.firstChild.style.fontSize = newFS + "%";
                    }
                }
                else
                {
                    this.htmlUnit.firstChild.style.maxWidth = "95%";
                    this.htmlUnit.firstChild.style.maxHeight = "95%";
                }
                break;
            case  2:
                let genSize = 0;
                for(let child of this.htmlUnit.childNodes)
                {
                    if(child.tagName == "IMG")
                    {
                        child.style.maxHeight = "65%";
                        genSize += child.clientHeight;
                    }
                    if(child.tagName == "P")
                    {
                        let maxSize = this.htmlUnit.clientWidth - (this.htmlUnit.clientWidth / 100 * 20);
                        if(child.clientWidth >= maxSize)
                        {
                            child.style.fontSize = maxSize / child.clientWidth * 100 + "%";
                        }
                        genSize += child.clientHeight;
                    }
                    if((this.htmlUnit.clientHeight - (this.htmlUnit.clientHeight / 100 * 10)) <= genSize)
                    {
                        this.htmlUnit.querySelector("IMG").style.maxHeight = "50%";
                        if(this.htmlUnit.querySelector("P").scrollHeight >= this.htmlUnit.clientHeight / 2)
                        {
                            let perc = (this.htmlUnit.clientHeight / 2) / this.htmlUnit.querySelector("P").scrollHeight * 100;
                            let fperc = this.htmlUnit.querySelector("P").style.fontSize.split("%");
                            let newFS = perc / 100 * fperc[0];
                            this.htmlUnit.querySelector("P").style.fontSize = newFS + "%";
                        }
                    }
                }
                break;
        }
    }
}
class MoveUnit extends Unit
{
    draggage = [];
    single;
    columns;
    type;
    direction;
    constructor(obj, grid)
    {
        super(obj, grid);
    }
    init(obj)
    {
        this.single = obj.single.toString();
        this.htmlUnit.dataset.type = "moveField";
        if(this.single === "true")
        {
            this.htmlUnit.style.alignItems = "stretch"; 
            this.htmlUnit.style.boxSizing = "border-box";
        }
        else
        {
            this.htmlUnit.style.boxSizing = "border-box";
            this.htmlUnit.style.display = "grid";
            this.htmlUnit.style.gridTemplateColumns = this.htmlUnit.clientWidth + "px";//this.htmlUnit.getBoundingClientRect().width + "px";
            this.htmlUnit.style.gridTemplateRows = this.htmlUnit.clientHeight + "px";//this.htmlUnit.getBoundingClientRect().height + "px";
            //this.htmlUnit.style.placeItems = "center stretch";
            this.htmlUnit.style.alignItems = "stretch";
            this.htmlUnit.style.justifyItems = "stretch";
            this.htmlUnit.style.gap = "6px";

            this.typeFromSize();
        }
        this.htmlUnit.dataset.id = obj.content.text;
        return this.htmlUnit;
    }
    typeFromSize()
    {
        let fieldArea = App.sizes.x * App.sizes.y;
        let grids = this.htmlUnit.style.gridArea.split("/");
        let rows = grids[2] - grids[0];
        let cols = grids[3] - grids[1];
        let htmlArea = rows * cols;
        if(this.#calcPercent(htmlArea, fieldArea) > 20)
        {
            this.type = "horizontalBig";
        }
        else
        {
            let w = this.htmlUnit.getBoundingClientRect().width;
            let h = this.htmlUnit.getBoundingClientRect().height;
            let result;
            if(w >= h)
            {
                 result = this.#calcPercent(h, w);
                 if(result < 60)
                 {
                    this.type = "horizontalMini";
                 }
                 else
                 {
                    this.type = "horizontalClassic";
                 }
            }
            else
            {
                result = this.#calcPercent(w, h);
                this.htmlUnit.style.gridAutoFlow = "column";
                if(result < 60)
                 {
                    this.type = "verticalMini";
                 }
                 else
                 {
                    this.type = "verticalClassic";
                 }
            }
        }
        this.switchLocation();
    }
    async resizeChilds()
    {
        return this.htmlUnit.childNodes;
    }
    #calcPercent(min, max)
    {
        return min / max * 100;
    }
    twoCellStart(length)
    {
        return "repeat(2, " + (length  - 6) / 2 + "px)";
    }
    switchLocation()
    {
        switch(this.type)
        {
            case "horizontalBig":
                this.columns = 4;
                this.htmlUnit.style.gridTemplateColumns = this.twoCellStart(this.htmlUnit.clientWidth);
                break;
            case "horizontalMini":
                this.columns = 3;
                this.htmlUnit.style.gridTemplateColumns = this.twoCellStart(this.htmlUnit.clientWidth);
                break;
            case "horizontalClassic":
                this.columns = 3;
                this.htmlUnit.style.gridTemplateColumns = this.twoCellStart(this.htmlUnit.clientWidth);
                break;
            case "verticalMini":
                this.columns = 4;
                this.htmlUnit.style.gridTemplateRows = this.twoCellStart(this.htmlUnit.clientHeight);
                break;
            case "verticalClassic":
                this.columns = 5;
                this.htmlUnit.style.gridTemplateRows = this.twoCellStart(this.htmlUnit.clientHeight);
                break;
        }
    }
    addDraggage(child)
    {
        if(this.single === "false")
        {       
            this.htmlUnit.appendChild(child.element);
            this.sizeHandler();
        }
        else
        {
            this.htmlUnit.appendChild(child.element);
        }
    }
    sizeHandler()
    {
        if(this.htmlUnit.childNodes.length >= 2)
        {
            this.sizeController();
        }
        else
        {
            if(this.type.includes("horizont"))
            {
                this.htmlUnit.style.gridTemplateColumns = this.twoCellStart(this.htmlUnit.clientWidth);
            }
            else
            {
                this.htmlUnit.style.gridTemplateRows = this.twoCellStart(this.htmlUnit.clientHeight);
            }
        }
    }
    sizeController()
    {
        let newLength = this.htmlUnit.childNodes.length;
        let gapSize = 6 * (newLength - 1);
        if(this.type.includes("horizont"))
        {
            if(newLength <= this.columns)
            {
                this.htmlUnit.style.gridTemplateColumns = "repeat(" + newLength + "," + (this.htmlUnit.clientWidth - gapSize) / newLength + "px)";
                this.htmlUnit.style.gridTemplateRows = this.htmlUnit.clientHeight + "px";
            }
            else
            {
                let rowCount = Math.ceil(newLength / this.columns);
                this.htmlUnit.style.gridTemplateRows = "repeat(" + rowCount + "," + (this.htmlUnit.clientHeight - ((rowCount - 1) * 6)) / rowCount + "px)";
            }
        }
        else
        {
            if(newLength <= this.columns)
            {
                this.htmlUnit.style.gridTemplateRows = "repeat(" + newLength + "," + (this.htmlUnit.clientHeight - gapSize) / newLength + "px)";
                this.htmlUnit.style.gridTemplateColumns = this.htmlUnit.clientWidth + "px";
            }
            else
            {
                let colCount = Math.ceil(newLength / this.columns);
                this.htmlUnit.style.gridTemplateColumns = "repeat(" + colCount + "," + (this.htmlUnit.clientWidth - ((colCount - 1) * 6)) / colCount + "px)";
            }
        }
    }
}
class ArrowUnit extends Unit
{
    static Arrows = [];
    constructor(obj, grid)
    {
        super(obj, grid);
        
    }
    init(obj)
    {
        ArrowUnit.Arrows.push(this.htmlUnit);
        this.htmlUnit.style.zIndex = 250;
        this.htmlUnit.style.boxShadow = "0 0 0 0 transparent";
        let svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.setAttribute("width", this.htmlUnit.getBoundingClientRect().width);
        svg.setAttribute("height", this.htmlUnit.getBoundingClientRect().height);
        let line = document.createElementNS("http://www.w3.org/2000/svg","line")
        if(obj.type.includes("vertical"))
        {
            line.setAttribute('x1', Math.floor(this.htmlUnit.getBoundingClientRect().width / 2));
            line.setAttribute('y1', "0");
            line.setAttribute('x2', Math.floor(this.htmlUnit.getBoundingClientRect().width / 2));
            line.setAttribute('y2', Math.floor(this.htmlUnit.getBoundingClientRect().height));
            line.setAttribute('stroke', obj.content);
        }
        else
        {
            line.setAttribute('x1', '0');
            line.setAttribute('y1', Math.floor(this.htmlUnit.getBoundingClientRect().height / 2));
            line.setAttribute('x2', Math.floor(this.htmlUnit.getBoundingClientRect().width));
            line.setAttribute('y2', Math.floor(this.htmlUnit.getBoundingClientRect().height / 2));
            line.setAttribute('stroke', obj.content);
        }
        line.setAttribute('stroke-width', '2');
        line.style.zIndex = 250;    
        svg.appendChild(line);
        this.htmlUnit.appendChild(svg);
    }
    static Factory(arrowArr, grid)
    {
        for(let arrows of arrowArr)
        {
            let aun = new ArrowUnit(arrows, grid);
            aun.init(arrows);
        }
    }
}
class Combiner extends Unit
{
    static Combiners = [];
    constructor(obj, grid)
    {
        super(obj, grid);
    }
    init(obj)
    {
        Combiner.Combiners.push(this.htmlUnit);
        this.htmlUnit.style.zIndex = 250;
        this.htmlUnit.style.boxShadow = "0 0 0 0 transparent";
        this.htmlUnit.style.width = this.htmlUnit.getBoundingClientRect().width + "px";
        this.htmlUnit.style.height = this.htmlUnit.getBoundingClientRect().height + "px";
        this.htmlUnit.style.overflow = "hidden";
        let svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.setAttribute("width", this.htmlUnit.getBoundingClientRect().width);
        svg.setAttribute("height", this.htmlUnit.getBoundingClientRect().height);
        if(obj.content.top)
        {
            let line = document.createElementNS("http://www.w3.org/2000/svg","line");
            line.setAttribute('x1', Math.floor(this.htmlUnit.getBoundingClientRect().width / 2));
            line.setAttribute('y1', "0");
            line.setAttribute('x2', Math.floor(this.htmlUnit.getBoundingClientRect().width / 2));
            line.setAttribute('y2', Math.floor(this.htmlUnit.getBoundingClientRect().height / 2));
            line.setAttribute('stroke', obj.color);
            line.setAttribute('stroke-width', '2');
            line.style.zIndex = 250;
            svg.appendChild(line);
        }
        if(obj.content.right)
        {
            let line = document.createElementNS("http://www.w3.org/2000/svg","line");
            line.setAttribute('x1', Math.floor(this.htmlUnit.getBoundingClientRect().width / 2));
            line.setAttribute('y1', Math.floor(this.htmlUnit.getBoundingClientRect().height / 2));
            line.setAttribute('x2', Math.floor(this.htmlUnit.getBoundingClientRect().width + 1));
            line.setAttribute('y2', Math.floor(this.htmlUnit.getBoundingClientRect().height / 2));
            line.setAttribute('stroke', obj.color);
            line.setAttribute('stroke-width', '2');
            line.style.zIndex = 250;
            svg.appendChild(line);
        }
        if(obj.content.bottom)
        {
            let line = document.createElementNS("http://www.w3.org/2000/svg","line");
            line.setAttribute('x1', Math.floor(this.htmlUnit.getBoundingClientRect().width / 2));
            line.setAttribute('y1', Math.floor(this.htmlUnit.getBoundingClientRect().height / 2));
            line.setAttribute('x2', Math.floor(this.htmlUnit.getBoundingClientRect().width / 2));
            line.setAttribute('y2', Math.floor(this.htmlUnit.getBoundingClientRect().height + 1));
            line.setAttribute('stroke', obj.color);
            line.setAttribute('stroke-width', '2');
            line.style.zIndex = 250;
            svg.appendChild(line);
        }
        if(obj.content.left)
        {
            let line = document.createElementNS("http://www.w3.org/2000/svg","line");
            line.setAttribute('x1', "0");
            line.setAttribute('y1', Math.floor(this.htmlUnit.getBoundingClientRect().height / 2));
            line.setAttribute('x2', Math.floor(this.htmlUnit.getBoundingClientRect().width / 2));
            line.setAttribute('y2', Math.floor(this.htmlUnit.getBoundingClientRect().height / 2));
            line.setAttribute('stroke', obj.color);
            line.setAttribute('stroke-width', '2');
            line.style.zIndex = 250;
            svg.appendChild(line);
        }
        this.htmlUnit.appendChild(svg);
    }
    static Factory(combArr, grid)
    {
        for(let combines of combArr)
        {
            let cmb = new Combiner(combines, grid);
            cmb.init(combines);
        }
    }
}
export{Unit, MoveUnit, ArrowUnit, Combiner}