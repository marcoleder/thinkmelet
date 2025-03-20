"use client";

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const TriangleVisualization = ({ motivated, clueless, hesitant, modificationLog }) => {
    // Define the vertices of an equilateral triangle (SVG coordinates)
    const vertexMotivated = { x: 150, y: 10 };   // Top vertex - Motivated
    const vertexClueless = { x: 10, y: 290 };     // Bottom left - Clueless
    const vertexHesitant = { x: 290, y: 290 };      // Bottom right - Hesitant

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

    return (
        <Paper elevation={4}>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                    {/* Left: SVG triangle visualization */}
                    <Paper elevation={0} sx={{ p: 1 }}>
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
                            <text x={vertexMotivated.x} y={vertexMotivated.y - 10} textAnchor="middle" fontSize="12">
                                Motivated
                            </text>
                            <text x={vertexClueless.x} y={vertexClueless.y + 20} textAnchor="middle" fontSize="12">
                                Clueless
                            </text>
                            <text x={vertexHesitant.x} y={vertexHesitant.y + 20} textAnchor="middle" fontSize="12">
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
                            alignItems: 'center',
                            gap: 1,
                            height: '100%'
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

                    {/* Right: Modification log */}
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
                                    whiteSpace: 'pre-wrap'
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
