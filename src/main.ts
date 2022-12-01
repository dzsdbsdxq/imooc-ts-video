import popup from "./components/popup/popup";
import video from "./components/video/video";
import "./main.css"

let listItems = document.querySelectorAll("#list li");

for(let i = 0 ; i < listItems.length ; i++ ){
    listItems[i].addEventListener("click",function(){
        popup({
            width:"700px",
            height:"456px",
            title:this.dataset.title,
            pos:'center',//1.center ,2.topLeft,3.topRight,4.leftBottom,5.rightBottom
            content:(contentElem)=>{
                video({
                    url:this.dataset.url,
                    elem:contentElem,
                    autoplay:false,
                    poster:""
                })
            }
        })
    });
}

