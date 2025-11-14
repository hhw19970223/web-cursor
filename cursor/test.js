 
import { reqExample } from "./request.js";
import { _tt } from "./service/common.js";
import { transportStream } from "./transport.js";

const { token, traceparent,  xRequestId } = {
  "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHx1c2VyXzAxSldHMk44M0RYOURFQUFOMzE4MzlRODUwIiwidGltZSI6IjE3NjI4MzMxOTYiLCJyYW5kb21uZXNzIjoiY2RhNmE5NmEtZmZmNi00NGYzIiwiZXhwIjoxNzY4MDE3MTk2LCJpc3MiOiJodHRwczovL2F1dGhlbnRpY2F0aW9uLmN1cnNvci5zaCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgb2ZmbGluZV9hY2Nlc3MiLCJhdWQiOiJodHRwczovL2N1cnNvci5jb20iLCJ0eXBlIjoic2Vzc2lvbiJ9.cqjlL4kj7Uea6y1w93M8GBaKGBmiAX0tF3VQ5tJxG3Y",
  "traceparent":"00-f31e0a3aafcc6016d220dacb4004e735-d22da2f806a2cb09-00",
  "xRequestId":"18c21006-44fd-43a6-bb6a-4c457144f621"}
 
const cfg = {
  traceparent,
  "x-request-id": xRequestId,
  "x-amzn-trace-id": `Root=${xRequestId}`
};

const res = await transportStream(token, cfg, 'aiserver.v1.ChatService', 'streamUnifiedChatWithTools', new _tt({ request: reqExample }));


Promise.resolve()
.then(async () => {
  for await (const G of res.message) {
    console.log(G.data.text);
  }
})