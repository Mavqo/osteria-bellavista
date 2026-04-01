import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GallerySection } from '../gallery-section';

// Mock the i18n hook
jest.mock('@/lib/i18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'gallery.badge': 'Atmosphere',
        'gallery.title': 'Gallery',
        'gallery.subtitle': 'Discover our spaces and dishes',
        'gallery.filters.all': 'All',
        'gallery.filters.dishes': 'Dishes',
        'gallery.filters.ambience': 'Ambience',
        'gallery.filters.lake': 'Lake',
      };
      return translations[key] || key;
    },
    locale: 'en',
  }),
}));

// Mock the dialog component
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => open ? React.createElement('div', { 'data-testid': 'dialog' }, children) : null,
  DialogContent: ({ children }: any) => React.createElement('div', { 'data-testid': 'dialog-content' }, children),
}));

// Mock the optimized-image component
jest.mock('@/components/optimized-image', () => ({
  OptimizedImage: ({ alt, src, fill }: any) => 
    React.createElement('img', { alt, src, 'data-fill': fill ? 'true' : 'false', 'data-testid': 'optimized-image' }),
}));

// Mock text-reveal
jest.mock('@/components/text-reveal', () => ({
  MaskReveal: ({ children }: any) => React.createElement(React.Fragment, null, children),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  X: () => React.createElement('span', { 'data-testid': 'x-icon' }, 'X'),
  ZoomIn: () => React.createElement('span', { 'data-testid': 'zoomin-icon' }, 'Zoom'),
}));

describe('GallerySection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders gallery section with title', () => {
    render(React.createElement(GallerySection));
    
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('Discover our spaces and dishes')).toBeInTheDocument();
    expect(screen.getByText('Atmosphere')).toBeInTheDocument();
  });

  it('renders all category filter buttons', () => {
    render(React.createElement(GallerySection));
    
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Dishes')).toBeInTheDocument();
    expect(screen.getByText('Ambience')).toBeInTheDocument();
    expect(screen.getByText('Lake')).toBeInTheDocument();
  });

  it('renders gallery images', () => {
    render(React.createElement(GallerySection));
    
    // Should render multiple images
    const images = screen.getAllByTestId('optimized-image');
    expect(images.length).toBeGreaterThan(0);
  });

  it('filters images by category when filter button is clicked', () => {
    render(React.createElement(GallerySection));
    
    // Initially "All" is selected
    const allButton = screen.getByText('All');
    expect(allButton).toBeInTheDocument();
    
    // Click on "Dishes" filter
    const dishesButton = screen.getByText('Dishes');
    fireEvent.click(dishesButton);
    
    // Images should still be rendered
    const images = screen.getAllByTestId('optimized-image');
    expect(images.length).toBeGreaterThan(0);
  });

  it('filters images by ambience category', () => {
    render(React.createElement(GallerySection));
    
    const ambienceButton = screen.getByText('Ambience');
    fireEvent.click(ambienceButton);
    
    // Images should still be rendered
    const images = screen.getAllByTestId('optimized-image');
    expect(images.length).toBeGreaterThan(0);
  });

  it('filters images by lake category', () => {
    render(React.createElement(GallerySection));
    
    const lakeButton = screen.getByText('Lake');
    fireEvent.click(lakeButton);
    
    // Images should still be rendered
    const images = screen.getAllByTestId('optimized-image');
    expect(images.length).toBeGreaterThan(0);
  });

  it('opens lightbox when image is clicked', () => {
    render(React.createElement(GallerySection));
    
    // Get first image and click it
    const images = screen.getAllByTestId('optimized-image');
    expect(images.length).toBeGreaterThan(0);
    
    // Click on the image parent (which has the click handler)
    const imageContainer = images[0].parentElement;
    if (imageContainer) {
      fireEvent.click(imageContainer);
    }
    
    // Dialog should be open
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('displays images with correct alt text', () => {
    render(React.createElement(GallerySection));
    
    const images = screen.getAllByTestId('optimized-image');
    
    // Each image should have alt text
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });
  });

  it('displays images with correct src attribute', () => {
    render(React.createElement(GallerySection));
    
    const images = screen.getAllByTestId('optimized-image');
    
    // Each image should have a src
    images.forEach(img => {
      expect(img).toHaveAttribute('src');
      expect(img.getAttribute('src')).toContain('http');
    });
  });

  it('has interactive category buttons', () => {
    render(React.createElement(GallerySection));
    
    const categories = ['All', 'Dishes', 'Ambience', 'Lake'];
    
    categories.forEach(category => {
      const button = screen.getByText(category);
      expect(button).toBeInTheDocument();
      expect(button.tagName.toLowerCase()).toBe('button');
    });
  });
});
