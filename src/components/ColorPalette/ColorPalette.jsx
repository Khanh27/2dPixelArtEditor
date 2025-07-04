function ColorPalette({ color, setColor }) {
    const colors = ['black', 'red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    return (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {colors.map((c) => (
                <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                        background: c,
                        width: 32,
                        height: 32,
                        border: color === c ? '3px solid #333' : '1px solid #ccc',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        outline: 'none',
                    }}
                    aria-label={`Select ${c}`}
                />
            ))}
        </div>
    );
}

export default ColorPalette