import { assertIsDefined } from './assert';

it('assertIsDefined', () => {
  expect(() => assertIsDefined(undefined)).toThrow();
  expect(() => assertIsDefined(null)).toThrow();
  expect(() => assertIsDefined(null, new Error('test'))).toThrow('test');
  expect(() => assertIsDefined('')).not.toThrow();
});
