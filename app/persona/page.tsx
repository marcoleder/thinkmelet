"use client";

import React from "react";
import TriangleComponent from "@/app/persona/TriangleComponent";
import { Typography } from "@mui/material";
export function findPersona() {
    return <>
        <Typography variant={"h4"} align={"center"} sx={{mb:1}}>Persona</Typography>
        <TriangleComponent></TriangleComponent>
    </>
}

export default findPersona;