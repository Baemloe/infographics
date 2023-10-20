import { Popup } from "../js/popup.js";
class WsGrid
{
    static fatherField = document.getElementById("workSpace");
    static addButton;
    static allElements = [];
    static color;
    grid;
    content;
    static update(color = null)
    {
        if(color != null)
        {
            WsGrid.color = color;
            if(WsGrid.allElements.length > 0)
            {
                for(let one of WsGrid.allElements)
                {
                    one.paint();
                }
            }
        }
    }
    constructor(content = null)
    {
        this.grid = document.createElement("DIV");
        this.grid.classList.add("wsGrid");
        let inside = document.createElement("DIV");
        inside.classList.add("inside");
        inside.classList.add("show");
        inside.onclick = this.newText.bind(this);
        let text = document.createElement("SPAN");
        inside.appendChild(text);
        this.grid.appendChild(inside);
        let img = document.createElement("IMG");
        img.style.gridArea = "1/2/1/2";
        img.style.maxWidth = "50px";
        img.style.maxHeight = "50px";
        img.className = "checkBox";
        img.onclick = this.deleteString.bind(this);
        this.grid.appendChild(img);
        if(content != null)
        {
            text.innerHTML = content;
            this.content = content;
        }
        WsGrid.allElements.push(this);
        WsGrid.fatherField.insertBefore(this.grid, WsGrid.addButton);
    }
    deleteString()
    {
        WsGrid.fatherField.removeChild(this.grid);
        WsGrid.allElements.splice(WsGrid.allElements.indexOf(this), 1);
    }
    static newGrid(content = null)
    {
        let unit = new WsGrid(content ? content : null);
        unit.paint();
    }
    paint()
    {
        let img = this.grid.querySelector("IMG");
        let div = this.grid.querySelector("div");
        img.src = WsGrid.color.empty;
        div.style.border = `2px solid ${WsGrid.color.rgb}`;
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
        let tarea = document.createElement("DIV");
        let edtr;
        ClassicEditor.create(tarea,{}).then( editor => { edtr = editor; editor.setData(content.innerHTML);}).catch( error => {
            console.error( error );} );
        let saveButton = document.createElement("BUTTON");
        saveButton.innerText = "Сохрaнить";
        flexContainer.appendChild(tarea);
        flexContainer.appendChild(saveButton);
        let p = new Popup(flexContainer);
        tarea.focus();
        saveButton.onclick = ()=>{
            content.innerHTML = edtr.getData();
            this.content = edtr.getData();
            p.close();
            edtr.destroy();
        };
    }
    static load(gridsArr)
    {
        for(let gr of WsGrid.allElements)
        {
            WsGrid.fatherField.removeChild(gr.grid);
        }
        for(let oneGrid of gridsArr)
        {
            WsGrid.newGrid(oneGrid);
        }
    }
    static returns()
    {
        let arr = [];
        for(let child of WsGrid.allElements)
        {
            arr.push(child.content);
        }
        return arr;
    }
}
export {WsGrid}