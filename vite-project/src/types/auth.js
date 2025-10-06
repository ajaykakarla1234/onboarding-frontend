/**
 * @typedef {Object} LoginResponse
 * @property {number} id - User ID
 * @property {string} email - User email
 * @property {string} role - User role
 * @property {number} progress - Current progress (1-4)
 * @property {boolean} [isNewUser] - True for newly created users
 */

/**
 * @typedef {Object} UpdateUserRequest
 * @property {number} currentPage - Current page number
 * @property {string} [about_me] - User bio
 * @property {string} [street_address] - Street address
 * @property {string} [city] - City
 * @property {string} [state] - State
 * @property {string} [zip_code] - Zip code
 * @property {string} [birthdate] - Birth date
 */