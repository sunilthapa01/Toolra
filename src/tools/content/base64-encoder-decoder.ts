import { ToolContent, FAQItem } from '../types';

export const base64EncoderDecoderFaqs: FAQItem[] = [
  {
    question: "What is Base64?",
    answer: "Base64 is a binary-to-text encoding scheme that translates binary data (such as files, images, or raw bytes) into an ASCII string format. It utilizes a set of 64 characters (A-Z, a-z, 0-9, +, and /) to represent data, with '=' used as padding. This allows binary media or complex text to be safely transmitted over channels that only support text."
  },
  {
    question: "Why use Base64 encoding?",
    answer: "Historically, network protocols like SMTP (email) or HTTP were built to handle ASCII text. Sending raw binary bytes directly through these text-based protocols often resulted in data corruption due to character set translations or stripping of control bytes. Base64 encoding guarantees that the data remains intact and unchanged during transmission."
  },
  {
    question: "Is Base64 a form of encryption?",
    answer: "No. Base64 is strictly an encoding format, NOT encryption. Its purpose is to represent data in a safe, readable text format, not to secure it. Anyone who intercepts a Base64 string can decode it instantly back to its original form using standard algorithms. Never use Base64 alone to protect passwords or sensitive information."
  },
  {
    question: "Is my data uploaded to your servers when I encode or decode?",
    answer: "Absolutely not. Toolora processes all calculations and text conversions 100% locally inside your web browser. Your text inputs, raw values, and files are processed entirely in memory on your CPU and are never uploaded, logged, or saved to any external servers, ensuring complete privacy."
  },
  {
    question: "Can Base64 be used to store files and images?",
    answer: "Yes. By encoding a binary file (like a PNG, JPEG, PDF, or font file) into Base64, you get a text string that can be embedded directly inside HTML documents, CSS files, or JSON payloads using 'Data URLs'. While this increases the size of the data by about 33%, it removes the need to make additional HTTP requests to load small media assets."
  },
  {
    question: "How do I decode Base64 back to text?",
    answer: "To decode Base64 back to plain text, paste your encoded Base64 string into the input field, enable 'Decode' mode, and the decoded plain text will display in the output panel. If you are doing it programmatically in JavaScript, you can use the native `atob()` function or a `TextDecoder` for full Unicode character support."
  }
];

