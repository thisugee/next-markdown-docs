import Head from "next/head";
import { remark } from "remark";
import html from "remark-html";
import prism from "remark-prism";
import { DocsContent, DocsSidebar, Layout } from "../../components";
import { Doc, DocDirectoryBranch, DocPath, Docs } from "../../lib/docs";

export default function DocPage({
  doc,
  docs,
  source,
}: {
  doc: Doc;
  docs: DocDirectoryBranch[];
  previousDoc: Doc;
  nextDoc: Doc;
  source: string;
}) {
  return (
    <>
      <Head>
        <title>{doc.title + " - Docs"}</title>
      </Head>
      <Layout>
        <DocsSidebar docs={docs} />
        <DocsContent source={source} doc={doc} />
      </Layout>
    </>
  );
}

const docs = new Docs();

export async function getStaticPaths() {
  return {
    paths: docs.paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: DocPath) {
  const { doc, previousDoc, nextDoc } = docs.getDocByLink(params.doc);

  if (!doc.content) {
    throw new Error("Doc is unexpectedly undefined.");
  }

  const processedContent = await remark()
    .use(prism)
    .use(html, { sanitize: false })
    .process(doc.content);

  return {
    props: {
      doc,
      docs: docs.tree.branches,
      source: processedContent.toString(),
      markdown: doc.content,
      previousDoc,
      nextDoc,
    },
  };
}
