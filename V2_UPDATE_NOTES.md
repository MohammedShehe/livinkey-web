# V2 update – public website

- PG cards show an offer ribbon and offer line when the PG has a live offer.
- PG detail page: "Offers on this PG" section (tap-to-copy coupon code, validity, terms, "Claim offer" via WhatsApp) and an offer badge under the PG name.
- Offers come from the API (`offers` on each PG) and disappear automatically when switched off or expired.

## App download modal
- Real Android QR (`assets/qr-android.png`, decodes to the Play Store listing `com.livinkey.app`) replaces the generated placeholder QR.
- "Get it on Google Play" button now links to the live listing (was `href="#"`).
- iOS card shows "Coming soon" (fake App Store QR/link removed). When the iOS app is live, add its QR + link in the `.is-soon` card of the `#appModal` block (same block exists in home, about, contact, pgs, pg-details, delete-account).
- On phones the QR is hidden and the Play Store button leads. `delete-account.html` previously had a Download App button with no modal; it now has one.
