# Site Scripts and Styles

## Shared CSS
- `css/style.css` - main shared layout and component styles
- `css/about.css` - about page styles
- `css/contact.css` - contact page styles
- `css/ourgear.css` - gear catalog styles
- `css/used-equipment.css` - used equipment listing styles
- `css/used-product.css` - used product detail styles
- `css/microphone.css` - microphone category styles

## Shared JavaScript
- `js/script.js` - navigation behavior and general UI behavior
- `js/ourgearapp.js` - filters gear cards on `ourgear.html`
- `js/used-equipment.js` - swaps gallery images on used product pages
- `js/formapp.js` - legacy form validation logic, currently not wired into the visible form
- `js/email.js` - legacy email submission logic, currently not wired into the visible form

## External dependencies
- Google Analytics / gtag
- jQuery
- Font Awesome
- Google Fonts
- SweetAlert2 appears on `index.html` for the legacy form flow

## Overall behavior
The current site is mostly static HTML with a small amount of client-side JavaScript for navigation, filtering, and image switching.
