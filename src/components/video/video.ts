import Icomponent from "../interface/common";
const styles:any = require("./video.css").default;

interface IVideo {
    url         :   string;
    elem        :   string|HTMLElement;
    width?      :   string;
    height?     :   string;
    autoplay?   :   boolean;
    poster?     :   string;
}
function video(options:IVideo){
    return new Video(options);
}

class Video implements Icomponent {
    tempContainer: HTMLElement;
    currentVolume : number;
    constructor(private settings:IVideo){
        this.settings = Object.assign({
            width:"100%",
            height:"100%",
            autoplay:false,
            poster:""
        },this.settings);
        this.init();

    } 
    init(){
        this.template();
        this.handle();
    }
    template(){
        this.tempContainer = document.createElement("div");
        this.tempContainer.className = styles.videoContainer;
        this.tempContainer.style.width = this.settings.width;
        this.tempContainer.style.height = this.settings.height;
        this.tempContainer.innerHTML = `
            <video poster="${this.settings.poster}" class="${styles.videoContent}" src="${this.settings.url}"></video>
            <div class="${styles.videoControls}">
                <div class="${styles.videoProgress}">
                    <div class="${styles.videoProgressNow}"></div>
                    <div class="${styles.videoProgressSuc}"></div>
                    <div class="${styles.videoProgressBar}">
                        <span></span>
                    </div>
                </div>
                <div class="${styles.videoOptions}">
                    <div class="${styles.videoPlay}">
                        <i class="${styles.videoPlayIco}"></i>
                    </div>
                    <div class="${styles.videoTime}">
                        <span>00:00</span>&nbsp;/&nbsp;<span>00:00</span>
                    </div>
                    <div class="${styles.videoFull}">
                        <i class="${styles.videoFullIco}"></i>
                    </div>
                    <div class="${styles.videoVolume}">
                        <i class="${styles.videoVolumeIco}"></i>
                        <div class="${styles.videoVolProgress}">
                            <div class="${styles.videoVolProgressNow}"></div>
                            <div class="${styles.videoVolProgressBar}">
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        typeof this.settings.elem == "object" ? 
        this.settings.elem.appendChild(this.tempContainer) :
        document.querySelector(`${this.settings.elem}`).appendChild(this.tempContainer);
    }
    handle(){
        let videoContentElem : HTMLVideoElement = this.tempContainer.querySelector(`.${styles.videoContent}`);
        let videoControlsElem :HTMLElement = this.tempContainer.querySelector(`.${styles.videoControls}`);
        let videoProgressElem = videoControlsElem.querySelectorAll(`.${styles.videoProgress} div`);
        let videoControlsOptionsElem = videoControlsElem.querySelector(`.${styles.videoOptions}`);
        let videoPlayElem = videoControlsOptionsElem.querySelector(`.${styles.videoPlay} i`);
        let videoTimesElem = videoControlsOptionsElem.querySelectorAll(`.${styles.videoTime} span`);
        let videoFullElem = videoControlsOptionsElem.querySelector(`.${styles.videoFull} i`);
        let videovolumeIcoElem = videoControlsOptionsElem.querySelector(`.${styles.videoVolume} i`);
        let videoVolProgressElems = videoControlsOptionsElem.querySelectorAll(`.${styles.videoVolProgress} div`);
        let videoVolProgressTextTipsElem = videoVolProgressElems[1].querySelector("span");
        let videoProgressTextTipsElem = videoProgressElem[2].querySelector("span");
    
        //默认音量
        this.currentVolume = videoContentElem.volume = 0.5;
        videoVolProgressTextTipsElem.innerText = videoContentElem.volume * 100 + "%";

        this.tempContainer.addEventListener("mouseenter",function(){
            videoControlsElem.style.bottom = "0px"
        });
        this.tempContainer.addEventListener("mouseleave",function(){
            videoControlsElem.style.bottom = "-60px";
        });



        videoContentElem.addEventListener("canplay",()=>{
            console.log("canplay");
        });
        videoContentElem.addEventListener("play",()=>{
            videoPlayElem.className = styles.videoPauseIco

        });
        videoContentElem.addEventListener("pause",()=>{
            videoPlayElem.className = styles.videoPlayIco
        });
        //监听加载完判断是否自动播放
        videoContentElem.addEventListener("loadeddata",()=>{
            this.settings.autoplay && videoContentElem.play();
        });
        videoContentElem.addEventListener("durationchange",()=>{
            (videoTimesElem[1] as HTMLElement).innerText = second(videoContentElem.duration);
        });
        videoContentElem.addEventListener("ended",()=>{
            (videoProgressElem[0] as HTMLElement).style.width = "0%";
            (videoProgressElem[2] as HTMLElement).style.left = "0%"; 
        });
        videoContentElem.addEventListener("timeupdate",()=>{
            (videoTimesElem[0] as HTMLElement).innerText = second(Math.floor(videoContentElem.currentTime));
            let currentProgress = Math.floor(
                (videoContentElem.currentTime / videoContentElem.duration) * 100
            ) + "%";
            (videoProgressElem[0] as HTMLElement).style.width = currentProgress;
            (videoProgressElem[2] as HTMLElement).style.left = currentProgress;
        });
        videoContentElem.addEventListener("progress",()=>{
            let progress = Math.floor(
                (videoContentElem.buffered.length
                    ? videoContentElem.buffered.end(videoContentElem.buffered.length - 1) /
                    videoContentElem.duration
                    : 0) * 100
            );
            (videoProgressElem[1] as HTMLElement).style.width = progress + "%";
        
        });
        //进度条拖拽事件监听
        videoProgressElem[2].addEventListener("mousedown",function(event:MouseEvent){
            let downX = event.pageX;
            let downL = this.offsetLeft;
            console.log(event.target["offsetLeft"],this.offsetLeft);
            videoProgressTextTipsElem.style.display = "block";
            document.onmousemove = (ev:MouseEvent)=>{
                let scale = (ev.pageX - downX + downL) / this.parentNode.offsetWidth;
                scale = scale < 0 ? 0 :scale >1 ? 1:scale;
                (videoProgressElem[0] as HTMLElement).style.width =  (scale *100)+ "%"; 
                (videoProgressElem[1] as HTMLElement).style.width =  scale+ "%"; 
                this.style.left = (scale * 100) + "%"
                videoContentElem.currentTime = scale * videoContentElem.duration;
                videoProgressTextTipsElem.innerText =  second(videoContentElem.currentTime);
            }
            document.onmouseup = () => {
                videoProgressTextTipsElem.style.display = "none";
                document.onmousemove = document.onmouseup = null;
            }
            event.preventDefault();
        },false);

        videovolumeIcoElem.addEventListener("click",()=>{
            if(videoContentElem.volume <= 0){
                //取消静音
                videovolumeIcoElem.className = styles.videoVolumeIco;
                (videoVolProgressElems[0] as HTMLElement).style.width =  (this.currentVolume *100)+ "%"; 
                (videoVolProgressElems[1] as HTMLElement).style.left = (this.currentVolume * 100) + "%"
                videoContentElem.volume = this.currentVolume;

            } else {
                //静音
                videovolumeIcoElem.className = styles.videoVolumeCloseIco;
                (videoVolProgressElems[0] as HTMLElement).style.width =   "0%"; 
                (videoVolProgressElems[1] as HTMLElement).style.left = "0%" 
                videoContentElem.volume = 0;
            }
        });

        // 音量条拖拽
        videoVolProgressElems[1].addEventListener("mousedown",function(event:MouseEvent){
            videoVolProgressTextTipsElem.style.display = "block";
            let downX = event.pageX;
            let downL = this.offsetLeft;
            document.onmousemove = (ev:MouseEvent)=>{
                let scale = (ev.pageX - downX + downL) / this.parentNode.offsetWidth;
                scale = scale < 0 ? 0 :scale >1 ? 1:scale;
                (videoVolProgressElems[0] as HTMLElement).style.width =  (scale *100)+ "%"; 
                this.style.left = (scale * 100) + "%"
                this.currentVolume = videoContentElem.volume = scale;
                videoVolProgressTextTipsElem.innerText = Math.round(scale * 100) + "%";
                videovolumeIcoElem.className = scale > 0 ? styles.videoVolumeIco:styles.videoVolumeCloseIco;
            }
            document.onmouseup = () => {
                videoVolProgressTextTipsElem.style.display = "none";
                document.onmousemove = document.onmouseup = null;
            }
            event.preventDefault();

        });



        //播放按钮监听点击事件->播放和暂停
        videoPlayElem.addEventListener("click",()=>{
            if(videoContentElem.paused){
                videoContentElem.play();
            } else {
                videoContentElem.pause();
            }
        });

        //全屏按钮监听事件
        videoFullElem.addEventListener("click",()=>{
            if(videoContentElem.requestFullscreen){
                videoContentElem.requestFullscreen()
            }
        });
        function second(second:number){
            second = second || 0;
            if (second === 0 || second === Infinity || second.toString() === 'NaN') {
              return '00:00';
            }
            const add0 = (num) => (num < 10 ? '0' + num : '' + num);
            const hour = Math.floor(second / 3600);
            const min = Math.floor((second - hour * 3600) / 60);
            const sec = Math.floor(second - hour * 3600 - min * 60);
            return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':');
        }
    }
}
export default video;