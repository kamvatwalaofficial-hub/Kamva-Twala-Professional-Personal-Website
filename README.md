# kamvatwalaofficial-hub.github.io

Personal portfolio website of Kamva Twala, a postgraduate cybersecurity student at Nelson Mandela University building towards technology and security leadership.

Live site: https://kamvatwala.com (also reachable at https://kamvatwalaofficial-hub.github.io, which redirects)

## Structure

```
index.html          page content
styles.css          design tokens and layout (dark "security operations" theme)
script.js           defence-in-depth simulation, skills filter, responsive navbar
favicon.svg
kamva-graduation.jpg graduation photo (Why security)
award-*.jpg         photos for the Highlights cards
cert-*.jpg          certificate images for Certifications and honours
press-*.jpg         photos for the "In the media" cards (16:9, 1200×675)
.nojekyll           tells GitHub Pages to serve files as they are
```

Plain HTML, CSS and JavaScript, with no build step and no tracking.

## Security

A Content Security Policy (a `<meta>` tag at the top of `index.html`) allows only this site's own
scripts, styles and images, plus Google Fonts. Inline scripts, outside scripts and tracking pixels are
blocked, which limits the damage if anything malicious were ever injected into the page.

If you add something new, update the policy too, or the browser will block it:

- **Images or files from another site:** add its address to `img-src` (or the matching directive).
- **Embedded videos or maps:** add a `frame-src` directive for that site.
- **Scripts:** put code in `script.js`, never in inline `<script>` tags or `onclick=` attributes.

GitHub Pages does not support custom response headers, so protections that only work as headers
(such as `frame-ancestors` against clickjacking) are not available on this host.

## Editing

- **Projects, timeline, about text:** edit `index.html`.
- **Skills in the layer diagram:** edit the `LAYERS` object at the top of `script.js`.
- **Skills section:** edit the skill lists in `index.html` (each `<li class="skill">`); the filter and search work automatically. No proficiency levels are shown.
- **Career roadmap:** edit the four stage cards in the Roadmap section of `index.html`.
- **LinkedIn or email:** uncomment the lines in the Contact section of `index.html`.
- **Highlights:** each card in `index.html` pairs an `award-*.jpg` photo with the result. Photos were
  resized and checked before publishing: other people's names and a visible Wi-Fi password were blurred.
- **Certifications:** each card in `index.html` pairs a `cert-*.jpg` image with its issuer, date and
  verification link. The university email (which contains a student number) was blurred on the Cisco
  certificates before publishing; check new certificates for ID or student numbers the same way.
- **Media cards:** each card in "In the media" uses a 16:9 photo (1200×675): `press-herald.jpg` and
  `press-samsung.jpg` (headshot) and `press-nmu.jpg` (Eastern Cape win). The
  hackathon and Eastern Cape photos keep the same blurs as their Highlights versions. If a photo is
  missing, the card falls back to a coloured cover.

Personal details such as phone numbers and home addresses are deliberately not published.
