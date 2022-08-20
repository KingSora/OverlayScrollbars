declare module '@~local/playwright-tooling' {
  export function playwrightRollup(useEsbuild?: boolean): void;
  export function expectSuccess(page: any): Promise<void>;
}
