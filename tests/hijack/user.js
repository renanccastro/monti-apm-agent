import { TestData } from '../_helpers/globals';
import { addAsyncTest, callAsync, getLastMethodEvents, registerMethod } from '../_helpers/helpers';

addAsyncTest(
  'User - not logged in',
  async function (test) {
    let methodId = registerMethod(async function () {
      await TestData.insertAsync({aa: 10});

      return 'foo';
    });

    await callAsync(methodId);

    let events = getLastMethodEvents([0, 2]);

    let expected = [
      ['start',undefined,{userId: null, params: '[]'}],
      ['wait',undefined,{waitOn: []}],
      ['db',undefined,{coll: 'tinytest-data', func: 'insertAsync'}],
      ['complete']
    ];

    test.equal(events, expected);
  }
);
