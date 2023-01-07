import parse, {
  attributesToProps,
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";
import React from "react";

export const RenderMarkdownHtmlResult = ({
  html,
  components,
}: {
  html: string;
  components?: Partial<Record<keyof JSX.IntrinsicElements, React.FC>>;
}) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && components) {
        const Component = (components as any)[domNode.name];
        if (domNode.attribs && Component) {
          const props = attributesToProps(domNode.attribs);
          return (
            <Component {...props}>{domToReact(domNode.children)}</Component>
          );
        }
      }
    },
  };

  return parse(html, options) as JSX.Element;
};
