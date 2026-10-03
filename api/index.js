import app, { connectDB } from '../server/index.js';

let dbPromise = null;

export default async function handler(req, res) {
  if (!dbPromise) {
    dbPromise = connectDB().catch((err) => {
      console.error('[Vercel Serverless] DB Connection Error:', err.message || err);
      dbPromise = null;
    });
  }

  try {
    await dbPromise;
  } catch (error) {
    console.error('[Vercel Serverless] DB Await Error:', error.message || error);
  }

  return app(req, res);
}
