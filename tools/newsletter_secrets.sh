#!/usr/bin/env bash
# Uploads the newsletter's four secrets (README "Newsletter") to the production Worker and to the Workers Preview base
# config. Run it in your own terminal: the keys stay in ~/.config/agentware/ and never enter the repository.
#
#   bash tools/newsletter_secrets.sh                      # production Worker + Preview base config
#   bash tools/newsletter_secrets.sh --preview <name>     # one existing Preview (e.g. feat-newsletter-start)
#
# The base config only seeds Previews created after it is set; a Preview that already existed keeps its own (empty)
# secrets across deployments and needs --preview with its name (the branch name).
# Reads RESEND_API_KEY from resend.env. On the first run it asks for the Turnstile secret key and writes newsletter.env
# (mode 600) with random NEWSLETTER_SECRET and NEWSLETTER_API_TOKEN values; previews get their own pair, so a
# confirmation link or API token from a preview does not work in production. Running it again re-uploads the same values.
# NEWSLETTER_API_TOKEN in newsletter.env is the token for the publishing system.
# Wrangler needs to be logged in (`npx wrangler login`), or a Cloudflare API token with Workers Scripts: Edit saved as
# CLOUDFLARE_API_TOKEN=… (and CLOUDFLARE_ACCOUNT_ID=…) in cloudflare.env.
set -euo pipefail
dir="$HOME/.config/agentware"
umask 077
# shellcheck source=/dev/null
. "$dir/resend.env"
if [ -f "$dir/cloudflare.env" ]; then
  set -a
  # shellcheck source=/dev/null
  . "$dir/cloudflare.env"
  set +a
fi
file="$dir/newsletter.env"
if [ ! -f "$file" ]; then
  read -rsp 'Turnstile secret key (Cloudflare > Turnstile > widget > Settings): ' turnstile; echo
  [ -n "$turnstile" ] || { echo 'empty secret' >&2; exit 1; }
  {
    echo "TURNSTILE_SECRET=$turnstile"
    echo "NEWSLETTER_SECRET=$(openssl rand -hex 32)"
    echo "NEWSLETTER_API_TOKEN=$(openssl rand -hex 32)"
    echo "PREVIEW_NEWSLETTER_SECRET=$(openssl rand -hex 32)"
    echo "PREVIEW_NEWSLETTER_API_TOKEN=$(openssl rand -hex 32)"
  } > "$file"
  echo "wrote $file"
fi
# shellcheck source=/dev/null
. "$file"
export RESEND_API_KEY TURNSTILE_SECRET NEWSLETTER_SECRET NEWSLETTER_API_TOKEN PREVIEW_NEWSLETTER_SECRET PREVIEW_NEWSLETTER_API_TOKEN

# The secrets as JSON on stdout (never in argv); $1 is the prefix of the environment's own pair ('' or PREVIEW_).
secrets() {
  node -e '
    const e = process.env, p = process.argv[1];
    const s = { RESEND_API_KEY: e.RESEND_API_KEY, TURNSTILE_SECRET: e.TURNSTILE_SECRET,
      NEWSLETTER_SECRET: e[p + "NEWSLETTER_SECRET"], NEWSLETTER_API_TOKEN: e[p + "NEWSLETTER_API_TOKEN"] };
    for (const [k, v] of Object.entries(s)) if (!v) { console.error(k + " is empty"); process.exit(1); }
    process.stdout.write(JSON.stringify(s));' "$1"
}

if [ "${1:-}" = --preview ]; then
  [ -n "${2:-}" ] || { echo 'usage: --preview <name>' >&2; exit 1; }
  echo "== Workers Preview $2"
  secrets PREVIEW_ | npx wrangler preview secret bulk --name "$2"
  exit
fi
echo '== production Worker'
secrets '' | npx wrangler secret bulk
echo '== Workers Preview base config'
secrets PREVIEW_ | npx wrangler preview base-config secret bulk
