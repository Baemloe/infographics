import { sendRequest } from "./request.js";
class MovementElement
{
    static count = 0;
    static allMovements = new Map();
    id;
    fatherId;
    content = {
        text: null,
        pic: null
    }
    #createElement()
    {
        let element = createElement("DIV", "draggableElement");
        element.id = Tools.movementsCount++;
        let inputs = createElement("DIV");
        inputs.style.display = "flex";
        inputs.style.flexDirection = "column";
        let tarea = createElement("TEXTAREA");
        inputs.appendChild(tarea);
        let picture = createElement("INPUT", null, null,"max-width:200px;");
        picture.type = "file";
        picture.accept = "image/png, image/jpeg";
        inputs.appendChild(picture);
        element.appendChild(inputs);
        let img = createElement("IMG", null, null, "max-width: 100px; max-height: 90%;");
        element.appendChild(img);
        picture.addEventListener("change", (e)=>{
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.onload = (e)=>{
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
        let list = createElement("select");
        list.appendChild(createElement("OPTION", null, "destructor"));
        for(let one of this.storage)
        {
            if(one instanceof MoveUnit)
            {
                list.appendChild(createElement("OPTION", null, "#" + one.number));
            }
        }
        element.appendChild(list);
        element.appendChild(createElement("BUTTON", null, "save", null));
        element.appendChild(createElement("BUTTON", null, "delete", null, (e)=>{e.target.parentNode.parentNode.removeChild(e.target.parentNode)}));
        insideDiv.insertBefore(element, e.target);
    }
    constructor(textContent, pic, fatherId, append = true, id=null)
    {
        console.log(pic);
        this.content.text = textContent;
        this.fatherId = fatherId;
        if(id == null)
        {
            this.id = MovementElement.count++;
        }
        else
        {
            this.id = id;
        }
        if(typeof(pic) == "object")
        {
            console.log(typeof(pic));
            this.asyncInit(pic, append);
        }
        else
        {
            this.content.pic = pic;
        }
        
    }
    async update(textContent, pic, fatherId)
    {
        this.content.text = textContent;
        this.fatherId = fatherId;
        if(pic != null)
        {
            if(typeof(pic) == "object")
            {
                await this.asyncInit(pic, false);
            }
            else
            {
                this.content.pic = pic;
            }
        }
        MovementElement.allMovements.set(this.id, this);
        this.writeElements();
    }
    writeElements()
    {
        localStorage.setItem("draggable", JSON.stringify(Object.fromEntries(MovementElement.allMovements)));
    }
    async asyncInit(pic, append)
    {
        let fDat = new FormData();
        fDat.append("file", pic);
        let imgid =  await sendRequest("/image/" + localStorage.getItem("id"), "POST", fDat);
        this.content.pic = imgid;
        if(append)
        {
            this.id = this.id.toString();
        }
        MovementElement.allMovements.set(this.id, this);
        this.writeElements();
    }
    static loadMap()
    {
        if(localStorage.getItem("draggable") != null)
        {
            MovementElement.allMovements = new Map(Object.entries(JSON.parse(localStorage.getItem("draggable"))));
            MovementElement.count = MovementElement.allMovements.size;
            for(let i of MovementElement.allMovements)
            {
                let unit = new MovementElement(i[1].content.text, i[1].content.pic, i[1].fatherId, false, i[0]);
                MovementElement.allMovements.set(i[0], unit);
            }
            console.log(MovementElement.allMovements);
        }
    }
}
export {MovementElement}