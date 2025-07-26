import React, {useEffect, useState} from "react"
// import ReactDOM from "react-dom"
// import {BrowserRouter as Router} from "react-router-dom"
// import TitleBar from "./components/TitleBar"
import Live2DModel from "./live2dRender"
import {Live2DCubismModel} from "live2d-renderer"
// import "./demo.less"

// require.context("../assets", true)

export const ModelContext = React.createContext<{model: string; setModel: React.Dispatch<React.SetStateAction<string>>}>({model: "", setModel: () => null})
export const AudioContext = React.createContext<{audio: string; setAudio: React.Dispatch<React.SetStateAction<string>>}>({audio: "", setAudio: () => null})
export const Live2DContext = React.createContext<{live2D: Live2DCubismModel | null; setLive2D: React.Dispatch<React.SetStateAction<Live2DCubismModel | null>>}>({live2D: null, setLive2D: () => null})

const Live2dProvider: React.FunctionComponent = (props) => {
    const [model, setModel] = useState("/Hiyori.zip")
    const [audio, setAudio] = useState("")
    const [live2D, setLive2D] = useState(null as Live2DCubismModel | null)

    return (
        <div className="app">
            <AudioContext.Provider value={{audio, setAudio}}>
            <ModelContext.Provider value={{model, setModel}}>
            <Live2DContext.Provider value={{live2D, setLive2D}}>
                <Live2DModel/>
            </Live2DContext.Provider>
            </ModelContext.Provider>
            </AudioContext.Provider>
        </div>
    )
}

export default Live2dProvider;