// Host-aware site mode. ONE deploy serves two distinct sites:
//   • remberllc.pages.dev  → the developer / software-engineering portfolio
//   • remberllc.com        → the Rember LLC trucking business
// Override locally with ?site=dev or ?site=business for previewing either face.
export type Site = 'dev' | 'business';

export function siteMode(): Site {
  if (typeof window === 'undefined') return 'business';
  const override = new URLSearchParams(window.location.search).get('site');
  if (override === 'dev' || override === 'business') return override;

  const host = window.location.hostname;
  if (host.endsWith('.pages.dev')) return 'dev';
  // remberllc.com (apex/www) and anything else → the trucking business.
  return 'business';
}

export const OTHER_SITE: Record<Site, { url: string; label: string }> = {
  dev: { url: 'https://remberllc.com', label: 'Rember LLC Trucking' },
  business: { url: 'https://remberllc.pages.dev', label: 'Software / Portfolio' },
};
