import { ToolContent, FAQItem } from '../types';

export const hashGeneratorFaqs: FAQItem[] = [
  {
    question: "What is a cryptographic hash generator?",
    answer: "A cryptographic hash generator is a tool that takes an input (such as text or a file) and runs it through a mathematical hashing algorithm to produce a fixed-length string of characters, typically representing the unique digital fingerprint of that data. The process is one-way, meaning it is computationally impossible to reconstruct the original input from the generated hash."
  },
  {
    question: "Which hashing algorithm should I use?",
    answer: "For standard security and cryptographic applications, use SHA-256, SHA-384, or SHA-512. MD5 and SHA-1 are cryptographically broken and vulnerable to collision attacks, meaning they should only be used for non-security tasks like checking file integrity, computing checksums, or legacy compatibility."
  },
  {
    question: "Is my data safe when using Toolora's Hash Generator?",
    answer: "Yes, completely. Our Hash Generator is a privacy-first tool that runs entirely locally inside your browser using the native Web Crypto API. No data, text strings, or files are ever uploaded to any servers, ensuring your sensitive credentials, files, and configurations remain 100% private."
  },
  {
    question: "How do I generate a hash for a file?",
    answer: "Toggle to the 'File Hash' tab, and drag and drop your file into the designated upload area or click to select a file. The browser will read the file locally into memory, compute the hash instantly, and display the checksum without uploading any bytes to the internet."
  },
  {
    question: "What is the difference between hashing and encryption?",
    answer: "Hashing is a one-way function designed to create a unique fingerprint (checksum) of data that cannot be reversed. Encryption is a two-way function designed to scramble data so that it can only be read by someone who has the correct decryption key."
  },
  {
    question: "What is a hash collision?",
    answer: "A hash collision occurs when two different inputs produce the exact same output hash. While theoretically possible for all algorithms, algorithms like MD5 and SHA-1 have known practical collision vulnerabilities, which is why modern systems rely on stronger algorithms like SHA-256."
  }
];

