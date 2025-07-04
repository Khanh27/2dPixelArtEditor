
function Eraser({ tool, setTool }) {
    return (
        <button
            onClick={() => setTool('eraser')}
            style={{
                padding: '10px 20px',
                background: tool === 'eraser' ? '#eee' : '#fff',
                border: tool === 'eraser' ? '2px solid #333' : '1px solid #ccc',
                borderRadius: 4,
                cursor: 'pointer'
            }}
        >
            🧽 Eraser
        </button>
    );
}

export default Eraser