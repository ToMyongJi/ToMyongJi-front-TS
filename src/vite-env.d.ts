/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_MAINTENANCE?: string;
  readonly VITE_MAINTENANCE_DATE?: string;
  readonly VITE_MAINTENANCE_DESCRIPTION?: string;
}
