export default {
  assumptions: {
    arrayLikeIsIterable: true,
    constantReexports: true,
    constantSuper: true,
    ignoreFunctionLength: true,
    ignoreToPrimitiveHint: true,
    iterableIsArray: true,
    mutableTemplateObject: true,
    noClassCalls: true,
    noDocumentAll: true,
    noNewArrows: true,
    objectRestNoSymbols: true,
    privateFieldsAsProperties: true,
    privateFieldsAsSymbols: true,
    pureGetters: true,
    setClassMethods: true,
    setComputedProperties: true,
    setPublicClassFields: true,
    setSpreadProperties: true,
  },
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        targets: {
          firefox: '54',
          chrome: '58',
          ie: '11',
          esmodules: false,
        },
      },
    ],
  ],
};
