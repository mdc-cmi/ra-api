"use strict"

module.exports = {
  http: {
    host: process.env.HTTP_HOST || "0.0.0.0",
    port: process.env.HTTP_PORT,
    stopTimeout: 5000
  },
  application: {
    public_uri: process.env.PUBLIC_URI,
  },
  redis: {
    uri: process.env.REDIS_URL
  },
  mail: {
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
    defaults: {
      from: process.env.EMAILS_DEFAULT_FROM,
    }
  },
  logger: {
    namespace: "ra-api",
    level:     process.env.LOG_LEVEL || "INFO"
  },
  database: {
    uri: process.env.DATABASE_URL,
    options: { },
    modelsDir: "app/models"
  },
  gcloudReporting: {
    projectId:              process.env.GCLOUD_PROJECT_ID,
    router:                "always",
    credentials:            process.env.GCLOUD_CREDENTIALS && JSON.parse(process.env.GCLOUD_CREDENTIALS)
  },
  firebase: {
    credentials:            process.env.FIREBASE_CREDENTIALS && JSON.parse(process.env.FIREBASE_CREDENTIALS),
    url:                    ""
  },
  maps: {
    key: ""
  },
  gcloudStorage: {
    projectId:   process.env.GCLOUD_PROJECT_ID,
    credentials: process.env.GCLOUD_CREDENTIALS && JSON.parse(process.env.GCLOUD_CREDENTIALS),
    bucket:      process.env.GCLOUD_STORAGE_BUCKET || "uploads.example.com"
  },

  healthzOptions: {
    checkInterval: 10000
  }
}
