import {Popup} from "../js/popup.js";
import { Saver } from "./compilerSaver.js";
import { Updater } from "./autoUpdater.js";
import { FSChanger } from "./fieldSizeChenger.js";
var emptys = new Map();
var selectedType = null;
var colr;
var unit;
window.addEventListener("resize", ()=>{
    document.getElementById("mainFrame").style.height = document.documentElement.clientHeight - 2 + "px";
    let coods = JSON.parse(localStorage.getItem("unit"));
    loadGC(coods.x, coods.y);
});
window.addEventListener("load", async ()=>{
    new Updater();  
    document.getElementById("mainFrame").style.height = document.documentElement.clientHeight - 2 + "px";
    document.getElementById("mainFrame").className = "flexCenter";
    document.body.style.margin = 0;
    let coods = JSON.parse(localStorage.getItem("unit"));
    if(coods != null)
    {
        let ftch = await fetch("/getdate/" + localStorage.getItem("id"));
        let res = await ftch.text();
        if(res.length > 0)
        {
            res = JSON.parse(res);
        }
        if(res != null && new Date(localStorage.getItem("lastChange")) < new Date(res[0], res[1] - 1, res[2], res[3], res[4], res[5]))
        {
            await Edit(localStorage.getItem("id"));
        }
        new FSChanger();
        loadGC(coods.x, coods.y);
    }
    else
    {
        createListButton();
    }
    colr = await import("../js/colorChoice.js");
    if(localStorage.getItem("colors") == null)
    {
        colr.sc.changeColor("green");
    }
    renderTheme();

});
async function Edit(id)
    {          
        let req = await fetch("/editeom/" + id);
        let data = await req.json();
        localStorage.setItem("id", data.id);  
        localStorage.setItem("unit", data.size); 
        localStorage.setItem("colors", data.colors);
        localStorage.setItem("infos", data.infos);
        localStorage.setItem("elements", data.elements);
        localStorage.setItem("draggable", data.draggable);
        localStorage.setItem("name", data.name);
    }
