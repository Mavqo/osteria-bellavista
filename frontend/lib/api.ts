/**
 * API client for Osteria Bellavista backend
 * Provides methods for booking management and slot availability
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Booking data structure
 */
export interface BookingData {
  name: string;
  phone?: string;
  email?: string;
  date: string; // YYYY-MM-DD format
  time_slot: string; // HH:MM format
  party_size: number;
  table_preference?: string;
  notes?: string;
}

/**
 * Booking response from API
 */
export interface BookingResponse {
  id: number;
  name: string;
  date: string;
  time_slot: string;
  party_size: number;
  status: string;
}

/**
 * Available slots response
 */
export interface SlotsResponse {
  date_available: boolean;
  slots: string[];
}

/**
 * API error response
 */
export interface ApiError {
  detail: string;
}

/**
 * Custom error class for API errors
 */
export class BookingApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: string
  ) {
    super(message);
    this.name = 'BookingApiError';
  }
}

/**
 * Validates a date string is in YYYY-MM-DD format
 */
export function isValidDateFormat(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

/**
 * Validates a time slot is in HH:MM format with valid hours (00-23) and minutes (00-59)
 */
export function isValidTimeSlot(timeSlot: string): boolean {
  if (!/^([01]?\d|2[0-3]):([0-5]\d)$/.test(timeSlot)) {
    return false;
  }
  const [hours, minutes] = timeSlot.split(':').map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

/**
 * Validates phone number format (allows +, spaces, dashes)
 */
export function isValidPhoneNumber(phone: string | undefined): boolean {
  if (phone === undefined || phone === '') return true;
  if (!/[\d+\s\-]+$/.test(phone)) return false;
  const digits = phone.replace(/[^\d]/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

/**
 * Sanitizes user input to prevent XSS
 * Removes potentially dangerous HTML/script tags
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML tags
    .trim()
    .slice(0, 500); // Limit length
}

/**
 * Validates booking data before sending to API
 */
export function validateBookingData(data: BookingData): string[] {
  const errors: string[] = [];

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.push('name must not be empty');
  } else if (data.name.trim().length > 100) {
    errors.push('name must be at most 100 characters');
  }

  // Phone validation (optional)
  if (data.phone && !isValidPhoneNumber(data.phone)) {
    errors.push('phone must have 7-15 digits and contain only valid characters');
  }

  // Date validation
  if (!data.date) {
    errors.push('date is required');
  } else if (!isValidDateFormat(data.date)) {
    errors.push('date must be in YYYY-MM-DD format');
  } else {
    const dateObj = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateObj < today) {
      errors.push('date must not be in the past');
    }
  }

  // Time slot validation
  if (!data.time_slot) {
    errors.push('time_slot is required');
  } else if (!isValidTimeSlot(data.time_slot)) {
    errors.push('time_slot must be in HH:MM format');
  }

  // Party size validation
  if (data.party_size === undefined || data.party_size === null) {
    errors.push('party_size is required');
  } else if (data.party_size < 1 || data.party_size > 10) {
    errors.push('party_size must be between 1 and 10');
  }

  return errors;
}

/**
 * Fetches available time slots for a given date
 */
export async function getAvailableSlots(date: string): Promise<SlotsResponse> {
  if (!isValidDateFormat(date)) {
    throw new BookingApiError(400, 'Invalid date format', 'date must be in YYYY-MM-DD format');
  }

  const response = await fetch(`${API_BASE_URL}/slots?date=${encodeURIComponent(date)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new BookingApiError(
      response.status,
      errorData.detail || `Failed to fetch slots: ${response.statusText}`,
      errorData.detail
    );
  }

  return response.json();
}

/**
 * Creates a new booking
 */
export async function createBooking(data: BookingData): Promise<BookingResponse> {
  const validationErrors = validateBookingData(data);
  if (validationErrors.length > 0) {
    throw new BookingApiError(400, 'Validation failed', validationErrors.join(', '));
  }

  // Sanitize input
  const sanitizedData = {
    ...data,
    name: sanitizeInput(data.name),
    phone: data.phone ? sanitizeInput(data.phone) : undefined,
  };

  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sanitizedData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    
    // Handle specific error codes
    if (response.status === 409) {
      throw new BookingApiError(409, 'Slot fully booked', errorData.detail);
    }
    if (response.status === 422) {
      throw new BookingApiError(422, 'Invalid booking data', errorData.detail);
    }
    if (response.status === 429) {
      throw new BookingApiError(429, 'Rate limit exceeded', errorData.detail);
    }
    
    throw new BookingApiError(
      response.status,
      errorData.detail || `Failed to create booking: ${response.statusText}`,
      errorData.detail
    );
  }

  return response.json();
}

/**
 * Health check for API
 */
export async function checkApiHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new BookingApiError(response.status, 'API health check failed');
  }

  return response.json();
}
