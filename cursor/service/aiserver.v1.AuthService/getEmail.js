// @ts-nocheck

import { Message, proto3 } from "@bufbuild/protobuf";

const { initPartial, setEnumType, newFieldList, equals } = proto3.util;


const SignUpType = {
  UNSPECIFIED: 0,
  AUTH_0: 1,
  GITHUB: 2,
  GOOGLE: 3,
  WORKOS: 4,
  0: "UNSPECIFIED",
  1: "AUTH_0",
  2: "GITHUB",
  3: "GOOGLE",
  4: "WORKOS"
};

setEnumType(SignUpType, "aiserver.v1.GetEmailResponse.SignUpType", [
  { no: 0, name: "SIGN_UP_TYPE_UNSPECIFIED" },
  { no: 1, name: "SIGN_UP_TYPE_AUTH_0" },
  { no: 2, name: "SIGN_UP_TYPE_GITHUB" },
  { no: 3, name: "SIGN_UP_TYPE_GOOGLE" },
  { no: 4, name: "SIGN_UP_TYPE_WORKOS" },
])

export class GetEmailResponse extends Message {
  email;
  signUpType = 0;

  constructor(data) {
    super();
    initPartial(data, this);
  }

  static runtime = proto3;
  static typeName = "aiserver.v1.GetEmailResponse";
  static fields = newFieldList(() => [
    { no: 1, name: "email", kind: "scalar", T: 9 },
    { no: 2, name: "sign_up_type", kind: "enum", T: proto3.getEnumType(SignUpType) },
  ]);

  static fromBinary(bytes, options) {
    return new GetEmailResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue, options) {
    return new GetEmailResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString, options) {
    return new GetEmailResponse().fromJsonString(jsonString, options);
  }

  static equals(a, b) {
    return equals(GetEmailResponse, a, b);
  }
}

export class GetEmailRequest extends Message {
  constructor(data) {
    super();
    initPartial(data, this);
  }

  static runtime = proto3;
  static typeName = "aiserver.v1.GetEmailRequest";
  static fields = newFieldList(() => []);

  static fromBinary(bytes, options) {
    return new GetEmailRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue, options) {
    return new GetEmailRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString, options) {
    return new GetEmailRequest().fromJsonString(jsonString, options);
  }

  static equals(a, b) {
    return equals(GetEmailRequest, a, b);
  }
}