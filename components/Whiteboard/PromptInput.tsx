import Input from "@mui/joy/Input";
import * as React from "react";
import { Button } from "@/primitives/Button";
import { Note } from "@/types/note";
import styles from "./Whiteboard.module.css";
import { AIGeneratedIdeasOverview } from "@/types/AIGeneratedIdeasOverview";
import { getSystemPrompt, jsonSchema } from "@/utils/prompt";

export default function PromptInput(insertNote: Function) {
  const [inputValue, setInputValue] = React.useState("");
  const urlLlamaEndpoint: string =
    "https://ai.marcoleder.ch/v1/chat/completions";
  //
  const handlePrompt = async () => {
    //create prompt with other infos
    const userPrompt: String = inputValue;
    const companyProfile = {
      companySize: "big",
      industry: "computer science",
      revenueRange: "2 million dollar",
      profitability: "very high",
      marketPosition: "market leader",
      competitiveLandscape: "not at all",
      keyChallenges: "getting rich",
      customerBase: "non existent",
      geographicalPresence: "only switzerland",
    };
    const systemPrompt = getSystemPrompt(companyProfile);

    const payload = {
      model: "gemma-3-27b-it",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(userPrompt) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "overview Ideas",
          strict: true,
          schema: jsonSchema,
        },
      },
      temperature: 0.7,
    };

    const response: Response = await fetch(urlLlamaEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`,
      },
      body: JSON.stringify(payload),
    });
    const aiIdeasOverViewData = await response.json();
    try {
      const parsedAIIdeasOverViewData = JSON.parse(
        aiIdeasOverViewData.choices[0].message.content
      );
      handleResponse(parsedAIIdeasOverViewData);
    } catch (error) {
      console.error("failed to parse response as JSON: ", error);
    }
  };

  // Parse the JSON response from the API
  //
  const handleResponse = (
    aiIdeasOverviewUnprepared: AIGeneratedIdeasOverview[]
  ) => {
    console.log("this check", aiIdeasOverviewUnprepared);
    const overviewIdeas: Note[] = aiIdeasOverviewUnprepared.map((item) => {
      return {
        title: item.title,
        text: item.description,
      };
    });

    overviewIdeas.forEach((note) => insertNote(note));
  };
  //
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleKey = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handlePrompt();
    }
  };
  //
  return (
    <div className={styles.promptWrapper}>
      <Input
        className={styles.promptInput}
        value={inputValue}
        onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleInputChange(event);
        }}
        onKeyDown={handleKey}
        placeholder="What may I help you with?"
      />
      <Button className={styles.promptButton} onClick={handlePrompt}>
        Generate Ideas
      </Button>
    </div>
  );
}
