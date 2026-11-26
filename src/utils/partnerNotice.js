/**
 * Centralized configuration for the authorized lending/distribution partner notice.
 *
 * IMPORTANT PRIVACY COMPLIANCE:
 * Do NOT invent or hardcode a fictional lending partner name.
 * Until the real partner is configured via environment variables before production
 * launch, `isConfigured` remains false so the UI explicitly informs visitors and
 * administrators that partner details require configuration before production submission.
 */
export function getPartnerNoticeConfig() {
  const configuredName = import.meta.env.VITE_LENDING_PARTNER_NAME?.trim() || '';
  const configuredNoticeUrl =
    import.meta.env.VITE_LENDING_PARTNER_NOTICE_URL?.trim() || '';

  if (configuredName) {
    return {
      isConfigured: true,
      partnerName: configuredName,
      noticeUrl: configuredNoticeUrl,
      summaryText: `Your enquiry details may be shared with our authorized lending/distribution partner, ${configuredName}, solely for evaluating and responding to your personal loan enquiry.`,
    };
  }

  return {
    isConfigured: false,
    partnerName: null,
    noticeUrl: null,
    summaryText:
      'Lending/distribution partner identity and partner-specific privacy notice require configuration prior to production submission. No specific lending partner entity has been configured in this environment yet.',
  };
}
