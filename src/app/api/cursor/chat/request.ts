import { gp, hXe, lKe, pc, st, xu } from "../service/common";

export const composerMap: any = {};

export const getConversation = (
  bubbleId: string,
  requestId: string,
  text: string,
  images: any[],
  richText: string,

  type: 1 | 2,
  code: string,
  serverBubbleId = '',
  ts: string,
  json: string,
) => {
  return new st({
    text,
    type: type,
    attachedCodeChunks: [
      new gp({
        relativeWorkspacePath: "index.html",
        startLineNumber: 1,
        lines: code?.split("\n"),
        languageIdentifier: "",
        intent: 1,
        isOnlyIncludedFromFolder: false,
      }),
      new gp({
        relativeWorkspacePath: "index.ts",
        startLineNumber: 1,
        lines: ts?.split("\n"),
        languageIdentifier: "",
        intent: 1,
        isOnlyIncludedFromFolder: false,
      }),
      new gp({
        relativeWorkspacePath: "index.json",
        startLineNumber: 1,
        lines: json?.split("\n"),
        languageIdentifier: "",
        intent: 1,
        isOnlyIncludedFromFolder: false,
      }),
    ],
    codebaseContextChunks: [],
    commits: [],
    pullRequests: [],
    gitDiffs: [],
    assistantSuggestedDiffs: [],
    interpreterResults: [],
    images,
    attachedFolders: [],
    approximateLintErrors: [],
    bubbleId,
    attachedFoldersNew: [],
    lints: [],
    userResponsesToSuggestedCodeBlocks: [],
    relevantFiles: [],
    toolResults: [],
    notepads: [],
    capabilities: [],
    editTrailContexts: [],
    suggestedCodeBlocks: [],
    diffsForCompressingFiles: [],
    multiFileLinterErrors: [],
    diffHistories: [],
    recentlyViewedFiles: [],
    recentLocationsHistory: [],
    isAgentic: true,
    fileDiffTrajectories: [],
    existedSubsequentTerminalCommand: false,
    existedPreviousTerminalCommand: false,
    docsReferences: [],
    webReferences: [],
    aiWebSearchResults: [],
    attachedFoldersListDirResults: [],
    humanChanges: [],
    attachedHumanChanges: false,
    summarizedComposers: [],
    cursorRules: [],
    contextPieces: [],
    allThinkingBlocks: [],
    diffsSinceLastApply: [],
    deletedFiles: [],
    supportedTools: [
      1, 3, 41, 5, 6, 7, 38, 8, 9, 11, 12, 15, 18, 19, 23, 24, 25, 26, 27, 28,
      29, 30, 31, 32, 34, 35, 39, 40, 42,
    ],
    consoleLogs: [],
    knowledgeItems: [
      {
        title: "Migrated User Rules",
        knowledge: "Always respond in Chinese-simplified",
        knowledgeId: "341218",
        isGenerated: false,
      },
    ],
    uiElementPicked: [],
    documentationSelections: [],
    externalLinks: [],
    projectLayouts: [],
    capabilityContexts: [],
    todos: [],
    requestId,
    unifiedMode: 2,
    editToolSupportsSearchAndReplace: true,
    richText,
    useWeb: false,
    serverBubbleId,
  });
};

export const addConversation = (composerId: string, data: any) => {
  if (!composerMap[composerId]) {
    composerMap[composerId] = [];
  }
  composerMap[composerId].push(data);
};

