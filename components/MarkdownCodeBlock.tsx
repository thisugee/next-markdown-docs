import { PropsWithChildren, useState } from "react";
import { useIsomorphicLayoutEffect } from "usehooks-ts";
import { useClickToCopy } from "../hooks/useClickToCopy";
import {
  extractTextFromChildren,
  ReactNodeWithoutObject,
} from "../utils/react-children";

export interface MarkdownCodeBlockProps {
  className?: string;
}

export const MarkdownCodeBlock = ({
  children,
  className,
}: PropsWithChildren<MarkdownCodeBlockProps>) => {
  const [copyText, setCopyText] = useState<string>(
    extractTextFromChildren(children as ReactNodeWithoutObject[])
  );

  useIsomorphicLayoutEffect(() => {
    setCopyText(extractTextFromChildren(children as ReactNodeWithoutObject[]));
  }, [children]);

  const { onClick: copyCode, showSuccess } = useClickToCopy(copyText, {
    delay: 3000,
  });

  return (
    <>
      <div className="code-block-wrapper">
        <button className="copy-button" onClick={copyCode}>
          {showSuccess ? "Copied!" : "Copy"}
        </button>

        <pre className={className ?? "language-unknown"}>{children}</pre>
      </div>

      <style jsx>
        {`
          .code-block-wrapper {
            width: 100%;
            overflow: auto;
            position: relative;
          }

          .code-block-wrapper:hover .copy-button {
            opacity: 0.5;
          }

          .copy-button {
            position: absolute;
            top: 24px;
            right: 16px;
            opacity: 0;
            background-color: transparent;
            border: 0;
            outline: 0;
            cursor: pointer;
            height: 20px;
            width: 30px;
            display: flex;
            align-items: center;
            justify-content: right;
          }

          .copy-button:hover {
            opacity: 1 !important;
          }
        `}
      </style>
    </>
  );
};
