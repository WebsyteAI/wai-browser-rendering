# Cloudflare Workers Project Template Prompt

Use this prompt as a template to start a new Cloudflare Workers project similar to the current one.

---

**Prompt:**

I want to build a Cloudflare Workers application with the following features:

1. **Markdown Conversion Service**:
   - Users can upload files in various formats (e.g., PDF, images, HTML, XML, Microsoft Office documents, CSV, etc.).
   - The service converts these files into Markdown format using the `toMarkdown` utility provided by Workers AI.
   - Supported file formats include:
     - **PDF Documents**: `.pdf`
     - **Images**: `.jpeg`, `.jpg`, `.png`, `.webp`, `.svg`
     - **HTML Documents**: `.html`
     - **XML Documents**: `.xml`
     - **Microsoft Office Documents**: `.xlsx`, `.xlsm`, `.xlsb`, `.xls`, `.et`
     - **Open Document Format**: `.ods`
     - **CSV**: `.csv`
     - **Apple Documents**: `.numbers`

2. **Drag-and-Drop File Upload**:
   - A user-friendly interface with a drag-and-drop zone for file uploads.
   - The UI should display the filename once a file is added.
   - The "Convert" button should remain disabled until a file is uploaded.

3. **Markdown Results Page**:
   - Display the converted Markdown results.
   - Use `marked.js` to render the Markdown content dynamically in the browser.
   - Include a "Copy Markdown" button for each result, allowing users to copy the content to their clipboard.

4. **FAQs Section**:
   - Explain the importance of Markdown for AI applications and list the supported file formats.

5. **AdSense Integration**:
   - Include an AdSense script at the bottom of each page, wrapped in a container with consistent width (`w-full max-w-2xl mx-auto`).

6. **SEO Optimization**:
   - Add meta tags for description, keywords, and author.
   - Include Open Graph (OG) tags for better social media sharing.
   - Use semantic HTML structure.

7. **Code Structure**:
   - Split the code into smaller, reusable components:
     - `MarkdownResults` for displaying the conversion results.
     - `FAQs` for the frequently asked questions section.
     - `AdSense` for the AdSense integration.

8. **Styling**:
   - Use Tailwind CSS for styling.
   - Ensure the UI is responsive and visually appealing.

9. **Build and Deployment**:
   - Automatically check the build status after each publish.
   - Use GitHub Actions for deployment.

10. **Additional Features**:
    - Include a test endpoint (`/test`) that returns a JSON response to verify the service is working.
    - Provide a `TEMPLATE_PROMPT.md` file that describes how to recreate this project as a prompt.

---

**Output:**

The application should be structured as follows:

- `src/index.tsx`: The main entry point of the application.
- `src/components/MarkdownResults.tsx`: Component for displaying Markdown results.
- `src/components/FAQs.tsx`: Component for the FAQs section.
- `src/components/AdSense.tsx`: Component for the AdSense integration.
- `TEMPLATE_PROMPT.md`: This file, describing how to recreate the project as a prompt.

The application should be deployed to Cloudflare Workers and include a GitHub Actions workflow for automatic deployment.