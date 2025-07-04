
function Pencil({ tool, setTool }) {
    return (
        <button
            onClick={() => setTool('pencil')}
            style={{
                padding: '10px 20px',
                background: tool === 'pencil' ? '#eee' : '#fff',
                border: tool === 'pencil' ? '2px solid #333' : '1px solid #ccc',
                borderRadius: 4,
                cursor: 'pointer',
                marginRight: 8
            }}
        >
            ✏️ Pencil
        </button>
    );
}

export default Pencil