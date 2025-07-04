function Hand({tool, setTool}) {
    return (
        <button
            onClick={() => setTool('hand')}
            style={{
                padding: '10px 20px',
                background: tool === 'hand' ? '#eee' : '#fff',
                border: tool === 'hand' ? '2px solid #333' : '1px solid #ccc',
                borderRadius: 4,
                cursor: 'pointer'
            }}
        >
            Hand
        </button>
    )
}

export default Hand