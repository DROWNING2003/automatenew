import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  FileTree,
  FileTreeProps,
  TreeNode,
  utils,
} from "@sinm/react-file-tree";
import FileItemWithFileIcon from "@sinm/react-file-tree/lib/FileItemWithFileIcon";
import "@sinm/react-file-tree/icons.css";
import "@sinm/react-file-tree/styles.css";
import _ from "lodash";

const sorter = (treeNodes: TreeNode[]) =>
  _.orderBy(
    treeNodes,
    [
      (node: { type: string }) => (node.type === "directory" ? 0 : 1),
      (node: { uri: string }) => utils.getFileName(node.uri),
    ],
    ["asc", "asc"]
  );

// const loadTree = () => {
//   return import("./tree.json").then((module) => module.default as TreeNode);
// };

// File content mapping
const fileContents: Record<string, string> = {
  ".babelrc": `{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}`,
  ".gitignore": `node_modules/
dist/
.DS_Store
`,
  ".gitmodules": `[submodule "example"]
  path = example
  url = https://github.com/sinm/react-file-tree-example.git
`,
  "package.json": `{
  "name": "react-file-tree",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "react": "^17.0.2"
  }
}`,
  "README.md": `# React File Tree

A customizable file tree component for React applications.
`,
  "index.js": `import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
`,
};

// Helper function to get language from filename
const getLanguageFromFileName = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "js":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "json":
      return "json";
    case "md":
      return "markdown";
    case "html":
      return "html";
    case "css":
      return "css";
    case "php":
      return "php";
    case "py":
      return "python";
    case "rb":
      return "ruby";
    case "java":
      return "java";
    case "kt":
      return "kotlin";
    case "go":
      return "go";
    case "rs":
      return "rust";
    default:
      return "plaintext";
  }
};

const EditorComponent = ({
  fileTree,
  onFileTreeChange,
}: {
  fileTree: any;
  onFileTreeChange: (updatedTree: any) => void;
}) => {
  const [tree, setTree] = useState<TreeNode | undefined>();
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  // Store file contents per file, initialized from original fileContents
  const [fileContentsState, setFileContentsState] =
    useState<Record<string, string>>(fileContents);
  const [language, setLanguage] = useState("javascript");

  const loadTree = async (): Promise<TreeNode> => {
    if (!fileTree) {
      throw new Error("No level data loaded");
    }
    // Convert FileTreeNode to your existing TreeNode type if needed
    return convertToTreeNode(fileTree);
  };

  // Example conversion function
  const convertToTreeNode = (fileNode: any): TreeNode => ({
    // Map properties according to your TreeNode interface
    type: fileNode.type,
    uri: fileNode.uri,
    children: fileNode.children?.map(convertToTreeNode) || [],
    content: fileNode.content,
    expanded: false, // or whatever your TreeNode expects
  });

  useEffect(() => {
    console.log("FILETREE", fileTree);
    loadTree().then((tree) => {
      const expandedTree = Object.assign(tree, { expanded: true });
      console.log("Loaded tree:", expandedTree); // 👈 Inspect here
      setTree(expandedTree);

      const fileContentsMap: Record<string, string> = {};
      const collectFiles = (node: TreeNode) => {
        if (node.type === "file") {
          console.log("uri", node.uri);
          console.log("content", node.content);
          fileContentsMap[utils.getFileName(node.uri)] = node.content || ""; // assuming node has a `content` field
        }
        node.children?.forEach(collectFiles);
      };
      collectFiles(expandedTree);
      setFileContentsState(fileContentsMap);
      console.log("fileContentsMap", fileContentsMap);
      //return expandedTree;
    });
  }, []);

  const handleFileClick = (treeNode: TreeNode) => {
    if (treeNode.type === "directory") {
      // Toggle directory expansion
      setTree((tree) =>
        utils.assignTreeNode(tree, treeNode.uri, {
          expanded: !treeNode.expanded,
        })
      );
    } else {
      // Handle file click
      const fileName = utils.getFileName(treeNode.uri);
      setCurrentFile(fileName);
      setLanguage(getLanguageFromFileName(fileName));
      // No need to set currentContent explicitly here, we get it from fileContentsState below
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!currentFile || value === undefined) return;
    setFileContentsState((prev) => ({
      ...prev,
      [currentFile]: value,
    }));
    console.log(tree);

    const clonedTree = structuredClone(tree); // Safe deep copy

    // Recursive function to find and update content
    const updateTreeContent = (node: TreeNode) => {
      if (node.type === "file" && utils.getFileName(node.uri) === currentFile) {
        node.content = value;
        return;
      }

      if (node.children) {
        node.children.forEach(updateTreeContent);
      }
    };
    updateTreeContent(clonedTree);
    onFileTreeChange(clonedTree);
    console.log("clone", clonedTree);
  };

  const itemRender = (treeNode: TreeNode) => (
    <FileItemWithFileIcon treeNode={treeNode} />
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "8px",
          background: "#1e1e1e",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {currentFile ? `Editing: ${currentFile}` : "Select a file to edit"}
        </div>
        <div>{`Currently editing in: ${language}`}</div>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* File Tree Panel - 20% width */}
        <div
          style={{
            width: "20%",
            minWidth: "150px",
            height: "100%",
            overflow: "auto",
            background: "#1e1e1e",
            borderRight: "1px solid #333",
            color: "white",
          }}
        >
          {tree && (
            <FileTree
              itemRenderer={itemRender}
              tree={tree}
              onItemClick={handleFileClick}
              sorter={sorter}
            />
          )}
        </div>

        {/* Editor Panel - 80% width */}
        <div
          style={{
            flex: 1,
            height: "100%",
            overflow: "hidden",
          }}
        >
          {currentFile ? (
            <Editor
              height="100%"
              language={language}
              value={currentFile ? fileContentsState[currentFile] : "testing"}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                padding: { top: 10 },
                fontSize: 14,
                automaticLayout: true,
                minimap: { enabled: true },
              }}
            />
          ) : (
            <p style={{ color: "#ffffff", fontSize: "16px" }}>
      Please select a file to continue
    </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorComponent;
