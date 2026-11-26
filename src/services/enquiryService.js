import apiClient, { extractApiErrorMessage } from './apiClient';

/**
 * Submits a validated customer personal loan enquiry to POST /api/enquiries.
 *
 * IMPORTANT:
 * - Never generates a frontend reference ID or fakes database persistence.
 * - Requires actual HTTP 2xx confirmation and a backend-generated reference ID.
 */
export async function submitEnquiry(enquiryData) {
  try {
    const response = await apiClient.post('/enquiries', enquiryData);
    const payload = response?.data;

    if (payload?.success === false) {
      throw new Error(
        payload?.message || 'The server could not save your enquiry.'
      );
    }

    const referenceId =
      payload?.referenceId ||
      payload?.data?.referenceId ||
      payload?.enquiry?.referenceId ||
      payload?.refId ||
      payload?.data?.refId ||
      null;

    if (!referenceId) {
      throw new Error(
        'Your request reached the server, but no official enquiry reference ID was returned. Please verify with support before resubmitting.'
      );
    }

    return {
      referenceId: String(referenceId),
      message:
        payload?.message || 'Your enquiry has been submitted successfully.',
      enquiry: payload?.data || payload?.enquiry || null,
    };
  } catch (error) {
    const friendlyMessage = extractApiErrorMessage(
      error,
      'Unable to submit your enquiry right now. Please try again shortly.'
    );
    const normalizedError = new Error(friendlyMessage);
    normalizedError.status = error?.response?.status ?? null;
    normalizedError.cause = error;
    throw normalizedError;
  }
}
