import { ComponentPropsWithoutRef, ReactNode } from "react";

export interface FileInputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "onDrop"> {
  secondaryMessage?: string;
  alternateInput?: ReactNode;
  fileUrlLabel?: string;
  value: string;
  onDrop: (acceptedFiles: File[]) => void;
  onReset: () => void;
  fileId?: string;
  success?: boolean;
  textClassName?: string;
}
