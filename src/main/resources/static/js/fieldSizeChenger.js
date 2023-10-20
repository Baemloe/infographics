class FSChanger
{
    #field;
    constructor()
    {
        window.addEventListener("resize", ()=>{
            this.calculatePosition();
        });
        let size = JSON.parse(localStorage.getItem("unit"));
        this.#field = document.createElement("DIV");
        this.#field.style = "position: fixed; width: 300px; top:0;";
        let rows = document.createElement("INPUT");
        rows.type = "number";
        rows.value = size.x;
        this.#field.appendChild(rows);
        let x = document.createElement("SPAN");
        x.innerText = "x";
        this.#field.appendChild(x);
        let cols = document.createElement("INPUT");
        cols.type = "number";
        cols.value = size.y;
        this.#field.appendChild(cols);
        let apply = document.createElement("BUTTON");
        apply.innerText = "Изменить";
        apply.onclick = ()=>{
            localStorage.setItem("unit", JSON.stringify({x: rows.value, y: cols.value}));
            window.dispatchEvent(new Event("resize"));
            localStorage.setItem("lastChange", new Date());
        }
        this.#field.appendChild(apply);
        document.body.appendChild(this.#field);
        this.calculatePosition();

    }
    calculatePosition()
    {
        this.#field.style.left = document.documentElement.clientWidth / 2 - this.#field.clientWidth / 2 + "px";
    }
}
export {FSChanger}