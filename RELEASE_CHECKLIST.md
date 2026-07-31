# Release Checklist

## Build

```powershell
npm run compile
npm run build
npm run zip
```

Upload the generated Chrome zip package from `.output` to the Chrome Web Store Developer Dashboard.

## Manual Test

- New tab opens correctly.
- Search works with Google, Bing, Baidu, and at least one custom search engine.
- Search engine menu opens and closes correctly.
- Search engine add, delete, and drag sorting work.
- Search history can be enabled, disabled, shown, selected, and deleted.
- Search history setting persists after refresh.
- Settings menu opens and closes correctly.
- Theme options work: light, dark, system.
- New-window search setting works.
- Custom background upload and clear work.
- Settings persist after refresh.
- Extension icon and favicon use `logo.svg`.

## Chrome Web Store

- Upload zip.
- Fill store listing from `STORE_LISTING.md`.
- Add privacy policy URL or hosted copy of `PRIVACY.md`.
- Complete privacy practices and declare the `storage` permission purpose.
- Upload screenshots, minimum one 1280x800 image.
- Submit for review.

