let nonce: string | undefined;

export const getNonce = () => nonce;
export const setNonce = (newNonce: string | undefined) => {
  nonce = newNonce;
};
