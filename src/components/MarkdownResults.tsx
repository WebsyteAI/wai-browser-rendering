// src/components/MarkdownResults.tsx
import { jsx } from 'hono/jsx';

interface MarkdownResult {
  name: string;
  data: string;
}

export function MarkdownResults({ results }: { results: MarkdownResult[] }) {
  return (
    <div>
      <h1 class="text-2xl font-bold mb-4">Markdown Results</h1>
      {results.map((result, index) => (
        <div key={result.name} class="mb-6">
          <h2 class="text-xl font-semibold mb-2">{result.name}</h2>
          <pre class="bg-gray-200 p-4 rounded border border-gray-300 overflow-x-auto">{result.data}</pre>
          <button
            id={`copy-button-${index}`}
            class="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2H8z" />
              <path d="M6 4a2 2 0 012-2h4a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V4z" />
            </svg>
            Copy Markdown
          </button>
          <script dangerouslySetInnerHTML={{
            __html: `
              document.getElementById('copy-button-${index}').addEventListener('click', function() {
                navigator.clipboard.writeText(${JSON.stringify(result.data)}).then(() => {
                  alert('Markdown copied to clipboard!');
                }).catch(err => {
                  console.error('Failed to copy text: ', err);
                });
              });
            `,
          }}></script>
        </div>
      ))}
      <a href="/" class="text-blue-500 hover:underline">Upload another file</a>
    </div>
  );
}