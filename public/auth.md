# agentware.studio auth.md — Public Access Policy

This document describes public access to **https://agentware.studio**.

## 1. Audience & Scope

This policy is intended for autonomous AI agents, bots, and automated clients accessing the public pages and documentation on `https://agentware.studio`.

## 2. Anonymous Access

All public pages and documentation are accessible anonymously.

| Property | Value |
|---|---|
| Access Method | Anonymous public access |
| Credentials Required | None |
| Registration Required | No |
| Public Read Access | Allowed without authentication |

## 3. Request Instructions

Access public resources directly using standard `GET` requests. No access token or `Authorization` header is required.

For example, retrieve the documentation index:

```http
GET /llms.txt HTTP/1.1
Host: agentware.studio
```

Follow the links in `https://agentware.studio/llms.txt` to find public pages and documentation.

## 4. Contact

For questions regarding public access:

**Email:** dev@agentware.studio
