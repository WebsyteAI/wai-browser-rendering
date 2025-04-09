// src/index.ts
import { Hono } from 'hono';

export interface Env {
  AI: {
    toMarkdown: (documents: Array<{ name: string; blob: Blob }>) => Promise<
      Array<{
        name: string;
        mimeType: string;
        tokens: number;
        data: string;
      }>
    >;
  };
}

const app = new Hono<{ Bindings: Env }>();

// Endpoint to handle file uploads and convert to Markdown
app.post('/convert', async (c) => {
  const contentType = c.req.header('Content-Type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return c.text('Content-Type must be multipart/form-data', 400);
  }

  try {
    // Parse the form data
    const formData = await c.req.parseBody();
    const files: Array<{ name: string; blob: Blob }> = [];

    for (const [key, value] of Object.entries(formData)) {
      if (value instanceof File) {
        files.push({ name: value.name, blob: value });
      }
    }

    if (files.length === 0) {
      return c.text('No files uploaded', 400);
    }

    // Convert files to Markdown
    const results = await c.env.AI.toMarkdown(files);

    // Return the results as JSON
    return c.json(results);
  } catch (error) {
    console.error('Error processing request:', error);
    return c.text('Internal Server Error', 500);
  }
});

export default app;