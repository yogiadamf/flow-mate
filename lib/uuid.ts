import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a session token using UUID.
 * @returns {string} The generated session token.
 */
export function generateSessionToken(): string {
  return uuidv4(); // Generates a random UUID (Version 4)
}
