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

const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'text/html',
  'application/xml',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel.sheet.macroenabled.12',
  'application/vnd.ms-excel.sheet.binary.macroenabled.12',
  'application/vnd.ms-excel',
  'application/vnd.oasis.opendocument.spreadsheet',
  'text/csv',
  'application/vnd.apple.numbers',
];

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
      <body class="bg-gray-100 text-gray-900 font-sans p-6 flex flex-col items-center justify-center min-h-screen">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-extrabold mb-2">Markdown Converter</h1>
          <p class="text-lg text-gray-600">Easily convert your files into Markdown format</p>
        </div>
        <form action="/convert" method="post" encType="multipart/form-data" class="w-full max-w-lg border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white text-center">
          <p class="text-gray-500 mb-4">Drag and drop your file here or click to upload</p>
          <input type="file" name="file" required class="hidden" id="file-upload" />
          <label for="file-upload" class="cursor-pointer inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Choose File</label>
          <button type="submit" class="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Convert</button>
        </form>
        <div class="mt-12 max-w-2xl">
          <h2 class="text-2xl font-bold mb-4">FAQs</h2>
          <div class="mb-4">
            <h3 class="text-lg font-semibold">What is the value proposition of this service?</h3>
            <p class="text-gray-600">This service allows you to quickly and easily convert various file formats into Markdown, saving you time and effort in manual conversions.</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold">What file formats are supported?</h3>
            <p class="text-gray-600">We support a wide range of formats including PDFs, images, HTML, XML, Microsoft Office documents, Open Document formats, CSVs, and Apple Numbers files. For a full list, refer to our <a href="/SUPPORTED_FORMATS.md" class="text-blue-500 hover:underline">Supported Formats</a>.</p>
          </div>
        </div>
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
        if (!SUPPORTED_MIME_TYPES.includes(value.type)) {
          return c.text(`Unsupported file type: ${value.type}`, 400);
        }
        files.push({ name: value.name, blob: value });
      }
    }

    if (files.length === 0) {
      return c.text('No valid files uploaded', 400);
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