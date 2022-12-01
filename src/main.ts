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
            pos:'center',
            content:(contentElem)=>{
                video({
                    url:this.dataset.url,
                    elem:contentElem,
                    autoplay:false,
                    poster:"https://www.sztv.com.cn/huodong/lsj_spds/public/uploads/banner/20221128143813_298.jpg"
                })
            }
        })
    });
}