var begin;
var ghost = document.createElement("DIV");
ghost.className = "ghost";
document.addEventListener("mousedown", (e)=>{
    let start = document.elementFromPoint(e.clientX, e.clientY);
    if(start.className == "emptyCell")
    {
        e.preventDefault();
        start.parentNode.appendChild(ghost);
        begin = {x: start.dataset.posX, y: start.dataset.posY};
        ghost.style.gridArea = begin.x + "/" + begin.y + "/" + (parseInt(begin.x) + 1)+  "/" + (parseInt(begin.y) + 1);
        window.addEventListener("mousemove", moveHandler);
        document.onmouseup = async (e)=>
        {
            ghost.hidden = true;
            if(document.elementFromPoint(e.clientX, e.clientY).className == "emptyCell")
            {
                ghost.hidden = false;
                document.onmouseup = null;
                e.target.parentNode.removeChild(ghost);
                if(selectedType != null)
                {
                    await createBlock(selectedType, ghost.style.gridArea);
                }
                ghost.style = null;
                window.removeEventListener("mousemove", moveHandler);
            }
        }
    }
});
function createButtonAndEvent(handler, name)
{
    let button = document.createElement("BUTTON");
    button.innerText = name;
    button.onclick = handler;
    button.className = "rightButtons";
    return button;
}
function undisableButtons()
{
    let rButts = document.querySelectorAll(".rightButtons");
    for(let b of rButts)
    {
        b.disabled = false;
    }
}
function moveHandler(e)
{
    e.preventDefault();
    ghost.hidden = true;
    let mous = document.elementFromPoint(e.clientX, e.clientY);
    ghost.style.gridArea = calcPosition({x: parseInt(begin.x), y: parseInt(begin.y)}, {x: parseInt(mous.dataset.posX), y: parseInt(mous.dataset.posY)});
    ghost.hidden = false;
}
function calcPosition(starter, ender)
{
    let o = { sr: null,
            sc: null,
            er: null,
            ec: null };
    if(starter.x < ender.x)
    {
        o.sr = starter.x;
        o.er = ender.x + 1;
    }
    else if(starter.x == ender.x)
    {
        o.sr = starter.x;
        o.er = starter.x + 1;
    }
    else
    {
        o.sr = ender.x;
        o.er = starter.x + 1;
    }
    if(starter.y < ender.y)
    {
        o.sc = starter.y;
        o.ec = ender.y + 1;
    }
    else if(starter.y == ender.y)
    {
        o.sc = starter.y;
        o.ec = starter.y + 1;
    }
    else
    {
        o.sc = ender.y;
        o.ec = starter.y + 1;
    }
    return o.sr + "/" + o.sc + "/" + o.er + "/" + o.ec;
}
async function createBlock(type, gridArea)
{
    let elem = unit.t.getElement(type, gridArea);
    let elements;
    if(localStorage.getItem("elements") != "null" && localStorage.getItem("elements") != null)
    {
        elements = new Map(Object.entries(JSON.parse(localStorage.getItem("elements"))));
    }
    else
    {
        elements = new Map();
    }
    elements.set(elem.grid, elem.getWriteObject());
    tools.toolObj.addOneInStorage(elem);
    localStorage.setItem("elements", JSON.stringify(Object.fromEntries(elements)));
    localStorage.setItem("lastChange", new Date());
}
var tools;
async function startCreate()
{
    let x = document.getElementById("h");
    let y = document.getElementById("v");
    let name = document.getElementById("eomCode");
    if(checkStart([x, y, name]))
    {
        localStorage.setItem("unit", JSON.stringify({x: x.value, y:y.value}));
        localStorage.setItem("name", name.value);
        let autoSave = new Saver();
        localStorage.setItem("id", await autoSave.autoSave());
        await loadGC(x.value, y.value);
    }
}
function checkStart(fieldsArr)
{
    let reuslt = true;
    for(let field of fieldsArr)
    {
        if(field.value.length < 1 || field.value == 0)
        {
            field.style.border = "2px solid red";
            setTimeout(()=>{field.style.border = "";}, 2500);
            reuslt = false;
        }
    }
    return reuslt;
}
async function loadGC(x, y)
{
    let gc = await import("../js/gridCreate.js");
    let grid = await gc.g.cr(x, y);
    document.getElementById("mainFrame").innerHTML = null;
    document.getElementById("mainFrame").appendChild(grid);
    grid.style.width = grid.clientWidth + "px";
    grid.style.height = grid.clientWidth * 0.562857142857 + "px";
    await gc.g.createCellElements(grid);
    tools = await import("../js/toolsPanel.js");
    addClear();
    let empts = document.querySelectorAll(".emptyCell");
    for(let e of empts)
    {
        emptys.set(e.dataset.posX + "/" + e.dataset.posY, e);
    }
    let rightPanel = document.createElement("DIV");
    rightPanel.className = "rightPanel";
    rightPanel.appendChild(createButtonAndEvent((e)=>{selectedType = "header"; undisableButtons(); e.target.disabled = true;}, "Шапка"));
    rightPanel.appendChild(createButtonAndEvent((e)=>{selectedType = "group"; undisableButtons(); e.target.disabled = true;}, "Группа"));
    rightPanel.appendChild(createButtonAndEvent((e)=>{selectedType = "info"; undisableButtons(); e.target.disabled = true;}, "Инфоблок"));
    rightPanel.appendChild(createButtonAndEvent((e)=>{selectedType = "drag"; undisableButtons(); e.target.disabled = true;}, "Элемент"));
    rightPanel.appendChild(createButtonAndEvent((e)=>{ 
        let pop = new Popup([
            createButtonAndEvent(()=>{pop.close(); selectedType = "hArrow";}, "—"), 
            createButtonAndEvent(()=>{pop.close(); selectedType = "combineArrow";}, "+"), 
            createButtonAndEvent(()=>{pop.close(); selectedType = "vArrow";}, "|")
        ]); 
        undisableButtons();}, "Стрелки"));
    document.body.appendChild(rightPanel);
    unit = await import("../js/types.js");
    tools.toolObj.loadStorage(unit.t.loadOfStorage());
}
function addClear()
{
    let clear = document.createElement("BUTTON");
    clear.className = "clearButton";
    clear.innerHTML = "Сохранить и вернуться";
    clear.onclick = async ()=>{
        let svr = new Saver();
        await svr.autoSave();
        localStorage.clear();
        location.reload();
    };
    document.body.appendChild(clear);
}
var colr;
async function LoadColorTheme()
{
    let colorsButton = document.querySelectorAll(".colorButton");
    colorsButton[0].onclick = (e)=>{undis(); e.target.disabled = true; colr.sc.changeColor("green"); renderTheme();};
    colorsButton[0].innerText = "Зеленый";
    colorsButton[0].disabled = true;
    colorsButton[1].onclick = (e)=>{undis();  e.target.disabled = true; colr.sc.changeColor("blue"); renderTheme();};
    colorsButton[1].innerText = "Синий";
    colorsButton[2].onclick = (e)=>{undis();  e.target.disabled = true; colr.sc.changeColor("orange"); renderTheme();};
    colorsButton[2].innerText = "Оранжевый";
}
function undis()
{
    let colorsButton = document.querySelectorAll(".colorButton");
    for(let cb of colorsButton)
    {
        cb.disabled = false;
    }
}
function renderTheme()
{
    let color = JSON.parse(localStorage.getItem("colors"));
    document.getElementById("mainFrame").style.boxSizing = "border-box";
    document.getElementById("mainFrame").style.background = "url(../static/backs/" + color.background + ".png)";
}
function createListButton()
{
    let button = document.createElement("BUTTON");
    button.classList.add("loadListButton");
    button.innerText = "Список ЭОМ";
    document.body.appendChild(button);
    button.onclick = ()=> { location.href = "/loadeom"};
}

export{startCreate, LoadColorTheme}
