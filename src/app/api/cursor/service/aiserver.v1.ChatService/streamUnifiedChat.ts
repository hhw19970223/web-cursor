// @ts-nocheck

import { Message, proto3 } from "@bufbuild/protobuf";

// 从 proto3.util 中解构需要的方法
const { initPartial, setEnumType, newFieldList, equals } = proto3.util;


export class StreamUnifiedChatResponse extends Message {
  text = "";

  constructor(data) {
    super();
    initPartial(data, this);
  }

  static runtime = proto3;
  static typeName = "aiserver.v1.StreamUnifiedChatResponse";
  static fields = newFieldList(() => []);

  static fromBinary(bytes, options) {
    return new StreamUnifiedChatResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue, options) {
    return new StreamUnifiedChatResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString, options) {
    return new StreamUnifiedChatResponse().fromJsonString(jsonString, options);
  }

  static equals(a, b) {
    return equals(StreamUnifiedChatResponse, a, b);
  }
}

export class StreamUnifiedChatRequest extends Message {
  conversation = [];
  fullConversationHeadersOnly= [];
  documentationIdentifiers = [];
  externalLinks = [];
  diffsForCompressingFiles = [];
  multiFileLinterErrors = [];
  fileDiffHistories = [];
  quotes = [];
  additionalRankedContext = [];
  isChat = !1;
  conversationId = "";
  replyingToRequestId = "";
  repositoryInfoShouldQueryStaging = !1;
  repositoryInfoShouldQueryProd = !1;
  repoQueryAuthToken = "";
  isAgentic = !1;
  supportedTools = [];
  enableYoloMode = !1;
  yoloPrompt = "";
  useUnifiedChatPrompt = !1;
  mcpTools = [];
  isHeadless = !1;
  isBackgroundComposer = !1;
  toolsRequiringAcceptedReturn = [];
  projectLayouts = [];
  supportsGitIndex = !1;
  forceIsNotDev = !1;
  constructor(data) {
    super();
    initPartial(data, this);
  }

