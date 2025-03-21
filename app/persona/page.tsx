"use client";

import React, { useEffect, useState } from "react";
import { TriangleVisualization } from "@/app/persona/TriangleComponent";
import { Box, Button, Typography } from "@mui/material";
import QuizComponent from "@/app/persona/quiz";
import { askGpt } from "@/app/persona/llmInteraction/LlmInteraction";
import { useRouter } from "next/navigation";

const findPersona = ()=> {
    // Initialize the router hook
    const router = useRouter();

    // Initialize state from localStorage if available, otherwise default to 100 or empty string.
    const [motivated, setMotivated] = useState(() => {
        const stored = localStorage.getItem("motivated");
        return stored ? parseInt(stored, 10) : 100;
    });
    const [clueless, setClueless] = useState(() => {
        const stored = localStorage.getItem("clueless");
        return stored ? parseInt(stored, 10) : 100;
    });
    const [hesitant, setHesitant] = useState(() => {
        const stored = localStorage.getItem("hesitant");
        return stored ? parseInt(stored, 10) : 100;
    });
    const [modificationLog, setModificationLog] = useState(() => {
        const stored = localStorage.getItem("modificationLog");
        return stored ? stored : "";
    });

    const [showTriangle, setShowTriangle] = useState(false);

    const toggleTriangle = () => {
        setShowTriangle((prev) => !prev);
    };

    // Update localStorage whenever any of the tracked states change
    useEffect(() => {
        localStorage.setItem("motivated", motivated.toString());
        localStorage.setItem("clueless", clueless.toString());
        localStorage.setItem("hesitant", hesitant.toString());
        localStorage.setItem("modificationLog", modificationLog);
    }, [motivated, clueless, hesitant, modificationLog]);

    const handleAnswerSelected = (answer: any) => {
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

    // New function to get prompt modifications via the LLM
    const getPromptModification = async (interaction: any) => {
        const response = await askGpt(motivated, clueless, hesitant, interaction);
        return response;
    };

    const handleRedirect = () => {
        router.push("/company");
    };

    // Function to simulate a prompt interaction and apply modifications
    const simulatePrompt = async (interaction: any) => {
        // Capture current state values before modification
        const currentMotivated = motivated;
        const currentClueless = clueless;
        const currentHesitant = hesitant;
        const oldTotal = currentMotivated + currentClueless + currentHesitant;
        const oldMotivatedPct = oldTotal ? (currentMotivated / oldTotal) * 100 : 0;
        const oldCluelessPct = oldTotal ? (currentClueless / oldTotal) * 100 : 0;
        const oldHesitantPct = oldTotal ? (currentHesitant / oldTotal) * 100 : 0;

        const response = await getPromptModification(interaction);

        if (response.change_occurred && response.persona_changed !== "") {
            const adjustment = response.scale * 2; // Adjust factor for demonstration
            const reduction = response.scale; // Adjust factor for demonstration

            let newMotivated = currentMotivated;
            let newClueless = currentClueless;
            let newHesitant = currentHesitant;

            if (response.persona_changed === "motivated") {
                newMotivated = currentMotivated + adjustment;
                newClueless = Math.max(currentClueless - reduction, 0);
                newHesitant = Math.max(currentHesitant - reduction, 0);
            } else if (response.persona_changed === "clueless") {
                newClueless = currentClueless + adjustment;
                newMotivated = Math.max(currentMotivated - reduction, 0);
                newHesitant = Math.max(currentHesitant - reduction, 0);
            } else if (response.persona_changed === "hesitant") {
                newHesitant = currentHesitant + adjustment;
                newMotivated = Math.max(currentMotivated - reduction, 0);
                newClueless = Math.max(currentClueless - reduction, 0);
            }

            // Calculate new normalized percentages
            const newTotal = newMotivated + newClueless + newHesitant;
            const newMotivatedPct = newTotal ? (newMotivated / newTotal) * 100 : 0;
            const newCluelessPct = newTotal ? (newClueless / newTotal) * 100 : 0;
            const newHesitantPct = newTotal ? (newHesitant / newTotal) * 100 : 0;

            // Compute changes
            const deltaMotivated = (newMotivatedPct - oldMotivatedPct).toFixed(0);
            const deltaClueless = (newCluelessPct - oldCluelessPct).toFixed(0);
            const deltaHesitant = (newHesitantPct - oldHesitantPct).toFixed(0);

            // Craft the log message in the same format
            const newLog =
                `Last change:\n\n` +
                `Motivated: ${oldMotivatedPct.toFixed(0)}% → ${newMotivatedPct.toFixed(0)}% (Δ ${deltaMotivated}%)\n` +
                `Clueless: ${oldCluelessPct.toFixed(0)}% → ${newCluelessPct.toFixed(0)}% (Δ ${deltaClueless}%)\n` +
                `Hesitant: ${oldHesitantPct.toFixed(0)}% → ${newHesitantPct.toFixed(0)}% (Δ ${deltaHesitant}%)\n\n` +
                `Reasoning: ${response.reason}`;

            // Update state with new values and log
            setMotivated(newMotivated);
            setClueless(newClueless);
            setHesitant(newHesitant);
            setModificationLog(newLog);
        } else {
            // If no change occurred, log the LLM response raw
            setModificationLog(`LLM response:\n${JSON.stringify(response, null, 2)}`);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" align="center" sx={{ mb: 1 }}>
                Persona Analysis Quiz
            </Typography>

            {/* Quiz Component: passes the callback for answer selection */}
            <QuizComponent onAnswerSelected={handleAnswerSelected} />

            {/* Triangle Visualization: receives the latest persona values and log */}
            <Box sx={{ textAlign: 'center' }}>
                <Button
                    variant="contained"
                    onClick={toggleTriangle}
                    sx={{ my: 2, mx: 3 }}
                >
                    {showTriangle ? "Hide Persona-Finding Process" : "Show Persona-Finding Process"}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleRedirect}
                    sx={{ my: 2, mx: 3 }}
                >
                    I answered enough
                </Button>
            </Box>
            {showTriangle && (
                <TriangleVisualization
                    motivated={motivated}
                    clueless={clueless}
                    hesitant={hesitant}
                    reason={modificationLog}
                    buttonPress={simulatePrompt} // passed as the "reason" field
                />
            )}
        </Box>
    );
}

export default findPersona;
