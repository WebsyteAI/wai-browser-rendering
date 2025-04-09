// src/index.tsx
import { Hono } from 'hono';
import { jsx } from 'hono/jsx';

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
  return c.html(
    <html>
      <head>
        <title>Markdown Converter</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body class="bg-gray-100 text-gray-900 font-sans p-6">
        <h1 class="text-2xl font-bold mb-4">Upload your file to convert to Markdown</h1>
        <form action="/convert" method="post" encType="multipart/form-data" class="space-y-4">
          <input type="file" name="file" required class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Convert</button>
        </form>
      </body>
    </html>
  );
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
    return c.html(
      <html>
        <head>
          <title>Markdown Results</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body class="bg-gray-100 text-gray-900 font-sans p-6">
          <h1 class="text-2xl font-bold mb-4">Markdown Results</h1>
          {results.map((result) => (
            <div key={result.name} class="mb-6">
              <h2 class="text-xl font-semibold mb-2">{result.name}</h2>
              <pre class="bg-gray-200 p-4 rounded border border-gray-300 overflow-x-auto">{result.data}</pre>
            </div>
          ))}
          <a href="/" class="text-blue-500 hover:underline">Upload another file</a>
        </body>
      </html>
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return c.text('Internal Server Error', 500);
  }
});

export default app;