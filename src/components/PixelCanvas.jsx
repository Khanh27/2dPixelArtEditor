import { useEffect, useRef, useState } from "react"


function PixelCanvas({color, tool}) {

    const heightCanvas = 800
    const widthCanvas = 800


    const [draw, setDraw] = useState(false)
    // State for panning (viewport offset)
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStart = useRef({ x: 0, y: 0 });

    //zoom
    const [zoom, setZoom] = useState(1)
    let pixelSize = 20 * zoom 

    //storing pixel drew as data structures
    const [pixels, setPixels] = useState({})


    //canvas not needed for rendering hence using hook
    const canvasRef = useRef()
    const gridCanvasRef = useRef()
    const containerRef = useRef()

    //to handle the click and drag to draw things
    //we need 3 components here, handle when mouse is down
    //mouse is up, and mouse is moving
    //for mouse is down and moving, we set the state draw to true to draw things
    //for mouse is up, we set the draw state to be false to stop drawing

    function handleMouseDown(e) {
        // If middle mouse or right mouse, start panning
        if (e.button === 1 || (tool === 'hand' && e.button === 0)) {
            setIsPanning(true);
            panStart.current = {
                x: e.clientX - offset.x,
                y: e.clientY - offset.y
            };
        } else {
            setDraw(true);
            handleDraw(e);
        }
    }


    function handleMouseMove(e) {
        if (isPanning) {
            setOffset({
                x: e.clientX - panStart.current.x,
                y: e.clientY - panStart.current.y
            });
        } else if (draw) {
            handleDraw(e);
        }
    }


    function handleMouseUp() {
        setDraw(false);
        setIsPanning(false);
    }

    //draw gridlines for canvas
    function gridLines() {
        //interact with canvas to draw gridlines
        const canvasCtx = gridCanvasRef.current.getContext("2d");
        canvasCtx.clearRect(0, 0, widthCanvas, heightCanvas);
        //set grid line color and thickness of line
        canvasCtx.strokeStyle = "#ccc"; //grey lines
        canvasCtx.lineWidth = 0.5;
        //draw in intervals, offset by viewport
        for (let x = -offset.x % pixelSize; x <= widthCanvas; x += pixelSize) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(x, 0);
            canvasCtx.lineTo(x, heightCanvas);
            canvasCtx.stroke();
        }
        for (let y = -offset.y % pixelSize; y <= heightCanvas; y += pixelSize) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(0, y);
            canvasCtx.lineTo(widthCanvas, y);
            canvasCtx.stroke();
        }
    }

    //useEffect to synchronize the canvas component with the
    //external system. In this case, it's the canvas api
    //also useEffect run after the component is being rendered
    useEffect(() => {
        //get canvas
        const canvas = canvasRef.current;
        //interact with the canvas
        const ctx = canvas.getContext("2d");
        //side effect to disable image smoothing
        gridLines();
        ctx.clearRect(0, 0, widthCanvas, heightCanvas)
        Object.entries(pixels).forEach(([key, color]) => {
            const [x, y] = key.split(',').map(Number)
            ctx.fillStyle = color
            ctx.fillRect(x * pixelSize - offset.x, y * pixelSize - offset.y, pixelSize, pixelSize);
        })
        ctx.imageSmoothingEnabled = false;
    }, [offset, pixels, zoom]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        function handleWheel(e) {
            e.preventDefault();
            // Get mouse position relative to the container
            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            // Calculate world (grid) coordinates under mouse before zoom
            const worldX = mouseX + offset.x;
            const worldY = mouseY + offset.y;
            const gridX = worldX / zoom;
            const gridY = worldY / zoom;

            // Calculate new zoom
            let newZoom = zoom;
            if (e.deltaY < 0) {
                newZoom = Math.min(zoom * 1.1, 4);
            } else {
                newZoom = Math.max(zoom / 1.1, 0.2);
            }
            // Calculate new offset so grid point under mouse stays under mouse
            const newOffsetX = gridX * newZoom - mouseX;
            const newOffsetY = gridY * newZoom - mouseY;
            setZoom(newZoom);
            setOffset({ x: newOffsetX, y: newOffsetY });
        }

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, [zoom, offset]);

    //when we click on the canvas, a pixel will be filled with the
    //indicated color above
    const handleDraw = (e) => {
        //get the position and size of the canvas
        const rect = canvasRef.current.getBoundingClientRect();
        //To calculate which pixel is clicked, we divide the mouse position 
        //by pixelSize, which gives the index of the pixel along the x and y axes. 
        //Since we're working with grid-based drawing, we need to use
        //Math.floor() to ensure we get whole numbers (rounded down)
        const x = Math.floor((e.clientX - rect.left + offset.x) / pixelSize);
        const y = Math.floor((e.clientY - rect.top + offset.y) / pixelSize);

        
        if (tool === 'pencil') {
            setPixels(prev => ({ ...prev, [`${x},${y}`]: color }));
        } else if (tool === 'eraser') {
            setPixels(prev => {
                const copy = { ...prev };
                delete copy[`${x},${y}`];
                return copy;
            });
        }
    };

    return (
        <div>
            {/* Container for layered canvases */}
            {/* 
                since canvas only allow to have one layer,
                we create multiple canvas, where background is the grid
                foreground is the layer to draw and erase. Then
                we layered them using css
                
            */}
            <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: widthCanvas }}>
                <div ref={containerRef} style={{ position: 'relative', width: widthCanvas, height: heightCanvas, marginBottom: 24 }}>
                    {/* Background canvas for grid - bottom layer */}
                    <canvas
                        ref={gridCanvasRef}
                        width={widthCanvas}
                        height={heightCanvas}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 1,
                            border: '1px solid #000'
                        }}
                    />
                    {/* Foreground canvas for drawing - top layer */}
                    <canvas
                        ref={canvasRef}
                        width={widthCanvas}
                        height={heightCanvas}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 2,
                            cursor: tool === 'pencil' ? 'crosshair' : 'grab'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default PixelCanvas