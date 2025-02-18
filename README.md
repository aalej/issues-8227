# Repro for issue 8227

## Versions

firebase-tools: v13.21.1<br>
dependencies:

```
$npm ls
├── @typescript-eslint/eslint-plugin@5.62.0
├── @typescript-eslint/parser@5.62.0
├── eslint-config-google@0.14.0
├── eslint-plugin-import@2.31.0
├── eslint@8.57.1
├── firebase-admin@12.7.0
├── firebase-functions-test@3.4.0
├── firebase-functions@6.3.2
└── typescript@4.9.5
```

## Steps to reproduce

1. Install dependencies
   - Run `cd functions`
   - Run `npm i`
   - Run `cd ../`
2. Run `firebase deploy --project PROJECT_ID`

```
[debug] [2025-02-18T17:40:57.197Z] Functions deploy failed.
[debug] [2025-02-18T17:40:57.197Z] {
  "endpoint": {
    "id": "hello",
    "project": "PROJECT_ID",
    "region": "us-central1",
    "entryPoint": "hello",
    "platform": "gcfv1",
    "runtime": "nodejs22",
    "callableTrigger": {},
    "labels": {
      "deployment-tool": "cli-firebase"
    },
    "ingressSettings": null,
    "availableMemoryMb": null,
    "serviceAccount": "new-service-account@",
    "timeoutSeconds": null,
    "maxInstances": null,
    "minInstances": null,
    "vpc": null,
    "environmentVariables": {
      "FIREBASE_CONFIG": "{\"projectId\":\"PROJECT_ID\",\"databaseURL\":\"https://PROJECT_ID-default-rtdb.firebaseio.com\",\"storageBucket\":\"PROJECT_ID.appspot.com\",\"locationId\":\"us-central\"}",
      "GCLOUD_PROJECT": "PROJECT_ID",
      "EVENTARC_CLOUD_EVENT_SOURCE": "projects/PROJECT_ID/locations/us-central1/functions/hello"
    },
    "codebase": "default",
    "securityLevel": "SECURE_ALWAYS",
    "targetedByOnly": false,
    "hash": "67e3ddedac8e5b95479fef8086c32a41d935477e"
  },
  "op": "update",
  "original": {
    "name": "FirebaseError",
    "children": [],
    "context": {
      "function": "projects/PROJECT_ID/locations/us-central1/functions/hello"
    },
    "exit": 1,
    "message": "Failed to update function projects/PROJECT_ID/locations/us-central1/functions/hello",
    "original": {
      "name": "FirebaseError",
      "children": [],
      "context": {
        "body": {
          "error": {
            "code": 400,
            "message": "Invalid function service account requested: new-service-account@. Please visit https://cloud.google.com/functions/docs/troubleshooting for in-depth troubleshooting documentation.",
            "status": "INVALID_ARGUMENT"
          }
        },
        "response": {
          "statusCode": 400
        }
      },
      "exit": 1,
      "message": "Request to https://cloudfunctions.googleapis.com/v1/projects/PROJECT_ID/locations/us-central1/functions/hello?updateMask=name%2CsourceUploadUrl%2CentryPoint%2Cruntime%2CdockerRegistry%2Clabels%2ChttpsTrigger.securityLevel%2CminInstances%2CmaxInstances%2CingressSettings%2CenvironmentVariables%2CserviceAccountEmail%2CavailableMemoryMb%2Ctimeout%2CvpcConnector%2CvpcConnectorEgressSettings%2CsourceToken%2CbuildEnvironmentVariables had HTTP Error: 400, Invalid function service account requested: new-service-account@. Please visit https://cloud.google.com/functions/docs/troubleshooting for in-depth troubleshooting documentation.",
      "status": 400
    },
    "status": 400,
    "code": 400
  }
}
[debug] [2025-02-18T17:40:57.230Z] Error: Failed to update function hello in region us-central1
    at /usr/local/lib/node_modules/firebase-tools/lib/deploy/functions/release/fabricator.js:52:11
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async Fabricator.updateV1Function (/usr/local/lib/node_modules/firebase-tools/lib/deploy/functions/release/fabricator.js:352:32)
    at async Fabricator.updateEndpoint (/usr/local/lib/node_modules/firebase-tools/lib/deploy/functions/release/fabricator.js:152:13)
    at async handle (/usr/local/lib/node_modules/firebase-tools/lib/deploy/functions/release/fabricator.js:89:17)
[error]
[error] Error: There was an error deploying functions
```

## Notes

Trying to deploy:

```ts
import * as functions from "firebase-functions/v1";

export const hello = functions
  .runWith({
    serviceAccount: "new-service-account",
  })
  .https.onCall(async (data, context) => {
    return "OK";
  });
```

Raises an error which indicates that '{serviceAccountName}@' is supported:

```
Error: serviceAccount must be set to 'default', a string expression, a service account email, or '{serviceAccountName}@'
    at assertRuntimeOptionsValid (/Users/USER_NAME/Desktop/firebase-tools/issues/8227/functions/node_modules/firebase-functions/lib/v1/function-builder.js:69:15)
    at Object.runWith (/Users/USER_NAME/Desktop/firebase-tools/issues/8227/functions/node_modules/firebase-functions/lib/v1/function-builder.js:191:9)
    at Object.<anonymous> (/Users/USER_NAME/Desktop/firebase-tools/issues/8227/functions/lib/index.js:29:6)
    at Module._compile (node:internal/modules/cjs/loader:1562:14)
    at Object..js (node:internal/modules/cjs/loader:1699:10)
    at Module.load (node:internal/modules/cjs/loader:1313:32)
    at Function._load (node:internal/modules/cjs/loader:1123:12)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:217:24)
    at Module.require (node:internal/modules/cjs/loader:1335:12)
```
