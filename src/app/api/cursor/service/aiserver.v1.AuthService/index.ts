import { GetEmailResponse, GetEmailRequest } from './getEmail'

export const authService = {
  typeName: "aiserver.v1.AuthService",
  methods: {
    getEmail: { name: "GetEmail", I: GetEmailRequest, O: GetEmailResponse, kind: 0 },
  },
}  