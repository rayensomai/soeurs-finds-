# Connecter https://soeurs-finder.com

Guide pour que votre boutique s'ouvre sur **https://soeurs-finder.com** dans n'importe quel navigateur.

---

## Étape 1 — Acheter le nom de domaine

Si vous ne l'avez pas encore, achetez **soeurs-finder.com** sur :

- [Namecheap](https://www.namecheap.com)
- [GoDaddy](https://www.godaddy.com)
- [Google Domains / Squarespace](https://domains.google)
- [Hostinger](https://www.hostinger.com)

Coût : environ **15 $ / an**.

---

## Étape 2 — Ajouter le domaine sur Render

1. Allez sur [render.com](https://render.com) → votre service **soeurs-finds**
2. Menu **Settings** → section **Custom Domains**
3. Cliquez **Add Custom Domain**
4. Entrez : `soeurs-finder.com`
5. Ajoutez aussi : `www.soeurs-finder.com` (recommandé)
6. Render affiche les **enregistrements DNS** à configurer — gardez cette page ouverte

---

## Étape 3 — Configurer le DNS (chez votre registrar)

Connectez-vous là où vous avez acheté le domaine (Namecheap, GoDaddy, etc.) → **DNS** / **Gestion DNS**.

### Pour `www.soeurs-finder.com`

| Type  | Nom | Valeur |
|-------|-----|--------|
| **CNAME** | `www` | `soeurs-finds.onrender.com` |

*(Remplacez par l'adresse exacte indiquée par Render)*

### Pour `soeurs-finder.com` (sans www)

Render propose en général :

| Type | Nom | Valeur |
|------|-----|--------|
| **A** | `@` | IP fournie par Render (ex. `216.24.57.1`) |

**OU** un enregistrement **ALIAS** / **ANAME** vers `soeurs-finds.onrender.com` si votre registrar le permet.

⏳ La propagation DNS peut prendre **15 minutes à 48 heures**.

---

## Étape 4 — Variable d'environnement sur Render

1. Render → votre service → **Environment**
2. Ajoutez :

| Key | Value |
|-----|-------|
| `SITE_URL` | `https://soeurs-finder.com` |

3. **Save Changes** (redéploiement automatique)

---

## Étape 5 — HTTPS (cadenas vert)

Render active **HTTPS automatiquement** (Let's Encrypt) une fois le DNS validé.

Vous n'avez rien à installer. Attendez que Render affiche **Verified** à côté du domaine.

---

## Étape 6 — Rediriger www → sans www (optionnel)

Dans Render **Custom Domains**, activez **Redirect www to apex** (ou l'inverse selon votre préférence).

Recommandation : **`https://soeurs-finder.com`** comme adresse principale.

---

## Vérification

Quand c'est prêt, testez dans Chrome, Firefox, Safari, téléphone :

- https://soeurs-finder.com
- https://soeurs-finder.com/admin
- https://www.soeurs-finder.com (doit rediriger)

---

## Google Search Console

1. [search.google.com/search-console](https://search.google.com/search-console)
2. Ajoutez la propriété **`https://soeurs-finder.com`**
3. Sitemap : **`https://soeurs-finder.com/sitemap.xml`**

---

## Résumé

```
1. Acheter soeurs-finder.com
2. Render → Settings → Custom Domains → ajouter le domaine
3. Copier les DNS chez votre registrar
4. Render → Environment → SITE_URL = https://soeurs-finder.com
5. Attendre Verified + HTTPS
```

Votre site sera accessible partout avec **https://soeurs-finder.com** 🔒
