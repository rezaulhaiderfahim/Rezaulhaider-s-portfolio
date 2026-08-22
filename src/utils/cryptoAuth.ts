/**
 * Cryptographic Utility Helper
 * 
 * Computes SHA-256 cryptographic hashes using the native Web Crypto API.
 * 
 * SECURITY ARCHITECTURE:
 * - NO plaintext passkeys and NO hardcoded passkey hashes exist in this bundle or codebase.
 * - Passkey verification is enforced server-side exclusively by Cloud Firestore Security Rules
 *   using get(/databases/$(database)/documents/config/adminAuth).data.passkeyHash.
 * - Client-side state cannot be forged because all privileged Firestore operations are
 *   validated against security rules on every request.
 */

/**
 * Computes SHA-256 hash of a string using the native Web Crypto API.
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
