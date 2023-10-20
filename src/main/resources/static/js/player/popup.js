class Popup
{
    constructor(htmlContent, popupStyle)
    {
        let back = this.#createBack();
        let p = this.#createPopup();
        p.style = popupStyle;
        if(Array.isArray(htmlContent))
        {
            for(let htm of htmlContent)
            {
                p.appendChild(htm);
            }
        }
        else
        {
            p.appendChild(htmlContent);
        }
        back.appendChild(this.#closeBack());
        back.appendChild(p);
        document.body.appendChild(back);
    }
    #createBack()
    {
        let b = document.createElement("DIV");
        b.className = "popUpBack";
        return b;
    }
    #closeBack()
    {
        let b = document.createElement("DIV");
        b.className = "popUpBack";
        b.style = "z-index:250; background: transparent;";
        b.onclick = this.close;
        return b;
    }
    #createPopup()
    {
        let p = document.createElement("DIV");
        p.className = "popup";
        return p;
    }
    close()
    {
        document.body.removeChild(document.querySelector(".popUpBack"));
    }
}
export {Popup}