import {MoveUnit} from "./units.js";
import {App} from "./app.js";
class DraggableElement
{
    content = {
        text: null,
        pic: null
    }
    element;
    field;
    draggableField;
    fatherId;
    where = null;
    static animationId = null;
    constructor(obj, colors, draggableField)
    {
        this.fatherId = obj.fatherId;
        this.content = obj.content;
        this.element = document.createElement("DIV");
        this.element.className = "draggage";
        this.element.dataset.type = "draggage";
        this.element.style.border = `2px solid ${colors.generalColor}`;
        if(this.content.pic != null)
        {
            let img = document.createElement("IMG");
            if(this.content.pic.includes(".svg"))
            {
                async function e(name){
                    let req = await fetch("/getimage/"+ name);
                    let file = await req.text();
                    let url = btoa(file);
                    img.src = 'data:image/svg+xml;base64,' + url;
                    };
                e(this.content.pic);
                }
            else
            {
                img.src = "/getimage/"+ this.content.pic;
            }
            img.className = "imgs";
            img.dataset.type = "dragChild";
            img.style.maxHeight = this.content.text.length > 0? "40%": "90%";
            this.element.appendChild(img);
        }
        this.draggableField = draggableField;
        if(this.element.querySelector("img") != undefined && draggableField.childNodes.length > 0)
        {
            draggableField.insertBefore(this.element, draggableField.firstChild);
        }
        else
        {
            draggableField.appendChild(this.element);
        }
        if(this.content.text != "")
        {   
            let text = document.createElement("span");
            text.innerHTML = this.content.text;
            text.dataset.type = "dragChild";
            text.style.maxHeight = this.element.querySelector("img") != undefined? "60%": "90%";
            //text.classList.add("cutText");
            this.element.appendChild(text);
        }
        this.field = draggableField;
        this.addListener();
        this.defaultStyle();
    }
    pointUP(e)
    {
        window.cancelAnimationFrame(DraggableElement.animationId);
        DraggableElement.animationId = null;
        App.changeColor(false);
        this.element.style.display = "none";
        let field;
        if(!e.isTrusted)
        {
            field = null;
        }
        else
        {
            field = document.elementFromPoint(e.clientX, e.clientY);
        }
        if(field == this.draggableField)
        {
            if(this.element.querySelector("span") != undefined)
            {
                this.element.querySelector("span").style.fontSize = "100%";
            }
        }
        App.addChild(this.element, field);
        this.where = field;
        this.element.style.display = "";
    }
    static autoScrolling(e, inst)
    {
        window.scrollTo(0, window.scrollY - 5);
        if(DraggableElement.autoScrolling != null)
        {
            DraggableElement.animationId = window.requestAnimationFrame(()=>{DraggableElement.autoScrolling(e, inst);});
        }
    }
    move(e)
    {
        if(e.clientY < 150 && DraggableElement.animationId == null)
        {
            DraggableElement.animationId = window.requestAnimationFrame(()=>{DraggableElement.autoScrolling(e, this);});
        }
        else if(e.clientY > 150)
        {
            window.cancelAnimationFrame(DraggableElement.animationId);
            DraggableElement.animationId = null;
        }
        let left = e.pageX - this.element.offsetWidth / 2;
        let top = e.pageY - this.element.offsetHeight / 2;
        if(e.pageX > document.getElementById("mainFrame").getBoundingClientRect().width - this.element.offsetWidth / 2)
        {   
            document.onpointermove = null;
            this.element.dispatchEvent(new Event("pointerup"));
        }
        this.element.style.left = left + "px";
        this.element.style.top = top + "px";
    }
    down(e)
    {  
        App.changeColor();
        let pNode = this.element.parentNode;
        e.preventDefault();
        this.moveStyle();
        document.body.appendChild(this.element);
        App.removeGrid(pNode);
        this.move(e);
        document.onpointermove = this.move.bind(this);
        this.element.addEventListener("pointerup", this.pointUP.bind(this));
    }
    addListener()
    { 
        this.element.onpointerdown = this.down.bind(this);
    }
    defaultStyle()
    {
        this.element.style.position = "";
        this.element.style.boxSizing = "";
        this.element.style.left = "";
        this.element.style.top = "";
        this.element.style.width = "";
        this.element.style.maxWidth = "200px";
        this.element.style.maxHeight = "";
        this.element.style.height = "";
        this.element.style.fontSize = "";
        this.resize();
    }
    oneStyle()
    {
        this.element.style.position = "";
        this.element.style.boxSizing = "border-box";
        this.element.style.left = "";
        this.element.style.top = "";
        this.element.style.width = "100%";
        this.element.style.maxWidth = "";
        this.element.style.maxHeight = "";
        this.element.style.height = "100%";
        this.element.style.fontSize = "";
        this.resize();
    }
    async manyStyle()
    {
        this.element.style.width = "";
        this.element.style.height = "";
        this.element.style.position = "";
        this.element.style.left = "";
        this.element.style.top = "";
        this.element.style.maxWidth = "100%";
        this.element.style.maxHeight = "100%";
        this.element.style.boxSizing = "";
        this.element.style.fontSize = "";
        this.resize();
    }
    moveStyle()
    {
        this.element.style.position = "absolute";
        this.element.style.boxSizing = "";
        this.element.style.maxWidth = "200px";
        this.element.style.height = "200px";
        //this.element.style.height = "";
        this.resize();
    }
    resize()
    {
        if(this.element.querySelector("span") != undefined)
        {
            this.element.querySelector("span").style.fontSize = "100%";
        }
        if(this.element.offsetHeight < this.element.offsetWidth / 3 && this.element.childNodes.length > 1)
        {
            this.element.style.flexDirection = "row";
        }     
        else
        {
            this.element.style.flexDirection = "column";
        }
        if(this.element.querySelector("span") != undefined)
        {
            if(this.element.querySelector("span").offsetWidth >= this.element.clientWidth - (this.element.clientWidth / 100 * 20))
            {
                this.element.querySelector("span").style.fontSize = (this.element.clientWidth - (this.element.clientWidth / 100 * 20)) / this.element.querySelector("span").offsetWidth * 100 + "%";
            }
            if(this.element.querySelector("span").scrollHeight >= this.element.querySelector("span").clientHeight - (this.element.querySelector("span").clientHeight / 100 * 10))
            {
                
                let perc = this.element.querySelector("span").clientHeight / this.element.querySelector("span").scrollHeight * 100;
                let fperc = this.element.querySelector("span").style.fontSize.split("%");
                let newFS = perc / 100 * fperc[0];
                this.element.querySelector("span").style.fontSize = newFS + "%";
                //(this.element.querySelector("span").clientHeight - (this.element.querySelector("span").clientHeight / 100 * 10)) / this.element.querySelector("span").scrollHeight * 100 + "%";
            }  
        }
    }
}
export {DraggableElement}