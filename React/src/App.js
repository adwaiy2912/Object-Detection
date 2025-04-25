import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home/Home";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
   // Manage the selected model in the parent (App)
   const [selectedModel, setSelectedModel] = useState("yoloV8");

   return (
      <div className="App">
         <Header
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
         />

         <Home selectedModel={selectedModel} />

         <Footer />
      </div>
   );
}

export default App;
