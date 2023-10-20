class PrepareUnit
{
    nameBlock;
    cap;
    colors;
    grids = [];
    constructor(name, cap, grids, colors)
    {
        this.nameBlock = name.outerHTML;
        this.cap = cap.outerHTML;
        for(let grid of grids)
        {
            this.grids.push(grid.outerHTML);
        }
        this.colors = colors;
        console.log(JSON.stringify(this));
    }
}
export {PrepareUnit}