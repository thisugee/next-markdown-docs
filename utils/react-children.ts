import React, { Children } from "react";

// avoid some type headaches caused by implicit {}
// see: https://solverfox.dev/writing/no-implicit-children/
export type ReactNodeWithoutObject =
  | React.ReactElement
  | string
  | number
  | boolean
  | null
  | undefined;

/**
 * Convenient type predicate to narrow types when node has children
 */
const hasChildren = (
  node: ReactNodeWithoutObject
): node is {
  props: { children: ReactNodeWithoutObject };
  type: any;
  key: any;
} => {
  if (
    node === null ||
    typeof node === "string" ||
    typeof node === "number" ||
    typeof node === "boolean" ||
    typeof node === "undefined"
  ) {
    return false;
  }

  return node.props && node.props.hasOwnProperty("children");
};

/**
 * Walk down a tree of React children, and `callChild` for each child in the
 * tree. If `matchingPredicate` is provided and returns false for any node, then
 * do not walk that node or any of its descendants.
 */
export const walkChildren = (
  children: ReactNodeWithoutObject | ReactNodeWithoutObject[],
  callChild: <T extends ReactNodeWithoutObject>(
    child: T,
    depth: number
  ) => void,
  matchingPredicate?: <T extends ReactNodeWithoutObject>(child: T) => boolean,
  depth?: number
) => {
  const shouldContinue = matchingPredicate ?? ((_) => true);
  Children.forEach(children, (child) => {
    if (!shouldContinue(child)) {
      return;
    }

    callChild(child, depth ?? 0);

    if (hasChildren(child)) {
      Children.forEach(child.props.children, (descendant) => {
        walkChildren(
          descendant,
          callChild,
          matchingPredicate,
          (depth ?? 0) + 1
        );
      });
    }
  });
};

/**
 * Extract the "inner text" from a tree of react nodes, by concatenating all
 * string nodes that descend from the given children into a final output string.
 *
 * This is useful in rare but specific cases like getting text from a
 * codeblock before copying it to the clipboard.
 */
export const extractTextFromChildren = (
  children: ReactNodeWithoutObject | ReactNodeWithoutObject[]
): string => {
  const strings: string[] = [];

  Children.forEach(children, (child) => {
    walkChildren(child, (descendant) => {
      if (typeof descendant === "string" || typeof descendant === "number") {
        strings.push(descendant.toString());
      }
    });
  });

  return strings.join("");
};
