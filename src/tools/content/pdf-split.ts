import { ToolContent, FAQItem } from '../types';

export const pdfSplitFaqs: FAQItem[] = [
  {
    question: 'How do I split a PDF with this tool?',
    answer: 'Upload your PDF file by dragging and dropping it into the workspace or clicking "Browse File". Once parsed, you can choose from three splitting modes: "Extract Selected Pages" (manually click the pages you want to keep), "Split by Ranges" (enter range brackets like "1-3, 4-6"), or "Split by Intervals" (divide the PDF into chunks of N pages). Click "Split PDF" and download your output files instantly.'
  },
  {
    question: 'Is this PDF split tool free to use?',
    answer: 'Yes! The Toolora PDF Page Splitter is 100% free with no limitations, watermarks, file size caps, or signup requirements.'
  },
  {
    question: 'Are my files uploaded to any servers?',
    answer: 'No. Like all Toolora services, the PDF Splitter runs 100% client-side inside your browser sandbox. All page extraction, splitting, and ZIP compiling happen locally on your CPU. No files or document contents ever leave your device.'
  },
  {
    question: 'Can I split password-protected PDFs?',
    answer: 'Yes. If you upload a locked PDF, you will be prompted to enter the correct password. Decryption happens locally in temporary browser memory, allowing you to split or extract pages from the file.'
  },
  {
    question: 'How do I split a PDF into single pages?',
    answer: 'Select the "Split All Pages" mode or set the interval split size to "1". The tool will extract every page into its own individual PDF document, compile them into a ZIP archive, and download it instantly.'
  },
  {
    question: 'Can I extract specific pages from a PDF?',
    answer: 'Yes. In the "Extract Mode", simply click on the page thumbnail previews to check or uncheck individual pages. You can also type a custom page range (like "1-3, 5, 8-10") in the manual entry box to extract exactly what you need.'
  },
  {
    question: 'What are the different split modes available?',
    answer: 'We support three splitting modes: (1) Extract Pages: Pick specific pages to compile into a single file or multiple files. (2) Custom Split Points: Interactively click dividers between pages in the thumbnail view to slice the document. (3) Interval Split: Cut the PDF into equal-sized documents (e.g. every 2 pages).'
  },
  {
    question: 'How does "Split by Ranges" work?',
    answer: 'You specify custom range brackets separated by commas, such as "1-3, 4-7, 8-10". The splitter will parse these instructions and output three separate PDF files: the first containing pages 1 to 3, the second containing pages 4 to 7, and the third containing pages 8 to 10.'
  },
  {
    question: 'Is there a page limit for splitting a PDF?',
    answer: 'There is no preset software limit on page counts. You can split a 2-page invoice or a 1,000-page catalog. The limit is based on your device\'s browser memory capacity.'
  },
  {
    question: 'Is there a file size limit?',
    answer: 'No arbitrary limits are imposed. Large files (up to 500MB+) can be split, although processing speeds will vary depending on your device\'s hardware, memory, and CPU.'
  },
  {
    question: 'How can I download multiple split PDFs?',
    answer: 'When a split action generates multiple output PDFs, our tool automatically compiles all files into a single, clean `.zip` archive client-side. This allows you to download all split files with a single click and avoids browser popup blocks.'
  },
  {
    question: 'Why did my download come in a ZIP file?',
    answer: 'When you divide a PDF into multiple documents (like splitting a 10-page PDF into 10 single pages), downloading them individually would trigger multiple file alerts and browser security blocks. Packaging them into a ZIP file allows you to download everything in one go.'
  },
  {
    question: 'Does splitting a PDF lose quality?',
    answer: 'No. Splitting extracts the page structures, fonts, and images directly without decompression or downsampling. The page objects are cloned exactly into new document containers, maintaining 100% of the original resolution and quality.'
  },
  {
    question: 'Does it preserve hyperlinks, form fields, and bookmarks?',
    answer: 'Yes. Page-level annotations, hyperlinks, and embedded vectors are copied over during extraction. Document-level features like a global table of contents (bookmarks tree) may be pruned to match the new page boundaries.'
  },
  {
    question: 'Does it work offline?',
    answer: 'Yes. Once loaded in your browser tab, the PDF Splitter requires no internet connection. You can disconnect your network and split documents fully offline.'
  },
  {
    question: 'Can I split scanned PDFs?',
    answer: 'Yes. Scanned PDFs are supported. The page previews may take slightly longer to render since scans are large images, but page splitting itself executes just as quickly.'
  },
  {
    question: 'What browsers are supported?',
    answer: 'Any modern, standards-compliant web browser, including Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge, Opera, and Brave.'
  },
  {
    question: 'Do you keep a history of my split documents?',
    answer: 'No, we do not store your files on any server. For your convenience, we save a local history log (showing file names, split types, and timestamps) in your browser\'s local storage. This can be cleared at any time.'
  },
  {
    question: 'How long does the splitting process take?',
    answer: 'For standard files (under 100 pages), splitting takes less than a second. For very large files or when compiling multiple split outputs, it may take 2 to 4 seconds.'
  },
  {
    question: 'Can I see previews of the pages before splitting?',
    answer: 'Yes. Our tool displays a full grid of page thumbnails with zoom options, helping you verify page numbers and content visually before defining split rules.'
  },
  {
    question: 'What happens to the original PDF?',
    answer: 'Nothing. The splitting process is completely non-destructive. Your original uploaded file remains intact on your computer; we only read its contents in-memory to generate new, separate PDF files.'
  },
  {
    question: 'Can I split files on a mobile device?',
    answer: 'Yes. The interface is responsive and optimized for mobile browsers on iOS and Android. You can split documents directly using files stored on your phone or tablet.'
  },
  {
    question: 'Why is my PDF file failing to load or split?',
    answer: 'This is usually caused by file corruption, entering page ranges that exceed the document\'s actual page count, or running out of browser memory during massive splits. Double-check your range settings or refresh the tab if memory is full.'
  },
  {
    question: 'Is client-side splitting more secure than online upload tools?',
    answer: 'Absolutely. Uploading files online risks interception or caching on third-party servers. Client-side execution acts like local software, providing absolute document secrecy.'
  },
  {
    question: 'How do I merge the split pages back together?',
    answer: 'If you want to combine pages, you can use the Toolora PDF Merge & Combine tool, which is fully compatible and also runs entirely inside your browser.'
  },
  {
    question: 'What is JSZip and why is it used?',
    answer: 'JSZip is a lightweight JavaScript library that compiles data buffers into compressed ZIP archives directly in the browser. We use it to package multiple PDF splits so you can download them as a single file.'
  },
  {
    question: 'Can I select all even or all odd pages to extract?',
    answer: 'Yes. In the manual range field, you can use range shortcuts or specify odd/even sequences (e.g., "1,3,5,7" or "2,4,6,8") to quickly isolate odd or even pages for extraction.'
  },
  {
    question: 'Is there any software installation required?',
    answer: 'None. The tool works directly inside your browser without installing any browser extensions, desktop applications, or plugins.'
  }
];

