---
name: Domain roles
description: Which domain is the main app vs shortener, and VPS IP
type: feature
---
- **sleepox.com** → primary app domain (dashboard, login, app UI). Nginx server_name on `sleepox` site.
- **breezysocial.com** → shortener domain (only `/r/<code>` short links for FB campaigns). Aged domain (2013+), Spamhaus/SURBL clean, drop-catch re-reg 2024-11.
- **VPS IP:** `75.119.144.171`
- All shortener domains must be added to `shortener_domains` table (verified=true, is_active=true, is_primary=true for the active one) and to the nginx `sleepox` site `server_name` list with certbot SSL.
