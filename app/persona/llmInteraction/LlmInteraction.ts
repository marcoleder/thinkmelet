import fetch from "node-fetch";

const constructPrompt = (motivation, clueless, hesitant, interaction) => {
    return {
        context: {
            personas: {
                clueless:
                    "He is a pragmatic and routine-oriented managing director who focuses heavily on daily operations rather than strategic growth. Innovation isn't part of his routine because he relies primarily on suppliers and known networks for updates. Although he isn't against innovation, he rarely initiates changes, preferring stability and reliability over new ventures. His exposure to new ideas is minimal, making him reactive rather than proactive when addressing company needs. He requires practical, low-risk innovation opportunities clearly demonstrating tangible benefits.",
                motivated:
                    "He is a strategic CEO driven by innovation, keenly aware of technological trends like electromobility and autonomous driving. Passionate about continuous improvement, he seeks to maintain her company’s competitive edge through carefully planned, impactful investments. Despite her enthusiasm, perfectionism and high workload sometimes delay innovation initiatives. He heavily relies on data-driven decision-making, clear planning, and a highly qualified team to implement innovations successfully. Balancing economic viability with sustainability is critical for her.",
                hesitant:
                    "He is a cautious and risk-averse CEO who carefully evaluates innovations before committing. His decisions are grounded in proven methods, and he maintains strict control over his company’s core processes, wary of becoming dependent on external partners. Skeptical about automation and digitalization due to uncertain returns, he prefers incremental changes with clear economic benefits. He faces rising price pressure and competition, creating urgency to become more efficient but without risking financial stability. Reliable partners, concrete evidence of profitability, and gradual step-by-step integration of new technologies are essential to winning his trust."
            },
            current_classification: {
                motivated: `${motivation}%`,
                clueless: `${clueless}%`,
                hesitant: `${hesitant}%`
            }
        },
        instruction:
            "Given the provided interaction between an AI and a user, analyze how this interaction would influence the user's persona classification. Evaluate if the interaction shifts the persona scores for exactly one persona ('motivated', 'clueless', or 'hesitant'), or none. Provide structured JSON output indicating if exactly one persona score changes (true or false), which persona, the direction of change ('increase', 'decrease', or 'none'), and quantify this shift on a scale from 1 (minor change) to 10 (major change). Include a one-sentence explanation of your reasoning if a change occurs. Below you find examples of how the output has to be structured. Create a similar output for the given user interaction.",
        interaction: interaction,
        required_output_format_example: {
            change_occurred: true,
            persona_changed: "motivated",
            direction: "increase",
            scale: 4,
            reason: "The user shows increased interest in strategic planning and technology trends."
        },
        required_output_format_example2: {
            change_occurred: false,
            persona_changed: "",
            direction: "",
            scale: 0,
            reason: ""
        },
        required_output_format_example3: {
            change_occurred: true,
            persona_changed: "clueless",
            direction: "increase",
            scale: 3,
            reason: "The user is confused by the process of innovation."
        }
    };
};

export const askGpt = async (motivation, clueless, hesitant, interaction) => {
    // Create the prompt object
    const prompt = constructPrompt(motivation, clueless, hesitant, interaction);

    // Prepare the request payload using the ChatGPT API format
    const payload = {
        model: "llama-3.2-11b-vision-instruct",
        messages: [
            { role: "system", content: "You are ChatGPT, a helpful assistant." },
            { role: "user", content: JSON.stringify(prompt) }
        ],
        temperature: 0.7
    };

    // Send API request to ChatGPT
    const response = await fetch("https://ai.marcoleder.ch/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Ich mag Züge` // Replace with your API key
        },
        body: JSON.stringify(payload)
    });

    // Parse the JSON response from the API
    const data = await response.json();

    // Extract the content from the first choice returned
    const messageContent = data.choices[0].message.content;

    // Attempt to parse the returned content as JSON and return as an object
    try {
        const parsedResponse = JSON.parse(messageContent);
        return parsedResponse;
    } catch (error) {
        console.error("Failed to parse response as JSON:", error);
        // If parsing fails, return the raw message wrapped in an object
        return { raw: messageContent };
    }
};
