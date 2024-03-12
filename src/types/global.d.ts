import createRequest from "../Hyperfetch";

export {}

declare global {
  namespace NodeJS {
    interface Global {
      createRequest: typeof createRequest; // Specify ur type here,use `string` for brief
    }
  }
}

declare global {
    interface Window { 
         createRequest: typeof createRequest
    }
}