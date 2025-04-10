// src/components/FAQs.tsx
import { jsx } from 'hono/jsx';

export function FAQs() {
  return (
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
  );
}