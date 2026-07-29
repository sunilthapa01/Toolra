import { ToolContent, FAQItem } from '../types';

export const jsonFormatterFaqs: FAQItem[] = [
  {
    question: "What is JSON?",
    answer: "JSON (JavaScript Object Notation) is a lightweight, text-based data interchange format that is easy for humans to read and write, and easy for machines to parse and generate. It is commonly used for transmitting data in web applications, API responses, and configuration files."
  },
  {
    question: "Why format JSON?",
    answer: "Minified JSON removes all unnecessary spacing, indentation, and newlines to save bandwidth. While ideal for computer execution, it is extremely hard for humans to read. Formatting (or beautifying) JSON adds indentation and spacing, restoring readability so you can debug API payloads, inspect configurations, and identify structure issues easily."
  },
  {
    question: "What is JSON validation?",
    answer: "JSON validation is the process of checking if a JSON text conforms to the official syntax specifications (RFC 8259). This verifies that the syntax is free of issues like missing commas, single quotes instead of double quotes, trailing commas, or unmatched brackets, ensuring web applications or backend servers can parse the data without crashing."
  },
  {
    question: "Is my data uploaded to any servers?",
    answer: "No. Toolora processes all operations entirely inside your web browser. The JSON data you paste, upload, format, or validate never leaves your local computer and is never transmitted over the internet, ensuring absolute privacy for sensitive data."
  },
  {
    question: "How do I fix invalid JSON?",
    answer: "Look at the validation panel below the editor, which highlights the exact line and column number of the error. Common errors include trailing commas, unquoted keys, single quotes instead of double quotes, and missing commas. Fixing these syntax errors based on the console feedback will resolve the issue."
  },
  {
    question: "Can I upload JSON files?",
    answer: "Yes, you can click the 'Upload File' button or drag and drop a `.json` or `.txt` file into the editor. The file contents will be loaded instantly into the raw input area, allowing you to format or validate them locally."
  },
  {
    question: "Can I download formatted JSON?",
    answer: "Yes. Once you have formatted, beautified, or minified your JSON data, you can click the 'Download' button to download it as a `.json` file directly to your device."
  }
];

export const jsonFormatterContent: ToolContent = {
  whatIsThis: {
    overview: "The JSON Formatter & Validator is a fast, offline-first developer tool designed to beauty, minify, validate, and inspect JSON data. Running entirely in your local browser sandbox, it protects your API keys and databases by keeping your data on your machine. It features line highlighting, duplicate key warnings, syntax analysis, and simple download options.",
    whyExists: "Developers copy and paste JSON payloads constantly to inspect logs, troubleshoot APIs, or edit configuration files. Standard web formatters upload pasted data to their servers, posing significant security risks for commercial projects. This tool is built to offer a secure, serverless alternative that runs locally and handles large files efficiently.",
    realWorldUseCases: [
      "API Debugging: Pretty-print minified JSON payloads received from API endpoints to understand their data structures.",
      "Syntax Validation: Find missing commas or incorrect single quotes in manually written configuration files.",
      "Bandwidth Optimization: Minify verbose configuration or data payloads before deploying them to production environments.",
      "Payload Inspection: Detect duplicate keys that might cause silent configuration overwrite issues in backends."
    ],
    whoShouldUse: [
      "Frontend Developers: For inspecting state objects, client-side logs, and server responses.",
      "Backend Developers: For verifying JSON request bodies and structuring system configurations.",
      "DevOps Engineers: For checking Kubernetes configs, package files, or cloud policy templates.",
      "QA Engineers: For validating API test payloads and reviewing mock data fixtures."
    ],
    benefits: [
      "100% Privacy & Security: Local sandbox execution ensures no external server receives your sensitive data.",
      "Detailed Syntax Checking: Points out specific errors like trailing commas, unquoted keys, and unmatched brackets with line numbers.",
      "Dual Editor Mode: Interactive side-by-side layout with independent scrolling and clean alignment.",
      "Keyboard Productivity: Includes native shortcuts for formatting, minifying, copying, and clearing."
    ]
  },
  howToUseSteps: [
    "Input Raw Data: Paste your JSON string into the Left Editor, or upload a `.json` file from your computer.",
    "Format / Minify: Click 'Format JSON' (or press Ctrl+Enter) to beautify the output, or click 'Minify' to compress the string.",
    "Inspect Validation: If there are syntax issues, check the validation console showing error details and red-highlighted line numbers.",
    "Export: Click 'Copy' to copy the result to your clipboard, or click 'Download' to save the formatted file."
  ],
  workedExamples: [
    {
      title: "Fixing Trailing Commas in Configuration File",
      scenario: "A developer has a configuration block with a trailing comma in the final object field, which causes a Node.js parser crash.",
      calculation: "Input: {\n  \"name\": \"Toolora\",\n  \"version\": \"1.0.0\",\n}\n\nThe validator flags a trailing comma error on line 3.",
      result: "After removing the comma on line 3, the tool successfully validates and beautifies the JSON format."
    },
    {
      title: "Detecting Single Quotes & Unquoted Keys",
      scenario: "Copying a JavaScript object literal into an API payload that requires strict JSON validation.",
      calculation: "Input: { name: 'Sunil' }\n\nThe validator alerts that keys must be double-quoted and single quotes around string values are invalid.",
      result: "The validator lists these on lines 1, suggesting double quotes, enabling quick manual fixes."
    },
    {
      title: "Minifying API Payload",
      scenario: "Reducing the payload size of a JSON mock file from 1.5MB to 0.9MB before uploading.",
      calculation: "Uploaded 1.5MB file, clicked 'Minify JSON' (or Cmd+Shift+F). All spacing and formatting is stripped.",
      result: "A single-line minified string is produced instantly, ready to copy or download."
    }
  ],
  formulaDetails: {
    equation: "JSON Syntax Compliance Rules (RFC 8259):\n1. String values and keys MUST use double quotes (\"). Single quotes (') are illegal.\n2. Key-value pairs must be separated by colons (:).\n3. Members of objects and arrays must be separated by commas (,).\n4. Trailing commas after the last member are forbidden.\n5. Numeric values cannot have leading zeros or unescaped values.\n6. Keys inside any object block must be unique (optional validation warning).",
    explanation: "Standard JSON parser operations follow a strict context-free grammar check. If any character violates these rules, the parser throws an exception indicating the exact position of the violation.",
    variables: [
      { name: "Double Quotes", description: "Mandatory delimiter for keys and string values in RFC 8259 compliance." },
      { name: "Object Key Uniqueness", description: "Warning threshold checks for duplicate object members which cause runtime issues." }
    ]
  },
  commonMistakes: [
    {
      title: "Using Single Quotes",
      mistake: "Writing {'type': 'finance'} which is valid JavaScript but invalid JSON.",
      correction: "Replace all single quotes with double quotes: {\"type\": \"finance\"}."
    },
    {
      title: "Trailing Commas",
      mistake: "Leaving a comma after the final item: [\"item1\", \"item2\",].",
      correction: "Remove the comma after \"item2\": [\"item1\", \"item2\"]."
    },
    {
      title: "Unquoted Keys",
      mistake: "Writing {name: \"Sunil\"} directly.",
      correction: "Wrap the key in double quotes: {\"name\": \"Sunil\"}."
    }
  ],
  tips: [
    "Use keyboard shortcut Ctrl + Enter to format the JSON instantly.",
    "If the JSON is extremely large, the custom validator runs in-memory to prevent browser lockups.",
    "Duplicate key check runs as a secondary audit warning, since standard parsing doesn't always fail on duplicate keys."
  ]
};
