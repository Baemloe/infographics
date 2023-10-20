import { Popup } from "./popup.js";
import { createElement } from "./elementCreator.js";
import { MovementElement } from "./movement.js";
import { AddInfo } from "./information.js";
import { Saver } from "./compilerSaver.js";
class Tools
{
    static movementsCount = 0;
    static storage;
    constructor()
    {
        Tools.storage = [];
        let botPanel = document.createElement("DIV");
        botPanel.className = "bottomTools";
        let deleteButton = this.#createButton("Удалить");
        deleteButton.onclick = this.deleteButton.bind(this);
        botPanel.appendChild(deleteButton);
        let contentButton = this.#createButton("Заполнить контент");
        contentButton.onclick = this.contentButton.bind(this);
        botPanel.appendChild(contentButton);
        let resizeElement = this.#createButton("Создать элементы");
        resizeElement.onclick = this.draggableWindow.bind(this);
        botPanel.appendChild(resizeElement);
        let showContent = this.#createButton("Показать контент");
        showContent.onclick = this.showContent.bind(this);
        botPanel.appendChild(showContent);
        let addInformation = this.#createButton("Добавить информацию");
        addInformation.onclick = this.addInfo.bind(this);
        botPanel.appendChild(addInformation);
        document.body.appendChild(botPanel);
        new Saver(addInformation);
    }
    addInfo()
    {
        let mainDiv = createElement("DIV", "mainDiv");
        let insideDiv = createElement("DIV", "insideMainDivFlex");
        mainDiv.appendChild(insideDiv);
        new AddInfo(insideDiv);
        new Popup(mainDiv);
    }
    static StorageDeleter(element)
    {
        let finded;
        for(let elem of Tools.storage)
        {
            if(elem.htmlElement == element)
            {
                finded = elem;
                break;
            }
        }
        Tools.storage.splice(Tools.storage.indexOf(finded), 1);
    }
    deleteButton()
    {
        for(let block of Tools.storage)
        {
            block.deleteButt();
        }
    }
    contentButton()
    {
        for(let block of Tools.storage)
        {
            block.contentInside();
        }
    }
    showContent()
    {
        for(let block of Tools.storage)
        {
            block.showContent();
        }
    }
    draggableWindow()
    {
        new Popup(this.createDraggableWindow());
        MovementElement.loadDraggable();
    }
    createDraggableWindow()
    {
        let mainDiv = createElement("DIV", "mainDiv");
        let insideDiv = createElement("DIV", "insideMainDivFlex");
        let addButton = createElement("BUTTON", null, "Добавить",  null, (e)=>{
            new MovementElement();
        });
        insideDiv.id = "insideMainDivFlex";
        addButton.id = "addButton";
        insideDiv.appendChild(addButton);
        mainDiv.appendChild(insideDiv);
        return mainDiv;
    }
    addOneInStorage(oneUnit)
    {
        Tools.storage.push(oneUnit);
    }
    loadStorage(array)
    {
        Tools.storage = array;
    }
    #createButton(text)
    {
        let button = document.createElement("BUTTON");
        button.innerText = text;
        return button;
    }
}

export const toolObj = new Tools();
export {Tools}