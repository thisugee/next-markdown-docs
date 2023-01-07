import Link from "next/link";
import { Fragment } from "react";
import { DocBranch, DocDirectoryBranch } from "../lib/docs";

export const DocsSidebar = ({ docs }: { docs: DocDirectoryBranch[] }) => {
  return (
    <>
      <div className="docs-sidebar">
        <nav className="docs-nav">
          {docs.map((doc) => (
            <DocsNavGroup key={doc.id} doc={doc} />
          ))}
        </nav>
      </div>
      <style jsx>
        {`
          .docs-sidebar {
            width: var(--sidebar-width);
            padding-inline: var(--spacing);
            padding-block-start: var(--spacing);
            border-right: 1px solid rgb(var(--border-rgb));

            position: fixed;
            top: 60px;
            left: 0;
            bottom: 0;
            z-index: 1;
            overflow: scroll;
          }
        `}
      </style>
    </>
  );
};

const DocsNavGroup = ({ doc }: { doc: DocDirectoryBranch }) => {
  return (
    <>
      <h4>{doc.name}</h4>
      <ul className="docs-nav-group">
        {doc.branches.map((doc) => (
          <Fragment key={doc.id}>
            {doc.type === "directory" ? (
              <DocsNavGroup doc={doc} />
            ) : (
              <li className="docs-nav-item">
                <Link href={`/${doc.link}`}>{doc.title}</Link>
              </li>
            )}
          </Fragment>
        ))}
      </ul>

      <style jsx>
        {`
          .docs-nav-group {
            margin: 0;
            margin-block-end: 20px;
            list-style: none;
          }

          .docs-nav-item {
            margin-block: 10px;
          }
        `}
      </style>
    </>
  );
};
