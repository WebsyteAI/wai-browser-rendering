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
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          form { margin-top: 20px; }
          input[type="file"] { margin-bottom: 10px; }
          button { background-color: #007BFF; color: white; border: none; padding: 10px 20px; cursor: pointer; }
          button:hover { background-color: #0056b3; }
          a { display: inline-block; margin-top: 20px; color: #007BFF; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
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
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            h2 { color: #555; }
            pre { background: #f8f9fa; padding: 10px; border: 1px solid #ddd; overflow-x: auto; }
            a { display: inline-block; margin-top: 20px; color: #007BFF; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
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