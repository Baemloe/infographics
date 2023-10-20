class Popup
{
    closed;
    constructor(htmlContent = null)
    {
        if(htmlContent != null)
        {
            let back = this.createBack();
            let p = this.createPopup();
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
            back.appendChild(this.closeBack());
            back.appendChild(p);
            document.body.appendChild(back);
        }
    }
    static createInnerHTML(innerHTML)
    {
        let instance = new Popup();
        let back = instance.createBack();
        let p = instance.createPopup();
        p.innerHTML = innerHTML;
        back.appendChild(instance.closeBack());
        back.appendChild(p);
        document.body.appendChild(back);
        return p;
    }
    createBack()
    {
        let b = document.createElement("DIV");
        b.className = "popUpBack";
        return b;
    }
    closeBack()
    {
        this.closed = document.createElement("DIV");
        this.closed.className = "popUpBack";
        this.closed.style = "z-index:450; background: transparent;";
        this.closed.onclick = this.close.bind(this);
        return this.closed;
    }
    createPopup()
    {
        let p = document.createElement("DIV");
        p.className = "popup";
        return p;
    }
    close()
    {
        document.body.removeChild(this.closed.parentNode);
    }
    
}
export {Popup}