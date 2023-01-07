import { Doc } from "../lib/docs";
import { MarkdownCodeBlock } from "./MarkdownCodeBlock";
import { RenderMarkdownHtmlResult } from "./RenderMarkdownHtmlResult";

export const DocsContent = ({ doc, source }: { doc: Doc; source: string }) => {
  return (
    <>
      <div className="docs-content-wrapper">
        <div className="docs-content">
          <RenderMarkdownHtmlResult
            html={source}
            components={{
              pre: MarkdownCodeBlock,
            }}
          />
        </div>
      </div>
      <style jsx>{`
        .docs-content-wrapper {
          margin-left: var(--sidebar-width);
          margin-top: calc(var(--header-height) + var(--spacing));
          margin-bottom: var(--spacing);
        }

        .docs-content {
          margin: 0 auto;
          max-width: 780px;
          padding: 20px;
          height: 5000px;
        }
      `}</style>
    </>
  );
};
