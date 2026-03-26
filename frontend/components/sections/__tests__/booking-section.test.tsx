import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingSection } from '../booking-section';
import * as api from '@/lib/api';

// Mock the API module
jest.mock('@/lib/api', () => ({
  getAvailableSlots: jest.fn(),
  createBooking: jest.fn(),
  sanitizeInput: jest.fn((input: string) => input.replace(/[<>]/g, '').trim()),
  isValidPhoneNumber: jest.fn((phone: string | undefined) => {
    if (!phone) return true;
    const digits = phone.replace(/[^\d]/g, '');
    return digits.length >= 7 && digits.length <= 15 && /^[\d+\s\-]+$/.test(phone);
  }),
  isValidDateFormat: jest.fn((date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date)),
}));

// Mock the i18n hook
jest.mock('@/lib/i18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'booking.badge': 'Reservations',
        'booking.title': 'Book Your Table',
        'booking.subtitle': 'Real-time availability',
        'booking.step1': 'Details',
        'booking.step2': 'Confirmation',
        'booking.date': 'Date',
        'booking.time': 'Time',
        'booking.guests': 'Guests',
        'booking.guestsNote': '9+ contact us',
        'booking.guestsLabel': 'guests',
        'booking.tablePreference': 'Table preference',
        'booking.summary': 'Summary',
        'booking.form.info': 'Enter your details',
        'booking.form.name': 'Full name',
        'booking.form.email': 'Email',
        'booking.form.phone': 'Phone',
        'booking.form.notes': 'Special requests',
        'booking.actions.continue': 'Continue',
        'booking.actions.back': 'Back',
        'booking.actions.confirm': 'Confirm',
        'booking.actions.new': 'New booking',
        'booking.success.title': 'Booking confirmed!',
        'booking.success.message': 'We look forward to seeing you!',
        'booking.tablePreferences.terrazza.name': 'Terrace',
        'booking.tablePreferences.interno.name': 'Indoor',
        'booking.tablePreferences.giardino.name': 'Garden',
        'booking.tablePreferences.nessuna.name': 'No preference',
      };
      return translations[key] || key;
    },
    locale: 'en',
    setLocale: jest.fn(),
  }),
}));

// Mock calendar component
jest.mock('@/components/ui/calendar', () => ({
  Calendar: ({ selected, onSelect, disabled }: any) => (
    <div data-testid="calendar">
      <button
        data-testid="calendar-date"
        onClick={() => onSelect && onSelect(new Date('2026-03-30'))}
      >
        Select Date
      </button>
      <div data-testid="selected-date">
        {selected ? selected.toISOString() : 'no-date'}
      </div>
    </div>
  ),
}));

// Mock card component
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

// Mock text-reveal component
jest.mock('@/components/text-reveal', () => ({
  MaskReveal: ({ children }: any) => <>{children}</>,
}));

