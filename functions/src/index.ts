import { https } from 'firebase-functions';
const app = require('./app');

// Expose Express API as a single Cloud Function:
exports.lynk = https.onRequest(app);
