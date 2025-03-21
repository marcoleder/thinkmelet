import { useStorage } from "@liveblocks/react/suspense";
import clsx from "clsx";
import {
  ChangeEventHandler,
  ComponentProps,
  FocusEventHandler,
  KeyboardEvent,
  PointerEventHandler,
  memo,
  useCallback,
  useRef,
} from "react";
import {
  getDeepDivePrompt,
  getDeepDiveUserInput,
  jsonSchemaDeepDive,
} from "../../utils/prompt";
import { CrossIcon } from "@/icons";
import { ExpandIcon } from "@/icons/Expand";
import { Avatar } from "@/primitives/Avatar";
import { Button } from "@/primitives/Button";
import styles from "./WhiteboardNote.module.css";

interface Props
  extends Omit<
    ComponentProps<"div">,
    "id" | "onBlur" | "onChange" | "onFocus"
  > {
  dragged: boolean;
  id: string;
  onBlur: FocusEventHandler<HTMLTextAreaElement>;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onDelete: () => void;
  onFocus: FocusEventHandler<HTMLTextAreaElement>;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  showOverlay: Function;
  setOverlayTitle: Function;
  setOverlayText: Function;
  setParagraphsText: Function;
  setStepsText: Function;
}

export const WhiteboardNote = memo(
  ({
    id,
    dragged,
    onPointerDown,
    onDelete,
    onChange,
    onFocus,
    onBlur,
    style,
    className,
    showOverlay,
    setOverlayTitle,
    setOverlayText,
    setParagraphsText,
    setStepsText,
    ...props
  }: Props) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const note = useStorage((root) => root.notes.get(id));
    const urlLlamaEndpoint: string =
      "https://api.openai.com/v1/chat/completions";
    const handleDoubleClick = useCallback(() => {
      textAreaRef.current?.focus();
    }, []);
    const expandNote = () => {
      getDeepDive(title, text);
      setStepsText("");
      setParagraphsText("");
      setOverlayTitle(title);
      setOverlayText(text);
      showOverlay();
    };

    const getDeepDive = async (title: string, text: string) => {
      const companyProfile = {
        companySize: localStorage.getItem("companySize") || "",
        industry: localStorage.getItem("industry") || "",
        revenueRange: localStorage.getItem("revenueRange") || "",
        profitability: localStorage.getItem("profitabilityStatus") || "",
        marketPosition: localStorage.getItem("marketPosition") || "",
        competitiveLandscape:
          localStorage.getItem("competitiveLandscape") || "",
        keyChallenges: localStorage.getItem("keyChallenges") || "",
        customerBase: localStorage.getItem("customerBase") || "",
        geographicalPresence:
          localStorage.getItem("geographicalPresence") || "",
      };
      const systemPrompt: string = getDeepDivePrompt(companyProfile);
      const userPrompt: string = getDeepDiveUserInput(title, text);

      const responseHandler = (dataToParse: any) => {
        const { paragraphs, next_steps } = dataToParse;

        console.log("paras", paragraphs);
        console.log("steps", next_steps);
        const paragraphText = Object.values(paragraphs)
          .map((paragraph: any) => {
            return paragraph;
          })
          .join("\n\n");
        setParagraphsText("General Information: " + paragraphText);


        const nextStepsText = Object.entries(next_steps)
          .map((step: any) => {
            console.log(step);
            return step[0].replace("_", " ").replace("s", "S") + ": " + step[1];
          })
          .join("\n");
        setStepsText("A starting idea: " + nextStepsText);
      };
      const payload = {
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(userPrompt) },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "deepdive",
            strict: true,
            schema: jsonSchemaDeepDive,
          },
        },
        temperature: 0.7, //TODO: maybe in future change
      };

      const response: Response = await fetch(urlLlamaEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log(data);
      try {
        const parsedAIIdeasOverViewData = JSON.parse(
          data.choices[0].message.content
        );
        responseHandler(parsedAIIdeasOverViewData);
      } catch (error) {
        console.error("failed to parse response as JSON: ", error);
      }
    };
    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Escape") {
          textAreaRef.current?.blur();
        }
      },
      []
    );

    if (!note) {
      return null;
    }

    const { x, y, text, title, selectedBy } = note;

    return (
      <div
        className={clsx(className, styles.container)}
        data-note={id}
        onDoubleClick={handleDoubleClick}
        onPointerDown={onPointerDown}
        style={{
          transform: `translate(${x}px, ${y}px)`,
          transition: dragged ? "none" : undefined,
          zIndex: dragged ? 1 : 0,
          cursor: dragged ? "grabbing" : "grab",
          ...style,
        }}
        {...props}
      >
        <div className={styles.note}>
          <div className={styles.header}>
            <Button
              className={styles.deleteButton}
              icon={<CrossIcon />}
              onClick={onDelete}
              variant="subtle"
            />
            <h2>{title}</h2>
            <Button
              className={styles.deleteButton}
              icon={<ExpandIcon />}
              onClick={expandNote}
              variant="subtle"
            />
            <div className={styles.presence}>
              {selectedBy ? (
                <Avatar
                  color={selectedBy.color}
                  name={selectedBy.name}
                  outline
                  src={selectedBy.avatar}
                />
              ) : null}
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.textAreaSize}>{text + " "}</div>
            <textarea
              className={styles.textArea}
              onBlur={onBlur}
              onChange={onChange}
              onFocus={onFocus}
              onKeyDown={handleKeyDown}
              onPointerDown={(e) => e.stopPropagation()}
              placeholder="Write note…"
              ref={textAreaRef}
              value={text}
            />
          </div>
        </div>
      </div>
    );
  }
);
