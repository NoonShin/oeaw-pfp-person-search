# PFP Person Search Demo App (RSE Assessment)
This small web application has been developed as part of an assessment procedure for OeAW. It includes a simple person search and result view for persons on the PFP database.

## Some Remarks
- The styling is created with React Bootstrap (as opposed to Tailwind) due to my higher skill level in Bootstrap.
- Pagination not provided due to perceived bug in API endpoint (returns page 1 of length 100 regardless of query parameters).
- To run the application, due to CORS restrictions on the API, you'll need to:
  - Disable CORS in your browser (what I did while developing and testing), OR
  - Use a CORS proxy, OR
  - Run a local development server with proxy configuration
