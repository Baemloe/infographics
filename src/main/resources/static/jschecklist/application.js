import {Popup} from "../js/popup.js";
import { WsGrid } from "./wsgrid.js";
class Application
{
    static colorMap;
    static nameContent;
    static descContent;
    static eomCode;
    static selectedColor;
    static id;
    static downPops;
    static start()
    {
        Application.mapInit();
        document.querySelector(".flexCenter").style.minHeight = document.documentElement.clientHeight + "px";
        document.getElementById("color").onclick = ()=>{
            let nameInput = document.createElement("INPUT");
            nameInput.type = "text";
            nameInput.id = "nameInput";
            nameInput.style = "max-width: 100%; border-radius: .4rem;";
            if(Application.eomCode)
            {
                nameInput.value = Application.eomCode;
            }
            let buttonsDiv = document.createElement("DIV");
            let oldYear = document.createElement("BUTTON");
            oldYear.dataset.color = "old";
            oldYear.onclick = this.setColor;
            oldYear.innerHTML = "<img style = 'max-width: 50px; max-height: 50px;' src = '../static/images/checkbox-2021_2.png'>";
            let green = document.createElement("BUTTON");
            green.onclick = this.setColor;
            green.dataset.color = "green";
            green.innerHTML = "<img style = 'max-width: 50px; max-height: 50px;' src = '../static/images/green_02.png'>";
            let blue = document.createElement("BUTTON");
            blue.dataset.color = "blue";
            blue.onclick = this.setColor;
            blue.innerHTML = "<img style = 'max-width: 50px; max-height: 50px;' src = '../static/images/blue_02.png'>";
            let orange = document.createElement("BUTTON");
            orange.dataset.color = "orange";
            orange.onclick = this.setColor;
            orange.innerHTML = "<img style = 'max-width: 50px; max-height: 50px;' src = '../static/images/orange_02.png'>";
            buttonsDiv.appendChild(oldYear);
            buttonsDiv.appendChild(green);
            buttonsDiv.appendChild(blue);
            buttonsDiv.appendChild(orange);
            let flexContainer = document.createElement("DIV");
            flexContainer.style = "display: flex; flex-direction: column; justify-content: center;";
            flexContainer.appendChild(nameInput);
            flexContainer.appendChild(buttonsDiv);
            let loadButton = document.createElement("BUTTON");
            loadButton.innerText = "Загрузить";
            loadButton.onclick = this.loadPage;
            flexContainer.appendChild(loadButton);
            Application.downPops = new Popup(flexContainer);
        };
        document.getElementById("save").onclick = async ()=>
        {
            let body = new FormData();
            if(Application.id)
            {
                body.append("id", Application.id);
            }
            body.append("eomCode", Application.eomCode);
            body.append("nameBlock", Application.nameContent);
            body.append("cap", Application.descContent);
            body.append("grids", JSON.stringify(WsGrid.returns()));
            body.append("colors", JSON.stringify(Application.colorMap.get(Application.selectedColor)));
            let request = await fetch("/savechecklist", {
                method: "POST",
                body: body
            });
            let response = parseInt(await request.text());
            Application.id = parseInt(response);
            let zipRequest = await fetch("/getcheck/" + Application.id);
            let url = URL.createObjectURL(await zipRequest.blob());
            let a = document.createElement("a");
            a.href = url;
            a.download = Application.eomCode + ".zip";
            a.click();
            URL.revokeObjectURL(url);     
        }
        document.getElementById("color").dispatchEvent(new Event("click"));
        document.getElementById("add").onclick = ()=>
        {
            WsGrid.newGrid();
        }
        document.querySelector(".nameField.show").onclick = Application.changeContent;
        document.querySelector(".cap.show").onclick = Application.changeContent;
    }
    static async loadPage()
    {
        let mainDiv = document.createElement("DIV");
        mainDiv.style = "width: 80vw; height:80vh; overflow-y: scroll;";
        let pop = new Popup(mainDiv);
        let ftch = await fetch("/loadchecklist");
        let res = await ftch.json();
        for(let r in res)
        {
            let div = document.createElement("DIV");
            div.classList.add("draggableElement");
            div.style = "padding: 8px; justify-content: space-between;";
            let name = document.createElement("SPAN");
            name.innerText = r;
            div.appendChild(name);
            let ldBut = document.createElement("BUTTON");
            ldBut.id = res[r];
            ldBut.innerText = "Загрузить";
            ldBut.onclick = async (e)=>
            {
                let ftch = await fetch("/checkedit/" + e.target.id);
                let res = await ftch.json();
                await Application.loadEom(res);
                pop.close();
                Application.downPops.close();
            }
            div.appendChild(ldBut);
            mainDiv.appendChild(div);
        }
    }
    static setColor(e)
    {
        let inps = document.getElementById("nameInput");
        if(inps.value.length > 0)
        {
            Application.eomCode = inps.value;
            let button = e.target.tagName == "IMG" ? e.target.parentNode : e.target;
            Application.selectedColor = button.dataset.color;
            document.querySelector(".flexCenter").style.background = `url(../static/backs/${Application.colorMap.get(Application.selectedColor).picture}.png)`;
            document.querySelector(".cap").querySelector("img").src = `../static/fingers/${Application.colorMap.get(Application.selectedColor).picture}.png`;
            document.querySelector(".cap").style.borderTop = `3px solid ${Application.colorMap.get(Application.selectedColor).rgb}`;
            WsGrid.update(Application.colorMap.get(Application.selectedColor));
            Application.downPops.close();
        }
        else
        {
            inps.style.border = "2px solid red";
            setTimeout(()=>{inps.style.border = "";}, 2000);
        }
    }
    static mapInit()
    {
        this.colorMap = new Map();
        this.colorMap.set("old", {picture: "green", rgb: "#46B755", gradient: "linear-gradient(0.25turn, #B0E881, #46B755)", empty: '../static/images/checkbox-2021_1.png', full: '../static/images/checkbox-2021_2.png'});
        this.colorMap.set("green", {picture: "green", rgb: "#46B755", gradient: "linear-gradient(0.25turn, #B0E881, #46B755)", empty: '../static/images/green_01.png', full: '../static/images/green_02.png'});
        this.colorMap.set("blue", {picture: "blue", rgb: "#3F8CFF", gradient: "linear-gradient(0.25turn, #3F8CFF, #61B9A9)", empty: '../static/images/blue_01.png', full: '../static/images/blue_02.png'});
        this.colorMap.set("orange", {picture: "orange", rgb: "#FF9432", gradient: "linear-gradient(0.25turn, #FF9432, #FFB546)", empty: '../static/images/orange_01.png', full: '../static/images/orange_02.png'});
    }
    static changeContent(e)
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
            if(clicked.dataset.tag == "name")
            {
                Application.nameContent = edtr.getData();
            }
            else
            {
                Application.descContent = edtr.getData();
            }
            edtr.destroy();
            p.close();
        };
    }
    static async loadEom(data)
    {
        Application.id = data.id;
        Application.eomCode = data.eomCode;
        Application.nameContent = data.nameBlock;
        Application.descContent = data.cap;
        Application.selectedColor = JSON.parse(data.colors).picture;
        WsGrid.color = await Application.colorMap.get(Application.selectedColor);
        await WsGrid.load(JSON.parse(data.grids));
        Application.updateRender();

    }
    static updateRender()
    {
        document.querySelector(".nameField.show").querySelector("h1").innerHTML = Application.nameContent;
        document.querySelector(".cap.show").querySelector("h3").innerHTML = Application.descContent;
        document.querySelector(".flexCenter").style.background = `url(../static/backs/${Application.colorMap.get(Application.selectedColor).picture}.png)`;
        document.querySelector(".cap.show").querySelector("img").src = `../static/fingers/${Application.colorMap.get(Application.selectedColor).picture}.png`;
        document.querySelector(".cap.show").style.borderTop = `3px solid ${Application.colorMap.get(Application.selectedColor).rgb}`;
            
    }
}
export {Application}