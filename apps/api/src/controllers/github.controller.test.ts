import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { describe, it } from 'node:test';

import { verifyGitHubWebhookSignature } from './github.controller';

describe('GitHub Webhook HMAC Signature Security', () => {
  const secret = 'my_test_webhook_secret_12345';
  const payload = JSON.stringify({ action: 'created', installation: { id: 998877 } });

  it('verifies valid HMAC-SHA256 signature', () => {
    const validHmac = `sha256=${createHmac('sha256', secret).update(payload).digest('hex')}`;
    const isValid = verifyGitHubWebhookSignature(payload, validHmac, secret);
    assert.equal(isValid, true);
  });

  it('rejects missing signature header', () => {
    const isValid = verifyGitHubWebhookSignature(payload, undefined, secret);
    assert.equal(isValid, false);
  });

  it('rejects tampered payload or incorrect secret', () => {
    const validHmac = `sha256=${createHmac('sha256', secret).update(payload).digest('hex')}`;
    const tamperedPayload = JSON.stringify({ action: 'created', installation: { id: 666666 } });

    const isValidWithTamperedPayload = verifyGitHubWebhookSignature(tamperedPayload, validHmac, secret);
    assert.equal(isValidWithTamperedPayload, false);

    const isValidWithWrongSecret = verifyGitHubWebhookSignature(payload, validHmac, 'wrong_secret');
    assert.equal(isValidWithWrongSecret, false);
  });
});
