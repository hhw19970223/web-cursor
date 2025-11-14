import { pc } from "../service/common";

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
        bubbleId: "3b96581c-739a-4786-943f-885edbaf5082",
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
          {
            rootPath: "package",
            content: {
              directories: [
              ],
              files: [
              ],
              hiddenFiles: [
              ],
            },
            listDirV2Result: {
              directoryTreeRoot: {
                absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package",
                childrenDirs: [
                  {
                    absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\cursor",
                    childrenDirs: [
                      {
                        absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\cursor\\server",
                        childrenDirs: [
                          {
                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\cursor\\server\\aiserver.v1.AuthService",
                            childrenDirs: [
                            ],
                            childrenFiles: [
                              {
                                name: "getEmail.js",
                              },
                            ],
                            childrenWereProcessed: true,
                            fullSubtreeExtensionCounts: {
                              ".js": 1,
                            },
                            numFiles: 1,
                          },
                        ],
                        childrenFiles: [
                        ],
                        childrenWereProcessed: true,
                        fullSubtreeExtensionCounts: {
                          ".js": 1,
                        },
                        numFiles: 1,
                      },
                      {
                        absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\cursor\\service",
                        childrenDirs: [
                          {
                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\cursor\\service\\aiserver.v1.AuthService",
                            childrenDirs: [
                            ],
                            childrenFiles: [
                              {
                                name: "getEmail.js",
                              },
                              {
                                name: "index.js",
                              },
                            ],
                            childrenWereProcessed: true,
                            fullSubtreeExtensionCounts: {
                              ".js": 2,
                            },
                            numFiles: 2,
                          },
                        ],
                        childrenFiles: [
                        ],
                        childrenWereProcessed: true,
                        fullSubtreeExtensionCounts: {
                          ".js": 2,
                        },
                        numFiles: 2,
                      },
                    ],
                    childrenFiles: [
                      {
                        name: "transport.js",
                      },
                      {
                        name: "transportFactory.js",
                      },
                    ],
                    childrenWereProcessed: true,
                    fullSubtreeExtensionCounts: {
                      ".js": 5,
                    },
                    numFiles: 5,
                  },
                  {
                    absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\node_modules",
                    childrenDirs: [
                    ],
                    childrenFiles: [
                    ],
                    childrenWereProcessed: true,
                    fullSubtreeExtensionCounts: {
                    },
                    numFiles: 0,
                  },
                  {
                    absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\public",
                    childrenDirs: [
                      {
                        absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\public\\images",
                        childrenDirs: [
                          {
                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\public\\images\\backgrounds",
                            childrenDirs: [
                            ],
                            childrenFiles: [
                              {
                                name: "errorimg.svg",
                              },
                              {
                                name: "upgrade.png",
                              },
                              {
                                name: "upgrade.svg",
                              },
                            ],
                            childrenWereProcessed: true,
                            fullSubtreeExtensionCounts: {
                              ".svg": 2,
                              ".png": 1,
                            },
                            numFiles: 3,
                          },
                          {
                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\public\\images\\blog",
                            childrenDirs: [
                            ],
                            childrenFiles: [
                              {
                                name: "blog-img1.jpg",
                              },
                              {
                                name: "blog-img2.jpg",
                              },
                              {
                                name: "blog-img3.jpg",
                              },
                            ],
                            childrenWereProcessed: true,
                            fullSubtreeExtensionCounts: {
                              ".jpg": 3,
                            },
                            numFiles: 3,
                          },
                          {
                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\public\\images\\logos",
                            childrenDirs: [
                            ],
                            childrenFiles: [
                              {
                                name: "dark-logo.svg",
                              },
                              {
                                name: "light-logo.svg",
                              },
                              {
                                name: "logo-icon.svg",
                              },
                            ],
                            childrenWereProcessed: true,
                            fullSubtreeExtensionCounts: {
                              ".svg": 3,
                            },
                            numFiles: 3,
                          },
                          {
                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\public\\images\\products",
                            childrenDirs: [
                            ],
                            childrenFiles: [
                              {
                                name: "dash-prd-1.jpg",
                              },
                              {
                                name: "dash-prd-2.jpg",
                              },
                              {
                                name: "dash-prd-3.jpg",
                              },
                              {
                                name: "dash-prd-4.jpg",
                              },
                            ],
                            childrenWereProcessed: true,
                            fullSubtreeExtensionCounts: {
                              ".jpg": 4,
                            },
                            numFiles: 4,
                          },
                          {
                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\public\\images\\profile",
                            childrenDirs: [
                            ],
                            childrenFiles: [
                              {
                                name: "user-1.jpg",
                              },
                              {
                                name: "user-10.jpg",
                              },
                              {
                                name: "user-11.jpg",
                              },
                              {
                                name: "user-12.jpg",
                              },
                              {
                                name: "user-2.jpg",
                              },
                              {
                                name: "user-3.jpg",
                              },
                              {
                                name: "user-4.jpg",
                              },
                              {
                                name: "user-5.jpg",
                              },
                              {
                                name: "user-6.jpg",
                              },
                              {
                                name: "user-7.jpg",
                              },
                              {
                                name: "user-8.jpg",
                              },
                              {
                                name: "user-9.jpg",
                              },
                            ],
                            childrenWereProcessed: true,
                            fullSubtreeExtensionCounts: {
                              ".jpg": 12,
                            },
                            numFiles: 12,
                          },
                        ],
                        childrenFiles: [
                        ],
                        childrenWereProcessed: true,
                        fullSubtreeExtensionCounts: {
                          ".jpg": 19,
                          ".svg": 5,
                          ".png": 1,
                        },
                        numFiles: 25,
                      },
                    ],
                    childrenFiles: [
                      {
                        name: "favicon.svg",
                      },
                    ],
                    childrenWereProcessed: true,
                    fullSubtreeExtensionCounts: {
                      ".jpg": 19,
                      ".svg": 6,
                      ".png": 1,
                    },
                    numFiles: 26,
                  },
                  {
                    absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src",
                    childrenDirs: [
                      {
                        absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app",
                        childrenDirs: [
                          {
                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\(DashboardLayout)",
                            childrenDirs: [
                              {
                                absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\(DashboardLayout)\\icons",
                                childrenDirs: [
                                  {
                                    absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\(DashboardLayout)\\icons\\solar",
                                    childrenDirs: [
                                    ],
                                    childrenFiles: [
                                      {
                                        name: "page.tsx",
                                      },
                                    ],
                                    childrenWereProcessed: true,
                                    fullSubtreeExtensionCounts: {
                                      ".tsx": 1,
                                    },
                                    numFiles: 1,
                                  },
                                ],
                                childrenFiles: [
                                ],
                                childrenWereProcessed: true,
                                fullSubtreeExtensionCounts: {
                                  ".tsx": 1,
                                },
                                numFiles: 1,
                              },
                              {
                                absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\(DashboardLayout)\\layout",
                                childrenDirs: [
                                  {
                                    absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\(DashboardLayout)\\layout\\vertical",
                                    childrenDirs: [
                                      {
                                        absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\(DashboardLayout)\\layout\\vertical\\header",
                                        childrenDirs: [
                                        ],
                                        childrenFiles: [
                                          {
                                            name: "Header.tsx",
                                          },
                                          {
                                            name: "notification.tsx",
                                          },
                                          {
                                            name: "Profile.tsx",
                                          },
                                        ],
                                        childrenWereProcessed: true,
                                        fullSubtreeExtensionCounts: {
                                          ".tsx": 3,
                                        },
                                        numFiles: 3,
                                      },
                                      {
                                        absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\(DashboardLayout)\\layout\\vertical\\sidebar",
                                        childrenDirs: [
                                          {
                                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\(DashboardLayout)\\layout\\vertical\\sidebar\\NavCollapse",
                                            childrenDirs: [
                                            ],
                                            childrenFiles: [
                                              {
                                                name: "index.tsx",
                                              },
                                            ],
                                            childrenWereProcessed: true,
                                            fullSubtreeExtensionCounts: {
                                              ".tsx": 1,
                                            },
                                            numFiles: 1,
                                          },
                                          {
                                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\(DashboardLayout)\\layout\\vertical\\sidebar\\NavItems",
                                            childrenDirs: [
                                            ],
                                            childrenFiles: [
                                              {
                                                name: "index.tsx",
                                              },
                                            ],
                                            childrenWereProcessed: true,
                                            fullSubtreeExtensionCounts: {
                                              ".tsx": 1,
                                            },
                                            numFiles: 1,
                                          },
                                        ],
                                        childrenFiles: [
                                          {
                                            name: "MobileSidebar.tsx",
                                          },
                                          {
                                            name: "Sidebar.tsx",
                                          },
                                          {
                                            name: "Sidebaritems.ts",
                                          },
                                          {
                                            name: "Upgrade.tsx",
                                          },
                                        ],
                                        childrenWereProcessed: true,
                                        fullSubtreeExtensionCounts: {
                                          ".tsx": 5,
                                          ".ts": 1,
                                        },
                                        numFiles: 6,
                                      },
                                    ],
                                    childrenFiles: [
                                    ],
                                    childrenWereProcessed: true,
                                    fullSubtreeExtensionCounts: {
                                      ".tsx": 8,
                                      ".ts": 1,
                                    },
                                    numFiles: 9,
                                  },
                                ],
                                childrenFiles: [
                                ],
                                childrenWereProcessed: true,
                                fullSubtreeExtensionCounts: {
                                  ".tsx": 8,
                                  ".ts": 1,
                                },
                                numFiles: 9,
                              },
                            ],
                            childrenFiles: [
                              {
                                name: "layout.tsx",
                              },
                              {
                                name: "page.tsx",
                              },
                            ],
                            childrenWereProcessed: true,
                            fullSubtreeExtensionCounts: {
                              ".tsx": 11,
                              ".ts": 1,
                            },
                            numFiles: 12,
                          },
                          {
                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\api",
                            childrenDirs: [
                              {
                                absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\api\\cursor",
                                childrenDirs: [
                                  {
                                    absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\api\\cursor\\chat",
                                    childrenDirs: [
                                    ],
                                    childrenFiles: [
                                      {
                                        name: "request.ts",
                                      },
                                      {
                                        name: "route.ts",
                                      },
                                    ],
                                    childrenWereProcessed: true,
                                    fullSubtreeExtensionCounts: {
                                      ".ts": 2,
                                    },
                                    numFiles: 2,
                                  },
                                  {
                                    absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\api\\cursor\\get-email",
                                    childrenDirs: [
                                    ],
                                    childrenFiles: [
                                      {
                                        name: "route.ts",
                                      },
                                    ],
                                    childrenWereProcessed: true,
                                    fullSubtreeExtensionCounts: {
                                      ".ts": 1,
                                    },
                                    numFiles: 1,
                                  },
                                  {
                                    absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\api\\cursor\\login",
                                    childrenDirs: [
                                    ],
                                    childrenFiles: [
                                      {
                                        name: "route.ts",
                                      },
                                    ],
                                    childrenWereProcessed: true,
                                    fullSubtreeExtensionCounts: {
                                      ".ts": 1,
                                    },
                                    numFiles: 1,
                                  },
                                  {
                                    absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\api\\cursor\\me",
                                    childrenDirs: [
                                    ],
                                    childrenFiles: [
                                      {
                                        name: "route.ts",
                                      },
                                    ],
                                    childrenWereProcessed: true,
                                    fullSubtreeExtensionCounts: {
                                      ".ts": 1,
                                    },
                                    numFiles: 1,
                                  },
                                  {
                                    absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\api\\cursor\\service",
                                    childrenDirs: [
                                      {
                                        absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\api\\cursor\\service\\aiserver.v1.AuthService",
                                        childrenDirs: [
                                        ],
                                        childrenFiles: [
                                          {
                                            name: "getEmail.ts",
                                          },
                                          {
                                            name: "index.ts",
                                          },
                                        ],
                                        childrenWereProcessed: true,
                                        fullSubtreeExtensionCounts: {
                                          ".ts": 2,
                                        },
                                        numFiles: 2,
                                      },
                                      {
                                        absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\api\\cursor\\service\\aiserver.v1.ChatService",
                                        childrenDirs: [
                                        ],
                                        childrenFiles: [
                                          {
                                            name: "index.ts",
                                          },
                                          {
                                            name: "streamUnifiedChat.ts",
                                          },
                                          {
                                            name: "streamUnifiedChatWithTools.ts",
                                          },
                                        ],
                                        childrenWereProcessed: true,
                                        fullSubtreeExtensionCounts: {
                                          ".ts": 3,
                                        },
                                        numFiles: 3,
                                      },
                                    ],
                                    childrenFiles: [
                                      {
                                        name: "common.ts",
                                      },
                                    ],
                                    childrenWereProcessed: true,
                                    fullSubtreeExtensionCounts: {
                                      ".ts": 6,
                                    },
                                    numFiles: 6,
                                  },
                                ],
                                childrenFiles: [
                                  {
                                    name: "transport.ts",
                                  },
                                  {
                                    name: "transportFactory.ts",
                                  },
                                ],
                                childrenWereProcessed: true,
                                fullSubtreeExtensionCounts: {
                                  ".ts": 13,
                                },
                                numFiles: 13,
                              },
                            ],
                            childrenFiles: [
                            ],
                            childrenWereProcessed: true,
                            fullSubtreeExtensionCounts: {
                              ".ts": 13,
                            },
                            numFiles: 13,
                          },
                          {
                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\components",
                            childrenDirs: [
                              {
                                absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\components\\toast",
                                childrenDirs: [
                                ],
                                childrenFiles: [
                                  {
                                    name: "index.tsx",
                                  },
                                ],
                                childrenWereProcessed: true,
                                fullSubtreeExtensionCounts: {
                                  ".tsx": 1,
                                },
                                numFiles: 1,
                              },
                            ],
                            childrenFiles: [
                            ],
                            childrenWereProcessed: true,
                            fullSubtreeExtensionCounts: {
                              ".tsx": 1,
                            },
                            numFiles: 1,
                          },
                          {
                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\css",
                            childrenDirs: [
                              {
                                absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\css\\layouts",
                                childrenDirs: [
                                ],
                                childrenFiles: [
                                  {
                                    name: "header.css",
                                  },
                                  {
                                    name: "sidebar.css",
                                  },
                                ],
                                childrenWereProcessed: true,
                                fullSubtreeExtensionCounts: {
                                  ".css": 2,
                                },
                                numFiles: 2,
                              },
                              {
                                absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\css\\override",
                                childrenDirs: [
                                ],
                                childrenFiles: [
                                  {
                                    name: "reboot.css",
                                  },
                                ],
                                childrenWereProcessed: true,
                                fullSubtreeExtensionCounts: {
                                  ".css": 1,
                                },
                                numFiles: 1,
                              },
                              {
                                absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\app\\css\\theme",
                                childrenDirs: [
                                ],
                                childrenFiles: [
                                  {
                                    name: "default-colors.css",
                                  },
                                ],
                                childrenWereProcessed: true,
                                fullSubtreeExtensionCounts: {
                                  ".css": 1,
                                },
                                numFiles: 1,
                              },
                            ],
                            childrenFiles: [
                              {
                                name: "globals.css",
                              },
                            ],
                            childrenWereProcessed: true,
                            fullSubtreeExtensionCounts: {
                              ".css": 5,
                            },
                            numFiles: 5,
                          },
                        ],
                        childrenFiles: [
                          {
                            name: "layout.tsx",
                          },
                          {
                            name: "not-found.tsx",
                          },
                        ],
                        childrenWereProcessed: true,
                        fullSubtreeExtensionCounts: {
                          ".tsx": 14,
                          ".css": 5,
                          ".ts": 14,
                        },
                        numFiles: 33,
                      },
                      {
                        absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\stores",
                        childrenDirs: [
                          {
                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\stores\\global-components",
                            childrenDirs: [
                            ],
                            childrenFiles: [
                              {
                                name: "index.ts",
                              },
                              {
                                name: "index.types.ts",
                              },
                            ],
                            childrenWereProcessed: true,
                            fullSubtreeExtensionCounts: {
                              ".ts": 2,
                            },
                            numFiles: 2,
                          },
                          {
                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\stores\\login",
                            childrenDirs: [
                            ],
                            childrenFiles: [
                              {
                                name: "index.ts",
                              },
                              {
                                name: "index.types.ts",
                              },
                            ],
                            childrenWereProcessed: true,
                            fullSubtreeExtensionCounts: {
                              ".ts": 2,
                            },
                            numFiles: 2,
                          },
                        ],
                        childrenFiles: [
                        ],
                        childrenWereProcessed: true,
                        fullSubtreeExtensionCounts: {
                          ".ts": 4,
                        },
                        numFiles: 4,
                      },
                      {
                        absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\utils",
                        childrenDirs: [
                          {
                            absPath: "d:\\hhw\\官网\\matdash-nextjs-free-v1\\package\\src\\utils\\theme",
                            childrenDirs: [
                            ],
                            childrenFiles: [
                              {
                                name: "custom-theme.tsx",
                              },
                            ],
                            childrenWereProcessed: true,
                            fullSubtreeExtensionCounts: {
                              ".tsx": 1,
                            },
                            numFiles: 1,
                          },
                        ],
                        childrenFiles: [
                        ],
                        childrenWereProcessed: true,
                        fullSubtreeExtensionCounts: {
                          ".tsx": 1,
                        },
                        numFiles: 1,
                      },
                    ],
                    childrenFiles: [
                    ],
                    childrenWereProcessed: true,
                    fullSubtreeExtensionCounts: {
                      ".tsx": 15,
                      ".ts": 18,
                      ".css": 5,
                    },
                    numFiles: 38,
                  },
                ],
                childrenFiles: [
                  {
                    name: "eslint.config.mjs",
                  },
                  {
                    name: "netlify.toml",
                  },
                  {
                    name: "next-env.d.ts",
                  },
                  {
                    name: "next.config.mjs",
                  },
                  {
                    name: "package.json",
                  },
                  {
                    name: "postcss.config.mjs",
                  },
                  {
                    name: "README.md",
                  },
                  {
                    name: "tailwind.config.ts",
                  },
                  {
                    name: "tsconfig.json",
                  },
                  {
                    name: "workflow-diagram.html",
                  },
                  {
                    name: "yarn.lock",
                  },
                ],
                childrenWereProcessed: true,
                fullSubtreeExtensionCounts: {
                  ".lock": 1,
                  ".html": 1,
                  ".json": 2,
                  ".ts": 19,
                  ".mjs": 3,
                  ".toml": 1,
                  ".md": 1,
                  ".js": 5,
                  ".tsx": 15,
                  ".jpg": 19,
                  ".svg": 6,
                  ".png": 1,
                  ".css": 5,
                },
                numFiles: 79,
              },
            },
          },
        ],
        capabilityContexts: [
        ],
        todos: [
        ],
        requestId: "1aac1dbf-ddf0-462c-a338-5f98ebcde199",
        unifiedMode: 2,
        editToolSupportsSearchAndReplace: true,
        richText: "{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"你好\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}",
        useWeb: false,
        gitStatusRaw: "On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges not staged for commit:\n  (use \"git add <file>...\" to update what will be committed)\n  (use \"git restore <file>...\" to discard changes in working directory)\n\tmodified:   .vscode/launch.json\n\tmodified:   package.json\n\tmodified:   src/app/(DashboardLayout)/layout/vertical/header/Profile.tsx\n\tmodified:   src/app/api/cursor/get-email/route.ts\n\tmodified:   src/app/api/cursor/service/aiserver.v1.AuthService/getEmail.ts\n\tmodified:   src/app/api/cursor/transport.ts\n\tmodified:   src/app/api/cursor/transportFactory.ts\n\nUntracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n\tsrc/app/api/cursor/chat/\n\tsrc/app/api/cursor/service/aiserver.v1.ChatService/\n\tsrc/app/api/cursor/service/common.ts\n\tworkflow-diagram.html\n\nno changes added to commit (use \"git add\" and/or \"git commit -a\")\n",
      },
    ],
    fullConversationHeadersOnly: [
      {
        bubbleId: "3b96581c-739a-4786-943f-885edbaf5082",
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
    conversationId: "178a0bb9-1aa1-424d-8581-65f1712746f1",
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
    repositoryInfo: {
      relativeWorkspacePath: ".",
      remoteUrls: [
      ],
      remoteNames: [
      ],
      repoName: "3077fd08-a5d6-452d-b1da-2ad324567159",
      repoOwner: "auth0|user_01JWG2N83DX9DEAAN31839Q850",
      isTracked: false,
      isLocal: false,
      workspaceUri: "",
      orthogonalTransformSeed: 7046967597152399,
      preferredEmbeddingModel: 0,
    },
    environmentInfo: {
      workspaceUris: [
        "file:///d%3A/hhw/%E5%AE%98%E7%BD%91/matdash-nextjs-free-v1/package",
      ],
      exthostPlatform: "win32",
      exthostArch: "x64",
      exthostRelease: "10.0.19045",
      exthostShell: "",
      localTimestamp: "2025-11-13T09:02:31.691Z",
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
    supportsMermaidDiagrams: true,
    disableEditFileTimeout: false,
  }),
};
