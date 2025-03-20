import React, { useState } from 'react';

const TriangleVisualization = () => {
    // Define state for each persona's value
    const [persona1, setPersona1] = useState(33);
    const [persona2, setPersona2] = useState(33);
    const [persona3, setPersona3] = useState(34);

    // Define the vertices of an equilateral triangle (SVG coordinates)
    const vertex1 = { x: 150, y: 10 };  // Top vertex
    const vertex2 = { x: 10, y: 290 };  // Bottom left
    const vertex3 = { x: 290, y: 290 }; // Bottom right

    // Calculate the total sum of values (to normalize the weights)
    const total = persona1 + persona2 + persona3;
    const w1 = total ? persona1 / total : 0;
    const w2 = total ? persona2 / total : 0;
    const w3 = total ? persona3 / total : 0;

    // Compute the point position using barycentric coordinates (weighted average)
    const point = {
        x: w1 * vertex1.x + w2 * vertex2.x + w3 * vertex3.x,
        y: w1 * vertex1.y + w2 * vertex2.y + w3 * vertex3.y,
    };

    return (
        <div>
            <h2>Triangle Persona Visualization</h2>
            <svg width="300" height="300" style={{ border: "1px solid black" }}>
                {/* Draw the triangle */}
                <polygon
                    points={`${vertex1.x},${vertex1.y} ${vertex2.x},${vertex2.y} ${vertex3.x},${vertex3.y}`}
                    fill="none"
                    stroke="black"
                />
                {/* Draw the point based on persona proportions */}
                <circle cx={point.x} cy={point.y} r="5" fill="red" />
            </svg>
            <div style={{ marginTop: '1rem' }}>
                <label>
                    Persona 1:
                    <input
                        type="number"
                        value={persona1}
                        onChange={(e) => setPersona1(parseFloat(e.target.value))}
                        style={{ margin: "0 10px" }}
                    />
                </label>
                <label>
                    Persona 2:
                    <input
                        type="number"
                        value={persona2}
                        onChange={(e) => setPersona2(parseFloat(e.target.value))}
                        style={{ margin: "0 10px" }}
                    />
                </label>
                <label>
                    Persona 3:
                    <input
                        type="number"
                        value={persona3}
                        onChange={(e) => setPersona3(parseFloat(e.target.value))}
                        style={{ margin: "0 10px" }}
                    />
                </label>
            </div>
        </div>
    );
};

export default TriangleVisualization;