export const hashGeneratorContent: ToolContent = {
  whatIsThis: {
    overview: "The Hash Generator is a premium, client-side cryptographic utility designed to instantly compute secure message digests and checksums. Supporting MD5, SHA-1, SHA-256, SHA-384, and SHA-512, this tool runs entirely locally in your browser. It is built to help developers, sysadmins, and security personnel verify file integrity, generate API signatures, and validate datasets with complete privacy.",
    whyExists: "Verifying checksums or generating cryptographic hashes of API secrets, keys, or proprietary code using online servers poses significant security risks. If the server logs queries or gets breached, your data is exposed. Toolora's Hash Generator utilizes the native Web Crypto API to guarantee that every computation remains strictly local on your device.",
    realWorldUseCases: [
      "File Integrity Checksums: Compute MD5 or SHA-256 hashes of downloaded software packages or system files to verify they haven't been tampered with or corrupted during transit.",
      "API Signature Generation: Hash API request bodies, timestamps, and client secrets to create verification signatures for webhooks and secure API endpoints.",
      "Database Credential Preparation: Pre-calculate secure digests of non-sensitive reference keys or verify system configurations locally.",
      "Git and Blockchain Verification: Inspect commit hashes or block identifiers to understand how content addressing works under standard version control systems.",
      "Security Audits: Compare expected file signatures against system hashes during forensic analyses or compliance checkups."
    ],
    whoShouldUse: [
      "Software Developers: To generate hash signatures for API requests and verify library checksums.",
      "Security Analysts: To audit system file integrity and calculate secure digests during pentesting.",
      "Systems Administrators: To verify downloaded ISO files, scripts, or patches before deployment.",
      "Database Administrators: To create hash indexes or check records for consistency."
    ],
    benefits: [
      "Zero Server Transmission: Computations are performed locally, preventing sensitive keys from leaking over the network.",
      "Universal File Hashing: Supports dragging and dropping any local file to generate its cryptographic checksum instantly in the browser.",
      "Simultaneous Multi-Hash View: View generated hashes for all supported algorithms at the same time, making comparative analysis fast and simple.",
      "Real-time Live Computation: Text input hashes update character-by-character as you type or paste text."
    ]
  },
  howToUseSteps: [
    "Choose Input Mode: Select 'Text Input' to write or paste plain text, or select 'File Hash' to upload a local file.",
    "Input Data: Type/paste into the Left panel, or drag and drop any file into the upload zone.",
    "Select Algorithm: Choose your desired cryptographic standard (MD5, SHA-1, SHA-256, SHA-384, or SHA-512) from the algorithm selector.",
    "Copy or Download: Copy the generated hash value to the clipboard or download it as a text file."
  ],
  workedExamples: [
    {
      title: "Generating a SHA-256 checksum for text",
      scenario: "Creating a secure, fixed-length digital fingerprint of a standardized phrase.",
      calculation: "Input: 'toolora'\n\nConvert text characters to bytes, pad to blocks, and process through SHA-256 compression functions.",
      result: "4c74cb185b3bcf52bc23999933ad69d95f4c4dc8c9a811c0f16559599ea7de02"
    },
    {
      title: "Verifying a downloaded file checksum",
      scenario: "Verifying that a downloaded file is original and has not been altered.",
      calculation: "Upload downloaded file locally -> Compute SHA-256 hash -> Compare calculated hash with the publisher's posted checksum.",
      result: "Matched: 2c5f6d89... (File is authentic and safe to execute)"
    },
    {
      title: "MD5 hashing for legacy database keys",
      scenario: "Creating an MD5 identifier for database indexing on legacy schemas.",
      calculation: "Input: 'admin'\n\nProcess through MD5 rounds to compute the 128-bit hash.",
      result: "21232f297a57a5a743894a0e4a801fc3"
    }
  ],
  formulaDetails: {
    equation: "Cryptographic Hash Function:\nH = H(M)\nWhere M is the variable-length message input, H is the cryptographic hash algorithm, and H is the fixed-length output (digest).",
    explanation: "Standard algorithms process messages in fixed-sized blocks (e.g., 512-bit or 1024-bit blocks). The message is padded, initialized with constants, and iteratively compressed through logical operations (bitwise AND, OR, XOR, rotations) to make reversing the process mathematically impossible.",
    variables: [
      { name: "Message (M)", description: "The raw text string or file bytes inputted by the user." },
      { name: "Digest (H)", description: "The resulting fixed-length hexadecimal representation of the computed hash." },
      { name: "Compression Function", description: "The core mathematical rounds that mix message blocks with state buffers to ensure avalanche effects." }
    ]
  },
  commonMistakes: [
    {
      title: "Using MD5 or SHA-1 for password storage",
      mistake: "Storing user passwords using simple MD5 or SHA-1 hashes, which can be easily cracked using rainbow tables.",
      correction: "Password hashing requires salted, slow-stretching key derivation functions like bcrypt, PBKDF2, or Argon2. Hashing tools are for data integrity, not credential protection."
    },
    {
      title: "Hashing Unicode characters incorrectly",
      mistake: "Failing to account for multi-byte Unicode strings (like emojis), leading to different hashes on different platforms.",
      correction: "Always convert text to UTF-8 bytes using a standard TextEncoder before hashing. Our tool handles Unicode standards automatically."
    },
    {
      title: "Relying on hashing to secure sensitive data contents",
      mistake: "Assuming hashing acts like encryption and can be decrypted later.",
      correction: "Hashing is strictly a one-way function. If you need to retrieve the original content, you must use symmetric or asymmetric encryption (e.g., AES or RSA)."
    }
  ],
  tips: [
    "Switching algorithms will instantly update the generated hash in the output panel.",
    "Drag and drop files up to 200MB for immediate local checksum generation without network delays.",
    "Click the copy button next to any hash to copy it instantly. Watch for the success notification.",
    "Toggle 'Live Update' off if you are pasting huge blocks of text to avoid any minor browser delay."
  ]
};
