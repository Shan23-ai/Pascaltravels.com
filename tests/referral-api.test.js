const test = require('node:test');
const assert = require('node:assert/strict');

const storePath = '../www/server/store';
const referralsRoutePath = '../www/server/routes/referrals';

test('referral store and API route should exist for the multi-page upgrade', async () => {
  let store;
  try {
    store = require(storePath);
  } catch (error) {
    assert.fail(`Missing store module: ${error.message}`);
  }

  let route;
  try {
    route = require(referralsRoutePath);
  } catch (error) {
    assert.fail(`Missing referrals route: ${error.message}`);
  }

  assert.ok(store.getStore, 'store should expose getStore');
  assert.ok(route, 'referrals route should load successfully');
});
