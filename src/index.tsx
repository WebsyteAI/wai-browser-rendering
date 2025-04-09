// src/index.tsx
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

// Test endpoint
app.get('/test', (c) => {
  return c.json({ message: 'Test endpoint is working!' });
});

// Home page with file upload form
app.get('/', (c) => {
  return c.html(`
    <html>
      <head>
        <title>Markdown Converter</title>
      </head>
      <body>
        <h1>Upload your file to convert to Markdown</h1>
        <form action="/convert" method="post" encType="multipart/form-data">
          <input type="file" name="file" required />
          <button type="submit">Convert</button>
        </form>
      </body>
    </html>
  `);
});

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

    // Display the results
    return c.html(`
      <html>
        <head>
          <title>Markdown Results</title>
        </head>
        <body>
          <h1>Markdown Results</h1>
          ${results
            .map(
              (result) => `
            <div>
              <h2>${result.name}</h2>
              <pre>${result.data}</pre>
            </div>
          `
            )
            .join('')}
          <a href="/">Upload another file</a>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error processing request:', error);
    return c.text('Internal Server Error', 500);
  }
});

export default app;