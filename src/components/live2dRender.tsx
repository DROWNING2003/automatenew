// import React, {useEffect, useRef, useState, useContext, useReducer} from "react"
// import {ModelContext, AudioContext, Live2DContext} from "./live2dProvider"
// // import zoomLock from "../../assets/zoomlock.png"
// // import zoomLocked from "../../assets/zoomlocked.png"
// // import zoomIn from "../../assets/zoomin.png"
// // import zoomOut from "../../assets/zoomout.png"
// // import halfSpeed from "../../assets/0.5x.png"
// // import normalSpeed from "../../assets/1x.png"
// // import doubleSpeed from "../../assets/2x.png"
// // import pause from "../../assets/pause.png"
// // import play from "../../assets/play.png"
// import {Live2DCubismModel, compressLive2DTextures} from "live2d-renderer"
// // import "./styles/live2dmodel.less"

// const audioContext = new window.AudioContext()

// const Live2DModel: React.FunctionComponent = (props) => {
//     const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
//     const {model, setModel} = useContext(ModelContext)
//     const {audio, setAudio} = useContext(AudioContext)
//     const {live2D, setLive2D} = useContext(Live2DContext)
//     const [controlHover, setControlHover] = useState(false)
//     const [speed, setSpeed] = useState(1)
//     const [paused, setPaused] = useState(false)
//     const [enableZoom, setEnableZoom] = useState(true)
//     const [canvasSize, setCanvasSize] = useState(Math.min(window.innerWidth, 700))
//     const rendererRef = useRef<HTMLCanvasElement>(null)

//     useEffect(() => {
//         const handleResize = () => setCanvasSize(Math.min(window.innerWidth, 700))
//         window.addEventListener("resize", handleResize)
//         return () => window.removeEventListener("resize", handleResize)
//     }, [])

//     const load = async () => {
//         let cubismCorePath = "https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"
//         const live2DModel = new Live2DCubismModel(rendererRef.current!, {cubismCorePath, scale: 1, scaledYPos: false})
//         live2DModel.canvas.width = 700
//         live2DModel.canvas.height = 700

//         /*
//         const arrayBuffer = await fetch(model).then((r) => r.arrayBuffer())
//         const newBuffer = await compressLive2DTextures(arrayBuffer)
//         console.log(URL.createObjectURL(new Blob([new Uint8Array(newBuffer)])))*/

//         await live2DModel.load(model)
//         setLive2D(live2DModel)
//     }

//     useEffect(()=> {
//         load()
//     }, [model])

//     const loadAudio = async () => {
//         if (!live2D || !audio) return
//         const arrayBuffer = await fetch(audio).then((r) => r.arrayBuffer())
//         live2D.inputAudio(arrayBuffer, true)
//     }

//     useEffect(() => {
//         loadAudio()
//     }, [live2D, audio])

//     useEffect(() => {
//         if (!live2D) return
//         live2D.paused = paused
//         live2D.speed = speed
//         live2D.zoomEnabled = enableZoom
//         forceUpdate()
//     }, [live2D, paused, speed, enableZoom])

//     const changeSpeed = () => {
//         if (speed === 0.5) setSpeed(1)
//         if (speed === 1) setSpeed(2)
//         if (speed === 2) setSpeed(0.5)
//     }

//     // const zoomLockIcon = () => {
//     //     return enableZoom ? zoomLock : zoomLocked
//     // }

//     // const speedIcon = () => {
//     //     if (speed === 0.5) return halfSpeed
//     //     if (speed === 1) return normalSpeed
//     //     if (speed === 2) return doubleSpeed
//     // }

