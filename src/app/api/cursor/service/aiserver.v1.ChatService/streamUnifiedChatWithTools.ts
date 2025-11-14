// @ts-nocheck

import { Message, proto3 } from "@bufbuild/protobuf";

const { initPartial, setEnumType, newFieldList, equals } = proto3.util;


export class StreamUnifiedChatResponseWithTools extends Message {
  constructor(data) {
    super();
    initPartial(data, this);
  }

  static runtime = proto3;
  static typeName = "aiserver.v1.aiserver.v1.StreamUnifiedChatResponseWithTools";
  static fields = newFieldList(() => []);

  static fromBinary(bytes, options) {
    return new StreamUnifiedChatResponseWithTools().fromBinary(bytes, options);
  }

  static fromJson(jsonValue, options) {
    return new StreamUnifiedChatResponseWithTools().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString, options) {
    return new StreamUnifiedChatResponseWithTools().fromJsonString(jsonString, options);
  }

  static equals(a, b) {
    return equals(StreamUnifiedChatResponseWithTools, a, b);
  }
}

export class StreamUnifiedChatRequestWithTools extends Message {
  constructor(data) {
    super();
    initPartial(data, this);
  }

  static runtime = proto3;
  static typeName = "aiserver.v1.StreamUnifiedChatRequestWithTools";
  static fields = newFieldList(() => []);

  static fromBinary(bytes, options) {
    return new StreamUnifiedChatWithToolsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue, options) {
    return new StreamUnifiedChatWithToolsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString, options) {
    return new StreamUnifiedChatWithToolsRequest().fromJsonString(jsonString, options);
  }

  static equals(a, b) {
    return equals(StreamUnifiedChatWithToolsRequest, a, b);
  }
}