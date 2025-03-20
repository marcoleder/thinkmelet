
    "use client";

import React, {useState} from "react";
import TriangleComponent, {TriangleVisualization} from "@/app/persona/TriangleComponent";
import {
    Typography,
    Button,
    Card,
    CardContent,
    RadioGroup,
    FormControlLabel,
    Radio, Box,
} from "@mui/material";
import QuizComponent from "@/app/persona/quiz";

export function findPersona() {
    const [motivated, setMotivated] = useState(100);
    const [clueless, setClueless] = useState(100);
    const [hesitant, setHesitant] = useState(100);

    // Optional: log the latest modification details (could also be handled in the Triangle component)
    const [modificationLog, setModificationLog] = useState("");

    const [showTriangle, setShowTriangle] = useState(true);

    const toggleTriangle = () => {
        setShowTriangle((prev) => !prev);
    };

    const handleAnswerSelected = (answer) => {
        // For demonstration, adjust the values based on which persona is pulled.
        // For example, add 20 points to the selected persona and subtract 10 from the others.
        const adjustment = 20;
        const reduction = 10;
        let newLog = "";


        if (answer.pullsToPersona.includes("Motivated")) {
            setMotivated((prev) => {
                const newVal = prev + adjustment;
                newLog += `Motivated increased by ${adjustment}.\n`;
                return newVal;
            });
            setClueless((prev) => {
                const newVal = Math.max(prev - reduction, 0);
                newLog += `Clueless decreased by ${reduction}.\n`;
                return newVal;
            });
            setHesitant((prev) => {
                const newVal = Math.max(prev - reduction, 0);
                newLog += `Hesitant decreased by ${reduction}.\n`;
                return newVal;
            });
        } else if (answer.pullsToPersona.includes("Clueless")) {
            setClueless((prev) => {
                const newVal = prev + adjustment;
                newLog += `Clueless increased by ${adjustment}.\n`;
                return newVal;
            });
            setMotivated((prev) => {
                const newVal = Math.max(prev - reduction, 0);
                newLog += `Motivated decreased by ${reduction}.\n`;
                return newVal;
            });
            setHesitant((prev) => {
                const newVal = Math.max(prev - reduction, 0);
                newLog += `Hesitant decreased by ${reduction}.\n`;
                return newVal;
            });
        } else if (answer.pullsToPersona.includes("Hesitant")) {
            setHesitant((prev) => {
                const newVal = prev + adjustment;
                newLog += `Hesitant increased by ${adjustment}.\n`;
                return newVal;
            });
            setMotivated((prev) => {
                const newVal = Math.max(prev - reduction, 0);
                newLog += `Motivated decreased by ${reduction}.\n`;
                return newVal;
            });
            setClueless((prev) => {
                const newVal = Math.max(prev - reduction, 0);
                newLog += `Clueless decreased by ${reduction}.\n`;
                return newVal;
            });
        }

        // Append reasoning from the selected answer to the log
        newLog += `Reasoning: ${answer.reason}`;
        setModificationLog(newLog);
    };

    return (
        <Box sx={{p: 2}}>
            <Typography variant="h4" align="center" sx={{mb: 1}}>
                Persona
            </Typography>

            {/* Quiz Component: passes the callback for answer selection */}
            <QuizComponent onAnswerSelected={handleAnswerSelected}/>

            {/* Triangle Visualization: receives the latest persona values and log */}
            <Button variant="contained" onClick={toggleTriangle} sx={{my: 2}}>
                {showTriangle ? "Hide Persona-Finding Process" : "Show Persona-Finding Process"}
            </Button>
            {showTriangle &&  <TriangleVisualization
              motivated={motivated}
              clueless={clueless}
              hesitant={hesitant}
              modificationLog={modificationLog}
            />}


        </Box>
    );
}

export default findPersona;

