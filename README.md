<p align="center">
  <img src="docs/assets/repguard-logo-transparent.png" alt="RepGuard" width="480">
</p>

# RepGuard

RepGuard is a prototype for reviewing receipts in support and warranty cases. It reads uploaded images and PDFs locally, flags details that need checking, and helps a support rep decide what to review next.

Scores describe evidence quality and internal consistency. They do not verify a claim or make an automatic claim decision.

## What works

- Receipt image and PDF upload
- Local OCR and receipt parsing
- Review signals, reports, and support guidance
- Synthetic evidence fixtures for testing

The case command center is a static demo with synthetic cases and no saved state. Product-photo analysis is not live; OCR and vision provider work remains in isolated mock and synthetic-fixture sandboxes.

## Tech Stack

- Next.js
- TypeScript
- React
- Tailwind CSS
- Tesseract.js
- PDF.js
- Exifr
- Lucide React

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Useful checks:

```bash
npm run lint
npm run build
```

## Documentation

See the [documentation index](docs/README.md) for product notes, QA instructions, operating guidance, and phase history. RepGuard is not a production claim decision system.

## Related Projects

- RepStack: review collection and pay-period tracking app
- RepReport: review parser and export helper
- RepOS: customer support workflow system prototype

## License

MIT. See [LICENSE](LICENSE).
