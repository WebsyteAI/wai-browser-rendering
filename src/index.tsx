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
        <form action="/convert" method="post" encType="multipart/form-data" class="w-full max-w-lg">
          <div id="dropzone" class="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white text-center cursor-pointer">
            <p class="text-gray-500 mb-4">Drag and drop your file here or click to upload</p>
            <input type="file" name="file" required class="hidden" id="file-upload" />
            <label for="file-upload" class="cursor-pointer inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Choose File</label>
          </div>
          <button type="submit" class="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Convert</button>
        </form>
        <div class="mt-12 max-w-2xl">
          <h2 class="text-2xl font-bold mb-4">FAQs</h2>
          <div class="mb-4">
            <h3 class="text-lg font-semibold">Why is this service important?</h3>
            <p class="text-gray-600">Markdown is a critical format for text generation and large language models (LLMs) during both training and inference. It provides a structured, semantic, and human-readable format that is also machine-friendly. This makes it ideal for chunking and organizing input data, improving retrieval and synthesis in Retrieval-Augmented Generation (RAG) workflows. Additionally, Markdown's simplicity and ease of parsing make it a preferred choice for AI Agents.</p>
            <p class="text-gray-600 mt-2">Document conversion is therefore a key component in building AI applications. Workers AI offers the <code>toMarkdown</code> utility method, accessible via the <code>env.AI</code> binding or REST APIs, enabling developers to quickly and efficiently convert and summarize documents in various formats into Markdown.</p>
          </div>
          <div class="mb-4">
            <h3 class="text-lg font-semibold">What file formats are supported?</h3>
            <ul class="list-disc list-inside text-gray-600">
              <li><strong>PDF Documents:</strong> .pdf</li>
              <li><strong>Images:</strong> .jpeg, .jpg, .png, .webp, .svg</li>
              <li><strong>HTML Documents:</strong> .html</li>
              <li><strong>XML Documents:</strong> .xml</li>
              <li><strong>Microsoft Office Documents:</strong> .xlsx, .xlsm, .xlsb, .xls, .et</li>
              <li><strong>Open Document Format:</strong> .ods</li>
              <li><strong>CSV:</strong> .csv</li>
              <li><strong>Apple Documents:</strong> .numbers</li>
            </ul>
          </div>
        </div>
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              var dropzone = document.getElementById('dropzone');
              var fileInput = document.getElementById('file-upload');

              dropzone.addEventListener('dragover', function(e) {
                e.preventDefault();
                dropzone.classList.add('bg-blue-100');
              });

              dropzone.addEventListener('dragleave', function() {
                dropzone.classList.remove('bg-blue-100');
              });

              dropzone.addEventListener('drop', function(e) {
                e.preventDefault();
                dropzone.classList.remove('bg-blue-100');

                var files = e.dataTransfer.files;
                if (files.length > 0) {
                  fileInput.files = files;
                }
              });
            });
          `,
        }} />
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