namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    MONGODB_URI: string
    NEXTAUTH_SECRET: string
  }
}