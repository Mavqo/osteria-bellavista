import {
  getAvailableSlots,
  createBooking,
  checkApiHealth,
  validateBookingData,
  sanitizeInput,
  isValidDateFormat,
  isValidTimeSlot,
  isValidPhoneNumber,
  BookingApiError,
  type BookingData,
} from '../api';

describe('API Utilities', () => {
  describe('isValidDateFormat', () => {
    it('should return true for valid date format', () => {
      expect(isValidDateFormat('2024-03-26')).toBe(true);
      expect(isValidDateFormat('2024-12-31')).toBe(true);
    });

    it('should return false for invalid date formats', () => {
      expect(isValidDateFormat('26-03-2024')).toBe(false);
      expect(isValidDateFormat('2024/03/26')).toBe(false);
      expect(isValidDateFormat('March 26, 2024')).toBe(false);
      expect(isValidDateFormat('')).toBe(false);
      expect(isValidDateFormat('invalid')).toBe(false);
    });
  });

  describe('isValidTimeSlot', () => {
    it('should return true for valid time format', () => {
      expect(isValidTimeSlot('12:00')).toBe(true);
      expect(isValidTimeSlot('19:30')).toBe(true);
      expect(isValidTimeSlot('23:59')).toBe(true);
    });

    it('should return false for invalid time formats', () => {
      expect(isValidTimeSlot('12:00 PM')).toBe(false);
      expect(isValidTimeSlot('25:00')).toBe(false);
      expect(isValidTimeSlot('12-00')).toBe(false);
      expect(isValidTimeSlot('')).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should return true for undefined/empty phone', () => {
      expect(isValidPhoneNumber(undefined)).toBe(true);
      expect(isValidPhoneNumber('')).toBe(true);
    });

    it('should return true for valid phone numbers', () => {
      expect(isValidPhoneNumber('+41 79 123 45 67')).toBe(true);
      expect(isValidPhoneNumber('079-123-45-67')).toBe(true);
      expect(isValidPhoneNumber('1234567')).toBe(true);
      expect(isValidPhoneNumber('+1-800-555-1234')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(isValidPhoneNumber('123')).toBe(false); // Too short
      expect(isValidPhoneNumber('1234567890123456')).toBe(false); // Too long
      expect(isValidPhoneNumber('phone123')).toBe(false); // Invalid chars
      expect(isValidPhoneNumber('abc@def.com')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('<img src=x onerror=alert(1)>')).toBe('img src=x onerror=alert(1)');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
    });

    it('should limit length to 500 characters', () => {
      const longString = 'a'.repeat(600);
      expect(sanitizeInput(longString).length).toBe(500);
    });
  });

  describe('validateBookingData', () => {
    const validBooking: BookingData = {
      name: 'Mario Rossi',
      phone: '+41 79 123 45 67',
      date: '2026-03-30',
      time_slot: '19:00',
      party_size: 4,
    };

    it('should return empty array for valid booking data', () => {
      const errors = validateBookingData(validBooking);
      expect(errors).toEqual([]);
    });

    it('should validate name is required', () => {
      const errors = validateBookingData({ ...validBooking, name: '' });
      expect(errors).toContain('name must not be empty');
    });

    it('should validate name max length', () => {
      const errors = validateBookingData({ ...validBooking, name: 'a'.repeat(101) });
      expect(errors).toContain('name must be at most 100 characters');
    });

    it('should validate phone format', () => {
      const errors = validateBookingData({ ...validBooking, phone: 'invalid' });
      expect(errors).toContain('phone must have 7-15 digits and contain only valid characters');
    });

    it('should validate date format', () => {
      const errors = validateBookingData({ ...validBooking, date: 'invalid' });
      expect(errors).toContain('date must be in YYYY-MM-DD format');
    });

    it('should validate date is not in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const dateStr = pastDate.toISOString().split('T')[0];
      const errors = validateBookingData({ ...validBooking, date: dateStr });
      expect(errors).toContain('date must not be in the past');
    });

    it('should validate time_slot format', () => {
      const errors = validateBookingData({ ...validBooking, time_slot: 'invalid' });
      expect(errors).toContain('time_slot must be in HH:MM format');
    });

    it('should validate party_size minimum', () => {
      const errors = validateBookingData({ ...validBooking, party_size: 0 });
      expect(errors).toContain('party_size must be between 1 and 10');
    });

    it('should validate party_size maximum', () => {
      const errors = validateBookingData({ ...validBooking, party_size: 11 });
      expect(errors).toContain('party_size must be between 1 and 10');
    });

    it('should validate party_size is required', () => {
      const errors = validateBookingData({ ...validBooking, party_size: undefined as unknown as number });
      expect(errors).toContain('party_size is required');
    });

    it('should return multiple validation errors', () => {
      const errors = validateBookingData({
        name: '',
        date: 'invalid',
        time_slot: 'bad',
        party_size: 0,
      });
      expect(errors.length).toBeGreaterThan(1);
    });
  });
});

