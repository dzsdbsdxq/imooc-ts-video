import Icomponent from "../interface/common";

const styles:any = require("./popup.css").default;

interface Ipopup {
    width?  :   string;
    height? :   string;
    title?  :   string;
    pos?    :   string;
    mask?   :   boolean;
    content?:   (popupContentElm:HTMLElement) => void;
}
function popup (options : Ipopup){
    return new Popup(options)
}

class Popup implements Icomponent {
    tempContainer;
    mask;
    constructor(private setting : Ipopup){
        this.setting = Object.assign({
            width:"100%",
            height:"100%",
            title:"",
            pos:"center",
            mask:true,
            content:function(){}
        },this.setting);
        this.init();
    }
    init(){
        this.template();
        this.setting.mask && this.createMaskContainer()
        this.handle();
        this.contentCallback();
    }
    template(){
        this.tempContainer = document.createElement("div");
        this.tempContainer.style.width = this.setting.width;
        this.tempContainer.style.height = this.setting.height;
        this.tempContainer.className = styles.popupContainer
        this.tempContainer.classList.add(
            styles[this.setting.pos] == undefined ? 
            styles.center: styles[this.setting.pos]);
        this.tempContainer.innerHTML = `
            <div class="${styles.popupTitle}">
                <h3>${this.setting.title}</h3>
                <svg class="close" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="128" height="128"><path d="M576 512l277.333333 277.333333-64 64-277.333333-277.333333L234.666667 853.333333 170.666667 789.333333l277.333333-277.333333L170.666667 234.666667 234.666667 170.666667l277.333333 277.333333L789.333333 170.666667 853.333333 234.666667 576 512z" fill="#444444"></path></svg>
            </div>
            <div class="${styles.popupContent}">
            </div>
        `;
        document.body.appendChild(this.tempContainer);
    }
    handle(){
        let closeContainerElm = this.tempContainer.querySelector(`.${styles.popupTitle} svg.close`);
        closeContainerElm.addEventListener("click",()=>{
            document.body.removeChild(this.tempContainer);
            this.setting.mask && document.body.removeChild(this.mask);
        });
    }
    createMaskContainer(){
        this.mask = document.createElement("div");
        this.mask.className = styles.maskContainer;
        document.body.appendChild(this.mask);
    }

    contentCallback(){
        let popupContentElm = this.tempContainer.querySelector(`.${styles.popupContent}`);
        this.setting.content(popupContentElm);
    }
}
export default popup