import { StaticUnit, MoveUnit, ArrowUnit, ArrowCombiner} from "../js/unit.js";
class Types
{
    #colors;
    constructor()
    {
        this.#colors = JSON.parse(localStorage.getItem("colors"));
    }
    getElement(type, gridArea)
    {
        let elemnt = this.#createEmptyElement(gridArea);
        let style;
        switch(type)
        {
            case "header":
                style = `background: ${this.#colors.gradient}; grid-area: ${gridArea}; color: white;`;
                return new StaticUnit(elemnt, style);
            case "group":
                style = `background: ${this.#colors.secondColor}; grid-area: ${gridArea};color: white;`;
                return new StaticUnit(elemnt, style);
            case "info":
                style = `background: white; grid-area: ${gridArea}; border: 2px solid ${this.#colors.generalColor}; color: #15374D;`;
                return new StaticUnit(elemnt, style);
            case "drag":
                style = `background: white; grid-area: ${gridArea}; border: 2px dashed ${this.#colors.generalColor}; color: #15374D;`;
                return new MoveUnit(elemnt, style, null);
            case "hArrow":
                style = `grid-area: ${gridArea}; z-index: 100;`;
                return new ArrowUnit(elemnt, style, "horizontal");
            case "vArrow":
                style = `grid-area: ${gridArea}; z-index: 100;`;
                return new ArrowUnit(elemnt, style, "vertical");
            case "combineArrow":
                style = `grid-area: ${gridArea}; z-index: 100;`;
                return new ArrowCombiner(elemnt, style);   
        }
    }
    #createEmptyElement(gridArea)
    {
        let elem = document.createElement("DIV");
        elem.style.gridArea = gridArea;
        return elem;
    }
    loadOfStorage()
    {
        let result = [];
        if(localStorage.getItem("elements") != "null" && localStorage.getItem("elements") != null)
        {
        let arrayElements = new Map(Object.entries(JSON.parse(localStorage.getItem("elements"))));
            for(let element of arrayElements)
            {
                switch(element[1].type)
                {
                    case "static":
                        result.push(new StaticUnit(this.#createEmptyElement(element[1].grid), element[1].style));
                        result[result.length - 1].showContent(element[1].content);
                        break;
                    case "move":
                        result.push(new MoveUnit(this.#createEmptyElement(element[1].grid), element[1].style, element[1].content, element[1].single));
                        break;
                    case "combiner":
                        result.push(new ArrowCombiner(this.#createEmptyElement(element[1].grid), element[1].style));
                        break;
                    default:
                        let peace = element[1].type.split("_");
                        result.push(new ArrowUnit(this.#createEmptyElement(element[1].grid), element[1].style, peace[1]));
                        break;
                }
            }
        }
        return result;
    }
}
let t = new Types();
export {t}