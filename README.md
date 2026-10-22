# kamvatwalaofficial-hub.github.io

Personal portfolio website of Kamva Twala, a postgraduate cybersecurity student at Nelson Mandela University building towards technology and security leadership.

Live site: https://kamvatwala.com (also reachable at https://kamvatwalaofficial-hub.github.io, which redirects)

## Structure

```
index.html          page content
styles.css          design tokens, layout, light and dark themes
script.js           skills-by-layer diagram in the hero
favicon.svg
kamva-*.jpg         portrait (hero) and graduation photo (Why security)
award-*.jpg         photos for the Highlights cards
cert-*.jpg          certificate images for Certifications and honours
press-*.jpg         optional photos for the "In the media" cards (see below)
.nojekyll           tells GitHub Pages to serve files as they are
```

Plain HTML, CSS and JavaScript, with no build step and no tracking.

## Editing

- **Projects, timeline, about text:** edit `index.html`.
- **Skills in the layer diagram:** edit the `LAYERS` object at the top of `script.js`.
- **LinkedIn or email:** uncomment the lines in the Contact section of `index.html`.
- **Highlights:** each card in `index.html` pairs an `award-*.jpg` photo with the result. Photos were
  resized and checked before publishing: other people's names and a visible Wi-Fi password were blurred.
- **Certifications:** each card in `index.html` pairs a `cert-*.jpg` image with its issuer, date and
  verification link. The university email (which contains a student number) was blurred on the Cisco
  certificates before publishing; check new certificates for ID or student numbers the same way.
- **Media cards:** each card in "In the media" shows a coloured cover. To show a photo instead, upload
  a landscape image (16:9, about 1200×675) named `press-herald.jpg`, `press-samsung.jpg` or
  `press-nmu.jpg`. Use only photos you own or have permission to use.

Personal details such as phone numbers and home addresses are deliberately not published.
