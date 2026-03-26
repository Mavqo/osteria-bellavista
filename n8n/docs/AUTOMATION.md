# Osteria Bellavista - Automation Documentation

## Overview

This document describes the n8n automation workflows integrated with the Osteria Bellavista restaurant website.

## Workflows

### 1. Booking Confirmation Workflow (`booking-confirmation.json`)

**Purpose**: Handles new booking submissions from the website.

**Triggers**:
- Webhook: `POST /webhook/booking-webhook`

**Flow**:
1. Receive booking data from frontend
2. Validate required fields (name, phone, date, time_slot)
3. Create booking via backend API (`POST /bookings`)
4. On success:
   - Return 201 with booking details
   - Send Slack notification to staff
   - Send email notification to restaurant

**Environment Variables**:
- `BACKEND_API_URL` - URL of the FastAPI backend
- `RESTAURANT_EMAIL` - Email address for notifications
- SMTP credentials for email delivery

**Retry Logic**:
- If booking creation fails, workflow calls error handler
- Error handler retries with exponential backoff (3 attempts)

---

### 2. Contact Form Handler (`contact-form.json`)

**Purpose**: Processes contact form submissions and classifies inquiries.

**Triggers**:
- Webhook: `POST /webhook/contact-webhook`

**Flow**:
1. Receive contact form data
2. Validate required fields (name, email, message)
3. Use OpenAI GPT-4 to classify inquiry:
   - Category: reservation, menu_inquiry, private_event, complaint, general
   - Priority: low, medium, high, urgent
   - Summary in Italian
4. Send Slack notification
5. Send email to restaurant
6. Store classification data

**LLM Integration**:
- Model: OpenAI GPT-4o-mini
- Prompt includes customer name and message
- Returns structured JSON with classification

**Environment Variables**:
- `OPENAI_API_KEY` - OpenAI API key

---

### 3. LLM Customer Service (`llm-customer-service.json`)

**Purpose**: AI-powered daily summaries and personalized customer communications.

**Triggers**:
- Schedule: Every hour
- Webhook: `POST /webhook/booking-notification`

**Flows**:

#### Daily Summary (Scheduled)
1. Fetch today's bookings from backend
2. Use GPT-4 to analyze:
   - Total bookings count
   - Peak hours
   - VIP/large party alerts (≥6 guests)
   - Preparation notes for staff
3. Send analysis to Slack

#### Booking Confirmation (Webhook)
1. Receive booking notification
2. Use Anthropic Claude to generate personalized confirmation email
3. Send email to customer

**LLM Integration**:
- Analysis: OpenAI GPT-4o-mini
- Email generation: Anthropic Claude 3.5 Sonnet
- Prompts include booking details and restaurant context

**Environment Variables**:
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key

---

### 4. Error Handler & Retry (`error-handler.json`)

**Purpose**: Handles workflow failures with intelligent retry and alerting.

**Triggers**:
- Webhook: `POST /webhook/error-handler`

**Flow**:
1. Receive error data from failed workflow
2. Check retry count
3. If under max retries (3):
   - Wait with exponential backoff (1s, 2s, 4s)
   - Trigger retry via backend
4. If max retries exceeded:
   - Alert Slack with error details
   - Email admin for manual intervention
   - Use GPT-4 to analyze error and suggest fixes

**Retry Strategy**:
- Exponential backoff: 2^retry_count seconds
- Max 3 retry attempts
- Original data preserved across retries

---

## Security

### Webhook Signature Verification

All webhooks support HMAC-SHA256 signature verification:

```python
# Backend verification
def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
```

**Configuration**:
- Set `WEBHOOK_SECRET` environment variable
- Include `X-Webhook-Signature` header in requests
- Backend returns 401 for invalid signatures

### API Key Management

- API keys stored only in environment variables
- No secrets in workflow JSON files
- Use n8n credential management for:
  - OpenAI API key
  - Anthropic API key
  - SMTP credentials
  - Slack bot token

---

## Setup Instructions

