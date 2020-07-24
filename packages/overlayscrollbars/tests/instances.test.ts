import { addInstance, removeInstance, getInstance, allInstances } from 'instances';

const testElm = document.body;
const testInstance = { value: 'value' };

describe('instances', () => {
  afterEach(() => {
    removeInstance(testElm);
  });

  test('add instance', () => {
    addInstance(testElm, testInstance);

    expect(allInstances().size).toBe(1);
  });

  test('remove instance', () => {
    addInstance(testElm, testInstance);
    removeInstance(testElm);

    expect(allInstances().size).toBe(0);
  });

  test('get instance', () => {
    addInstance(testElm, testInstance);

    expect(getInstance(testElm)).toBe(testInstance);
  });
});
