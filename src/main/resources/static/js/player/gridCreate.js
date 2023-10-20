class GridCreator
{
    #rows;
    #cols;
    #x;
    #y;
    cr(x, y)
    {
        this.#x = parseInt(x);
        this.#y = parseInt(y);
        this.#rows = this.#cycleString(x);
        this.#cols = this.#cycleString(y);
        return this.#createElement();
    }
    #cycleString(count)
    {
        let result = "";
        for(let i=0; i<count; i++)
        {
            result += "1fr ";
        }
        return result;
    }
    #createElement()
    {
        let block = document.createElement("DIV");
        block.className = "generalGrid";
        block.style.grid = this.#rows + "/" + this.#cols;
        return block;
    }
    createCellElements(container)
    {
        let x = this.#x + 1;
        let y = this.#y + 1;
        for(let r = 0; r < this.#x; r++)
        {
            for(let c = 0; c < this.#y; c++)
            {
                let element;
                    element = document.createElement("DIV");    
                    element.className = "emptyCell";
                    element.style.gridArea = (r + 1) + "/" + (c + 1) + "/" + (r + 1) + "/" + (c + 1);
                element.dataset.posX = (r + 1);
                element.dataset.posY = (c + 1);
                container.appendChild(element);
            }
        }
        return container;
    }
    updateToPixels(grid)
    {
        grid.style.gridTemplateRows = "repeat(" + this.#x + "," + Math.round(grid.clientHeight /  this.#x) +"px)";
        grid.style.gridTemplateColumns = "repeat(" + this.#y + "," + Math.round(grid.clientWidth /  this.#y) +"px)";
    }
}
export const g = new GridCreator();
export {GridCreator}