import * as functions from "firebase-functions/v1";

export const hello = functions
  .runWith({
    serviceAccount: "new-service-account@",
  })
  .https.onCall(async (data, context) => {
    return "OK";
  });
