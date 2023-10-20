class Updater
{
    #timer;
    #time;
    constructor()
    {
        document.addEventListener("visibilitychange", ()=>{
            if(document.visibilityState === "hidden")
            {
                this.#time = 0;
                this.#timer = setInterval(()=>{
                    this.#time++;
                }, 1000);
            }
            else
            {
                clearInterval(this.#timer);
                if(this.#time >= 240)
                {
                    location.reload();
                }
            }
        });
    }
}
export {Updater}