export const getReqChatExample = (
  bubbleId: string,
  composerId: string,
  requestId: string,
  text: string,
  images: any[],
  richText: string,
  code: string,
  ts: string,
  json: string,
  isThink: boolean,
) => {
  const oldConversation = composerMap[composerId] || [];

  const req = {
    conversation: [
      ...oldConversation,
      new st({
        text,
        type: 1,
        attachedCodeChunks: [
          new gp({
            relativeWorkspacePath: "index.html",
            startLineNumber: 1,
            lines: code?.split("\n") || '',
            languageIdentifier: "",
            intent: 1,
            isOnlyIncludedFromFolder: false,
          }),
          new gp({
            relativeWorkspacePath: 'index.ts',
            startLineNumber: 1,
            lines: ts?.split("\n") || '',
            languageIdentifier: "",
            intent: 1,
            isOnlyIncludedFromFolder: false,
          }),
          new gp({
            relativeWorkspacePath: 'index.json',
            startLineNumber: 1,
            lines: json?.split("\n") || '',
            languageIdentifier: "",
            intent: 1,
            isOnlyIncludedFromFolder: false,
          }),
        ],
        codebaseContextChunks: [],
        commits: [],
        pullRequests: [],
        gitDiffs: [],
        assistantSuggestedDiffs: [],
        interpreterResults: [],
        images,
        attachedFolders: [],
        approximateLintErrors: [],
        bubbleId,
        attachedFoldersNew: [],
        lints: [],
        userResponsesToSuggestedCodeBlocks: [],
        relevantFiles: [],
        toolResults: [],
        notepads: [],
        capabilities: [],
        editTrailContexts: [],
        suggestedCodeBlocks: [],
        diffsForCompressingFiles: [],
        multiFileLinterErrors: [],
        diffHistories: [],
        recentlyViewedFiles: [],
        recentLocationsHistory: [],
        isAgentic: true,
        fileDiffTrajectories: [],
        existedSubsequentTerminalCommand: false,
        existedPreviousTerminalCommand: false,
        docsReferences: [],
        webReferences: [],
        aiWebSearchResults: [],
        attachedFoldersListDirResults: [],
        humanChanges: [],
        attachedHumanChanges: false,
        summarizedComposers: [],
        cursorRules: [],
        contextPieces: [],
        allThinkingBlocks: [],
        diffsSinceLastApply: [],
        deletedFiles: [],
        supportedTools: [
          1, 3, 41, 5, 6, 7, 38, 8, 9, 11, 12, 15, 18, 19, 23, 24, 25, 26, 27,
          28, 29, 30, 31, 32, 34, 35, 39, 40, 42,
        ],
        consoleLogs: [],
        knowledgeItems: [
          {
            title: "Migrated User Rules",
            knowledge: "Always respond in Chinese-simplified",
            knowledgeId: "341218",
            isGenerated: false,
          },
        ],
        uiElementPicked: [],
        documentationSelections: [],
        externalLinks: [],
        projectLayouts: [],
        capabilityContexts: [],
        todos: [],
        requestId,
        unifiedMode: 2,
        editToolSupportsSearchAndReplace: true,
        richText,
        useWeb: false,
      }),
    ],
    fullConversationHeadersOnly: [
      ...oldConversation.map(({bubbleId, type, serverBubbleId}: any) => ({ bubbleId, type, serverBubbleId })),
      {
        bubbleId,
        type: 1,
      },
    ],
    documentationIdentifiers: [],
    externalLinks: [],
    diffsForCompressingFiles: [],
    multiFileLinterErrors: [],
    fileDiffHistories: [],
    quotes: [],
    additionalRankedContext: [],
    isChat: false,
    conversationId: composerId,
    replyingToRequestId: "",
    repositoryInfoShouldQueryStaging: false,
    repositoryInfoShouldQueryProd: false,
    repoQueryAuthToken: "",
    isAgentic: true,
    supportedTools: [
      1, 3, 41, 5, 6, 7, 38, 8, 9, 11, 12, 15, 18, 19, 23, 24, 25, 26, 27, 28,
      29, 30, 31, 32, 34, 35, 39, 40, 42,
    ],
    enableYoloMode: true,
    yoloPrompt: "",
    useUnifiedChatPrompt: false,
    mcpTools: [
      {
        name: "nx_docs",
        description:
          "Returns a list of documentation sections that could be relevant to the user query. IMPORTANT: ALWAYS USE THIS IF YOU ARE ANSWERING QUESTIONS ABOUT NX. NEVER ASSUME KNOWLEDGE ABOUT NX BECAUSE IT WILL PROBABLY BE OUTDATED. Use it to learn about nx, its configuration and options instead of assuming knowledge about it.",
        parameters:
          '{"type":"object","properties":{"userQuery":{"type":"string","description":"The user query to get docs for. You can pass the original user query verbatim or summarize it."}},"required":["userQuery"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}',
        serverName: "extension-nx-mcp",
      },
      {
        name: "nx_available_plugins",
        description:
          "Returns a list of available Nx plugins from the core team as well as local workspace Nx plugins.",
        parameters:
          '{"type":"object","properties":{"random_string":{"type":"string","description":"Dummy parameter for no-parameter tools"}},"required":["random_string"]}',
        serverName: "extension-nx-mcp",
      },
    ],
    isHeadless: false,
    isBackgroundComposer: false,
    toolsRequiringAcceptedReturn: [18, 7, 38, 24],
    projectLayouts: [],
    supportsGitIndex: true,
    forceIsNotDev: false,
    allowLongFileScan: true,
    explicitContext: {
      context: "Always respond in Chinese-simplified",
      rules: [],
    },
    canHandleFilenamesAfterLanguageIds: true,
    modelDetails: {
      modelName: isThink ? "claude-4.5-sonnet-thinking" : "default",//"default",
      azureState: {
        apiKey: "",
        baseUrl: "",
        deployment: "",
        useAzure: false,
      },
      maxMode: false,
    },
    useNewCompressionScheme: true,
    environmentInfo: {
      // workspaceUris: [
      // ],
      // exthostPlatform: "win32",
      // exthostArch: "x64",
      // exthostRelease: "10.0.19045",
      // exthostShell: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
      // localTimestamp: new Date(),
      // cursorVersion: "1.5.5",
      // isRemote: false,
      // localOsType: "Windows",
    },
    useFullInputsContext: false,
    allowModelFallbacks: true,
    numberOfTimesShownFallbackModelWarning: 0,
    unifiedMode: 2,
    shouldDisableTools: false,
    thinkingLevel: 0,
    usesRules: false,
    modeUsesAutoApply: false,
    unifiedModeName: "Agent",
    editToolSupportsSearchAndReplace: true,
    repositoryNameIfUnindexed: "none",
    indexingPhaseIfUnindexed: "none",
    supportsMermaidDiagrams: true,
    disableEditFileTimeout: false,
  };

  return {
    case: "streamUnifiedChatRequest",
    value: new pc(req),
  };
};