export const base64EncoderDecoderContent: ToolContent = {
  whatIsThis: {
    overview: "The Base64 Encoder & Decoder is a premium, client-side developer utility designed to instantly encode plain text into Base64 format or decode Base64 strings back to readable text. Since it runs completely offline in your browser, it is a privacy-first solution for parsing JSON payloads, tokens, and data URIs without exposing sensitive configuration strings or credentials to third-party databases.",
    whyExists: "Developers, systems administrators, and integrations managers work with Base64-encoded strings daily—whether inspecting JSON Web Tokens (JWT), formatting API payloads, or embedding images. Copy-pasting sensitive database values or corporate credentials into standard online tools poses major security threats. This tool provides a professional, serverless interface that keeps all computations inside your device.",
    realWorldUseCases: [
      "JSON Web Tokens (JWT): Inspect the header and payload segments of a JWT by splitting the token at the dots and decoding the Base64URL-encoded JSON parts.",
      "Embedded Assets (Data URLs): Convert small SVG or PNG icons into Base64 strings to write inline source attributes in HTML and CSS stylesheets.",
      "API Payloads & Headers: Encode HTTP Basic Authentication credentials (username:password) to construct authorization header keys.",
      "MIME Email Encoding: Format binary attachments or Unicode text messages to send safely through email transfer protocols.",
      "Config Management: Encode Kubernetes secret parameters or system configuration blocks before committing declarations to infrastructure repositories."
    ],
    whoShouldUse: [
      "Fullstack Developers: For encoding headers, basic auth tokens, and decoding client-server payloads.",
      "Security Auditing Teams: For verifying credentials inside encoded tokens or reading encoded payloads during pen-testing.",
      "Systems Architects: For configuring environmental variables, service accounts, and localized configurations.",
      "Content Creators & Designers: For converting small web design elements into inline image source codes."
    ],
    benefits: [
      "100% Privacy Protection: Code runs locally in-browser, guaranteeing no server uploads or data leaks.",
      "Safe Unicode Support: Fully encodes and decodes multi-byte Unicode strings (emojis, accented characters, international scripts) without crashing.",
      "Auto-Detect Mode: Intelligently senses if you pasted a valid Base64 string and prompts you to decode it.",
      "Interactive Sync Layout: Side-by-side textareas for raw and converted data with character/byte counters and instant swap buttons."
    ]
  },
  howToUseSteps: [
    "Select Mode: Toggle between 'Encode' and 'Decode' modes based on your starting input.",
    "Input Text: Paste your plain text or Base64 string into the Left Panel, or upload a `.txt` file.",
    "Live Output: The conversion updates instantly in the Right Panel. Any character errors or padding warnings are displayed in the Validation console.",
    "Copy or Download: Click the 'Copy' button to copy results to your clipboard, or click 'Download' to save the output text file."
  ],
  workedExamples: [
    {
      title: "Encoding standard text to Base64",
      scenario: "Converting a simple greeting string to Base64 to transmit across a text-based protocol.",
      calculation: "Input: 'Hello World'\n\nConvert character bytes to binary:\nH: 01001000, e: 01100101, l: 01101100, l: 01101100, o: 01101111, space: 00100000, W: 01010111, o: 01101111, r: 01110010, l: 01101100, d: 01100100\n\nGroup into 6-bit chunks and map to Base64 alphabet table.",
      result: "SGVsbG8gV29ybGQ="
    },
    {
      title: "Decoding a JSON Web Token (JWT) payload segment",
      scenario: "Decoding the payload portion of a web token to check user permissions and expiration timestamp parameters.",
      calculation: "Input token segment: eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlN1bmlsIiwiYWRtaW4iOnRydWV9\n\nParse ASCII characters in groups of 4 and convert back into 8-bit bytes representing the UTF-8 string.",
      result: '{"sub":"1234567890","name":"Sunil","admin":true}'
    },
    {
      title: "Encoding Unicode strings with Emojis",
      scenario: "Encoding a string containing a UTF-8 character (e.g. 'Hello 🚀') which exceeds standard Latin-1 ranges.",
      calculation: "Input: 'Hello 🚀'\n\nUse a safe TextEncoder to extract UTF-8 byte array before applying Base64 mapping to avoid btoa() character range exceptions.",
      result: "SGVsbG8g🚀 -> SGVsbG8g8J+Gjg=="
    }
  ],
  formulaDetails: {
    equation: "Base64 Algorithm Map:\n1. Split input characters into 8-bit bytes (Octets).\n2. Join bytes into a continuous stream of bits (e.g., 3 bytes = 24 bits).\n3. Divide the 24-bit stream into four 6-bit groups (Sextets).\n4. Map each 6-bit group value (0 to 63) to its matching index in the Base64 alphabet:\n   'A'-'Z' (0-25), 'a'-'z' (26-51), '0'-'9' (52-61), '+' (62), '/' (63).\n5. If the final block has only 1 byte (8 bits), add two padding '=' signs. If it has 2 bytes (16 bits), add one padding '='.",
    explanation: "Because Base64 translates three 8-bit bytes into four 6-bit values, the output text size will always be exactly 33.3% larger than the original input binary/text data. This is the minor trade-off for transport safety.",
    variables: [
      { name: "Octet (8-bit)", description: "The standard byte unit containing 8 bits of raw input text data." },
      { name: "Sextet (6-bit)", description: "The Base64 byte chunk. Maps directly to one of the 64 characters in the alphabet." },
      { name: "Padding (=)", description: "A suffix character appended to align output length to a multiple of 4 when inputs do not split evenly into 3-byte groups." }
    ]
  },
  commonMistakes: [
    {
      title: "Confusing Encoding with Encryption",
      mistake: "Using Base64 encoding to store passwords in a database under the assumption that it secures them.",
      correction: "Use a secure hashing algorithm (like bcrypt, Argon2, or PBKDF2) for passwords, and encryption (like AES-256) for data payloads that must remain private."
    },
    {
      title: "Unicode Crashing in standard Javascript",
      mistake: "Using simple window.btoa() on international text or emojis, causing a DOMException error.",
      correction: "Encode the string into a UTF-8 byte array first using TextEncoder, then convert the bytes to Base64. Our tool does this automatically."
    },
    {
      title: "Url Safe Base64 Mismatches",
      mistake: "Passing standard Base64 characters like '+' and '/' in URL query strings, which get replaced or break routing.",
      correction: "Use Base64URL encoding which replaces '+' with '-' and '/' with '_', and strips the trailing padding '=' signs."
    }
  ],
  tips: [
    "Auto-detect will instantly suggest switching to Decode mode when it identifies Base64 character patterns.",
    "Use keyboard shortcut Ctrl + Shift + S to swap input and output text blocks instantly.",
    "Click the character counters to toggle between character count and byte size representation.",
    "If your text input is larger than 1MB, live-conversion will auto-disable and a manual button will appear to protect CPU performance."
  ]
};
