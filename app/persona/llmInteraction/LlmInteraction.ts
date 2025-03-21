const constructPrompt = (motivation: number, clueless: number, hesitant: number, interaction: string) => {
  return {
    context: {
        personas: {
            clueless: "He is a pragmatic managing director focused heavily on daily operations rather than strategic growth. Rarely initiating innovation himself, he prefers stability, reliability, and known networks over new ventures. He requires practical, low-risk innovation opportunities clearly demonstrating tangible benefits.",
            motivated:
                "He is a strategic CEO driven by innovation and closely follows technological trends like electromobility and autonomous driving. His perfectionism and high workload sometimes delay initiatives, yet he relies heavily on data-driven decisions and careful planning. Balancing economic viability with sustainability is critical for his company's success.",
            hesitant:
                "He is a cautious, risk-averse CEO who carefully evaluates innovations, favoring incremental changes with clear economic benefits. Skeptical about automation and digitalization, he prioritizes financial stability amid rising competition and price pressures. Reliable partners, evidence of profitability, and gradual integration of new technologies are essential to earning his trust."
        },
        current_classification: {
                motivated: `${motivation}%`,
                clueless: `${clueless}%`,
                hesitant: `${hesitant}%`
            }
        },
        instruction:
            "Evaluate if the interaction shifts exactly one persona ('motivated', 'clueless', or 'hesitant'), or none. Provide structured JSON indicating if one persona score changes (true/false), which persona, (always an increase) shift magnitude (1 minor - 10 major), and a one-sentence explanation if applicable. Provide only the structured output.",
        interaction_to_be_analyzed: interaction,
        required_output_format_example: {
            change_occurred: true,
            persona_changed: "motivated",
            direction: "increase",
            scale: 4,
            reason:
                "The user shows increased interest in strategic planning and technology trends."
        },
        required_output_format_example2: {
            change_occurred: false,
            persona_changed: "",
            direction: "",
            scale: 0,
            reason: ""
        }
    };
};

export const askGpt = async (motivation: number, clueless: number, hesitant: number, interaction: string) => {
    const prompt = constructPrompt(motivation, clueless, hesitant, interaction);

    // Define the JSON schema for structured output
    const jsonSchema = {
        "type": "object",
        "properties": {
            "change_occurred": {
                "type": "boolean",
                "description": "Indicates if a persona classification changed."
            },
            "persona_changed": {
                "type": "string",
                "description": "The persona that changed (if applicable).",
                "enum": ["motivated", "clueless", "hesitant", ""]
            },
            "scale": {
                "type": "integer",
                "description": "The magnitude of change on a scale of 1-10.",
            },
            "reason": {
                "type": "string",
                "description": "A brief explanation of why the change occurred."
            }
        },
        "required": ["change_occurred", "persona_changed", "scale", "reason"],
        "additionalProperties": false
    };

    // Build the payload including the response_format parameter for structured output
    const payload = {
        model: "gpt-4o",
        messages: [
            {role: "system", content: "You are ChatGPT, a helpful assistant."},
            {role: "user", content: JSON.stringify(prompt)}
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "persona_change",
                strict: true,
                schema: jsonSchema
            }
        },
        temperature: 0.7,
    };

    // Send API request to ChatGPT
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`
        },
        body: JSON.stringify(payload)
    });

    // Parse the JSON response from the API
    const data = await response.json();
    const messageContent = data.choices[0].message.content;

    try {
        const parsedResponse = JSON.parse(messageContent);
        return parsedResponse;
    } catch (error) {
        console.error("Failed to parse response as JSON:", error);
        // If parsing fails, return the raw message wrapped in an object
        return {raw: messageContent};
    }
};
