import { ComponentProps } from "react";
import { DocumentType } from "@/types";

interface Props extends Omit<ComponentProps<"svg">, "type"> {
  type?: DocumentType;
}

export function DocumentIcon({ type, ...props }: Props) {
  return null;
}