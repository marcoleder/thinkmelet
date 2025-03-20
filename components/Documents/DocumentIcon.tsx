import { ComponentProps } from "react";
import { DocumentType } from "@/types";

interface Props extends Omit<ComponentProps<"svg">, "type"> {
  type?: DocumentType;
}

function TextDocumentIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      fill="none"
      height="20"
      width="20"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 7V4h16v3M9 20h6M12 4v16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function DocumentIcon({ type, ...props }: Props) {
  return <TextDocumentIcon {...props} />;
}