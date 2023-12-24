import { contextBridge, ipcRenderer } from "electron";
import { AIModelConfig } from "electron/main/Store/storeConfig";
import { FileInfoTree } from "electron/main/Files/Types";
// import { FileInfo } from "electron/main/Files/Types";
import { RagnoteDBEntry } from "electron/main/database/Table";
type ReceiveCallback = (...args: any[]) => void;

declare global {
  interface Window {
    ipcRenderer: {
      // send: (channel: string, ...args: any[]) => void;
      // sendSync: (channel: string, ...args: any[]) => any;
      on: (channel: string, listener: (...args: any[]) => void) => void;
      // once: (channel: string, listener: (...args: any[]) => void) => void;
      // invoke: (channel: string, ...args: any[]) => Promise<any>;
      removeListener: (
        channel: string,
        listener: (...args: any[]) => void
      ) => void;
      // removeAllListeners: (channel: string) => void;
      receive: (channel: string, callback: ReceiveCallback) => void;
    };
    contextMenu: {
      showFileItemContextMenu: (filePath: string) => void;
      onMenuActionCUNT: (callback: (action: string) => void) => () => void;
    };
    database: {
      search: (
        query: string,
        limit: number,
        filter?: string
      ) => Promise<RagnoteDBEntry[]>;
      indexFilesInDirectory: (directoryPath: string) => any;
      augmentPromptWithRAG: (
        prompt: string,
        limit: number,
        filter?: string
      ) => Promise<string>;
    };
    files: {
      openDirectoryDialog: () => Promise<any>;
      getFiles: () => Promise<FileInfoTree>;
      writeFile: (filePath: string, content: string) => Promise<any>;
      readFile: (filePath: string) => Promise<any>;
      createFile: (filePath: string, content: string) => Promise<any>;
      joinPath: (...pathSegments: string[]) => Promise<string>;
      moveFileOrDir: (
        sourcePath: string,
        destinationPath: string
      ) => Promise<any>;
    };
    llm: {
      createSession: (sessionId: any) => Promise<any>;
      doesSessionExist: (sessionId: any) => Promise<any>;
      deleteSession: (sessionId: any) => Promise<any>;
      getOrCreateSession: (sessionId: any) => Promise<any>;
      initializeStreamingResponse: (
        sessionId: any,
        prompt: string
      ) => Promise<any>;
    };
    electronStore: {
      setUserDirectory: (path: string) => any;
      getUserDirectory: () => string;
      setOpenAIAPIKey: (apiKey: string) => any;
      getOpenAIAPIKey: () => string;
      getAIModelConfigs: () => Promise<Record<string, AIModelConfig>>;
      setupNewLocalLLM: (
        modelName: string,
        modelConfig: AIModelConfig
      ) => Promise<any>;
      setDefaultAIModel: (modelName: string) => any;
      getDefaultAIModel: () => Promise<string>;
    };
  }
}

contextBridge.exposeInMainWorld("database", {
  search: async (
    query: string,
    limit: number,
    filter?: string
  ): Promise<RagnoteDBEntry[]> => {
    return ipcRenderer.invoke("search", query, limit, filter);
  },
  indexFilesInDirectory: async (directoryPath: string) => {
    return ipcRenderer.send("index-files-in-directory", directoryPath);
  },
  augmentPromptWithRAG: async (
    prompt: string,
    limit: number,
    filter?: string
  ): Promise<RagnoteDBEntry[]> => {
    return ipcRenderer.invoke("augment-prompt-with-rag", prompt, limit, filter);
  },
});

contextBridge.exposeInMainWorld("electronStore", {
  setUserDirectory: (path: string) => {
    return ipcRenderer.sendSync("set-user-directory", path);
  },
  setOpenAIAPIKey: (apiKey: string) => {
    return ipcRenderer.sendSync("set-openai-api-key", apiKey);
  },
  getOpenAIAPIKey: () => {
    return ipcRenderer.sendSync("get-openai-api-key");
  },
  getUserDirectory: () => {
    return ipcRenderer.sendSync("get-user-directory");
  },
  getAIModelConfigs: async (): Promise<AIModelConfig[]> => {
    return ipcRenderer.invoke("get-ai-model-configs");
  },
  setupNewLocalLLM: async (modelName: string, modelConfig: AIModelConfig) => {
    return ipcRenderer.invoke("setup-new-model", modelName, modelConfig);
  },
  setDefaultAIModel: (modelName: string) => {
    ipcRenderer.send("set-default-ai-model", modelName);
  },

  getDefaultAIModel: async () => {
    return ipcRenderer.invoke("get-default-ai-model");
  },
});

contextBridge.exposeInMainWorld("ipcRenderer", {
  // send: ipcRenderer.send,
  // sendSync: ipcRenderer.sendSync,
  on: ipcRenderer.on,
  // once: ipcRenderer.once,
  // invoke: ipcRenderer.invoke,
  removeListener: ipcRenderer.removeListener,
  // removeAllListeners: ipcRenderer.removeAllListeners,
  receive: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
});

contextBridge.exposeInMainWorld("electronAPI", {
  openContextMenu: (menuTemplate: any) =>
    ipcRenderer.invoke("open-context-menu", menuTemplate),
});

contextBridge.exposeInMainWorld("contextMenu", {
  // Function to trigger the context menu
  showFileItemContextMenu: (filePath: string) => {
    ipcRenderer.send("show-context-menu-file-item", filePath);
  },

  // Function to set up a listener for menu actions
  onMenuActionCUNT: (callback: (action: string) => void) => {
    const handler = (_: any, action: any) => callback(action);
    ipcRenderer.on("context-menu-command", handler);
    // Return a function to remove the listener
    return () => {
      ipcRenderer.removeListener("context-menu-command", handler);
    };
  },
});

contextBridge.exposeInMainWorld("files", {
  openDirectoryDialog: () => ipcRenderer.invoke("open-directory-dialog"),
  getFiles: async (): Promise<FileInfoTree> => {
    // No need to pass a channel name as a string literal every time, which can be error-prone
    return ipcRenderer.invoke("get-files");
  },

  // Write content to a file
  writeFile: async (filePath: string, content: string) => {
    return ipcRenderer.invoke("write-file", filePath, content);
  },

  createFile: async (filePath: string, content: string) => {
    return ipcRenderer.invoke("create-file", filePath, content);
  },

  // Read content from a file
  readFile: async (filePath: string) => {
    return ipcRenderer.invoke("read-file", filePath);
  },
  joinPath: (...pathSegments: string[]) =>
    ipcRenderer.invoke("join-path", ...pathSegments),

  moveFileOrDir: async (sourcePath: string, destinationPath: string) => {
    return ipcRenderer.invoke("move-file-or-dir", sourcePath, destinationPath);
  },
});

contextBridge.exposeInMainWorld("llm", {
  createSession: async (sessionId: any) => {
    return await ipcRenderer.invoke("create-session", sessionId);
  },
  doesSessionExist: async (sessionId: any) => {
    return await ipcRenderer.invoke("does-session-exist", sessionId);
  },
  deleteSession: async (sessionId: any) => {
    return await ipcRenderer.invoke("delete-session", sessionId);
  },
  getOrCreateSession: async (sessionId: any) => {
    return await ipcRenderer.invoke("get-or-create-session", sessionId);
  },
  initializeStreamingResponse: async (sessionId: any, prompt: string) => {
    return await ipcRenderer.invoke(
      "initialize-streaming-response",
      sessionId,
      prompt
    );
  },
});
