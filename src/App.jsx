import { useState } from "react"
import PixelCanvas from "./components/PixelCanvas"
import Hand from "./components/Hand/Hand"
import DrawingTool from "./components/DrawingTool/DrawingTool"
import Pencil from "./components/Pencil/Pencil"

function App() {
  const [pencilColor, setPencilColor] = useState('black')
  const [tool, setTool] = useState('hand')

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px', minHeight: 800 }}>
      <PixelCanvas color={pencilColor} tool={tool} />

      <div>
        <Hand tool={tool} setTool={setTool}/>
        
        <DrawingTool 
          tool={tool} setTool={setTool}
          colorPencil={pencilColor} setColorPencil={setPencilColor}/>
      </div>
    </div>
  )
}

export default App
