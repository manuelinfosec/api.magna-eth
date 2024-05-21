import { ValueTransformer } from 'typeorm';

/**
 * Value transformer to encode strings to URI format and decode URI format back to strings.
 */
export const URIEncode: ValueTransformer = {
  /**
   * Encode the entity value to URI format.
   * @param {string} entityValue - The entity value to be encoded.
   * @returns {string} - The URI-encoded string.
   */
  to: (entityValue: string) => {
    return encodeURI(entityValue);
  },
  /**
   * Decode the database value from URI format back to a string.
   * @param {string} databaseValue - The URI-encoded value from the database.
   * @returns {string} - The decoded string.
   */
  from: (databaseValue: string) => {
    return decodeURI(databaseValue);
  },
};

/**
 * Value transformer to encode strings using base64 encoding and decode base64 encoded strings back to plaintext.
 */
export const base6Encode: ValueTransformer = {
  /**
   * Encode the entity value using base64 encoding.
   * @param {string} entityValue - The entity value to be encrypted.
   * @returns {string} - The base64-encoded string.
   */
  to: (entityValue: string) => {
    return Buffer.from(entityValue).toString('base64');
  },
  /**
   * Decode the database value from base64 encoded format back to plaintext.
   * @param {string} databaseValue - The base64-encoded value from the database.
   * @returns {string} - The decoded plaintext string.
   */
  from: (databaseValue: string) => {
    return Buffer.from(databaseValue, 'base64').toString();
  },
};

/**
 * Value transformer to convert strings to lowercase.
 */
export const lowercase: ValueTransformer = {
  /**
   * Convert the entity value to lowercase.
   * @param {string} entityValue - The entity value to be converted to lowercase.
   * @returns {string} - The lowercase string.
   */
  to: (entityValue: string) => {
    return entityValue.toLowerCase();
  },
  /**
   * Keep the database value unchanged (no conversion).
   * @param {string} databaseValue - The database value (already lowercase).
   * @returns {string} - The unchanged database value.
   */
  from: (databaseValue: string) => {
    return databaseValue;
  },
};