describe('API Client', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('getAvailableSlots', () => {
    it('should fetch available slots successfully', async () => {
      const mockResponse = {
        date_available: true,
        slots: ['12:00', '12:30', '19:00'],
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getAvailableSlots('2026-03-30');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/slots?date=2026-03-30'),
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should throw error for invalid date format', async () => {
      await expect(getAvailableSlots('invalid')).rejects.toThrow(BookingApiError);
    });

    it('should throw error on API failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: 'Server error' }),
      });

      await expect(getAvailableSlots('2026-03-30')).rejects.toThrow('Server error');
    });

    it('should handle unknown error details', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(getAvailableSlots('2026-03-30')).rejects.toThrow();
    });
  });

  describe('createBooking', () => {
    const validBooking: BookingData = {
      name: 'Mario Rossi',
      phone: '+41 79 123 45 67',
      date: '2026-03-30',
      time_slot: '19:00',
      party_size: 4,
    };

    it('should create booking successfully', async () => {
      const mockResponse = {
        id: 123,
        name: 'Mario Rossi',
        date: '2026-03-30',
        time_slot: '19:00',
        party_size: 4,
        status: 'confirmed',
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await createBooking(validBooking);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/bookings'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validBooking),
        })
      );
    });

    it('should sanitize input data', async () => {
      const bookingWithXss: BookingData = {
        ...validBooking,
        name: '<script>Mario</script>',
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, ...bookingWithXss, status: 'confirmed' }),
      });

      await createBooking(bookingWithXss);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.name).not.toContain('<');
      expect(body.name).not.toContain('>');
    });

    it('should throw validation error for invalid data', async () => {
      const invalidBooking = { ...validBooking, name: '' };
      await expect(createBooking(invalidBooking)).rejects.toThrow('Validation failed');
    });

    it('should handle 409 conflict error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ detail: 'slot is fully booked' }),
      });

      const error = await createBooking(validBooking).catch(e => e);
      expect(error).toBeInstanceOf(BookingApiError);
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe('Slot fully booked');
    });

    it('should handle 422 validation error from API', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => ({ detail: 'Invalid time_slot' }),
      });

      const error = await createBooking(validBooking).catch(e => e);
      expect(error.statusCode).toBe(422);
    });

    it('should handle 429 rate limit error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ detail: 'Too many requests' }),
      });

      const error = await createBooking(validBooking).catch(e => e);
      expect(error.statusCode).toBe(429);
    });
  });

  describe('checkApiHealth', () => {
    it('should return ok status when healthy', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'ok' }),
      });

      const result = await checkApiHealth();
      expect(result.status).toBe('ok');
    });

    it('should throw error when unhealthy', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 503,
      });

      await expect(checkApiHealth()).rejects.toThrow(BookingApiError);
    });
  });
});

describe('BookingApiError', () => {
  it('should create error with correct properties', () => {
    const error = new BookingApiError(400, 'Bad Request', 'Invalid data');
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Bad Request');
    expect(error.details).toBe('Invalid data');
    expect(error.name).toBe('BookingApiError');
  });
});
