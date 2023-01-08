import fs from "fs";
import matter from "gray-matter";
import path from "path";

const DEFAULT_DOCS_STORAGE_PATH = path.join(process.cwd(), "docs");
const DEFAULT_DOCS_URL_BASE = "docs";

export interface Doc {
  link: string;
  id?: string;
  title?: string;
  parent?: string;
  description?: string;
  content?: string;
}

export interface DocPath {
  params: { doc: string[] };
}

export interface DocGrayMatter<I extends matter.Input = string>
  extends Omit<matter.GrayMatterFile<I>, "data"> {
  data: {
    id?: string;
    title?: string;
    description?: string;
  };
}

export interface DocDirectoryBranch<T = DocBranch> {
  id: string;
  type: "directory";
  name: string;
  branches: T[];
}

export interface DocFileBranch extends Doc {
  type: "file";
}

export type DocBranch = DocFileBranch | DocDirectoryBranch;

export class Docs {
  private DOCS_STORAGE_PATH;
  private DOCS_URL_BASE;

  public tree: DocDirectoryBranch;

  public list: Doc[] = [];
  public dictionary: Record<string, Doc> = {};
  public paths: DocPath[] = [];

  constructor(options?: { docsStoragePath: string; docsUrlBase: string }) {
    this.DOCS_STORAGE_PATH =
      options?.docsStoragePath ?? DEFAULT_DOCS_STORAGE_PATH;
    this.DOCS_URL_BASE = options?.docsUrlBase ?? DEFAULT_DOCS_URL_BASE;

    this.tree = this.getDocsTree();
  }

  private pathToLink(pathName: string): string {
    return pathName.replace(/(\d{1,}_|.(mdx|md))/g, "");
  }

  public getDocByLink(linkArray: string[]) {
    const link = path.join(this.DOCS_URL_BASE, linkArray.join("/"));

    const docIndex = this.list.findIndex((_doc) => _doc.link === link);
    const doc = this.list?.[docIndex];
    let previousDoc = this.list?.[docIndex - 1] || null;
    let nextDoc = this.list?.[docIndex + 1] || null;

    return {
      doc,
      previousDoc: previousDoc,
      nextDoc: nextDoc,
    };
  }

  private getDocByPath(filename = "", parentPath = ""): Doc {
    const filePath = path.join(parentPath, filename);
    const link = this.pathToLink(filePath);
    const fullPath = path.join(this.DOCS_STORAGE_PATH, filePath);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data: frontMatter, content } = matter(
      fileContents
    ) as DocGrayMatter;

    return {
      link: path.join(this.DOCS_URL_BASE, link), // ex. "getting-started/introduction"
      content,
      ...frontMatter,
    };
  }

  public getDocsTree(directory = "", parentPath = ""): DocDirectoryBranch {
    const branches: DocBranch[] = [];
    const id = this.pathToLink(directory);
    const directoryPath = path.join(parentPath, directory);
    const fullPath = path.join(this.DOCS_STORAGE_PATH, directory);
    const metadataPath = path.join(fullPath, "metadata.json");

    if (!fs.existsSync(metadataPath)) {
      console.log(
        `Unable to read directory metadata file: ${directoryPath}/metadata.json`
      );
    }

    const metadataFile = fs.readFileSync(metadataPath, "utf8");
    const metadata = JSON.parse(metadataFile);

    const directoryEntries = fs.readdirSync(fullPath, { withFileTypes: true });
    for (const directoryEntry of directoryEntries) {
      if (directoryEntry.isFile() && /\.(mdx|md)$/.test(directoryEntry.name)) {
        // create doc
        const doc = {
          ...this.getDocByPath(directoryEntry.name, directoryPath),
          parent: metadata.title,
        };
        branches.push({
          type: "file",
          ...doc,
        });
        this.paths.push({
          params: {
            doc: doc
              .link!.split("/")
              .filter((part) => part !== this.DOCS_URL_BASE),
          },
        });
        this.list.push(doc);
      } else if (directoryEntry.isDirectory()) {
        // re-crawl directory
        branches.push(this.getDocsTree(directoryEntry.name, directory));
      }
    }

    return {
      id,
      type: "directory",
      name: metadata?.title ?? id,
      branches,
    };
  }
}