export const getReqToolImgExample = (tool: string, toolCallId: string) => {
  const value = {
    result: new lKe({
      fileWasCreated: false,
      linterErrors: [],
      sentBackLinterErrors: false,
      shouldAutoFixLints: false,
      resultForModel: "",
    }),
    tool,
    toolCallId,
  };

  return {
    case: "clientSideToolV2Result",
    value: new xu(value),
  };
};

export const getReqToolWebExample = (tool: string, toolCallId: string, web_search: boolean) => {
  const value = {
    result: {
      case: "webSearchResult",
      value: new hXe({
        references: [],
        isFinal: web_search,
      }),
    },
    tool,
    toolCallId,
  };

  return {
    case: "clientSideToolV2Result",
    value: new xu(value),
  };
};

export const getReqToolWebSearch = (toolCall: any) => {
  const value = {
    clientSideToolV2Call: {
      isLastMessage: toolCall.isLastMessage,
      internal: toolCall.internal,
      isStreaming: toolCall.isStreaming,
      name: toolCall.name,
      rawArgs: toolCall.rawArgs,
      toolCallId: toolCall.toolCallId,
      timeoutMs: 240000,
      tool: "CLIENT_SIDE_TOOL_V2_WEB_SEARCH",
      webSearchParams: toolCall.params.value,
    },
    eventId: ''
  };

  return {
    case: "clientSideToolV2Result",
    value: new xu(value),
  };
};
