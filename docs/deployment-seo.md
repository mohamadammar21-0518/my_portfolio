# Deployment metadata

The portfolio includes Open Graph title, description, site name and type, Twitter text metadata, and an allow-all robots.txt.

After choosing the public HTTPS address:

- Add a canonical link and og:url to index.html using the actual public address.
- Add og:image and twitter:image using the absolute public URL of /images/portrait.jpeg (or a dedicated preview image). Add og:image:alt describing the image.
- Create public/sitemap.xml with the public homepage URL. Section and project fragments belong to the same page and should not become separate sitemap entries.
- Add a Sitemap line with its absolute URL to public/robots.txt.
- Verify the deployed image, CV, and project links before sharing. Localhost cannot be fetched by LinkedIn crawlers.

No production address has been assumed or substituted with the old Framer website.
