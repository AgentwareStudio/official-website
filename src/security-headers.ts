const documentRestrictions = [
  "default-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
];

export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
};

export const fallbackCsp = [...documentRestrictions, "form-action 'none'"].join('; ');

export const pageCsp = {
  directives: [
    ...documentRestrictions,
    "form-action 'self'",
    "connect-src 'self'",
    "font-src 'self'",
    'frame-src https://challenges.cloudflare.com',
    "img-src 'self' https://s.ar8.top",
    "media-src 'self'",
  ],
  scriptDirective: {
    resources: ["'self'", 'https://challenges.cloudflare.com', 'https://static.cloudflareinsights.com'],
  },
  styleDirective: {
    // React's prerendered animations and the blog use inline style attributes.
    resources: [{ resource: "'unsafe-inline'", kind: 'attribute' as const }],
  },
};
