import { pc } from "./service/common.js";

export const reqExample = {
  case: "streamUnifiedChatRequest",
  value: new pc({
    conversation: [
      {
        text: "你好",
        type: 1,
        attachedCodeChunks: [
        ],
        codebaseContextChunks: [
        ],
        commits: [
        ],
        pullRequests: [
        ],
        gitDiffs: [
        ],
        assistantSuggestedDiffs: [
        ],
        interpreterResults: [
        ],
        images: [
        ],
        attachedFolders: [
        ],
        approximateLintErrors: [
        ],
        bubbleId: "ad9d386b-a3a1-4f96-aedf-97e366496136",
        attachedFoldersNew: [
        ],
        lints: [
        ],
        userResponsesToSuggestedCodeBlocks: [
        ],
        relevantFiles: [
        ],
        toolResults: [
        ],
        notepads: [
        ],
        capabilities: [
        ],
        editTrailContexts: [
        ],
        suggestedCodeBlocks: [
        ],
        diffsForCompressingFiles: [
        ],
        multiFileLinterErrors: [
        ],
        diffHistories: [
        ],
        recentlyViewedFiles: [
        ],
        recentLocationsHistory: [
        ],
        isAgentic: true,
        fileDiffTrajectories: [
        ],
        existedSubsequentTerminalCommand: false,
        existedPreviousTerminalCommand: false,
        docsReferences: [
        ],
        webReferences: [
        ],
        aiWebSearchResults: [
        ],
        attachedFoldersListDirResults: [
        ],
        humanChanges: [
        ],
        attachedHumanChanges: false,
        summarizedComposers: [
        ],
        cursorRules: [
        ],
        contextPieces: [
        ],
        allThinkingBlocks: [
        ],
        diffsSinceLastApply: [
        ],
        deletedFiles: [
        ],
        supportedTools: [
          1,
          3,
          41,
          5,
          6,
          7,
          38,
          8,
          9,
          11,
          12,
          15,
          18,
          19,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          31,
          32,
          34,
          35,
          39,
          40,
          42,
        ],
        consoleLogs: [
        ],
        knowledgeItems: [
          {
            title: "Migrated User Rules",
            knowledge: "Always respond in Chinese-simplified",
            knowledgeId: "341218",
            isGenerated: false,
          },
        ],
        uiElementPicked: [
        ],
        documentationSelections: [
        ],
        externalLinks: [
        ],
        projectLayouts: [
        ],
        capabilityContexts: [
        ],
        todos: [
        ],
        requestId: "d6ea29f2-73eb-4b13-a619-4fc7c494abd7",
        unifiedMode: 2,
        editToolSupportsSearchAndReplace: true,
        richText: "{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"你好\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}",
        useWeb: false,
      },
    ],
    fullConversationHeadersOnly: [
      {
        bubbleId: "ad9d386b-a3a1-4f96-aedf-97e366496136",
        type: 1,
      },
    ],
    documentationIdentifiers: [
    ],
    externalLinks: [
    ],
    diffsForCompressingFiles: [
    ],
    multiFileLinterErrors: [
    ],
    fileDiffHistories: [
    ],
    quotes: [
    ],
    additionalRankedContext: [
    ],
    isChat: false,
    conversationId: "d9ddde13-6111-496b-9195-82928d6d6906",
    replyingToRequestId: "",
    repositoryInfoShouldQueryStaging: false,
    repositoryInfoShouldQueryProd: false,
    repoQueryAuthToken: "",
    isAgentic: true,
    supportedTools: [
      1,
      3,
      41,
      5,
      6,
      7,
      38,
      8,
      9,
      11,
      12,
      15,
      18,
      19,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      34,
      35,
      39,
      40,
      42,
    ],
    enableYoloMode: true,
    yoloPrompt: "",
    useUnifiedChatPrompt: false,
    mcpTools: [
      {
        name: "nx_docs",
        description: "Returns a list of documentation sections that could be relevant to the user query. IMPORTANT: ALWAYS USE THIS IF YOU ARE ANSWERING QUESTIONS ABOUT NX. NEVER ASSUME KNOWLEDGE ABOUT NX BECAUSE IT WILL PROBABLY BE OUTDATED. Use it to learn about nx, its configuration and options instead of assuming knowledge about it.",
        parameters: "{\"type\":\"object\",\"properties\":{\"userQuery\":{\"type\":\"string\",\"description\":\"The user query to get docs for. You can pass the original user query verbatim or summarize it.\"}},\"required\":[\"userQuery\"],\"additionalProperties\":false,\"$schema\":\"http://json-schema.org/draft-07/schema#\"}",
        serverName: "extension-nx-mcp",
      },
      {
        name: "nx_available_plugins",
        description: "Returns a list of available Nx plugins from the core team as well as local workspace Nx plugins.",
        parameters: "{\"type\":\"object\",\"properties\":{\"random_string\":{\"type\":\"string\",\"description\":\"Dummy parameter for no-parameter tools\"}},\"required\":[\"random_string\"]}",
        serverName: "extension-nx-mcp",
      },
    ],
    isHeadless: false,
    isBackgroundComposer: false,
    toolsRequiringAcceptedReturn: [
      18,
      7,
      38,
      24,
    ],
    projectLayouts: [
    ],
    supportsGitIndex: true,
    forceIsNotDev: false,
    allowLongFileScan: true,
    explicitContext: {
      context: "Always respond in Chinese-simplified",
      rules: [
      ],
    },
    canHandleFilenamesAfterLanguageIds: true,
    modelDetails: {
      modelName: "default",
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
      workspaceUris: [
      ],
      exthostPlatform: "win32",
      exthostArch: "x64",
      exthostRelease: "10.0.19045",
      exthostShell: "",
      localTimestamp: "2025-11-26T06:51:01.001Z",
      cursorVersion: "1.5.5",
      isRemote: false,
      localOsType: "Windows",
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
  }),
};
