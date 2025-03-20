"use client";

import React, { useState } from "react";
import TriangleComponent, { TriangleVisualization } from "@/app/persona/TriangleComponent";
import {
    Typography,
    Button,
    Card,
    CardContent,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
} from "@mui/material";
import QuizComponent from "@/app/persona/quiz";

export function findPersona() {
    const [motivated, setMotivated] = useState(100);
    const [clueless, setClueless] = useState(100);
    const [hesitant, setHesitant] = useState(100);

    // Log for the latest modification details
    const [modificationLog, setModificationLog] = useState("");

    const [showTriangle, setShowTriangle] = useState(true);

    const toggleTriangle = () => {
        setShowTriangle((prev) => !prev);
    };

    const handleAnswerSelected = (answer) => {
        // Define adjustment values
        const adjustment = 20;
        const reduction = 10;

        // Compute new values based on current state
        let newMotivated = motivated;
        let newClueless = clueless;
        let newHesitant = hesitant;

        if (answer.pullsToPersona.includes("Motivated")) {
            newMotivated = motivated + adjustment;
            newClueless = Math.max(clueless - reduction, 0);
            newHesitant = Math.max(hesitant - reduction, 0);
        } else if (answer.pullsToPersona.includes("Clueless")) {
            newClueless = clueless + adjustment;
            newMotivated = Math.max(motivated - reduction, 0);
            newHesitant = Math.max(hesitant - reduction, 0);
        } else if (answer.pullsToPersona.includes("Hesitant")) {
            newHesitant = hesitant + adjustment;
            newMotivated = Math.max(motivated - reduction, 0);
            newClueless = Math.max(clueless - reduction, 0);
        }

        // Calculate old normalized percentages
        const oldTotal = motivated + clueless + hesitant;
        const oldMotivatedPct = oldTotal ? (motivated / oldTotal) * 100 : 0;
        const oldCluelessPct = oldTotal ? (clueless / oldTotal) * 100 : 0;
        const oldHesitantPct = oldTotal ? (hesitant / oldTotal) * 100 : 0;

        // Calculate new normalized percentages
        const newTotal = newMotivated + newClueless + newHesitant;
        const newMotivatedPct = newTotal ? (newMotivated / newTotal) * 100 : 0;
        const newCluelessPct = newTotal ? (newClueless / newTotal) * 100 : 0;
        const newHesitantPct = newTotal ? (newHesitant / newTotal) * 100 : 0;

        // Compute changes
        const deltaMotivated = (newMotivatedPct - oldMotivatedPct).toFixed(0);
        const deltaClueless = (newCluelessPct - oldCluelessPct).toFixed(0);
        const deltaHesitant = (newHesitantPct - oldHesitantPct).toFixed(0);

        // Craft the log message showing percentual changes
        const newLog =
            `Last change:\n\n` +
            `Motivated: ${oldMotivatedPct.toFixed(0)}% → ${newMotivatedPct.toFixed(0)}% (Δ ${deltaMotivated}%)\n` +
            `Clueless: ${oldCluelessPct.toFixed(0)}% → ${newCluelessPct.toFixed(0)}% (Δ ${deltaClueless}%)\n` +
            `Hesitant: ${oldHesitantPct.toFixed(0)}% → ${newHesitantPct.toFixed(0)}% (Δ ${deltaHesitant}%)\n\n` +
            `Reasoning: ${answer.reason}`;

        // Update the states with new values
        setMotivated(newMotivated);
        setClueless(newClueless);
        setHesitant(newHesitant);
        setModificationLog(newLog);
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" align="center" sx={{ mb: 1 }}>
                Persona
            </Typography>

            {/* Quiz Component: passes the callback for answer selection */}
            <QuizComponent onAnswerSelected={handleAnswerSelected} />

            {/* Triangle Visualization: receives the latest persona values and log */}
            <Button variant="contained" onClick={toggleTriangle} sx={{ my: 2 }}>
                {showTriangle ? "Hide Persona-Finding Process" : "Show Persona-Finding Process"}
            </Button>
            {showTriangle && (
                <TriangleVisualization
                    motivated={motivated}
                    clueless={clueless}
                    hesitant={hesitant}
                    reason={modificationLog}  // passed as the "reason" field
                />
            )}
        </Box>
    );
}

export default findPersona;
