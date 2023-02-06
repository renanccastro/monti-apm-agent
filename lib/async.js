import fs from 'fs';
import util from 'util';
import asyncHooks from 'async_hooks';
import { AsyncLocalStorage } from 'node:async_hooks';
import crypto from 'crypto';

export const getId = () => crypto.randomUUID();

export const MontiAsyncStorage = new AsyncLocalStorage();

export const runWithStorage = (fn) => function (...args) {
  const self = this;
  return MontiAsyncStorage.run({
    id: getId(),
  }, () => fn.apply(self, args));
};

export const debug = label => (...args) => {
  fs.writeFileSync(1, `${util.format(label, ...args)}\n`, { flag: 'a' });
};

export const asyncHook = asyncHooks.createHook({
  init: debug('init'),
  before: debug('before'),
  after: debug('after'),
  destroy: debug('destroy'),
  promiseResolve: debug('promiseResolve'),
});
