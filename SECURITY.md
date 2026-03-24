# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Fresh News, **please do not open a public issue.**

Instead, please report it responsibly:

1. **Email**: Send details to the maintainers privately via GitHub (use the "Security" tab on the repository)
2. **Include**: A description of the vulnerability, steps to reproduce, and potential impact
3. **Response time**: We aim to acknowledge reports within 48 hours and provide a fix within 7 days for critical issues

## Security Measures

Fresh News implements the following security controls:

### API Key Protection
- All LLM provider API keys are sent via HTTP headers, never in URL query parameters
- API keys are stored server-side only (`.env` file, never bundled to client)
- `.env` files are gitignored

### Input Validation
- All user input is sanitized (control characters stripped, length limits enforced)
- Enum values are validated against allowlists
- URLs from external sources are validated (only `http`/`https` protocols allowed)

### Prompt Injection Defense
- Untrusted content (article titles, snippets) is wrapped in XML-delimited data blocks
- LLM system prompts explicitly instruct treating data blocks as data, not instructions
- Content is escaped before prompt interpolation

### Rate Limiting
- In-memory rate limiter on all API endpoints (10 req/min for research, 30 req/min for metadata)
- Configurable per-endpoint limits

### HTTP Security Headers
- Content Security Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Strict-Transport-Security (production)
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy (disables camera, microphone, geolocation, payment)

### Response Safety
- Error messages are generic — internal details are never exposed to clients
- LLM response JSON is runtime-validated with safe defaults
- All external content lengths are capped

## For Deployers

- Always use HTTPS in production
- Set `ALLOWED_ORIGIN` environment variable to restrict CORS
- Consider Redis-backed rate limiting for multi-instance deployments
- Rotate API keys regularly
- Monitor API usage for anomalies
