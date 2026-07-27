import { ToolContent, FAQItem } from '../types';

export const pdfMergeCombineFaqs: FAQItem[] = [
  {
    question: 'How do I merge PDFs with this tool?',
    answer: 'Simply drag and drop your PDF files into the upload zone, or click "Browse Files" to select them. Once loaded, you can reorder documents by dragging them or using the action buttons. You can also rotate individual pages, duplicate pages, delete pages, or select page ranges. Finally, click "Merge PDF" and your combined document will download instantly.'
  },
  {
    question: 'Is this PDF merge tool free to use?',
    answer: 'Yes! The Toolora PDF Merge & Combine tool is 100% free with no hidden charges, watermarks, page limits, or document size caps. You do not need to register or sign up for an account to use any of its features.'
  },
  {
    question: 'Are my files uploaded to any servers?',
    answer: 'Never. Toolora is built with a privacy-first architecture. All PDF processing—including parsing, page rotation, sorting, and merging—takes place locally in your browser using secure client-side JavaScript. Your files are never uploaded to any remote server, keeping your data entirely confidential.'
  },
  {
    question: 'Can I merge password-protected or encrypted PDFs?',
    answer: 'Yes, our tool supports merging password-protected PDFs. When you upload an encrypted PDF, you will be prompted to enter the password directly within the interface. The file is unlocked locally on your device so that it can be parsed and combined.'
  },
  {
    question: 'How can I unlock a password-protected PDF to merge it?',
    answer: 'When a locked PDF is added, a lock icon appears on its card along with a password input field. Enter the correct password in that field. Once entered, the browser unlocks the document in temporary memory, allowing the tool to extract its page counts, render previews, and combine it with other documents.'
  },
  {
    question: 'Can I rearrange the pages of the PDFs before merging?',
    answer: 'Absolutely. You can change the order of the documents by dragging them into the desired sequence, or using the "Move Up" and "Move Down" buttons on the document list. Additionally, you can choose to merge in uploaded order, custom order, or reverse order.'
  },
  {
    question: 'Can I delete specific pages from a PDF?',
    answer: 'Yes, we provide granular page-level editing. You can click on the "Page Preview" to expand the document pages, and select individual pages to delete, duplicate, or rotate before compiling the final document.'
  },
  {
    question: 'Can I rotate pages before combining them?',
    answer: 'Yes. You can rotate individual pages of any uploaded PDF by 90, 180, or 270 degrees in the preview grid. This is perfect for fixing scanned documents that were uploaded sideways or upside down.'
  },
  {
    question: 'Can I duplicate certain pages in my PDF?',
    answer: 'Yes, you can duplicate any page of an uploaded PDF. This creates an exact copy of the selected page in the merge stream, which is useful when you need to repeat form pages, templates, or separator sheets.'
  },
  {
    question: 'Is there a file size limit for merging PDFs?',
    answer: 'Since all calculations happen in your local browser, there is no arbitrary file size limit set by Toolora. The file size is only limited by your device\'s system memory (RAM). Our tool optimized memory usage to successfully process files larger than 500MB.'
  },
  {
    question: 'Can I merge scanned PDF files?',
    answer: 'Yes. Scanned PDFs are fully supported. Since scanned pages are often stored as large images inside the document, they might take slightly longer to load previews, but they will merge with full resolution and no quality loss.'
  },
  {
    question: 'Does it work offline?',
    answer: 'Yes, once the Toolora PDF Merge page is loaded in your browser, it operates fully offline. You can disconnect your internet completely and still merge, rotate, reorder, and download your combined PDFs since everything runs locally.'
  },
  {
    question: 'Does this tool support mobile devices?',
    answer: 'Yes, the tool is fully responsive and optimized for modern smartphones and tablets running iOS, Android, or iPadOS. You can browse and select files directly from your mobile device\'s file system and merge them on the go.'
  },
  {
    question: 'Why is my PDF file failing to load or merge?',
    answer: 'Common reasons include file corruption, extremely high browser memory usage, or unsupported PDF formats. If a file is broken, it cannot be read. You can resolve most memory issues by closing unused browser tabs or reducing the page count of the files you are merging.'
  },
  {
    question: 'How secure is this tool?',
    answer: 'It is as secure as your local computer. Since your files never leave your browser, they cannot be intercepted, stored, or accessed by third parties. This makes Toolora far more secure than online tools that upload your documents to external cloud storage.'
  },
  {
    question: 'Can I merge large PDF files (e.g. over 500MB)?',
    answer: 'Yes, our implementation uses optimized stream-based chunks and virtualized loaders to handle large files. However, processing times and success rates will depend on your computer\'s hardware and memory capacity.'
  },
  {
    question: 'Do you store or keep a history of my merged files?',
    answer: 'No, we do not store your files anywhere. We maintain a local merge history (showing file names, merged sizes, and timestamps) that is saved exclusively in your browser\'s local storage (localStorage) for your convenience. You can clear this history anytime.'
  },
  {
    question: 'What is the difference between merging and combining PDFs?',
    answer: 'In general terminology, they are identical. "Merging" usually refers to joining two or more entire files, while "Combining" can refer to picking specific pages from multiple documents and arranging them into a new file. Our tool supports both workflows.'
  },
  {
    question: 'Can I select only a few pages from a PDF to merge?',
    answer: 'Yes. For each file, you can specify custom page ranges (e.g., "1-3, 5, 7-9") in the document options. The merger will extract only those specific pages from the source file to include in the merged document.'
  },
  {
    question: 'Can I insert blank pages between PDFs?',
    answer: 'Yes, our tool allows you to insert blank pages anywhere in the merge order. This is highly useful for preparing files for double-sided (duplex) printing, ensuring chapters or new sections start on odd-numbered pages.'
  },
  {
    question: 'What happens if I upload duplicate files?',
    answer: 'If you upload the same PDF file twice, our tool will warn you to avoid accidental duplication. You can still choose to keep both files if you intentionally want to repeat sections.'
  },
  {
    question: 'Does merging PDFs lose quality?',
    answer: 'No. The merging process copies the raw PDF objects, images, vectors, and fonts directly into the new file container. It does not compress, re-encode, or downsample your document content, ensuring zero loss of quality.'
  },
  {
    question: 'Does it preserve hyperlinks and bookmarks?',
    answer: 'Yes. Our tool is configured to preserve standard PDF formatting, fonts, annotations, and internal structure. The resulting merged file maintains all hyperlinks and document attributes.'
  },
  {
    question: 'What browser is recommended for using this tool?',
    answer: 'Any modern, secure browser is fully supported, including Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, Brave, and Opera. We recommend keeping your browser updated for optimal speed and web standard support.'
  },
  {
    question: 'How long does the merging process take?',
    answer: 'For standard documents (under 50 pages), the merge takes less than a second. For very large documents or image-heavy scanned files, it may take 2 to 5 seconds. The speed depends entirely on your system\'s CPU.'
  },
  {
    question: 'Can I print the merged PDF directly?',
    answer: 'Yes, once the merge is complete, a "Print" button is provided. Clicking this opens the native browser print dialogue, letting you send the combined document directly to your physical or network printer.'
  },
  {
    question: 'How does client-side PDF processing work?',
    answer: 'Client-side processing reads the PDF file into your browser memory as an ArrayBuffer. We then use a JavaScript engine (pdf-lib) to read the catalog, map the page tree, perform operations (like rotating or selecting pages), and compile a new PDF binary that is downloaded directly.'
  },
  {
    question: 'Is there a limit to the number of PDF files I can merge at once?',
    answer: 'There is no preset software limit. You can merge 2 files, 10 files, or 100+ files. The only constraint is your computer\'s available RAM to hold and compile the file buffers.'
  }
];

