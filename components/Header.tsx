import React from "react";
import Link from "next/link";

export const Header = () => {
  return (
    <>
      <div className="header-wrapper">
        <header className="header">
          <h3>
            <Link href="/">MD Docs</Link>
          </h3>
        </header>
      </div>
      <style jsx>
        {`
          .header-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1;
          }

          .header {
            height: var(--header-height);
            display: flex;
            align-items: center;
            padding-inline: var(--spacing);
            border-bottom: 1px solid rgb(var(--border-rgb));
            background-color: rgb(var(--background-rgb));
          }

          .header h3 {
            margin-bottom: 0;
          }
        `}
      </style>
    </>
  );
};
