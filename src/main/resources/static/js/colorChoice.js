class SetColor
{
    background;
    generalColor;
    secondColor;
    gradient;
    changeColor(color)
    {
        switch(color)
        {
            case "green":
                this.#setColor("#46B755", "#46B755", color ,"linear-gradient(0.25turn, #B0E881, #46B755)");
                break;
            case "blue":
                this.#setColor("#3F8CFF", "#3F8CFF", color, "linear-gradient(0.25turn, #3F8CFF, #61B9A9)");
                break;
            case "orange":
                this.#setColor("#FF9432", "#0C6ED6", color, "linear-gradient(0.25turn, #FF9432, #FFB546)");
                break;
        }
    }
    #setColor(gen, sec, pic, grad)
    {
        this.background = pic;
        this.generalColor = gen;
        this.gradient = grad;
        this.secondColor = sec;
        localStorage.setItem("colors", JSON.stringify(this));
        document.getElementById("mainFrame").style.background = "url(../static/backs/" + this.background + ".png)";
    }
    getGeneralColor()
    {
        return this.generalColor;
    }
}
var sc = new SetColor();
export {sc}