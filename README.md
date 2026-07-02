# karni.net.au

Personal website for Nitzan Karni — positioned as a fractional product-and-delivery
leader (de-facto CTO when it counts). Two prototype directions are built for
feedback; one will be chosen.

The full strategy and the reasoning behind it live in
[docs/website-plan.md](docs/website-plan.md).

## Structure

```
index.html            Landing page to compare the two directions
direction-warm/       Direction 1 — "Warm Professional"
direction-sharp/      Direction 2 — "Sharp & Understated"
api/contact.php       Shared contact-form handler (PHP)
```

Each direction is a standalone, plain HTML + vanilla JS page. Tailwind is loaded
via the Play CDN, so there is **no build step** during prototyping.

## Running locally

The contact form posts to `api/contact.php`, so you need PHP to test it
end-to-end. PHP ships with macOS/Linux; run the built-in server from the repo
root:

```bash
php -S localhost:8000
```

Then open:

- Compare page: <http://localhost:8000/>
- Warm: <http://localhost:8000/direction-warm/>
- Sharp: <http://localhost:8000/direction-sharp/>

Without PHP you can still open the HTML files directly in a browser to review
design and copy; only the contact form's send step needs PHP.

## Contact form

`api/contact.php` validates the input, checks a hidden honeypot field
(`company`) to deter bots, and emails the message via PHP's `mail()`.

Before going live, edit the two constants at the top of the file:

- `RECIPIENT` — where enquiries are delivered.
- `FROM_ADDRESS` — a From address on your own domain (so mail isn't rejected).

Your host must support PHP and outbound `mail()`. If it doesn't, swap the
handler for a hosted form service (e.g. Formspree) — the front-end only needs
the form `action`/`fetch` URL changed.

## Production notes

- The Tailwind Play CDN is fine for prototyping but not recommended for
  production (it compiles in the browser). Before launch, compile Tailwind to a
  static CSS file and replace the `<script src="https://cdn.tailwindcss.com">`
  tag with a `<link>` to the built stylesheet.
- Once a direction is chosen, the other can be removed and the winner promoted
  to the site root.
