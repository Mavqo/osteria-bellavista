/**
 * Contact form utilities for validation and sanitization
 */

/**
 * Contact form data structure
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

/**
 * Contact form response
 */
export interface ContactFormResponse {
  success: boolean;
  message: string;
}

/**
 * Validates email address format
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length === 0) return false;
  
  // Check for HTML/script tags in email
  if (/[<>]/.test(email)) return false;
  
  // RFC 5322 compliant regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  // Additional checks
  if (email.length > 254) return false; // Max email length
  if (email.includes('..')) return false; // No consecutive dots
  
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  
  const [localPart, domain] = parts;
  if (localPart.length > 64) return false; // Max local part length
  if (domain.length > 255) return false; // Max domain length
  if (!domain.includes('.')) return false; // Must have TLD
  
  return true;
}

/**
 * Validates phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || phone.length === 0) return true; // Optional
  
  // Allow digits, spaces, dashes, plus, parentheses
  if (!/^[\d\s\-\+\(\)]+$/.test(phone)) return false;
  
  // Check digit count
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers (onclick, onload, etc.)
    .trim()
    .slice(0, maxLength); // Limit length
}

/**
 * Checks if input contains potentially dangerous content
 */
export function containsDangerousContent(input: string): boolean {
  if (!input) return false;
  
  const dangerousPatterns = [
    /<script/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<form/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers
    /data:text\/html/i,
  ];
  
  return dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Validates contact form data
 */
export function validateContactForm(data: ContactFormData): string[] {
  const errors: string[] = [];

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.push('name is required');
  } else if (data.name.trim().length > 100) {
    errors.push('name must be at most 100 characters');
  } else if (containsDangerousContent(data.name)) {
    errors.push('name contains invalid characters');
  }

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.push('email is required');
  } else if (containsDangerousContent(data.email)) {
    errors.push('email contains invalid characters');
  } else if (!isValidEmail(data.email)) {
    errors.push('email is invalid');
  }

  // Phone validation (optional)
  if (data.phone && data.phone.trim().length > 0) {
    if (containsDangerousContent(data.phone)) {
      errors.push('phone contains invalid characters');
    } else if (!isValidPhoneNumber(data.phone)) {
      errors.push('phone format is invalid');
    }
  }

  // Subject validation (optional)
  if (data.subject && data.subject.trim().length > 0) {
    if (data.subject.trim().length > 200) {
      errors.push('subject must be at most 200 characters');
    }
    if (containsDangerousContent(data.subject)) {
      errors.push('subject contains invalid characters');
    }
  }

  // Message validation
  if (!data.message || data.message.trim().length === 0) {
    errors.push('message is required');
  } else if (data.message.trim().length > 1000) {
    errors.push('message must be at most 1000 characters');
  } else if (containsDangerousContent(data.message)) {
    errors.push('message contains invalid characters');
  }

  return errors;
}

/**
 * Sanitizes contact form data
 */
export function sanitizeContactForm(data: ContactFormData): ContactFormData {
  return {
    name: sanitizeInput(data.name, 100),
    email: sanitizeInput(data.email, 254).toLowerCase(),
    phone: data.phone ? sanitizeInput(data.phone, 20) : undefined,
    subject: data.subject ? sanitizeInput(data.subject, 200) : undefined,
    message: sanitizeInput(data.message, 1000),
  };
}

/**
 * Submits contact form to backend
 */
export async function submitContactForm(data: ContactFormData): Promise<ContactFormResponse> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // Validate form
  const validationErrors = validateContactForm(data);
  if (validationErrors.length > 0) {
    return {
      success: false,
      message: validationErrors.join(', '),
    };
  }

  // Sanitize data
  const sanitizedData = sanitizeContactForm(data);

  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanitizedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      return {
        success: false,
        message: errorData.detail || `Failed to send message: ${response.statusText}`,
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
}
