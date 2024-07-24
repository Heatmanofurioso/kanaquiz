/// <reference types="vite/client" />

// @ts-ignore
import {ImportMetaEnv} from "vite/types/importMeta";

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
