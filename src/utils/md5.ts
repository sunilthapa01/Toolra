/**
 * High-performance, stack-safe client-side MD5 hashing implementation.
 * Conforms to RFC 1321 MD5 Message-Digest Algorithm.
 * Accepts a Uint8Array and returns the 32-character hexadecimal digest.
 */
export function md5(data: Uint8Array): string {
  // MD5 Round Constants
  const k = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
    0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
    0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
    0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
    0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
  ];

  // MD5 Round Shifts
  const s = [
    7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
    5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
    4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
    6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21
  ];

  const len = data.length;
  // Pad size to congruent to 448 bits mod 512 (which is 14 words mod 16 words)
  const wordsCount = ((len + 8) >> 6) + 1 << 4;
  const words = new Int32Array(wordsCount);

  // Copy bytes into 32-bit words
  for (let i = 0; i < len; i++) {
    words[i >> 2] |= data[i] << ((i % 4) << 3);
  }
  // Append single '1' bit (0x80 byte) after original message
  words[len >> 2] |= 0x80 << ((len % 4) << 3);

  // Append original message bit length (64-bit little endian)
  const bitsLengthLow = (len * 8) | 0;
  const bitsLengthHigh = Math.floor((len * 8) / 0x100000000);
  words[wordsCount - 2] = bitsLengthLow;
  words[wordsCount - 1] = bitsLengthHigh;

  // Initialize MD5 Buffer State
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  // Process 512-bit blocks (16 words each)
  for (let i = 0; i < wordsCount; i += 16) {
    const originalA = a;
    const originalB = b;
    const originalC = c;
    const originalD = d;

    for (let j = 0; j < 64; j++) {
      let f = 0;
      let g = 0;

      if (j < 16) {
        f = (b & c) | (~b & d);
        g = j;
      } else if (j < 32) {
        f = (d & b) | (~d & c);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        f = b ^ c ^ d;
        g = (3 * j + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * j) % 16;
      }

      const temp = d;
      d = c;
      c = b;
      const sum = (a + f + k[j] + words[i + g]) | 0;
      b = (b + ((sum << s[j]) | (sum >>> (32 - s[j])))) | 0;
      a = temp;
    }

    a = (a + originalA) | 0;
    b = (b + originalB) | 0;
    c = (c + originalC) | 0;
    d = (d + originalD) | 0;
  }

  // Convert state buffers to little-endian hex string
  const toHex = (num: number) => {
    let hex = '';
    for (let i = 0; i < 4; i++) {
      hex += ((num >> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return hex;
  };

  return toHex(a) + toHex(b) + toHex(c) + toHex(d);
}

/**
 * Helper to hash standard string inputs to MD5 hex digests.
 */
export function md5String(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return md5(bytes);
}
