import { useCallback } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import { useFadeSuccess } from "./useFadeSuccess";

export const useClickToCopy = (
  copyValue: string | null,
  {
    delay,
    disabledHoverText,
  }: { delay: Parameters<typeof useFadeSuccess>[0]; disabledHoverText?: string }
) => {
  const [_copiedText, copy] = useCopyToClipboard();
  const { fadeIn, visible: showSuccess } = useFadeSuccess(delay);

  const onClick = useCallback(() => {
    fadeIn();
    if (!!copyValue) {
      copy(copyValue);
    }
  }, [fadeIn, copyValue]);

  const disabled = copyValue === null;
  const title = disabled
    ? disabledHoverText ?? "Nothing to copy"
    : "Click to copy";

  return {
    onClick,
    showSuccess,
    disabled,
    title,
  };
};
