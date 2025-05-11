"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATTERNS = void 0;
class PATTERNS {
    // Matches a valid email address (e.g., user@example.com)
    static EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Matches a password with at least 8 characters, including at least one letter and one number
    // (e.g., abc12345, A1b2c3d4)
    static PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    // Matches alphabetic names with optional spaces (e.g., "John Doe", "Alice")
    // Disallows numbers and special characters
    static NAME = /^[a-zA-Z\s]+$/;
    // Matches exactly 10 digits (e.g., 9876543210)
    // No spaces, dashes, or country codes
    static PHONE = /^\d{10}$/;
    // Matches a date in the format YYYY-MM-DD (e.g., 2025-05-11)
    // No validation for real dates (like Feb 30)
    static DATE = /^\d{4}-\d{2}-\d{2}$/;
    // Matches a time in 24-hour format HH:MM (e.g., 09:30, 23:59)
    static TIME = /^([01]\d|2[0-3]):([0-5]\d)$/;
    // Matches a valid HTTP or HTTPS URL (e.g., https://example.com)
    // Basic format only, not exhaustive
    static URL = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    // Matches only alphanumeric characters (no spaces or symbols)
    // (e.g., abc123, Test99)
    static ALPHANUMERIC = /^[a-zA-Z0-9]+$/;
}
exports.PATTERNS = PATTERNS;
//# sourceMappingURL=patterns.js.map