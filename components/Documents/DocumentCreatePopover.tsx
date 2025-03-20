import { ComponentProps, useState } from "react";
import { PlusIcon } from "@/icons";
import { createDocument } from "@/lib/actions";
import { Button } from "@/primitives/Button";
import { Document, DocumentGroup, DocumentType, DocumentUser } from "@/types";

interface Props extends Omit<ComponentProps<typeof Button>, "content"> {
  documentName?: Document["name"];
  draft: Document["draft"];
  groupIds?: DocumentGroup["id"][];
  userId: DocumentUser["id"];
  align?: string;
  sideOffset?: number;
}

export function DocumentCreatePopover({
  groupIds,
  userId,
  draft,
  children,
  align,
  sideOffset,
  ...props
}: Props) {
  const [disableButtons, setDisableButtons] = useState(false);

  // Create a new document, then navigate to the document's URL location
  async function createNewDocument(name: string, type: DocumentType) {
    setDisableButtons(true);
    const result = await createDocument(
      {
        name,
        type,
        userId,
        draft,
        groupIds: draft ? undefined : groupIds,
      },
      true
    );

    // If this runs, there's an error and the redirect failed
    if (!result || result?.error || !result.data) {
      setDisableButtons(false);
      return;
    }
  }

  return (
    <Button
      icon={<PlusIcon />}
      onClick={() => createNewDocument("Untitled", "whiteboard")}
      disabled={disableButtons}
      {...props}
    >
      Thinkboard
    </Button>
  );
}
