/* ****** Server-side encryption utilities using Node.js crypto ****** */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey() {
    const secret = process.env.ENCRYPTION_KEY;
    const salt = process.env.ENCRYPTION_SALT;
    
    if (!secret || !salt) {
        throw new Error("ENCRYPTION_KEY or ENCRYPTION_SALT is not defined in environment variables");
    }
    
    // Using scrypt to derive a 32-byte key from the secret and salt
    const key = scryptSync(secret, salt, 32);
    return key;
}

export async function encryptSecret(plainText: string): Promise<string> {
    const key = getEncryptionKey();
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // Store as iv.authTag.encrypted payload
    return `${iv.toString("base64")}.${authTag.toString("base64")}.${encrypted.toString("base64")}`;
}

export async function decryptSecret(cipherText: string): Promise<string> {
    const [ivBase64, authTagBase64, encryptedBase64] = cipherText.split(".");
    if (!ivBase64 || !authTagBase64 || !encryptedBase64) {
        throw new Error("Invalid encrypted value format");
    }

    const key = getEncryptionKey();
    const iv = Buffer.from(ivBase64, "base64");
    const authTag = Buffer.from(authTagBase64, "base64");
    const encrypted = Buffer.from(encryptedBase64, "base64");

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf8");
}
