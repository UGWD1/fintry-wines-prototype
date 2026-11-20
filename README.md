# Fintry Wines — website prototype

A clickable front-end prototype of the Fintry Wines marketplace. Each page is a single self-contained HTML file (styles, scripts and logo are built in), so it needs no build step and runs on GitHub Pages as-is.

## Pages

- `index.html`: homepage
- `shop.html`: red wine listing with filters
- `product.html`: product page with the full wine profile

## What works

- Wine Types, Wine by Location and Offers menus in the header
- Bestseller tabs on the homepage
- Location filters on the shop page
- Bottle, Mixed 6 and Case options on the product page, with a quantity selector
- Add-to-basket buttons that update the basket count and keep it between pages
- Wishlist hearts
- Hover and entrance animations

All wines, sellers, prices and reviews are sample data.

## Publish on GitHub Pages

1. Create a new repository, for example `fintry-wines-prototype`.
2. Upload `index.html`, `shop.html` and `product.html` to the root of the repository (not inside a subfolder).
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**, then choose the `main` branch and the `/ (root)` folder.
5. Click **Save**. After a minute or two the site is live at `https://<your-username>.github.io/fintry-wines-prototype/`.

## Notes

- Every page has `noindex`, so search engines won't list the prototype.
- GitHub Pages sites are always public to anyone who has the link.
