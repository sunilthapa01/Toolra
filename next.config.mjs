/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/tools/json-formatter', destination: '/json', permanent: true },
      { source: '/tools/base64-encoder-decoder', destination: '/base64', permanent: true },
      { source: '/tools/markdown-preview', destination: '/markdown', permanent: true },
      { source: '/tools/hash-generator', destination: '/hash', permanent: true },
      { source: '/tools/gst-calculator', destination: '/gst', permanent: true },
      { source: '/tools/reverse-gst-calculator', destination: '/reverse-gst', permanent: true },
      { source: '/tools/emi-calculator', destination: '/emi', permanent: true },
      { source: '/tools/sip-calculator', destination: '/sip', permanent: true },
      { source: '/tools/loan-calculator', destination: '/loan', permanent: true },
      { source: '/tools/income-tax-calculator-india', destination: '/income-tax', permanent: true },
      { source: '/tools/pdf-merge-combine', destination: '/pdf-merge', permanent: true },
      { source: '/tools/pdf-split', destination: '/pdf-split', permanent: true },
      { source: '/tools/gst-split-calculator', destination: '/gst-split', permanent: true },
      { source: '/tools/gst-invoice-generator', destination: '/gst-invoice', permanent: true },
      { source: '/tools/invoice-generator', destination: '/invoice', permanent: true },
    ];
  },
};

export default nextConfig;