export const pdfSplitContent: ToolContent = {
  whatIsThis: {
    overview: 'The PDF Page Splitter is a client-side utility engineered to extract pages, partition documents, or divide large PDF files into smaller, separate documents. Running entirely on your local CPU via browser sandboxing, the tool ensures complete document privacy. It supports range extraction, custom split intervals, and interactive visual split markers, exporting results instantly as individual downloads or compressed ZIP archives.',
    whyExists: 'In corporate and legal workflows, documents like tax folders, scanning batches, or contracts often contain hundreds of pages that need to be categorized, archived, or emailed separately. Standard tools require uploading these confidential files online, compromising privacy. This tool is built to offer a secure, serverless alternative that runs locally and handles locked files natively.',
    realWorldUseCases: [
      'Extracting Single Invoices: Isolate a single invoice or transaction slip from a bulk monthly billing document.',
      'Slicing E-books by Chapter: Break down long manuals or textbook PDFs into individual chapter files for easier reading.',
      'Extracting Signed Signature Sheets: Pull out only the signing page of a legal document to attach to a registry.',
      'Separating Scanned Batches: Divide a batch scan of several client files into distinct folders.',
      'Trimming Cover Pages: Remove heavy cover pages or tables of contents to reduce document size before mailing.'
    ],
    whoShouldUse: [
      'Legal Professionals: To extract specific contract terms or annexures for trial files safely.',
      'Accounts Teams: To split bulk vendor billings into separate transaction folders.',
      'Students and Lecturers: To share specific chapters or reading assignments from voluminous academic books.',
      'Administrative Staff: To clean and organize digitized office archives without cloud leakage.'
    ],
    benefits: [
      '100% Secure Sandbox: All decryption, parsing, and splitting happen locally. No data leaves your machine.',
      'Interactive Visual Slicing: Easily set split markers between pages in the thumbnail layout to cut files naturally.',
      'Instant ZIP Export: Compiles multiple split documents into a single ZIP archive client-side, bypassing browser limits.',
      'High Fidelity Page Clones: Extracts vector layers, fonts, geometries, and images without quality loss.'
    ]
  },
  howToUseSteps: [
    'Add PDF File: Drag and drop your PDF into the upload zone or click "Browse File". Use the password field to unlock if encrypted.',
    'Select Splitting Method: Choose between Extract Pages, Custom Split Points, or Interval Split modes.',
    'Set Split Markers: Toggle checkboxes on thumbnails to select pages, click the divider scissors to mark cuts, or type ranges (e.g., "1-3, 5").',
    'Compile and Split: Click "Split PDF". The engine will extract pages and build new documents in-memory.',
    'Download Archive: Instantly save the single PDF or the generated ZIP file containing all split documents.'
  ],
  workedExamples: [
    {
      title: 'Isolating Contract Exhibit Annexure',
      scenario: 'A project manager needs to extract Exhibit B (pages 45 to 52) from a 120-page confidential agreement file.',
      calculation: 'Uploaded the contract, selected "Extract Mode", typed page range "45-52", clicked Split.',
      result: 'An 8-page PDF containing only Exhibit B compiled and downloaded locally in 0.3 seconds.'
    },
    {
      title: 'Splitting Scanned Records into Single Pages',
      scenario: 'A receptionist scanned 15 employee intake forms in a single PDF and needs to split them into 15 individual single-page files.',
      calculation: 'Uploaded document, selected "Interval Split Mode", set chunk interval size to "1 page", clicked Split.',
      result: 'ZIP archive containing 15 separate, labeled, single-page PDFs downloaded instantly.'
    },
    {
      title: 'Slicing a Manual by Custom Chapters',
      scenario: 'An editor has a 30-page draft document and needs to split it at custom points: File 1 (pages 1-10), File 2 (pages 11-20), File 3 (pages 21-30).',
      calculation: 'Uploaded file, chose "Custom Split Points", toggled the divider lines after Page 10 and Page 20 to set split markers, clicked Split.',
      result: 'ZIP archive containing 3 separate files (10 pages each) generated locally.'
    }
  ],
  formulaDetails: {
    equation: `PDF Splitter Operations:
1. Load PDF Binary Array: Buffer = readAsArrayBuffer(File)
2. Decrypt in memory: PDFDocument.load(Buffer, { password })
3. Calculate Splits: 
   - Extract: [S_0] where S_0 = { indices selected }
   - Intervals: [S_0, S_1, ...] where S_i = { offset * i ... offset * (i+1) - 1 }
   - Split Points: [S_0, S_1, ...] divided at boundary marker indices
4. Export Pipeline:
   For Each Split Segment S_k in Splits:
     TargetPDF = PDFDocument.create()
     CopiedPages = TargetPDF.copyPages(SourcePDF, S_k)
     For Page P in CopiedPages: TargetPDF.addPage(P)
     FileBuffer = TargetPDF.save()
     Add to ExportList(FileBuffer, "part-k.pdf")
5. ZIP Packaging (If ExportList.length > 1):
   ZipInstance = JSZip()
   For Item in ExportList: ZipInstance.file(Item.name, Item.buffer)
   ZipBuffer = ZipInstance.generateAsync({ type: "blob" })
   Download(ZipBuffer, "splits.zip")`,
    explanation: 'The system reads the PDF into typed binary streams. Pages are copied reference-by-reference into new document catalogs, maintaining link tables, image mappings, and font resources. When multiple files are generated, they are compressed into a standard zip stream in memory.',
    variables: [
      { name: 'SourcePDF', description: 'The parent PDF document loaded and decrypted in local browser memory.' },
      { name: 'S_k', description: 'The array of page indices to extract for the k-th split document.' },
      { name: 'JSZip', description: 'The client-side library used to construct and compress zip files in memory.' },
      { name: 'ZipBuffer', description: 'The completed binary ZIP data packaged as a blob, ready for browser download.' }
    ]
  },
  commonMistakes: [
    {
      title: 'Entering Out-Of-Bound Page Numbers',
      mistake: 'Entering range inputs like "50-60" for a document that only has 30 pages.',
      correction: 'Our parser automatically clips ranges to the maximum page length, but check range inputs to ensure you get the exact boundaries.'
    },
    {
      title: 'Splitting Large Files without RAM Overhead',
      mistake: 'Splitting a 500-page file into 500 separate single-page documents on a low-end mobile phone with very low RAM.',
      correction: 'Running 500 document saves concurrently consumes substantial RAM. On mobile devices, split large documents in smaller range batches.'
    },
    {
      title: 'Attempting to Split Encrypted Files without Password',
      mistake: 'Uploading a secure PDF and clicking Split without entering the unlocking key in the document password box.',
      correction: 'The browser cannot read page trees of encrypted files. Enter the correct password in the inline card box to unlock parsing.'
    }
  ],
  tips: [
    'Use Extract Mode if you only want to save a few pages from a large file, discarding the rest of the pages.',
    'For chapter splits, use Custom Split Points. Simply scroll through the thumbnails and click the divider scissors at each chapter transition.',
    'If your browser blocks the download popups, make sure to allow popups or download as a ZIP file which is packaged in a single download stream.'
  ]
};
