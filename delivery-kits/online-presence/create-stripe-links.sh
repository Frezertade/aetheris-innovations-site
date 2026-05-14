#!/bin/bash
# Create Stripe Payment Links for Online Presence setup fees
# Run this after: stripe login

set -e

echo "Creating Stripe Payment Links for Online Presence..."
echo "Make sure you're logged in: stripe login"
echo ""

# Starter Presence - $499 setup
STARTER=$(stripe payment_links create \
  --line-items[0][price_data][currency]=usd \
  --line-items[0][price_data][product_data][name]="Starter Presence Setup" \
  --line-items[0][price_data][product_data][description]="1-page website, GBP optimization, basic SEO" \
  --line-items[0][price_data][unit_amount]=49900 \
  --line-items[0][quantity]=1 \
  --after_completion[type]=redirect \
  --after_completion[redirect][url]="https://www.aetherisinnovations.com/thank-you.html" \
  -o json | jq -r '.url')

echo "Starter ($499): $STARTER"

# Growth Presence - $1,500 setup
GROWTH=$(stripe payment_links create \
  --line-items[0][price_data][currency]=usd \
  --line-items[0][price_data][product_data][name]="Growth Presence Setup" \
  --line-items[0][price_data][product_data][description]="5-page website, Aetheris Chat, lead routing, local SEO" \
  --line-items[0][price_data][unit_amount]=150000 \
  --line-items[0][quantity]=1 \
  --after_completion[type]=redirect \
  --after_completion[redirect][url]="https://www.aetherisinnovations.com/thank-you.html" \
  -o json | jq -r '.url')

echo "Growth ($1,500): $GROWTH"

# Authority Presence - $3,500 setup
AUTHORITY=$(stripe payment_links create \
  --line-items[0][price_data][currency]=usd \
  --line-items[0][price_data][product_data][name]="Authority Presence Setup" \
  --line-items[0][price_data][product_data][description]="Full website, chat + voice, CRM, Slack, ad tracking" \
  --line-items[0][price_data][unit_amount]=350000 \
  --line-items[0][quantity]=1 \
  --after_completion[type]=redirect \
  --after_completion[redirect][url]="https://www.aetherisinnovations.com/thank-you.html" \
  -o json | jq -r '.url')

echo "Authority ($3,500): $AUTHORITY"

echo ""
echo "=== SAVE THESE LINKS ==="
echo "Starter:   $STARTER"
echo "Growth:    $GROWTH"
echo "Authority: $AUTHORITY"
