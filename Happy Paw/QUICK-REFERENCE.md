# Happy Paw Bootstrap Quick Reference

## Color Palette

css
Primary (Sky Blue):    #a8d5e2  ■■■
Secondary (Sage Green): #c8e6c9  ■■■
Accent (Lavender):     #e1bee7  ■■■
Light Background:      #f5f5f5  ■■■
Text:                  #4a4a4a  ■■■

## Border Radius Standards

- Small elements: `0.75rem` (12px)
- Standard: `1.25rem` (20px)
- Large cards: `2rem` (32px)

## Navigation Structure

### Homepage → All Pages

index.html
├── about/about.html
├── services/services-bootstrap.html
│   ├── #full-groom
│   ├── #bath-blowdry
│   ├── #mini-groom
│   ├── #puppy-first
│   └── #deshedding
├── gallery/gallery.html
├── booking/booking.html
└── contact/contact.html
```

## Button Classes

html
<!-- Primary Actions (Booking, Premium) -->
<button class="btn btn-happy-primary">Book Now</button>

<!-- Secondary Actions (Info, Basic) -->
<button class="btn btn-happy-secondary">Learn More</button>

<!-- Accent Actions (Featured Offers) -->
<button class="btn btn-happy-accent">Special Offer</button>
```

## Responsive Breakpoints

| Device | Width | Navbar | Cards Layout |
|--------|-------|--------|-------------|
| Mobile | <768px | Hamburger | 1 column |
| Tablet | 768-991px | Hamburger | 2 columns |
| Desktop | ≥992px | Full | 3 columns |

## Testing Checklist

### Desktop (>992px)
- [ ] All nav links visible in row
- [ ] Service cards display 3 per row
- [ ] Pricing tables side-by-side
- [ ] Hover effects smooth on all cards
- [ ] Dropdown menu appears on Services

### Tablet (768-991px)
- [ ] Hamburger menu appears
- [ ] Service cards show 2 per row
- [ ] Pricing tables show 2 columns
- [ ] Featured pricing card scales correctly
- [ ] Touch targets large enough (44px min)

### Mobile (<768px)
- [ ] Navbar collapses completely
- [ ] All cards stack vertically
- [ ] Text remains readable
- [ ] Buttons span full width
- [ ] No horizontal scroll
- [ ] Carousel controls accessible

## Common Customizations

### Change Primary Color
css
/* In bootstrap-custom.css */
:root {
  --hp-primary: #YOUR_COLOR;
}

### Adjust Navbar Height
css
/* In bootstrap-custom.css */
body {
  padding-top: YOUR_HEIGHT; /* Match navbar height */
}

### Modify Card Hover Effect
css
/* In bootstrap-custom.css */
.service-card:hover {
  transform: translateY(-12px); /* Increase lift */
  box-shadow: 0 16px 40px rgba(168, 213, 226, 0.3);
}

## Component Locations

| Component | File | Lines |
|-----------|------|-------|
| Custom CSS | `css/bootstrap-custom.css` | All |
| Navbar | All HTML files | Top |
| Service Cards | `services/services-bootstrap.html` | Lines 78-174 |
| Pricing Tables | `services/services-bootstrap.html` | Lines 178-260 |
| Testimonials | `index.html` | Lines 68-110 |

## Quick Start Commands

### Open All Pages
powershell
cd "Happy Paw"
start index.html
start services/services-bootstrap.html

### Test Responsive
1. Open Developer Tools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Test sizes: 375px, 768px, 1024px, 1920px

## Tips

- **Navbar links**: Update `active` class when adding new pages
- **Service images**: Replace `mydog.jpg` with unique images per service
- **Testimonials**: Add more slides by duplicating `.carousel-item`
- **Pricing**: Update prices in `.price` div, services in `list-group-item`

**Last Updated**: October 27, 2025  
**Framework**: Bootstrap 5.3.2  
**Browser Support**: Chrome, Firefox, Safari, Edge
