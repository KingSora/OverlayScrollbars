declare module '@~local/playwright-tooling' {
  export interface PlaywrightRollupOptions {
    useEsbuild?: boolean;
    adaptUrl?: (originalUrl: string) => string;
  }
  export function playwrightRollup(options?: PlaywrightRollupOptions): void;
  export function expectSuccess(page: any): Promise<void>;
}
