"use client";

import React, {useState} from 'react';
import {Box, Button, TextField, Typography, Paper} from '@mui/material';

export const TriangleVisualization = () => {
    // Define state for each persona value (raw values for internal use)
    const [motivated, setMotivated] = useState(100);
    const [clueless, setClueless] = useState(100);
    const [hesitant, setHesitant] = useState(100);

    // State for logging external modifications (display only normalized percentages)
    const [modificationLog, setModificationLog] = useState("");

    // Define the vertices of an equilateral triangle (SVG coordinates)
    const vertexMotivated = {x: 150, y: 10};   // Top vertex - Motivated
    const vertexClueless = {x: 10, y: 290};     // Bottom left - Clueless
    const vertexHesitant = {x: 290, y: 290};      // Bottom right - Hesitant

    // Calculate the total (to normalize the weights)
    const total = motivated + clueless + hesitant;
    const wMotivated = total ? motivated / total : 0;
    const wClueless = total ? clueless / total : 0;
    const wHesitant = total ? hesitant / total : 0;

    // Compute the weighted point position using barycentric coordinates
    const point = {
        x: wMotivated * vertexMotivated.x + wClueless * vertexClueless.x + wHesitant * vertexHesitant.x,
        y: wMotivated * vertexMotivated.y + wClueless * vertexClueless.y + wHesitant * vertexHesitant.y,
    };

    // Simulate an external modification; only display normalized (percentage) updates in the log.
    const simulateExternalModification = () => {
        // Compute normalized percentages before update
        const oldTotal = motivated + clueless + hesitant;
        const oldNormMotivated = oldTotal ? (motivated / oldTotal) * 100 : 0;
        const oldNormClueless = oldTotal ? (clueless / oldTotal) * 100 : 0;
        const oldNormHesitant = oldTotal ? (hesitant / oldTotal) * 100 : 0;

        // Example update: decrease motivated by 20, increase clueless by 20, hesitant unchanged.
        // Ensure no raw value becomes negative.
        const newMotivated = Math.max(motivated - 20, 0);
        const newClueless = Math.max(clueless + 20, 0);
        const newHesitant = Math.max(hesitant, 0);

        // Update the state with raw values (for internal computations)
        setMotivated(newMotivated);
        setClueless(newClueless);
        setHesitant(newHesitant);

        // Compute normalized percentages after update
        const newTotal = newMotivated + newClueless + newHesitant;
        const newNormMotivated = newTotal ? (newMotivated / newTotal) * 100 : 0;
        const newNormClueless = newTotal ? (newClueless / newTotal) * 100 : 0;
        const newNormHesitant = newTotal ? (newHesitant / newTotal) * 100 : 0;

        // Update the modification log with only normalized (percentage) information.
        setModificationLog(
            `Last change:\n\n` +
            `Motivated: ${oldNormMotivated.toFixed(0)}% → ${newNormMotivated.toFixed(0)}% (Δ ${(newNormMotivated - oldNormMotivated).toFixed(0)}%)\n` +
            `Clueless: ${oldNormClueless.toFixed(0)}% → ${newNormClueless.toFixed(0)}% (Δ ${(newNormClueless - oldNormClueless).toFixed(0)}%)\n` +
            `Hesitant: ${oldNormHesitant.toFixed(0)}% → ${newNormHesitant.toFixed(0)}% (Δ ${(newNormHesitant - oldNormHesitant).toFixed(0)}%)\n\n` +
            `Reasoning: Me being clueless about what I do boy.`
        );
    };

    return (
        <Paper elevation={4}>
        <Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
            <Box sx={{display: 'flex', alignItems: 'flex-start', gap: 4}}>
                {/* Left: SVG triangle visualization wrapped in a Paper */}
                <Paper elevation={0} sx={{p: 1}}>
                    <svg
                        width="300"
                        height="300"
                        viewBox="-20 -20 340 340"  // Extra margin so labels are fully visible
                    >
                        {/* Draw the triangle */}
                        <polygon
                            points={`${vertexMotivated.x},${vertexMotivated.y} ${vertexClueless.x},${vertexClueless.y} ${vertexHesitant.x},${vertexHesitant.y}`}
                            fill="none"
                            stroke="black"
                        />
                        {/* Labels for each vertex */}
                        <text
                            x={vertexMotivated.x}
                            y={vertexMotivated.y - 10}
                            textAnchor="middle"
                            fontSize="12"
                        >
                            Motivated
                        </text>
                        <text
                            x={vertexClueless.x}
                            y={vertexClueless.y + 20}
                            textAnchor="middle"
                            fontSize="12"
                        >
                            Clueless
                        </text>
                        <text
                            x={vertexHesitant.x}
                            y={vertexHesitant.y + 20}
                            textAnchor="middle"
                            fontSize="12"
                        >
                            Hesitant
                        </text>
                        {/* Draw the weighted point */}
                        <circle cx={point.x} cy={point.y} r="7" fill="red"/>
                    </svg>
                </Paper>

                {/* Center: Normalized percentages */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center', // Centers content horizontally
                        gap: 1,
                        height: '100%' // Ensures it takes up full height for proper centering
                    }}
                >
                    <Typography variant="h6">
                        Motivated: {(wMotivated * 100).toFixed(0)}%
                    </Typography>
                    <Typography variant="h6">
                        Clueless: {(wClueless * 100).toFixed(0)}%
                    </Typography>
                    <Typography variant="h6">
                        Hesitant: {(wHesitant * 100).toFixed(0)}%
                    </Typography>
                </Box>


                {/* Right: Text field for modification log and reasoning */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Paper elevation={0} sx={{ p: 1 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                width: 300,
                                height: 300,
                                overflowY: 'auto',
                                p: 1,
                                bgcolor: 'background.paper',

                                whiteSpace: 'pre-wrap' // Ensures newlines are preserved
                            }}
                        >
                            {modificationLog || "No external modifications yet."}
                        </Typography>
                    </Paper>
                </Box>
            </Box>
        </Box>
        </Paper>
    );
};

export default TriangleVisualization;
