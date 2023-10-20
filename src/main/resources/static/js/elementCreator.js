function createElement(selector, className = null, innerHTML = null, style = null, onclick = null)
{
    let element = document.createElement(selector);
    if(className != null)
    {
        element.className = className;
    }
    if(style != null)
    {
        element.style = style;
    }
    if(onclick != null)
    {
        element.onclick = onclick;
    }
    if(innerHTML != null)
    {
        element.innerHTML = innerHTML;
    }
    return element;
}
export{createElement}