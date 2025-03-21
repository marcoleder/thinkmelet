import Input from "@mui/joy/Input";
import * as React from "react";
import { Button } from "@/primitives/Button";
import { Note } from "@/types/note";
import styles from "./Whiteboard.module.css";
import { AIGeneratedIdeasOverview } from "@/types/AIGeneratedIdeasOverview";
import { getSystemPrompt, jsonSchema } from "@/utils/prompt";

export interface PromptInputProps {
  insertNote: (any) => (any);
}

export function getCompanyProfileFromLocalStorage() {
  const companyProfile = {
    companySize: localStorage.getItem("companySize") || "",
    industry: localStorage.getItem("industry") || "",
    revenueRange: localStorage.getItem("revenueRange") || "",
    profitability: localStorage.getItem("profitabilityStatus") || "",
    marketPosition: localStorage.getItem("marketPosition") || "",
    competitiveLandscape: localStorage.getItem("competitiveLandscape") || "",
    keyChallenges: localStorage.getItem("keyChallenges") || "",
    customerBase: localStorage.getItem("customerBase") || "",
    geographicalPresence: localStorage.getItem("geographicalPresence") || ""
  };

  console.log(companyProfile);
  return companyProfile;
}

export default function PromptInput({insertNote}) {
  const [inputValue, setInputValue] = React.useState("");
  const urlLlamaEndpoint: string =
    "https://api.openai.com/v1/chat/completions";
  //
  const handlePrompt = async () => {

    //create prompt with other infos
    const userPrompt: String = inputValue;
    const companyProfile = getCompanyProfileFromLocalStorage();
    const systemPrompt = getSystemPrompt(companyProfile);

    const payload = {
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(userPrompt) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "overview_ideas",
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
      aiIdeasOverviewUnprepared: { [key: string]: AIGeneratedIdeasOverview }
  ) => {
    console.log("this check", aiIdeasOverviewUnprepared);
    const overviewIdeas: Note[] = Object.values(aiIdeasOverviewUnprepared).map((item) => ({
      title: item.title,
      text: item.description,
    }));

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
