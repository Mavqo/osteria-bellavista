import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactSection } from '../contact-section';
import * as contactModule from '@/lib/contact';

// Mock the contact module
jest.mock('@/lib/contact', () => ({
  validateContactForm: jest.fn(() => []),
  sanitizeInput: jest.fn((input: string) => input.trim()),
  submitContactForm: jest.fn(),
  isValidEmail: jest.fn((email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
  containsDangerousContent: jest.fn(() => false),
}));

// Mock the i18n hook
jest.mock('@/lib/i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: 'en',
  }),
}));

// Mock the UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => React.createElement('div', props, children),
  CardContent: ({ children, ...props }: any) => React.createElement('div', props, children),
}));

// Mock text-reveal
jest.mock('@/components/text-reveal', () => ({
  MaskReveal: ({ children }: any) => React.createElement(React.Fragment, null, children),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Send: () => React.createElement('span', null, 'Send'),
  User: () => React.createElement('span', null, 'User'),
  Mail: () => React.createElement('span', null, 'Mail'),
  Phone: () => React.createElement('span', null, 'Phone'),
  MessageSquare: () => React.createElement('span', null, 'Message'),
  Check: () => React.createElement('span', null, 'Check'),
  AlertCircle: () => React.createElement('span', null, 'Alert'),
  Loader2: () => React.createElement('span', { 'data-testid': 'loader' }, 'Loading'),
}));

describe('ContactSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (contactModule.validateContactForm as jest.Mock).mockReturnValue([]);
    (contactModule.submitContactForm as jest.Mock).mockResolvedValue({ success: true, message: 'Message sent' });
  });

  it('renders contact section with title', () => {
    render(React.createElement(ContactSection));
    
    expect(screen.getByText('Scrivici')).toBeInTheDocument();
  });

  it('renders contact form with all fields', () => {
    render(React.createElement(ContactSection));
    
    expect(screen.getByLabelText(/Nome e cognome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Oggetto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Messaggio/i)).toBeInTheDocument();
  });

  it('allows entering name', async () => {
    const user = userEvent.setup();
    render(React.createElement(ContactSection));
    
    const nameInput = screen.getByLabelText(/Nome e cognome/i);
    await user.type(nameInput, 'John Doe');
    
    expect(nameInput).toHaveValue('John Doe');
  });

  it('allows entering email', async () => {
    const user = userEvent.setup();
    render(React.createElement(ContactSection));
    
    const emailInput = screen.getByLabelText(/Email/i);
    await user.type(emailInput, 'john@example.com');
    
    expect(emailInput).toHaveValue('john@example.com');
  });

  it('allows entering phone', async () => {
    const user = userEvent.setup();
    render(React.createElement(ContactSection));
    
    const phoneInput = screen.getByLabelText(/Telefono/i);
    await user.type(phoneInput, '+41 79 123 45 67');
    
    expect(phoneInput).toHaveValue('+41 79 123 45 67');
  });

  it('allows entering message', async () => {
    const user = userEvent.setup();
    render(React.createElement(ContactSection));
    
    const messageInput = screen.getByLabelText(/Messaggio/i);
    await user.type(messageInput, 'I would like to book a table.');
    
    expect(messageInput).toHaveValue('I would like to book a table.');
  });

  it('shows character count for message', async () => {
    const user = userEvent.setup();
    render(React.createElement(ContactSection));
    
    const messageInput = screen.getByLabelText(/Messaggio/i);
    await user.type(messageInput, 'Test message');
    
    expect(screen.getByText('12/1000')).toBeInTheDocument();
  });

  it('submits form successfully', async () => {
    const user = userEvent.setup();
    render(React.createElement(ContactSection));
    
    // Fill in the form
    await user.type(screen.getByLabelText(/Nome e cognome/i), 'John Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Messaggio/i), 'Test message');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Invia/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(contactModule.submitContactForm).toHaveBeenCalled();
    });
  });

  it('shows success message after submission', async () => {
    (contactModule.submitContactForm as jest.Mock).mockResolvedValue({ success: true, message: 'Sent' });
    
    const user = userEvent.setup();
    render(React.createElement(ContactSection));
    
    // Fill in the form
    await user.type(screen.getByLabelText(/Nome e cognome/i), 'John Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Messaggio/i), 'Test message');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Invia/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Messaggio inviato!')).toBeInTheDocument();
    });
  });

  it('shows validation errors when form is invalid', async () => {
    (contactModule.validateContactForm as jest.Mock).mockReturnValue(['name is required', 'email is invalid']);
    
    render(React.createElement(ContactSection));
    
    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /Invia/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Correggi i seguenti errori/i)).toBeInTheDocument();
    });
  });

  it('shows error message when submission fails', async () => {
    (contactModule.submitContactForm as jest.Mock).mockResolvedValue({ 
      success: false, 
      message: 'Server error' 
    });
    
    const user = userEvent.setup();
    render(React.createElement(ContactSection));
    
    // Fill in the form
    await user.type(screen.getByLabelText(/Nome e cognome/i), 'John Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Messaggio/i), 'Test message');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Invia/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  it('sanitizes user input', async () => {
    const user = userEvent.setup();
    render(React.createElement(ContactSection));
    
    const nameInput = screen.getByLabelText(/Nome e cognome/i);
    await user.type(nameInput, '<script>alert(1)</script>');
    
    // The sanitizeInput mock should be called
    expect(contactModule.sanitizeInput).toHaveBeenCalled();
  });

  it('allows resetting the form after submission', async () => {
    (contactModule.submitContactForm as jest.Mock).mockResolvedValue({ success: true, message: 'Sent' });
    
    const user = userEvent.setup();
    render(React.createElement(ContactSection));
    
    // Fill in and submit the form
    await user.type(screen.getByLabelText(/Nome e cognome/i), 'John Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Messaggio/i), 'Test message');
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Invia/i }));
    });
    
    await waitFor(() => {
      expect(screen.getByText('Messaggio inviato!')).toBeInTheDocument();
    });
    
    // Click reset button
    const resetButton = screen.getByRole('button', { name: /Invia un altro messaggio/i });
    fireEvent.click(resetButton);
    
    // Form should be back
    await waitFor(() => {
      expect(screen.getByLabelText(/Nome e cognome/i)).toHaveValue('');
    });
  });

  it('has required attributes on required fields', () => {
    render(React.createElement(ContactSection));
    
    expect(screen.getByLabelText(/Nome e cognome/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/Email/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/Messaggio/i)).toHaveAttribute('required');
  });

  it('has correct input types', () => {
    render(React.createElement(ContactSection));
    
    expect(screen.getByLabelText(/Nome e cognome/i)).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/Email/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/Telefono/i)).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText(/Oggetto/i)).toHaveAttribute('type', 'text');
  });
});
