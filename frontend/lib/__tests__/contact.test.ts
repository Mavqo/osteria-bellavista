import {
  validateContactForm,
  sanitizeInput,
  isValidEmail,
  ContactFormData,
} from '../contact';

describe('Contact Form Utilities', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
      expect(isValidEmail('test123@sub.domain.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
      expect(isValidEmail('test..test@example.com')).toBe(false);
      expect(isValidEmail('test@test')).toBe(false); // Missing TLD
    });

    it('should return false for potentially dangerous emails', () => {
      expect(isValidEmail('<script>@example.com')).toBe(false);
      expect(isValidEmail('test@exa<mple.com')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('<iframe src="evil.com"></iframe>')).toBe('iframe src="evil.com"/iframe');
    });

    it('should remove event handlers from HTML-like content', () => {
      // onerror= and similar event handlers are removed
      expect(sanitizeInput('<img src=x onerror=alert(1)>')).not.toContain('onerror');
      expect(sanitizeInput('test onclick=alert(1)')).not.toContain('onclick');
      expect(sanitizeInput('<div onload=evil()>')).not.toContain('onload');
    });

    it('should remove javascript: protocol', () => {
      expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
      expect(sanitizeInput('JaVaScRiPt:alert(1)')).toBe('alert(1)');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
      expect(sanitizeInput('\t\n  test  \n\t')).toBe('test');
    });

    it('should limit length to 1000 characters', () => {
      const longString = 'a'.repeat(1500);
      expect(sanitizeInput(longString).length).toBe(1000);
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('');
    });

    it('should preserve valid text content', () => {
      expect(sanitizeInput('Hello World!')).toBe('Hello World!');
      expect(sanitizeInput('Special chars: @#$%^&*()')).toBe('Special chars: @#$%^&*()');
    });
  });

  describe('validateContactForm', () => {
    const validForm: ContactFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+41 79 123 45 67',
      subject: 'Reservation Question',
      message: 'I would like to book a table for 4 people.',
    };

    it('should return no errors for valid form data', () => {
      const errors = validateContactForm(validForm);
      expect(errors).toEqual([]);
    });

    it('should validate name is required', () => {
      const errors = validateContactForm({ ...validForm, name: '' });
      expect(errors).toContain('name is required');
    });

    it('should validate name max length', () => {
      const errors = validateContactForm({ ...validForm, name: 'a'.repeat(101) });
      expect(errors).toContain('name must be at most 100 characters');
    });

    it('should validate name does not contain HTML', () => {
      const errors = validateContactForm({ ...validForm, name: '<script>alert(1)</script>' });
      expect(errors).toContain('name contains invalid characters');
    });

    it('should validate email is required', () => {
      const errors = validateContactForm({ ...validForm, email: '' });
      expect(errors).toContain('email is required');
    });

    it('should validate email format', () => {
      const errors = validateContactForm({ ...validForm, email: 'invalid' });
      expect(errors).toContain('email is invalid');
    });

    it('should validate email does not contain HTML', () => {
      const errors = validateContactForm({ ...validForm, email: 'test<script>@example.com' });
      expect(errors).toContain('email contains invalid characters');
    });

    it('should validate phone format when provided', () => {
      const errors = validateContactForm({ ...validForm, phone: 'invalid' });
      expect(errors).toContain('phone format is invalid');
    });

    it('should allow empty phone', () => {
      const errors = validateContactForm({ ...validForm, phone: '' });
      expect(errors).not.toContain('phone format is invalid');
    });

    it('should validate subject max length', () => {
      const errors = validateContactForm({ ...validForm, subject: 'a'.repeat(201) });
      expect(errors).toContain('subject must be at most 200 characters');
    });

    it('should allow empty subject', () => {
      const errors = validateContactForm({ ...validForm, subject: '' });
      expect(errors).not.toContain('subject is required');
    });

    it('should validate message is required', () => {
      const errors = validateContactForm({ ...validForm, message: '' });
      expect(errors).toContain('message is required');
    });

    it('should validate message max length', () => {
      const errors = validateContactForm({ ...validForm, message: 'a'.repeat(1001) });
      expect(errors).toContain('message must be at most 1000 characters');
    });

    it('should validate message does not contain HTML', () => {
      const errors = validateContactForm({ ...validForm, message: '<iframe src="evil.com"></iframe>' });
      expect(errors).toContain('message contains invalid characters');
    });

    it('should return multiple validation errors', () => {
      const errors = validateContactForm({
        name: '',
        email: 'invalid',
        phone: 'bad',
        message: '',
      });
      expect(errors.length).toBeGreaterThan(1);
    });

    it('should detect XSS attempts in all fields', () => {
      const xssForm: ContactFormData = {
        name: '<script>',
        email: '<img@example.com>',
        phone: '<svg>',
        subject: '<iframe>',
        message: '<body onload=alert(1)>',
      };
      const errors = validateContactForm(xssForm);
      expect(errors.filter(e => e.includes('invalid characters')).length).toBeGreaterThan(0);
    });
  });
});
