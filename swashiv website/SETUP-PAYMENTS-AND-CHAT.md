# Swashiv Fashion — Payments & AI Chat Setup

Your site now has a real shopping cart, checkout, and an AI chat assistant built in. Two things need to be switched on before they fully work — both require accounts only you can create.

---

## 1. Getting Payments Live (Razorpay)

**What you need to do:**

1. Go to razorpay.com and sign up for a free business account.
2. Complete their KYC (they'll ask for PAN, bank account details, and possibly business registration/GST depending on your setup). This is a real requirement for any payment gateway — it's how they verify money goes to a real person/business.
3. Once approved, go to **Settings → API Keys** in your Razorpay dashboard.
4. Click **Generate Key** — you'll get a **Key ID** and a **Key Secret**. Copy both somewhere safe (the secret is only shown once).

**Then, connect it to your site:**

5. Go to your Netlify dashboard → your Swashiv site → **Site settings** → **Environment variables**.
6. Click **Add a variable**. Add:
   - Key: `RAZORPAY_KEY_ID` → Value: (paste your Key ID)
7. Add another:
   - Key: `RAZORPAY_KEY_SECRET` → Value: (paste your Key Secret)
8. Save. Netlify will need to redeploy the site once for these to take effect — go to the **Deploys** tab and trigger a new deploy (or just push any small change via GitHub).

Once that's done, the "Pay ₹___" button on the checkout page will process real payments.

---

## 2. Getting the AI Chatbot Live (Anthropic API)

**What you need to do:**

1. Go to console.anthropic.com and create an account.
2. Add a payment method (billing is usage-based — for a small boutique's chat volume, this is typically a few dollars a month, not a large fixed cost).
3. Go to **API Keys**, click **Create Key**, and copy it.

**Then, connect it to your site:**

4. Same as above — Netlify → Site settings → Environment variables.
5. Add:
   - Key: `ANTHROPIC_API_KEY` → Value: (paste your key)
6. Save and redeploy.

Once that's done, the chat bubble in the bottom-right corner of every page will give real AI-powered answers about your products, sizing, and delivery.

---

## Important Notes

- **Until these are set up**, the checkout button and chat widget will show a friendly fallback message pointing customers to Instagram/WhatsApp instead of failing silently — nothing will look broken to visitors.
- **Never share your Key Secret or API Key with anyone**, or paste it directly into any file in this project — it only ever goes into Netlify's Environment Variables, which stays private to your account.
- **This site must be deployed via the GitHub-connected method** (the one set up for the CMS), not the old drag-and-drop method — drag-and-drop doesn't support the backend functions this uses.
- If you ever suspect a key has leaked, go back into Razorpay/Anthropic's dashboard and regenerate it, then update the Netlify environment variable with the new one.