### 1. Install n8n

```bash
# Using npm
npm install -g n8n

# Using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### 2. Import Workflows

1. Open n8n UI at `http://localhost:5678`
2. Go to Workflows → Import from File
3. Import each JSON file from `n8n/workflows/`

### 3. Configure Credentials

In n8n UI:
1. Settings → Credentials
2. Add credentials for:
   - OpenAI API
   - Anthropic API
   - SMTP (email)
   - Slack Bot
   - HTTP Header Auth (for backend API)

### 4. Set Environment Variables

Backend (`.env`):
```bash
# Required
WEBHOOK_SECRET=your-webhook-secret-here
BACKEND_API_URL=https://api.osteria-bellavista.com

# Optional (for email notifications)
RESTAURANT_EMAIL=ristorante@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password

# Optional (for LLM features)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

Frontend (`.env.local`):
```bash
NEXT_PUBLIC_API_URL=https://api.osteria-bellavista.com
```

### 5. Activate Workflows

In n8n UI:
1. Open each workflow
2. Click "Activate" toggle
3. For scheduled workflows, verify cron expression

---

## Testing

### Test Webhook Signature

```bash
curl -X POST https://api.osteria-bellavista.com/webhooks/signature-test \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: your-signature" \
  -d '{"test": true}'
```

### Test Booking Webhook

```bash
curl -X POST https://your-n8n-instance.com/webhook/booking-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "phone": "+41 79 123 4567",
    "email": "test@example.com",
    "date": "2024-12-25",
    "time_slot": "20:00",
    "party_size": 4,
    "table_preference": "terrazza",
    "notes": "Anniversary dinner"
  }'
```

### Test Error Handler

```bash
curl -X POST https://your-n8n-instance.com/webhook/error-handler \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": "booking-confirmation",
    "error": "Connection timeout",
    "retryCount": 1,
    "originalData": {"name": "Test", "date": "2024-12-25"}
  }'
```

---

## Monitoring

### Health Checks

- Backend: `GET /health`
- Webhooks: `GET /webhooks/health`
- Contact: `GET /contact/health`

### Logs

Check n8n execution logs for workflow runs:
1. Open n8n UI
2. Executions → View execution history
3. Filter by workflow or status

### Alerts

The error handler sends alerts to:
- Slack channel (immediate)
- Admin email (for max retry failures)

---

## Troubleshooting

### Workflow Not Triggering

1. Check webhook URL is correct
2. Verify workflow is activated in n8n
3. Check n8n logs for webhook registration
4. Test webhook manually with curl

### LLM Not Responding

1. Verify API keys in n8n credentials
2. Check API rate limits
3. Review LLM node configuration
4. Check n8n execution logs for errors

### Email Not Sending

1. Verify SMTP credentials
2. Check spam folders
3. Review email service logs
4. Test SMTP connection separately

### Signature Verification Failing

1. Ensure `WEBHOOK_SECRET` matches between backend and n8n
2. Check header name: `X-Webhook-Signature`
3. Verify payload encoding (UTF-8)
4. Test with `/webhooks/signature-test` endpoint

---

## Architecture Diagram

```
┌─────────────────┐
│   Frontend      │
│  (Next.js)      │
└────────┬────────┘
         │ HTTP/JSON
         ▼
┌─────────────────┐     ┌─────────────────┐
│  FastAPI        │────▶│   SQLite DB     │
│  Backend        │     └─────────────────┘
└────────┬────────┘
         │ Webhooks
         ▼
┌─────────────────┐
│   n8n           │
│  Workflows      │
└────────┬────────┘
         │
    ┌────┴────┬─────────┬─────────┐
    ▼         ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ OpenAI│ │Anthropic│ │ Slack │ │ Email │
└───────┘ └───────┘ └───────┘ └───────┘
```

---

## Support

For issues or questions:
1. Check n8n documentation: https://docs.n8n.io
2. Review execution logs in n8n UI
3. Check backend logs for webhook errors
4. Contact automation team
