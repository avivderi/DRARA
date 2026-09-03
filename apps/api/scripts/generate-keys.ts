#!/usr/bin/env ts-node
/**
 * Generates an RS256 keypair and saves to ./keys/
 * Run: npm run keys:generate (from apps/api)
 */
import { generateKeyPairSync } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const KEYS_DIR = path.resolve(__dirname, '../keys');

if (!fs.existsSync(KEYS_DIR)) {
  fs.mkdirSync(KEYS_DIR, { recursive: true });
}

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

fs.writeFileSync(path.join(KEYS_DIR, 'private.pem'), privateKey, { mode: 0o600 });
fs.writeFileSync(path.join(KEYS_DIR, 'public.pem'), publicKey, { mode: 0o644 });

// eslint-disable-next-line no-console
console.log('✅ RS256 keypair generated:');
// eslint-disable-next-line no-console
console.log('  → keys/private.pem (chmod 600)');
// eslint-disable-next-line no-console
console.log('  → keys/public.pem');
// eslint-disable-next-line no-console
console.log('\n⚠️  These files are gitignored. Back them up securely!');
