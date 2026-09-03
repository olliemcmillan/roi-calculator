# ROI calculator

A small Astro app that estimates the return on a website or conversion-rate improvement. Built to deploy on Webflow Cloud.

## Local

```sh
npm install
npm run dev
```

The calculator runs entirely in the browser. Traffic, conversion rate, average conversion value, expected lift, and investment update the ROI, net return, and payback period live.

## Webflow Cloud

This repo includes a `webflow.json` that pins the framework to Astro. Webflow Cloud detects the Astro 7 version from `package.json` and installs the matching adapter at build time.

One-click import:

[https://webflow.com/dashboard/cloud/deploy?repo=https://github.com/olliemcmillan/roi-calculator](https://webflow.com/dashboard/cloud/deploy?repo=https://github.com/olliemcmillan/roi-calculator)
