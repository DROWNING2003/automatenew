import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Routes, Route} from "react-router-dom";
import Classes from "./pages/Classes";
import AutoMate from "./pages/AutoMate";
import BackgroundHero from "./pages/Background";

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Routes>
      <Route path='/' element = {<Classes/>}/>
      <Route path='automate' element = {<AutoMate />}/>
    </Routes>
   
  );
}

export default App;