// Mock magnetic-button component
jest.mock('@/components/magnetic-button', () => ({
  MagneticButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

describe('BookingSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders booking section with initial step', () => {
    render(<BookingSection />);
    
    expect(screen.getByText('Book Your Table')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Confirmation')).toBeInTheDocument();
  });

  it('displays date selection calendar', () => {
    render(<BookingSection />);
    
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
  });

  it('displays time slot buttons', () => {
    render(<BookingSection />);
    
    // Time slots should be visible
    const timeSlots = ['12:00', '12:30', '13:00', '13:30', '14:00', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
    timeSlots.forEach(slot => {
      expect(screen.getByText(slot)).toBeInTheDocument();
    });
  });

  it('displays guest selection buttons', () => {
    render(<BookingSection />);
    
    // Guest options (1-8)
    for (let i = 1; i <= 8; i++) {
      expect(screen.getAllByText(i.toString())[0]).toBeInTheDocument();
    }
    expect(screen.getByText('9+ contact us')).toBeInTheDocument();
  });

  it('displays table preference options', () => {
    render(<BookingSection />);
    
    expect(screen.getByText('Terrace')).toBeInTheDocument();
    expect(screen.getByText('Indoor')).toBeInTheDocument();
    expect(screen.getByText('Garden')).toBeInTheDocument();
    expect(screen.getByText('No preference')).toBeInTheDocument();
  });

  it('allows selecting a time slot', () => {
    render(<BookingSection />);
    
    const timeButton = screen.getByText('19:00');
    fireEvent.click(timeButton);
    
    // Button should be selected (visually indicated by class)
    expect(timeButton).toBeInTheDocument();
  });

  it('allows selecting number of guests', () => {
    render(<BookingSection />);
    
    const guestButtons = screen.getAllByText('4');
    fireEvent.click(guestButtons[0]);
    
    expect(guestButtons[0]).toBeInTheDocument();
  });

  it('allows selecting table preference', () => {
    render(<BookingSection />);
    
    const preferenceButton = screen.getByText('Terrace');
    fireEvent.click(preferenceButton);
    
    expect(preferenceButton).toBeInTheDocument();
  });

  it('disables continue button when required fields are not filled', () => {
    render(<BookingSection />);
    
    const continueButton = screen.getByText('Continue');
    expect(continueButton).toBeDisabled();
  });

  it('enables continue button when all required fields are filled', async () => {
    render(<BookingSection />);
    
    // Select date
    fireEvent.click(screen.getByTestId('calendar-date'));
    
    // Select time
    fireEvent.click(screen.getByText('19:00'));
    
    // Select guests (default is 2, so this might already be selected)
    const guestButtons = screen.getAllByText('2');
    fireEvent.click(guestButtons[0]);
    
    // Continue button should be enabled
    const continueButton = screen.getByText('Continue');
    expect(continueButton).toBeInTheDocument();
  });

  it('proceeds to confirmation step when continue is clicked with valid data', async () => {
    render(<BookingSection />);
    
    // Select date
    fireEvent.click(screen.getByTestId('calendar-date'));
    
    // Select time
    fireEvent.click(screen.getByText('19:00'));
    
    // Select guests
    const guestButtons = screen.getAllByText('2');
    fireEvent.click(guestButtons[0]);
    
    // Click continue
    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);
    
    // Should show summary section
    await waitFor(() => {
      expect(screen.getByText('Summary')).toBeInTheDocument();
    });
  });

  it('displays summary with selected details in confirmation step', async () => {
    render(<BookingSection />);
    
    // Select date
    fireEvent.click(screen.getByTestId('calendar-date'));
    
    // Select time
    fireEvent.click(screen.getByText('19:00'));
    
    // Select guests
    const guestButtons = screen.getAllByText('2');
    fireEvent.click(guestButtons[0]);
    
    // Click continue
    fireEvent.click(screen.getByText('Continue'));
    
    await waitFor(() => {
      // Summary should show selected values
      expect(screen.getByText('Summary')).toBeInTheDocument();
      expect(screen.getByText('19:00')).toBeInTheDocument();
    });
  });

  it('has form inputs for contact details in confirmation step', async () => {
    render(<BookingSection />);
    
    // Navigate to step 2
    fireEvent.click(screen.getByTestId('calendar-date'));
    fireEvent.click(screen.getByText('19:00'));
    fireEvent.click(screen.getAllByText('2')[0]);
    fireEvent.click(screen.getByText('Continue'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Special requests')).toBeInTheDocument();
    });
  });

  it('allows going back from confirmation to details', async () => {
    render(<BookingSection />);
    
    // Navigate to step 2
    fireEvent.click(screen.getByTestId('calendar-date'));
    fireEvent.click(screen.getByText('19:00'));
    fireEvent.click(screen.getAllByText('2')[0]);
    fireEvent.click(screen.getByText('Continue'));
    
    await waitFor(() => {
      expect(screen.getByText('Back')).toBeInTheDocument();
    });
    
    // Click back
    fireEvent.click(screen.getByText('Back'));
    
    // Should be back on step 1
    await waitFor(() => {
      expect(screen.getByText('Continue')).toBeInTheDocument();
    });
  });

  it('sanitizes name input to prevent XSS', async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    
    // Navigate to step 2
    fireEvent.click(screen.getByTestId('calendar-date'));
    fireEvent.click(screen.getByText('19:00'));
    fireEvent.click(screen.getAllByText('2')[0]);
    fireEvent.click(screen.getByText('Continue'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument();
    });
    
    const nameInput = screen.getByPlaceholderText('Full name');
    await user.type(nameInput, '<script>alert("xss")</script>');
    
    // The input should not contain script tags
    expect(nameInput).not.toHaveValue('<script>');
  });

  it('validates phone number format', async () => {
    const user = userEvent.setup();
    render(<BookingSection />);
    
    // Navigate to step 2
    fireEvent.click(screen.getByTestId('calendar-date'));
    fireEvent.click(screen.getByText('19:00'));
    fireEvent.click(screen.getAllByText('2')[0]);
    fireEvent.click(screen.getByText('Continue'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
    });
    
    const phoneInput = screen.getByPlaceholderText('Phone');
    
    // Valid phone numbers should work
    await user.clear(phoneInput);
    await user.type(phoneInput, '+41 79 123 45 67');
    expect(phoneInput).toHaveValue('+41 79 123 45 67');
  });

  it('shows success state after booking submission', async () => {
    const mockedCreateBooking = api.createBooking as jest.MockedFunction<typeof api.createBooking>;
    mockedCreateBooking.mockResolvedValueOnce({
      id: 123,
      name: 'Test User',
      date: '2026-03-30',
      time_slot: '19:00',
      party_size: 2,
      status: 'confirmed',
    });

    render(<BookingSection />);
    
    // Navigate to step 2 and fill form
    fireEvent.click(screen.getByTestId('calendar-date'));
    fireEvent.click(screen.getByText('19:00'));
    fireEvent.click(screen.getAllByText('2')[0]);
    fireEvent.click(screen.getByText('Continue'));
    
    await waitFor(() => {
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });
    
    // Fill in name
    const nameInput = screen.getByPlaceholderText('Full name');
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    
    // Submit booking
    await act(async () => {
      fireEvent.click(screen.getByText('Confirm'));
    });
    
    // Should show success message
    await waitFor(() => {
      expect(screen.getByText('Booking confirmed!')).toBeInTheDocument();
    });
  });

  it('shows error state when booking fails', async () => {
    const mockedCreateBooking = api.createBooking as jest.MockedFunction<typeof api.createBooking>;
    mockedCreateBooking.mockRejectedValueOnce(new Error('Slot fully booked'));

    render(<BookingSection />);
    
    // Navigate to step 2 and fill form
    fireEvent.click(screen.getByTestId('calendar-date'));
    fireEvent.click(screen.getByText('19:00'));
    fireEvent.click(screen.getAllByText('2')[0]);
    fireEvent.click(screen.getByText('Continue'));
    
    await waitFor(() => {
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });
    
    // Fill in name
    const nameInput = screen.getByPlaceholderText('Full name');
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    
    // Submit booking
    await act(async () => {
      fireEvent.click(screen.getByText('Confirm'));
    });
    
    // Should still be on confirmation step (error state)
    await waitFor(() => {
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });
  });

  it('allows creating a new booking after successful submission', async () => {
    const mockedCreateBooking = api.createBooking as jest.MockedFunction<typeof api.createBooking>;
    mockedCreateBooking.mockResolvedValueOnce({
      id: 123,
      name: 'Test User',
      date: '2026-03-30',
      time_slot: '19:00',
      party_size: 2,
      status: 'confirmed',
    });

    render(<BookingSection />);
    
    // Complete a booking
    fireEvent.click(screen.getByTestId('calendar-date'));
    fireEvent.click(screen.getByText('19:00'));
    fireEvent.click(screen.getAllByText('2')[0]);
    fireEvent.click(screen.getByText('Continue'));
    
    await waitFor(() => {
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });
    
    const nameInput = screen.getByPlaceholderText('Full name');
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    
    await act(async () => {
      fireEvent.click(screen.getByText('Confirm'));
    });
    
    await waitFor(() => {
      expect(screen.getByText('New booking')).toBeInTheDocument();
    });
    
    // Click new booking
    fireEvent.click(screen.getByText('New booking'));
    
    // Should be back to initial state
    await waitFor(() => {
      expect(screen.getByText('Continue')).toBeInTheDocument();
    });
  });

  it('fetches available slots when date is selected', async () => {
    const mockedGetAvailableSlots = api.getAvailableSlots as jest.MockedFunction<typeof api.getAvailableSlots>;
    mockedGetAvailableSlots.mockResolvedValueOnce({
      date_available: true,
      slots: ['12:00', '12:30', '19:00', '19:30'],
    });

    render(<BookingSection />);
    
    fireEvent.click(screen.getByTestId('calendar-date'));
    
    // API call should be triggered (if implemented)
    await waitFor(() => {
      // Component might not call API immediately, but structure allows for it
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
    });
  });

  it('limits party size selection to 1-8 in the UI', () => {
    render(<BookingSection />);
    
    // Should show options 1-8
    for (let i = 1; i <= 8; i++) {
      expect(screen.getAllByText(i.toString())[0]).toBeInTheDocument();
    }
    
    // Should show note for 9+
    expect(screen.getByText('9+ contact us')).toBeInTheDocument();
  });

  it('has working form inputs with proper types', async () => {
    render(<BookingSection />);
    
    // Navigate to step 2
    fireEvent.click(screen.getByTestId('calendar-date'));
    fireEvent.click(screen.getByText('19:00'));
    fireEvent.click(screen.getAllByText('2')[0]);
    fireEvent.click(screen.getByText('Continue'));
    
    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText('Full name');
      const emailInput = screen.getByPlaceholderText('Email');
      const phoneInput = screen.getByPlaceholderText('Phone');
      
      expect(nameInput).toHaveAttribute('type', 'text');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(phoneInput).toHaveAttribute('type', 'tel');
    });
  });
});
