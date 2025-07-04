import ColorPalette from "../ColorPalette/ColorPalette"
import Eraser from "../Eraser/Eraser"
import Pencil from "../Pencil/Pencil"


function DrawingTool({tool, colorPencil, setColorPencil, setTool}){
    return (
        <div>
            <Pencil tool={tool} setTool={setTool} />
            {tool === 'pencil' && (
                <>
                <ColorPalette color={colorPencil} setColor={setColorPencil} />
                <Eraser tool={tool} setTool={setTool} />
                </>
            )}
        </div>
    )
}

export default DrawingTool