# agentware.studio auth.md — Agent Authentication & Registration

This document defines the self-contained agent authentication and registration discovery policy for **agentware.studio**.

## 1. Audience & Scope

This specification is intended for autonomous AI agents, bots, and automated clients interacting with `https://agentware.studio`.

All public documentation and web resources are accessible anonymously without mandatory registration or credential provisioning.

## 2. Agent Registration & Provisioning

### 2.1 Endpoints

The following endpoints are declared for agent registration and authentication discovery:

| Property | Endpoint |
|---|---|
| Resource | `https://agentware.studio` |
| Registration (`register_uri`) | `POST https://agentware.studio/agent/auth` |
| Claim (`claim_uri`) | `https://agentware.studio/agent/claim` |
| Revocation (`revocation_uri`) | `https://agentware.studio/agent/revoke` |

### 2.2 Discovery Metadata

```json
{
  "resource": "https://agentware.studio",
  "scopes_supported": [
    "read",
    "public"
  ],
  "bearer_methods_supported": [
    "header"
  ],
  "agent_auth": {
    "skill": "auth.md",
    "register_uri": "https://agentware.studio/agent/auth",
    "claim_uri": "https://agentware.studio/agent/claim",
    "revocation_uri": "https://agentware.studio/agent/revoke",
    "identity_types_supported": [
      "anonymous"
    ],
    "anonymous": {
      "credential_types_supported": [
        "none",
        "bearer_token"
      ],
      "claim_uri": "https://agentware.studio/agent/claim"
    },
    "events_supported": [
      "https://schemas.openid.net/secevent/oauth/event-type/token-revoked"
    ]
  }
}
```

## 3. Supported Registration Methods

### 3.1 Anonymous Access

| Property | Value |
|---|---|
| Identity Type | `anonymous` |
| Supported Credentials | `none`, `bearer_token` |
| Registration Required | No |
| Public Read Access | Allowed without authentication |

Public pages and Markdown documentation do not require an active authentication token.

Agents may access all public routes directly without invoking `POST /agent/auth`.

## 4. Credential Usage

### 4.1 Public Routes

No `Authorization` header is required for standard `GET` requests to publicly accessible pages and documentation.

### 4.2 Authenticated / Registered Requests

When using a provisioned credential, agents must include the access token in the HTTP `Authorization` request header using the Bearer authentication scheme.

```http
Authorization: Bearer <agent_access_token>
```

**Supported bearer method:**

```json
{
  "bearer_methods_supported": ["header"]
}
```

## 5. Rate Limits

Requests are subject to standard fair-use policies enforced at the Cloudflare edge.

Agents should respect rate limits and avoid excessive or abusive request patterns.

## 6. Contact

For questions regarding agent authentication, registration, or access policies:

**Email:** dev@agentware.studio
