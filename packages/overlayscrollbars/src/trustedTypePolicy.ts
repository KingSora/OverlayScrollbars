// at the time of implementation TypeScript doesn't offer any TrustedTypes typescript definitions
// https://github.com/microsoft/TypeScript/issues/30024
let trustedTypePolicy: unknown | undefined;

export const getTrustedTypePolicy = () => trustedTypePolicy;
export const setTrustedTypePolicy = (newTrustedTypePolicy: unknown | undefined) => {
  trustedTypePolicy = newTrustedTypePolicy;
};
