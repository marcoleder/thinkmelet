import React, { useState } from "react";
import { Card, CardContent, Button, Typography, Box } from "@mui/material";
import questionsData from "./questions.json"; // Ensure the correct path

export function QuizComponent({ onAnswerSelected }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const questions = questionsData.questions;

    const handleAnswerClick = (answer) => {
        // Send the answer details to the parent component
        if (onAnswerSelected) {
            onAnswerSelected({
                reason: answer.reason,
                pullsToPersona: answer.pullsToPersona,
            });
        }
        // Move to the next question, if available
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Optionally, handle quiz completion
            console.log("Quiz completed!");
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" align={"center"} sx={{ mt: 1 }}>
                    {currentQuestion.questionText}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
                    {currentQuestion.answers.map((answer, idx) => (
                        <Button
                            key={idx}
                            variant="outlined"
                            onClick={() => handleAnswerClick(answer)}
                            sx={{ mb: 1 }}

                        >
                            {answer.answerText}
                        </Button>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}

export default QuizComponent;
