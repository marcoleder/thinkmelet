import { LiveObject, shallow } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useSelf,
  useStorage,
} from "@liveblocks/react/suspense";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
} from "@mui/material";
import clsx from "clsx";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import React, {
  ChangeEvent,
  ComponentProps,
  FocusEvent,
  PointerEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { Cursors } from "../Cursors";
import { BootstrapDialog } from "./Dialog";
import { WhiteboardNote } from "./WhiteboardNote";
import PromptInput from "@/components/Whiteboard/PromptInput";
import { CrossIcon, PlusIcon, RedoIcon, UndoIcon } from "@/icons";
import { Button } from "@/primitives/Button";
import { DocumentSpinner } from "@/primitives/Spinner";
import { Tooltip } from "@/primitives/Tooltip";
import { Coordinates } from "@/types/coordinates";
import { Note } from "@/types/note";
import { useBoundingClientRectRef } from "@/utils";
import styles from "./Whiteboard.module.css";

interface Props extends ComponentProps<"div"> {
  currentUser: Liveblocks["UserMeta"]["info"] | null;
}

/**
 * This file shows how to create a multiplayer canvas with draggable notes.
 * The notes allow you to add text, display who's currently editing them, and can be removed.
 * There's also a toolbar allowing you to undo/redo your actions and add more notes.
 */

export function Whiteboard() {
  const { data: session } = useSession();

  return (
    <ClientSideSuspense fallback={<DocumentSpinner />}>
      <LiveblocksWhiteboard currentUser={session?.user.info ?? null} />
    </ClientSideSuspense>
  );
}

// The main Liveblocks code, handling all events and note modifications
function LiveblocksWhiteboard({
  currentUser,
  className,
  style,
  ...props
}: Props) {
  // An array of every note id
  const noteIds: string[] = useStorage(
    (root) => Array.from(root.notes.keys()),
    shallow
  );

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const canvasRef = useRef(null);
  const rectRef = useBoundingClientRectRef(canvasRef);

  const canWrite = useSelf((me) => me.canWrite);

  // Info about element being dragged
  const [isDragging, setIsDragging] = useState(false);
  let xSpawnCoordinate = -300;
  let ySpawnCoordinate = 50;
  const dragInfo = useRef<{
    element: Element;
    noteId: string;
    offset: { x: number; y: number };
  } | null>();

  // Insert a new note onto the canvas
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
  // Delete a note
  const handleNoteDelete = useMutation(({ storage, self }, noteId) => {
    if (!self.canWrite) {
      return;
    }

    storage.get("notes").delete(noteId);
  }, []);

  // Update a note, if it exists
  const handleNoteUpdate = useMutation(({ storage, self }, noteId, updates) => {
    if (!self.canWrite) {
      return;
    }

    const note = storage.get("notes").get(noteId);
    if (note) {
      note.update(updates);
    }
  }, []);

  // On note pointer down, pause history, set dragged note
  function handleNotePointerDown(
    e: PointerEvent<HTMLDivElement>,
    noteId: string
  ) {
    history.pause();
    e.stopPropagation();
    const element = document.querySelector(`[data-note="${noteId}"]`);
    if (!element) {
      return;
    }

    // Get position of cursor on note, to use as an offset when moving notes
    const rect = element.getBoundingClientRect();
    const offset = {
      x: translate.x + e.clientX - rect.left,
      y: translate.y + e.clientY - rect.top,
    };

    dragInfo.current = { noteId, element, offset };
    setIsDragging(true);
    document.documentElement.classList.add("grabbing");
  }

  // On canvas pointer up, remove dragged element, resume history
  function handleCanvasPointerUp() {
    setIsDragging(false);
    dragInfo.current = null;
    document.documentElement.classList.remove("grabbing");
    history.resume();
  }

  // If dragging on canvas pointer move, move element and adjust for offset
  function handleCanvasPointerMove(e: PointerEvent<HTMLDivElement>) {
    e.preventDefault();

    if (isDragging && dragInfo.current) {
      const { x, y } = dragInfo.current.offset;
      const coords = {
        x: e.clientX - rectRef.current.x - x,
        y: e.clientY - rectRef.current.y - y,
      };
      handleNoteUpdate(dragInfo.current.noteId, coords);
    }
  }

  // When note text is changed, update the text and selected user on the LiveObject
  function handleNoteChange(
    e: ChangeEvent<HTMLTextAreaElement>,
    noteId: string
  ) {
    handleNoteUpdate(noteId, { text: e.target.value, selectedBy: currentUser });
  }

  // When note is focused, update the selected user LiveObject
  function handleNoteFocus(e: FocusEvent<HTMLTextAreaElement>, noteId: string) {
    history.pause();
    handleNoteUpdate(noteId, { selectedBy: currentUser });
  }

  // When note is unfocused, remove the selected user on the LiveObject
  function handleNoteBlur(e: FocusEvent<HTMLTextAreaElement>, noteId: string) {
    handleNoteUpdate(noteId, { selectedBy: null });
    history.resume();
  }

  const [displayedNoteTitle, setDisplayedNoteTitle] = useState<string>("");
  const [displayedNoteDescription, setDisplayedNoteDescription] =
    useState<string>("");
  const [displayedParagraphs, setDisplayedParagraphs] = useState<string>("");
  const [displayedSteps, setDisplayedSteps] = useState<string>("");
  //
  const [isPaning, setisPaning] = useState(false);
  const [origin, setOrigin] = useState<Coordinates>({ x: 0, y: 0 });
  const [translate, setTranslate] = useState<Coordinates>({ x: 0, y: 0 });
  const [startTranslate, setStartTranslate] = useState<Coordinates>({
    x: 0,
    y: 0,
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  //
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const target = event.target as HTMLElement;
    if (target.closest("[data-note]") || target.closest(`.${styles.toolbar}`)) {
      return;
    }
    setisPaning(true);
    setOrigin({ x: event.clientX, y: event.clientY });
    setStartTranslate(translate);
  };
  //
  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!isPaning) return;
    const deltaX = event.clientX - origin.x;
    const deltaY = event.clientY - origin.y;
    setTranslate({
      x: startTranslate.x + deltaX,
      y: startTranslate.y + deltaY,
    });
  };
  //
  const handleMouseUp = () => {
    setisPaning(false);
  };
  //
  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();

    setZoomLevel((prevZoom) => {
      if (event.deltaY < 0) {
        return Math.min(prevZoom * 1.1, 4);
      } else {
        return Math.max(prevZoom / 1.1, 0.2);
      }
    });
  }, []);
  //
  //
  return (
    <>
      <PromptInput insertNote={insertNote} />
      <div
        className={clsx(className, styles.whiteboardWrapper)}
        style={{ cursor: isPaning ? "grabbing" : "grab" }}
      >
        <div
          className={clsx(className, styles.whiteboard)}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{
            pointerEvents: canWrite ? undefined : "none",
            ...style,
            transform: `translate(${translate.x}px, ${translate.y}px)`,
            transition: isPaning ? "none" : "transform 0.1s ease-out",
          }}
          {...props}
        >
          <Cursors element={canvasRef} />
          {
            /*
             * Iterate through each note in the LiveMap and render it as a note
             */
            noteIds.map((id) => (
              <WhiteboardNote
                dragged={id === dragInfo?.current?.noteId}
                id={id}
                key={id}
                onBlur={(e) => handleNoteBlur(e, id)}
                onChange={(e) => handleNoteChange(e, id)}
                onDelete={() => handleNoteDelete(id)}
                onFocus={(e) => handleNoteFocus(e, id)}
                onPointerDown={(e) => handleNotePointerDown(e, id)}
                showOverlay={handleClickOpen}
                setOverlayTitle={setDisplayedNoteTitle}
                setOverlayText={setDisplayedNoteDescription}
                setParagraphsText={setDisplayedParagraphs}
                setStepsText={setDisplayedSteps}
              />
            ))
          }
        </div>
      </div>
      {canWrite && (
        <div className={styles.toolbar}>
          <Tooltip content="Add note" sideOffset={16}>
            <Button
              icon={<PlusIcon />}
              onClick={() => insertNote()}
              variant="subtle"
            />
          </Tooltip>
          <Tooltip content="Undo" sideOffset={16}>
            <Button
              disabled={!canUndo}
              icon={<UndoIcon />}
              onClick={history.undo}
              variant="subtle"
            />
          </Tooltip>
          <Tooltip content="Redo" sideOffset={16}>
            <Button
              disabled={!canRedo}
              icon={<RedoIcon />}
              onClick={history.redo}
              variant="subtle"
            />
          </Tooltip>
        </div>
      )}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {displayedNoteTitle}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CrossIcon />
        </IconButton>
        <DialogContent dividers>{displayedNoteDescription}</DialogContent>
        {displayedParagraphs != "" ? (
          <div>
            <DialogContent dividers>{displayedParagraphs}</DialogContent>
            <DialogContent dividers>{displayedSteps}</DialogContent>
          </div>
        ) : (
          <div>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
          </div>
        )}

        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
