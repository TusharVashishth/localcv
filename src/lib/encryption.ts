/* ****** Client-side encryption utilities for IndexedDB secrets ****** */

const ENCRYPTION_SECRET_STORAGE_KEY = "localcv_encryption_secret_v1";
const ENCRYPTION_SALT = "localcv-api-key-salt";

function toBase64(bytes: Uint8Array): string {
    let binary = "";
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary);
}

function fromBase64(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
    const buffer = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buffer).set(bytes);
    return buffer;
}

function getOrCreateSecret(): string {
    const existing = localStorage.getItem(ENCRYPTION_SECRET_STORAGE_KEY);
    if (existing) {
        return existing;
    }

    const random = crypto.getRandomValues(new Uint8Array(32));
    const secret = toBase64(random);
    localStorage.setItem(ENCRYPTION_SECRET_STORAGE_KEY, secret);
    return secret;
}

async function getAesKey(): Promise<CryptoKey> {
    const secret = getOrCreateSecret();
    const secretBytes = new TextEncoder().encode(secret);

    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        secretBytes,
        "PBKDF2",
        false,
        ["deriveKey"],
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: new TextEncoder().encode(ENCRYPTION_SALT),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        {
            name: "AES-GCM",
            length: 256,
        },
        false,
        ["encrypt", "decrypt"],
    );
}

export async function encryptSecret(plainText: string): Promise<string> {
    const key = await getAesKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ivBuffer = toArrayBuffer(iv);
    const encodedText = new TextEncoder().encode(plainText);

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: ivBuffer },
        key,
        encodedText,
    );

    return `${toBase64(iv)}.${toBase64(new Uint8Array(encrypted))}`;
}

export async function decryptSecret(cipherText: string): Promise<string> {
    const [ivBase64, encryptedBase64] = cipherText.split(".");
    if (!ivBase64 || !encryptedBase64) {
        throw new Error("Invalid encrypted value");
    }

    const key = await getAesKey();
    const iv = fromBase64(ivBase64);
    const ivBuffer = toArrayBuffer(iv);
    const encrypted = toArrayBuffer(fromBase64(encryptedBase64));

    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBuffer },
        key,
        encrypted,
    );

    return new TextDecoder().decode(decrypted);
}