  static runtime = proto3;
  static typeName = "aiserver.v1.StreamUnifiedChatRequest";
  static fields = newFieldList(() => [
    { no: 1, name: "conversation", kind: "message", T: st, repeated: !0 },
    {
      no: 30,
      name: "full_conversation_headers_only",
      kind: "message",
      T: Vtt,
      repeated: !0,
    },
    { no: 2, name: "allow_long_file_scan", kind: "scalar", T: 8, opt: !0 },
    { no: 3, name: "explicit_context", kind: "message", T: Zt },
    {
      no: 4,
      name: "can_handle_filenames_after_language_ids",
      kind: "scalar",
      T: 8,
      opt: !0,
    },
    { no: 5, name: "model_details", kind: "message", T: ke },
    { no: 6, name: "linter_errors", kind: "message", T: ms },
    {
      no: 7,
      name: "documentation_identifiers",
      kind: "scalar",
      T: 9,
      repeated: !0,
    },
    { no: 8, name: "use_web", kind: "scalar", T: 9, opt: !0 },
    { no: 9, name: "external_links", kind: "message", T: Fh, repeated: !0 },
    { no: 10, name: "project_context", kind: "message", T: st, opt: !0 },
    {
      no: 11,
      name: "diffs_for_compressing_files",
      kind: "message",
      T: Ltt,
      repeated: !0,
    },
    { no: 12, name: "compress_edits", kind: "scalar", T: 8, opt: !0 },
    { no: 13, name: "should_cache", kind: "scalar", T: 8, opt: !0 },
    {
      no: 14,
      name: "multi_file_linter_errors",
      kind: "message",
      T: ms,
      repeated: !0,
    },
    { no: 15, name: "current_file", kind: "message", T: at },
    { no: 16, name: "recent_edits", kind: "message", T: Dtt, opt: !0 },
    {
      no: 17,
      name: "use_reference_composer_diff_prompt",
      kind: "scalar",
      T: 8,
      opt: !0,
    },
    {
      no: 18,
      name: "file_diff_histories",
      kind: "message",
      T: lme,
      repeated: !0,
    },
    {
      no: 19,
      name: "use_new_compression_scheme",
      kind: "scalar",
      T: 8,
      opt: !0,
    },
    { no: 21, name: "quotes", kind: "message", T: Zle, repeated: !0 },
    {
      no: 20,
      name: "additional_ranked_context",
      kind: "message",
      T: nPe,
      repeated: !0,
    },
    { no: 22, name: "is_chat", kind: "scalar", T: 8 },
    { no: 23, name: "conversation_id", kind: "scalar", T: 9 },
    { no: 72, name: "replying_to_request_id", kind: "scalar", T: 9 },
    { no: 24, name: "repository_info", kind: "message", T: Ne },
    {
      no: 25,
      name: "repository_info_should_query_staging",
      kind: "scalar",
      T: 8,
    },
    {
      no: 39,
      name: "repository_info_should_query_prod",
      kind: "scalar",
      T: 8,
    },
    { no: 52, name: "query_only_repo_access", kind: "message", T: rf },
    { no: 44, name: "repo_query_auth_token", kind: "scalar", T: 9 },
    { no: 26, name: "environment_info", kind: "message", T: zle },
    { no: 27, name: "is_agentic", kind: "scalar", T: 8 },
    {
      no: 28,
      name: "conversation_summary",
      kind: "message",
      T: sr,
      opt: !0,
    },
    {
      no: 29,
      name: "supported_tools",
      kind: "enum",
      T: i.getEnumType(Ei),
      repeated: !0,
    },
    { no: 31, name: "enable_yolo_mode", kind: "scalar", T: 8 },
    { no: 32, name: "yolo_prompt", kind: "scalar", T: 9 },
    { no: 33, name: "use_unified_chat_prompt", kind: "scalar", T: 8 },
    { no: 34, name: "mcp_tools", kind: "message", T: ame, repeated: !0 },
    {
      no: 35,
      name: "use_full_inputs_context",
      kind: "scalar",
      T: 8,
      opt: !0,
    },
    { no: 36, name: "is_resume", kind: "scalar", T: 8, opt: !0 },
    {
      no: 37,
      name: "allow_model_fallbacks",
      kind: "scalar",
      T: 8,
      opt: !0,
    },
    {
      no: 38,
      name: "number_of_times_shown_fallback_model_warning",
      kind: "scalar",
      T: 5,
      opt: !0,
    },
    {
      no: 40,
      name: "context_bank_session_id",
      kind: "scalar",
      T: 9,
      opt: !0,
    },
    { no: 41, name: "context_bank_version", kind: "scalar", T: 5, opt: !0 },
    {
      no: 43,
      name: "context_bank_encryption_key",
      kind: "scalar",
      T: 12,
      opt: !0,
    },
    { no: 45, name: "is_headless", kind: "scalar", T: 8 },
    { no: 68, name: "is_background_composer", kind: "scalar", T: 8 },
    {
      no: 42,
      name: "uses_codebase_results",
      kind: "message",
      T: Att,
      opt: !0,
    },
    {
      no: 46,
      name: "unified_mode",
      kind: "enum",
      T: i.getEnumType(pp),
      opt: !0,
    },
    {
      no: 47,
      name: "tools_requiring_accepted_return",
      kind: "enum",
      T: i.getEnumType(Ei),
      repeated: !0,
    },
    { no: 48, name: "should_disable_tools", kind: "scalar", T: 8, opt: !0 },
    {
      no: 49,
      name: "thinking_level",
      kind: "enum",
      T: i.getEnumType(sne),
      opt: !0,
    },
    {
      no: 50,
      name: "should_use_chat_prompt",
      kind: "scalar",
      T: 8,
      opt: !0,
    },
    {
      no: 55,
      name: "background_composer_id",
      kind: "scalar",
      T: 9,
      opt: !0,
    },
    { no: 51, name: "uses_rules", kind: "scalar", T: 8, opt: !0 },
    { no: 53, name: "mode_uses_auto_apply", kind: "scalar", T: 8, opt: !0 },
    { no: 54, name: "unified_mode_name", kind: "scalar", T: 9, opt: !0 },
    {
      no: 56,
      name: "use_generate_rules_prompt",
      kind: "scalar",
      T: 8,
      opt: !0,
    },
    {
      no: 57,
      name: "edit_tool_supports_search_and_replace",
      kind: "scalar",
      T: 8,
      opt: !0,
    },
    {
      no: 58,
      name: "project_layouts",
      kind: "message",
      T: SPe,
      repeated: !0,
    },
    {
      no: 59,
      name: "repository_name_if_unindexed",
      kind: "scalar",
      T: 9,
      opt: !0,
    },
    { no: 60, name: "indexing_progress", kind: "scalar", T: 1, opt: !0 },
    {
      no: 61,
      name: "full_file_cmd_k_options",
      kind: "message",
      T: qtt,
      opt: !0,
    },
    {
      no: 62,
      name: "indexing_phase_if_unindexed",
      kind: "scalar",
      T: 9,
      opt: !0,
    },
    {
      no: 63,
      name: "use_knowledge_base_prompt",
      kind: "scalar",
      T: 8,
      opt: !0,
    },
    {
      no: 64,
      name: "indexing_num_files_if_unindexed",
      kind: "scalar",
      T: 5,
      opt: !0,
    },
    {
      no: 65,
      name: "supports_mermaid_diagrams",
      kind: "scalar",
      T: 8,
      opt: !0,
    },
    { no: 66, name: "subagent_info", kind: "message", T: bst, opt: !0 },
    { no: 67, name: "supports_git_index", kind: "scalar", T: 8 },
    { no: 69, name: "force_is_not_dev", kind: "scalar", T: 8 },
    {
      no: 70,
      name: "disable_edit_file_timeout",
      kind: "scalar",
      T: 8,
      opt: !0,
    },
    {
      no: 71,
      name: "should_attach_linter_errors",
      kind: "scalar",
      T: 8,
      opt: !0,
    }]);

  static fromBinary(bytes, options) {
    return new StreamUnifiedChatRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue, options) {
    return new StreamUnifiedChatRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString, options) {
    return new StreamUnifiedChatRequest().fromJsonString(jsonString, options);
  }

  static equals(a, b) {
    return equals(StreamUnifiedChatRequest, a, b);
  }
}