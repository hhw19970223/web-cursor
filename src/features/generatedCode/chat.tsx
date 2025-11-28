"use client";

import {
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
} from "@/components/ai-elements/message";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  ImageShow,
  PromptInput,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { MessageResponse } from "@/components/ai-elements/message";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import type { ToolUIPart } from "ai";
import { ImageIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useGeneratedCodeStore } from "./context";
import { aria_browseract_tag } from "@/utils/dom";
import { v4 } from "uuid";
import { cn } from "@/utils/cn";
import { useLoginStore } from "@/stores/login";
import { traceparent } from "@/utils/cursor";
import LineLoading from "@/components/loading";

type MessageType = {
  key: string;
  from: "user" | "assistant";
  sources?: { href: string; title: string }[];
  versions: {
    id: string;
    content: string;
    files?: {
      data: string;
      type: string;
      filename: string;
      dimension?: {
        height: number;
        width: number;
      };
    }[];
  }[];
  reasoning?: {
    content: string;
    duration: number;
  };
  tools?: {
    name: string;
    description: string;
    status: ToolUIPart["state"];
    parameters: Record<string, unknown>;
    result: string | undefined;
    error: string | undefined;
  }[];
};

export const Chat = () => {
  const [text, setText] = useState<string>("");
  const [composerId] = useState(v4());
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const [messages, setMessages] = useState<MessageType[]>([]);

  const { selectTags } = useGeneratedCodeStore((selector) => selector);
  const { loginInfo } = useLoginStore();
  const { setCode, setNewCode, code: html } = useGeneratedCodeStore(selector => selector);

  const addUserMessage = useCallback(({ newText, images }: any) => {
    const userMessage: MessageType = {
      key: `user-${Date.now()}`,
      from: "user",
      versions: [
        {
          id: `user-${Date.now()}`,
          content: newText,
          files: images,
        },
      ],
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(async () => {
      const assistantMessageId = `assistant-${Date.now()}`;

      const assistantMessage: MessageType = {
        key: `assistant-${Date.now()}`,
        from: "assistant",
        versions: [
          {
            id: assistantMessageId,
            content: "",
          },
        ],
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const bubbleId = v4();
      const requestId = v4();

      const params = encodeURIComponent(
        JSON.stringify({
          uuid: composerId,
        })
      );

      setStatus("streaming");

      try {
        await fetch("/api/cursor/chat", {
          method: "POST",
          body: JSON.stringify({
            text: newText,
            token: loginInfo?.accessToken,
            traceparent,
            xRequestId: requestId,
            bubbleId,
            composerId,
            requestId,
            images,
            richText: "",
            uuid: composerId,
            code: html
          }),
        });

        const eventSource = new EventSource(`/api/cursor/chat?data=${params}`);

        let code = "";

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data?.message?.streamUnifiedChatResponse) {
            const streamUnifiedChatResponse = data.message.streamUnifiedChatResponse;
            console.log(data.message);
            console.warn(streamUnifiedChatResponse.text);

            if (streamUnifiedChatResponse.text != null) {
              assistantMessage.versions[0].content +=
                streamUnifiedChatResponse.text;
              setMessages((prev) => [...prev]);
            }

            if (streamUnifiedChatResponse.toolCall) {
              const toolCall = streamUnifiedChatResponse.toolCall;
              if (toolCall.rawArgs) {
                try {
                  const args = JSON.parse(toolCall.rawArgs);
                  const contents = args.contents;
                  if (contents) {
                    if (!code) {
                      code = contents;
                      setNewCode(code);
                    } else {
                      code += contents;
                      setCode(code);
                    }
                  }
                  
                } catch (e) {
                  console.error(e);
                }
              }
            }

            if (streamUnifiedChatResponse.parallelToolCallsComplete && code) {
              onClose();
            }
          }
        };

        const onClose = () => {
          eventSource?.close();
          setStatus("ready");
        };

        eventSource.onerror = (err) => {
          console.error("SSE error:", err);
          eventSource.close();
          setStatus("ready");
        };
      } catch (e) {
        setStatus("ready");
      }
    }, 500);
  }, []);

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!text.trim() || status === "streaming") return;

    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    const newText = message.text.replace(/@\d+/g, (match) => {
      const num = Number(match.slice(1)); // 取数字
      const flag = selectTags.some((info) => info.tag === num + "");
      return flag ? `属性${aria_browseract_tag}的值为${num}的元素` : match;
    });

    console.log(newText);

    setStatus("submitted");

    const images: any[] = [];

    if (message.files?.length) {
      for (const file of message.files) {
        images.push({
          data: file.url,
          uuid: v4(),
          // @ts-expect-error dimension
          dimension: file.dimension,
          // @ts-expect-error type
          type: file.file?.type,
          // @ts-expect-error name
          filename: file.file?.name,
        });
      }
    }

    addUserMessage({
      newText,
      images,
    });
    setText("");
  };

  useEffect(() => {
    return () => {
      fetch("/api/cursor/chat", {
        method: "DELETE",
        body: JSON.stringify({
          composerId
        }),
      })
    }
  }, [])

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden">
      <Conversation>
        <ConversationContent>
          {messages.map(({ versions, ...message }) => (
            <MessageBranch defaultBranch={0} key={message.key}>
              <MessageBranchContent>
                {versions.map((version) => (
                  <Message
                    from={message.from}
                    key={`${message.key}-${version.id}`}
                  >
                    <div>
                      {message.sources?.length && (
                        <Sources>
                          <SourcesTrigger count={message.sources.length} />
                          <SourcesContent>
                            {message.sources.map((source) => (
                              <Source
                                href={source.href}
                                key={source.href}
                                title={source.title}
                              />
                            ))}
                          </SourcesContent>
                        </Sources>
                      )}
                      {message.reasoning && (
                        <Reasoning duration={message.reasoning.duration}>
                          <ReasoningTrigger />
                          <ReasoningContent>
                            {message.reasoning.content}
                          </ReasoningContent>
                        </Reasoning>
                      )}
                      {version.files?.length ? (
                        <MessageContent className="group-[.is-user]:bg-none mb-4 max-w-full overflow-hidden">
                          <div
                            className={cn(
                              "flex flex-wrap items-center gap-2 p-3"
                            )}
                          >
                            {version.files.map((file, index) => {
                              return (
                                <div>
                                  {file?.data ? (
                                    <div key={index + ""}>
                                      <ImageShow
                                        data={file.data}
                                        type={file.type}
                                        filename={file.filename}
                                      />
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        </MessageContent>
                      ) : null}

                      <MessageContent>
                        <MessageResponse>{version.content}</MessageResponse>
                      </MessageContent>
                    </div>
                  </Message>
                ))}
              </MessageBranchContent>
              {versions.length > 1 && (
                <MessageBranchSelector from={message.from}>
                  <MessageBranchPrevious />
                  <MessageBranchPage />
                  <MessageBranchNext />
                </MessageBranchSelector>
              )}
            </MessageBranch>
          ))}
          {status === "streaming" ? (
            <div className="mb-4">
              <LineLoading />
            </div>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="grid shrink-0 gap-4 pt-4">
        <div className="w-full px-4 pt-2 pb-4 max-w-full overflow-hidden">
          <div className="w-full max-w-full">
            <PromptInputProvider>
              <PromptInput globalDrop multiple onSubmit={handleSubmit}>
                <PromptInputHeader>
                  <PromptInputAttachments>
                    {(attachment) => (
                      <PromptInputAttachment data={attachment} />
                    )}
                  </PromptInputAttachments>
                </PromptInputHeader>
                <PromptInputBody>
                  <PromptInputTextarea
                    onChange={(event) => setText(event.target.value)}
                    value={text}
                    placeholder="你想做些什么? (@tag 选择选中的元素)"
                  />
                </PromptInputBody>
                <PromptInputFooter>
                  <UploadImg />
                  <PromptInputSubmit
                    disabled={!text.trim() || status === "streaming"}
                    status={status}
                  />
                </PromptInputFooter>
              </PromptInput>
            </PromptInputProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

function UploadImg() {
  const attachments = usePromptInputAttachments();

  return (
    <div
      className="rounded-sm bg-white border border-gray-200 p-1 cursor-pointer hover:bg-gray-50"
      onClick={(e) => {
        e.preventDefault();
        attachments.openFileDialog();
      }}
    >
      <ImageIcon className="size-4" />
    </div>
  );
}
