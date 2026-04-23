# James Carlo Dioso — Personal Portfolio

Professional, dark-theme static portfolio built with HTML, CSS, and a small amount of vanilla JavaScript.

This repository hosts a recruiter-friendly portfolio site focused on Administrative Support, Data Entry, Quality Assurance, Lead Generation, and Front-End Web Development.

---

## Project Description

A clean, modern single-page portfolio that presents accurate professional details, experience, skills, education, and contact information. The site is intentionally minimal, fast, and optimized for clarity and readability on all devices.

## Purpose of the Website

- Showcase relevant work experience and skills for job applications
- Provide a simple way for recruiters and hiring managers to contact the owner
- Act as a lightweight, deployable web presence (static site) for professional outreach

## Main Sections

- Hero (name, title, short intro, CTAs)
- About
- Work Highlights / Core Strengths
- Professional Experience (timeline)
- Skills
- Education
- Certifications & Training
- Contact
- Footer

## File Structure

- [index.html](index.html) — main HTML file containing site structure and content
- [style.css](style.css) — all visual styles, color variables, spacing, responsive rules
- [script.js](script.js) — JavaScript for navigation, smooth scrolling, reveal animations, and back-to-top
- [favicon.svg](favicon.svg) — site monogram / favicon
- images/ — recommended folder for images (place profile photo here)
- assets/files/ — recommended folder for supporting files (place resume PDF here)

> Note: The current project root includes the files above. Create the `images/` and `assets/files/` folders if you prefer to keep assets organized.

## How to Edit `index.html`

Open [index.html](index.html) in your editor. Key editable areas:

- Hero: top of the file — name, tagline, short intro, and CTA links
- Sections: each main section has an `id` (for example `about`, `experience`, `skills`) — edit headings, lists, and text directly
- Links: the download resume and profile image paths are plain HTML attributes — update paths if you move files

Small tips:

- Preserve semantic structure (section IDs and headings) so CSS and JS keep working.
- When changing file paths, update the href/src attributes used in the HTML accordingly.

## How to Edit `style.css`

Open [style.css](style.css). Recommended edits:

- Theme variables: change the color palette at the top under `:root` (accent color, background, text colors).
- Typography and spacing: adjust font sizes or container max-width for global layout changes.
- Component styles: cards, nav, hero, and reveal animations are organized as logical blocks — modify carefully to keep responsive rules intact.

Best practice: change variables first (`--accent`, `--text`, `--bg`) so updates remain consistent across the site.

## How to Edit `script.js`

Open [script.js](script.js). The file is organized into feature blocks with comments:

- Mobile menu toggle and accessibility
- Smooth scrolling for anchor links
- Active nav highlighting via `IntersectionObserver`
- Sticky header helper and back-to-top button handling
- Reveal animations (also uses `IntersectionObserver`)
- Optional hero text animation

If you rename any section IDs or class names in the HTML, update the matching selectors in `script.js`.

## How to Replace the Profile Image

Place a replacement profile image in `images/profile.jpg` (recommended). The markup in [index.html](index.html) currently points to `images/profile.jpg`.

If you prefer `assets/images/` instead, move the file and update the `src` value in [index.html](index.html):

```html
<!-- example: update the img src attribute -->
<img src="assets/images/profile.jpg" alt="Profile photo of James Carlo Dioso">
```

Use a square or slightly rectangular image (>= 400×400 px recommended). The page includes a graceful fallback if the image is missing.

## How to Replace the Resume PDF

Place your resume as `assets/files/JamesCarloDioso_Resume.pdf` (or a name you prefer). Then update the download link in [index.html](index.html):

```html
<a class="btn" href="assets/files/JamesCarloDioso_Resume.pdf" download>Download Resume</a>
```

If you place the PDF at the project root as `resume.pdf`, the existing links will work without further edits.

## How to Preview the Site in VS Code

1. Open the project folder in VS Code.
2. Option A — Live Server extension (recommended): install the *Live Server* extension, then right-click `index.html` and select *Open with Live Server*.
3. Option B — Open in default browser: open the file system and double-click `index.html` to open it in your browser.

Note: Live Server provides automatic reloads when you save files and is useful during editing.

## How to Publish with GitHub Pages

1. Initialize a Git repository if you haven't already:

```bash
git init
git add .
git commit -m "Initial portfolio site"
```

2. Create a GitHub repository and push your code (replace `<repo-url>`):

```bash
git remote add origin <repo-url>
git branch -M main
git push -u origin main
```

3. On GitHub: go to the repository Settings → Pages, select the `main` branch and save. Your static site will be published at `https://<username>.github.io/<repo>/`.

## Future Improvements

- Add a small contact form that posts to a serverless function or a form service (avoid storing sensitive data client-side).
- Add PNG favicon fallbacks (16×16, 32×32, 48×48) for older browsers.
- Add structured data (schema.org) for contact and resume snippets to improve search appearance.
- Optionally split CSS into a small critical inline portion and a larger stylesheet for performance if needed.

---

If you'd like, I can:

- Generate PNG favicon fallbacks in the correct sizes
- Wire a simple contact form or add GitHub Actions to build/publish automatically

Project owner: James Carlo Dioso
