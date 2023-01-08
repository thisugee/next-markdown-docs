import Link from "next/link";
import { Doc } from "../lib/docs";
import { MarkdownCodeBlock } from "./MarkdownCodeBlock";
import { RenderMarkdownHtmlResult } from "./RenderMarkdownHtmlResult";

export const DocsContent = ({
  doc,
  previousDoc,
  nextDoc,
}: {
  doc: Doc;
  previousDoc: Doc;
  nextDoc: Doc;
}) => {
  return (
    <>
      <div className="doc-content-wrapper">
        <div className="doc-content">
          <RenderMarkdownHtmlResult
            html={doc.content ?? ""}
            components={{
              pre: MarkdownCodeBlock,
            }}
          />
        </div>

        <div className="doc-nav-links">
          <div className="previous">
            {!!previousDoc && (
              <>
                <span className="link-heading">Previous</span>
                <Link href={`/${previousDoc.link}`}>
                  {previousDoc.parent}: {previousDoc.title}
                </Link>
              </>
            )}
          </div>

          <div className="next">
            {!!nextDoc && (
              <>
                <span className="link-heading">Next</span>
                <Link href={`/${nextDoc.link}`}>
                  {nextDoc.parent}: {nextDoc.title}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .doc-content-wrapper {
          margin-left: var(--sidebar-width);
          margin-top: calc(var(--header-height) + var(--spacing));
          margin-bottom: var(--spacing);
        }

        .doc-content {
          margin: 0 auto;
          max-width: 780px;
          padding: 20px;
        }

        .doc-nav-links {
          margin: 0 auto;
          max-width: 780px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
        }

        .doc-nav-links .link-heading {
          display: block;
          opacity: 0.6;
          font-size: 0.8em;
          margin-bottom: 2px;
        }

        .doc-nav-links .next {
          text-align: right;
        }
      `}</style>
    </>
  );
};
