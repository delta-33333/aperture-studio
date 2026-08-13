# Publier Aperture sur aperture.trustai.center

Stack : **Vercel** + **Supabase (Postgres)** + **Stripe**

## 1. Supabase

1. New project `aperture`
2. SQL Editor → run `supabase/schema.sql`
3. Copy URL + anon + service_role keys
4. Auth Site URL = `https://aperture.trustai.center`

## 2. Stripe products

| Produit | Prix | Env |
|---------|------|-----|
| Lab | 49€/mo | STRIPE_PRICE_LAB |
| Growth | 149€/mo | STRIPE_PRICE_GROWTH |
| Scale | 399€/mo | STRIPE_PRICE_SCALE |
| Boost S/M/L | 29/79/189€ | STRIPE_PRICE_BOOST_* |

Webhook: `https://aperture.trustai.center/api/webhook`
Events: checkout.session.completed, invoice.paid, customer.subscription.deleted

## 3. Vercel env

NEXT_PUBLIC_APP_URL=https://aperture.trustai.center
+ all Supabase + Stripe keys

## 4. Domaine

Vercel → aperture-studio → Domains → Add `aperture.trustai.center`

DNS CNAME:
```
aperture  CNAME  cname.vercel-dns.com
```
(ou valeur exacte affichée par Vercel)

## 5. Tokens

free 10 · lab 80 · growth 280 · scale 900
