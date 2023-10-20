import {load} from "./script.js";
class Loader
{
    static #data = null;
    static async loading(dataId)
    {
        this.#data = await load(dataId);
        return this.#data;
    }
}
export {Loader}