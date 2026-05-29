# Mettre Soeurs Finds en ligne — 100 % GRATUIT

Aucun achat nécessaire. Vous obtiendrez une adresse gratuite du type :
`https://soeurs-finds.onrender.com`

---

## Étape 1 — Créer un compte GitHub (gratuit)

1. Allez sur **https://github.com**
2. Cliquez **Sign up** et créez un compte (gratuit)
3. Vérifiez votre e-mail

---

## Étape 2 — Mettre votre projet sur GitHub

1. Sur GitHub, cliquez le **+** en haut → **New repository**
2. Nom : `soeurs-finds`
3. Laissez **Public**
4. Cliquez **Create repository**

5. Sur votre PC, ouvrez un terminal dans le dossier du projet et tapez :

```bash
git init
git add .
git commit -m "Premier déploiement Soeurs Finds"
git branch -M main
git remote add origin https://github.com/VOTRE-NOM/soeurs-finds.git
git push -u origin main
```

Remplacez `VOTRE-NOM` par votre nom d'utilisateur GitHub.

> Si Git vous demande de vous connecter, suivez les instructions GitHub à l'écran.

---

## Étape 3 — Créer un compte Render (gratuit)

1. Allez sur **https://render.com**
2. Cliquez **Get Started for Free**
3. Inscrivez-vous avec votre compte **GitHub** (le plus simple)

---

## Étape 4 — Déployer le site (gratuit)

1. Dans Render, cliquez **New +** → **Blueprint**
2. Connectez votre dépôt GitHub `soeurs-finds`
3. Render détecte le fichier `render.yaml` automatiquement
4. Cliquez **Apply**

**OU** manuellement :

1. **New +** → **Web Service**
2. Connectez le dépôt `soeurs-finds`
3. Remplissez :
   - **Name** : `soeurs-finds`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
   - **Plan** : **Free**
4. Dans **Environment Variables**, ajoutez :
   - `ADMIN_PASSWORD` = un mot de passe que vous choisissez (ex. `MonAdmin2026!`)
5. Cliquez **Create Web Service**

⏳ Attendez 5 à 10 minutes. Render installe et lance votre site.

---

## Étape 5 — Votre site est en ligne !

Quand c'est terminé, Render affiche une URL comme :

**https://soeurs-finds.onrender.com**

Ouvrez-la dans votre navigateur — votre boutique est en ligne !

- **Boutique** : `https://votre-url.onrender.com`
- **Admin** : `https://votre-url.onrender.com/admin`

---

## Étape 6 — Apparaître sur Google (gratuit)

1. Allez sur **https://search.google.com/search-console**
2. Connectez-vous avec Google
3. **Ajouter une propriété** → entrez votre URL Render
4. Vérifiez la propriété (méthode **Balise HTML** ou **Fichier HTML** — Google vous guide)
5. Menu **Sitemaps** → ajoutez : `https://votre-url.onrender.com/sitemap.xml`
6. **Inspection de l'URL** → collez votre page d'accueil → **Demander une indexation**

Google peut prendre quelques jours pour afficher votre site.

---

## Partager votre lien

Copiez votre URL Render et mettez-la :
- Sur votre **page Facebook**
- Dans vos **messages** aux clients
- Dans votre **bio** Instagram / TikTok

---

## Notes importantes (gratuit)

| Point | Détail |
|-------|--------|
| **Prix** | 0 $ — tout est gratuit |
| **Premier chargement** | Peut prendre 30–60 sec si personne n'a visité le site depuis un moment (plan gratuit) |
| **Mot de passe admin** | Changez-le dans Render → Environment → `ADMIN_PASSWORD` |
| **Mises à jour** | Modifiez le code → `git push` → Render redéploie automatiquement |

---

## Besoin d'aide ?

Si une étape bloque, dites-moi où vous êtes (GitHub, Render, Google) et je vous guide.
