import Input from "@mui/joy/Input";
import * as React from "react";
import { Button } from "@/primitives/Button";
import { Note } from "@/types/note";
import styles from "./Whiteboard.module.css";
import { AIGeneratedIdeasOverview } from "@/types/AIGeneratedIdeasOverview";
import { getSystemPrompt, jsonSchema } from "@/utils/prompt";
import { useMutation } from "@liveblocks/react/suspense";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";

export default function PromptInput() {
  const [inputValue, setInputValue] = React.useState("");
  const urlLlamaEndpoint: string =
    "https://ai.marcoleder.ch/v1/chat/completions";
  //
  let xSpawnCoordinate = -300;
  let ySpawnCoordinate = 50;
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
        "Access-Control-Allow-Origin": "*",
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
  const insertNote = useMutation(({ storage, self }, givenNote?: Note) => {
    if (!self.canWrite) {
      return;
    }
    xSpawnCoordinate += 400;
    if (xSpawnCoordinate > 1300) {
      xSpawnCoordinate = 100;
      xSpawnCoordinate += getRandomInt(120);
      ySpawnCoordinate += 120;
      if (ySpawnCoordinate > 410) {
        ySpawnCoordinate = 50;
        ySpawnCoordinate += getRandomInt(30);
      }
    }

    const noteId = nanoid();
    const note = new LiveObject({
      x: xSpawnCoordinate,
      y: ySpawnCoordinate,
      title: givenNote?.title ? givenNote?.title : "",
      text: givenNote?.text ? givenNote?.text : "",
      selectedBy: null,
      id: noteId,
    });
    storage.get("notes").set(noteId, note);
  }, []);
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

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