//     return (
//         <div className="live2d-model-container">
//             {live2D ? <div className={`live2d-controls ${controlHover ? "live2d-controls-visible" : ""}`} 
//             onMouseEnter={() => setControlHover(true)} onMouseLeave={() => setControlHover(false)}>
//                 {/* <img draggable={false} className="live2d-control-icon" src={zoomLockIcon()} onClick={() => setEnableZoom((prev) => !prev)}/>
//                 <img draggable={false} className="live2d-control-icon" src={zoomOut} onClick={() => live2D.zoomOut()}/>
//                 <img draggable={false} className="live2d-control-icon" src={zoomIn} onClick={() => live2D.zoomIn()}/>
//                 <img draggable={false} className="live2d-control-icon" src={live2D.paused ? play : pause} onClick={() => setPaused((prev) => !prev)}/>
//                 <img draggable={false} className="live2d-control-icon" src={speedIcon()} onClick={changeSpeed}/> */}
//             </div> : null}
//             <canvas ref={rendererRef} width={canvasSize} height={canvasSize}></canvas>
//         </div>
//     )
// }

// export default Live2DModel
import React, { useEffect, useRef, useState, useContext, useReducer } from "react"
import { ModelContext, AudioContext, Live2DContext } from "./live2dProvider"
import { Live2DCubismModel, compressLive2DTextures } from "live2d-renderer"

const audioContext = new window.AudioContext()

const Live2DModel: React.FunctionComponent = (props) => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const { model, setModel } = useContext(ModelContext)
    const { audio, setAudio } = useContext(AudioContext)
    const { live2D, setLive2D } = useContext(Live2DContext)
    const [controlHover, setControlHover] = useState(false)
    const [speed, setSpeed] = useState(1)
    const [paused, setPaused] = useState(false)
    const [enableZoom, setEnableZoom] = useState(true)
    const [canvasSize, setCanvasSize] = useState(Math.min(window.innerWidth, 700))
    const rendererRef = useRef<HTMLCanvasElement>(null)

    const loop = async()=>{
        live2D?.update()
        live2D?.setParameter("ParamMouthOpenY", 1)
        window.requestAnimationFrame(loop)
    }

    useEffect(() => {
        const handleResize = () => setCanvasSize(Math.min(window.innerWidth, 700))
        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const load = async () => {
        let cubismCorePath = "https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"
        const live2DModel = new Live2DCubismModel(rendererRef.current!, { autoAnimate: false, cubismCorePath, scale: 1, scaledYPos: false })
        live2DModel.canvas.width = 700
        live2DModel.canvas.height = 700

        // 从public目录读取zip文件
        try {
            const response = await fetch('/Haru.zip'); // 替换为你的zip文件路径
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            // const newBuffer = await compressLive2DTextures(arrayBuffer);
            await live2DModel.load(arrayBuffer);
            setLive2D(live2DModel);
            loop();
        } catch (error) {
            console.error('Error loading model:', error);
        }
    }

    useEffect(() => {
        load()
    }, [model])

    

    const loadAudio = async () => {
        if (!live2D || !audio) return
        try {
            const response = await fetch(audio);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            live2D.inputAudio(arrayBuffer, true);
        } catch (error) {
            console.error('Error loading audio:', error);
        }
    }

    useEffect(() => {
        loadAudio()
    }, [live2D, audio])

    useEffect(() => {
        if (!live2D) return
        live2D.paused = paused
        live2D.speed = speed
        live2D.zoomEnabled = enableZoom
        forceUpdate()
    }, [live2D, paused, speed, enableZoom])

    const changeSpeed = () => {
        if (speed === 0.5) setSpeed(1)
        if (speed === 1) setSpeed(2)
        if (speed === 2) setSpeed(0.5)
    }

    return (
        <div className="live2d-model-container">
            {live2D ? <div className={`live2d-controls ${controlHover ? "live2d-controls-visible" : ""}`}
                onMouseEnter={() => setControlHover(true)} onMouseLeave={() => setControlHover(false)}>
            </div> : null}
            <canvas ref={rendererRef} width={canvasSize} height={canvasSize}></canvas>
            <h1 onClick={async () => {
                const response = await fetch('/录音.mp3'); // 替换为你的zip文件路径
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const arrayBuffer = await response.arrayBuffer();
                console.log(arrayBuffer);
                
                if(live2D?.lipsyncSmoothing){
                    live2D.lipsyncSmoothing = 0.1
                }
                console.log(await live2D?.inputAudio(arrayBuffer));
                
            }}>play</h1>
        </div>
    )
}

export default Live2DModel