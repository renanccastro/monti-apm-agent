import { call } from '../utils/methods';
import { subscribe } from '../utils/subs';

export const callbackTester = (callback) => async (state, ephemeralState, payload) => {
  payload.totalCalls = state.total;
  payload.memBefore = await call('getMemoryUsage');
  payload.startTime = performance.now();

  for (const i of Array.from({ length: state.total }).map((_,i) => i+ 1)) {
    await callback(i);
    ephemeralState.curProgress = i + 1;
    state.averageCallDuration = (performance.now() - payload.startTime) / (i + 1);
  }

  payload.endTime = performance.now();

  ephemeralState.curProgress = null;

  payload.memAfter = await call('getMemoryUsage');
}

export const getMethodTester = (methodName, methodParams = undefined, methodShuffle = 1) => callbackTester(async (i) => {
  if (methodShuffle > 1) {
    await call(methodName.concat(i % methodShuffle + 1), methodParams);
  } else {
    await call(methodName, methodParams);
  }
})

const bigstring = 'a'.repeat(1024 * 1024)

export const Tests = {
  echo: getMethodTester('echo', 'Hello World!'),
  find: getMethodTester('find', { bigstring }),
  largeTrace: getMethodTester('trace:spam:', null, 100),
  subscribe: callbackTester(async () => {
    const sub = await subscribe('links');
    sub.stop();
  }),
  manualEvent: {
    test: getMethodTester('manualEvent'),
    requiresMontiApm: true
  }
};