export const pdfMergeCombineContent: ToolContent = {
  whatIsThis: {
    overview: 'The PDF Merge & Combine Tool is a high-performance, client-side utility designed to join multiple PDF documents into a single cohesive file. Operating entirely within the client-side sandbox of your browser, this tool ensures complete document security by executing all page extraction, rotation, and file construction directly on your CPU. It is built for professional workflows, offering advanced features like range extraction, page rotation, file duplication, and password unlocking without requiring any server uploads.',
    whyExists: 'Online PDF utilities usually require uploading files to remote servers, exposing sensitive business contracts, financial invoices, or personal identification documents to third-party networks. This utility is engineered to eliminate that security risk. By compiling files locally, it guarantees absolute privacy, delivers instant results, operates completely offline, and bypasses the bandwidth limits associated with heavy uploads.',
    realWorldUseCases: [
      'Assembling Monthly Business Reports: Combine separate sheets (expenses, charts, summaries) from different teams into a single file.',
      'Compiling Legal Portfolios: Collect signed contracts, appendix materials, and annexures into a unified legal record.',
      'Structuring Educational Booklets: Join syllabus papers, lecture slides, and assignment sheets for students.',
      'Consolidating Scanned Receipts: Combine individual scanned invoices into a single multi-page file for tax filing.',
      'Preparing Printing Batches: Merge various PDF handouts and insert blank pages to prepare them for duplex printing.'
    ],
    whoShouldUse: [
      'Corporate Employees and Lawyers: To handle highly confidential customer contracts, NDA forms, and financial ledgers safely.',
      'Freelancers and Consultants: To group project pitches, design specs, and final invoice receipts for clients.',
      'Students and Teachers: To compile homework folders, study guides, and research handouts easily.',
      'Office Administrators: To manage massive batches of scanned records and client files without exhausting company internet bandwidth.'
    ],
    benefits: [
      'Guaranteed 100% Privacy: Your documents never traverse the web or touch a server. They remain safe in your local browser sandbox.',
      'Zero Compression Loss: Copies raw text, vector geometries, and images without re-encoding, preserving document crispness.',
      'Offline Functionality: Runs completely without internet, ensuring you can organize, split, and merge files on planes, trains, or remote sites.',
      'Granular Page Controls: Allows rotating individual pages, specifying ranges, and duplicating page entries on the fly.'
    ]
  },
  howToUseSteps: [
    'Add PDF Files: Drag and drop your PDFs into the upload container or click "Browse Files" to choose them. You can upload multiple files at once.',
    'Rearrange Documents: Adjust the order of your documents. Drag card handles or click the up/down arrows to position files.',
    'Configure Options: Specify custom page ranges if you only want to merge certain pages, or rotate individual pages in the thumbnail view.',
    'Handle Locked Files: If a file is password-protected, enter its unlock key in the inline password box that appears.',
    'Merge and Download: Choose the output order, optionally toggle page numbering, and click "Merge PDF" to build and save your document instantly.'
  ],
  workedExamples: [
    {
      title: 'Tax Document Compilation',
      scenario: 'An accountant needs to compile a tax portfolio comprising a main tax return (15 pages), salary slips (3 files, 1 page each), and a donation receipt (1 page).',
      calculation: 'Uploaded files: main tax return, salary-1, salary-2, salary-3, receipt. Reordered to put receipts at the end. Merged in order. Page count: 15 + 1 + 1 + 1 + 1 = 19 pages.',
      result: '19-page unified PDF generated in 0.4 seconds, ready for tax office submission.'
    },
    {
      title: 'Duplex Printing Layout Adjustment',
      scenario: 'A teacher wants to merge a syllabus (3 pages) and a lecture handout (5 pages). Since both have odd page counts, a blank page is needed in between to keep the handout from starting on the back of the syllabus page.',
      calculation: 'Uploaded files: Syllabus, Handout. Added a "Blank Page" item between them. Merged pages in order: Syllabus (1-3) -> Blank Page -> Handout (1-5). Page count: 3 + 1 + 5 = 9 pages.',
      result: '9-page PDF generated with blank page inserted at Page 4, ready for double-sided printing.'
    },
    {
      title: 'Confidential Contract Merging',
      scenario: 'A lawyer has three confidential NDAs (each password-protected) and needs to merge them. The lawyer cannot upload these files online due to strict client confidentiality.',
      calculation: 'Uploaded 3 locked PDFs. Entered passwords locally. Browser decrypted the files in memory using pdf-lib. Extracted pages and combined them.',
      result: 'Unsecured combined PDF downloaded locally; client confidentiality maintained 100%.'
    }
  ],
  formulaDetails: {
    equation: `PDF Merger Operations:
1. Load PDF Binary Buffers: ArrayBuffer = readAsArrayBuffer(File)
2. Decrypt PDF (If Encrypted): PDFDocument.load(ArrayBuffer, { password })
3. Initialize Target Document: OutputPDF = PDFDocument.create()
4. Page Copying Pipeline:
   For Each Document D in mergeList:
     TargetPages = filterPages(D, D.pageRange)
     CopiedPages = OutputPDF.copyPages(D, TargetPages)
     For Each Page P in CopiedPages:
       Apply Page Rotation: P.setRotation(degrees(P.getRotation() + D.rotation))
       OutputPDF.addPage(P)
5. Save Combined PDF: SaveBuffer = OutputPDF.save()
6. Trigger Client-Side Download: URL.createObjectURL(new Blob([SaveBuffer]))`,
    explanation: 'The application uses browser-level streams to ingest PDFs. By loading documents into memory using typed arrays (Uint8Array), we extract the page dictionaries and copy reference pointers to images and fonts without expanding them, keeping memory consumption low and processing speed incredibly high.',
    variables: [
      { name: 'ArrayBuffer', description: 'The raw binary data of the PDF file loaded by the FileReader API.' },
      { name: 'TargetPages', description: 'The zero-indexed array of page indices designated by the user to be imported.' },
      { name: 'copyPages', description: 'The pdf-lib method that transfers pages, fonts, and images between separate PDF contexts.' },
      { name: 'setRotation', description: 'A page-level property that applies rotation values in multiples of 90 degrees.' },
      { name: 'Blob', description: 'A file-like object of raw data representing the completed PDF, loaded directly into standard window memory.' }
    ]
  },
  commonMistakes: [
    {
      title: 'Leaving Password Fields Blank',
      mistake: 'Trying to compile locked PDF documents without entering their decryption passwords in the upload panel.',
      correction: 'Locked documents remain encrypted. You must type the correct password in the document card to allow the local script to parse the page trees.'
    },
    {
      title: 'Using Large Page Ranges on Small Files',
      mistake: 'Entering page range inputs (e.g., "1-20") for a document that only has 5 pages, which can cause merging syntax alerts.',
      correction: 'Our system automatically caps page selections to the maximum pages in the document, but it is best to verify page ranges before compiling.'
    },
    {
      title: 'Closing the Browser Tab Mid-Merge',
      mistake: 'Closing or refreshing the browser window while merging very large files (e.g., 600MB+ PDFs).',
      correction: 'Because the operation runs entirely on your local CPU and browser thread, closing the tab terminates the execution buffer. Keep the tab open until the download starts.'
    }
  ],
  tips: [
    'If you are merging files for double-sided printing, make sure to insert a blank page after any document with an odd number of pages so the next document starts on a new sheet.',
    'Use the page range input to skip unwanted pages (like blank cover sheets or cover letters) to save file space and paper.',
    'If previews load slowly for massive PDFs, you can still merge them immediately without waiting for thumbnails to finish rendering.',
    'Keep your browser updated to Chrome, Safari, or Firefox to get the fastest PDF compilation times on large files.'
  ]
};
