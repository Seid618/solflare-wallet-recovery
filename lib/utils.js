const readline = require('readline');
const pc = require('picocolors');

/**
 * Logging utilities with colored output
 * Always enabled for transparency and troubleshooting
 */

/**
 * Debug logging - gray color for diagnostic information
 * @param {...any} args - Arguments to log to console
 */
function debug(...args) {
    console.log(pc.gray('[DEBUG]'), ...args);
}

/**
 * Info logging - blue color for informational messages
 * @param {...any} args - Arguments to log to console
 */
function info(...args) {
    console.log(pc.blue('[INFO]'), ...args);
}

/**
 * Success logging - green color for success messages
 * @param {...any} args - Arguments to log to console
 */
function success(...args) {
    console.log(pc.green('[SUCCESS]'), ...args);
}

/**
 * Warning logging - yellow color for warnings
 * @param {...any} args - Arguments to log to console
 */
function warn(...args) {
    console.log(pc.yellow('[WARN]'), ...args);
}

/**
 * Error logging - red color for errors
 * @param {...any} args - Arguments to log to console
 */
function error(...args) {
    console.log(pc.red('[ERROR]'), ...args);
}

// Create readline interface for prompts
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Prompts the user for input and returns their response
 * @param {string} question - The question to ask the user
 * @returns {Promise<string>} Promise that resolves with the user's answer
 */
function prompt(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

module.exports = {
    debug,
    info,
    success,
    warn,
    error,
    rl,
    prompt
};
