// src/index.tsx
import { Hono } from 'hono';
import { jsx } from 'hono/jsx';
import { MarkdownResults } from './components/MarkdownResults';
import { FAQs } from './components/FAQs';
import { AdSense } from './components/AdSense';

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
    <html lang="en">
      <head>
        <title>Markdown Converter - Convert Files to Markdown Effortlessly</title>
        <meta name="description" content="Easily convert your files into Markdown format. Supports PDFs, images, HTML, XML, Microsoft Office documents, and more." />
        <meta name="keywords" content="Markdown converter, file to markdown, PDF to markdown, HTML to markdown, AI markdown conversion" />
        <meta name="author" content="WebsyteAI" />
        <meta property="og:title" content="Markdown Converter - Convert Files to Markdown Effortlessly" />
        <meta property="og:description" content="Easily convert your files into Markdown format. Supports PDFs, images, HTML, XML, Microsoft Office documents, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wai-browser-rendering.websyte.ai/" />
        <meta property="og:image" content="https://wai-browser-rendering.websyte.ai/og-image.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              var dropzone = document.getElementById('dropzone');
              var fileInput = document.getElementById('file-upload');
              var fileNameDisplay = document.getElementById('file-name');
              var convertButton = document.getElementById('convert-button');

              convertButton.disabled = true;

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
                  fileNameDisplay.textContent = files[0].name;
                  convertButton.disabled = false;
                }
              });

              fileInput.addEventListener('change', function() {
                if (fileInput.files.length > 0) {
                  fileNameDisplay.textContent = fileInput.files[0].name;
                  convertButton.disabled = false;
                }
              });

              window.copyMarkdown = function(content) {
                navigator.clipboard.writeText(content).then(() => {
                  alert('Markdown copied to clipboard!');
                }).catch(err => {
                  console.error('Failed to copy text: ', err);
                });
              };
            });
          `,
        }} />
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
            <p id="file-name" class="mt-4 text-gray-700"></p>
          </div>
          <button id="convert-button" type="submit" class="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Convert</button>
        </form>
        <FAQs />
        <AdSense />
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
      <html lang="en">
        <head>
          <title>Markdown Results - Converted Files</title>
          <meta name="description" content="View the Markdown results of your converted files. Easily copy and use the Markdown content." />
          <meta name="keywords" content="Markdown results, converted files, copy markdown, AI markdown conversion" />
          <meta name="author" content="WebsyteAI" />
          <meta property="og:title" content="Markdown Results - Converted Files" />
          <meta property="og:description" content="View the Markdown results of your converted files. Easily copy and use the Markdown content." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://wai-browser-rendering.websyte.ai/results" />
          <meta property="og:image" content="https://wai-browser-rendering.websyte.ai/og-image.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body class="bg-gray-100 text-gray-900 font-sans p-6">
          <MarkdownResults results={results} />
          <AdSense />
        </body>
      </html>
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return c.text('Internal Server Error', 500);
  }
});

export default app;