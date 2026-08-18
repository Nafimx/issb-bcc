# Real PPDT / TAT pictures

Put the actual plates in this folder and list them in `manifest.json`:

```json
{ "pictures": [
  { "file": "01-thief-chase.jpg", "title": "Crowd in a market" },
  { "file": "02-farmer-and-student.jpg" }
] }
```

As soon as `pictures` is not empty, both the PPDT and the TAT use these instead
of the drawn fallback scenes. Order in the list is the order in the picture
menu. Any image format a browser can show works; roughly 900x600 or larger
reads best, since the drill blurs them.

A cadet can also add pictures on their own device with "Add your own pictures"
on the PPDT page — those are kept in that browser only, never uploaded, and
take priority over everything else.

Note on rights: these plates usually come from published ISSB preparation
books. Adding them on a personal device is one thing; committing them here
publishes them to everyone who visits the site.
