# Apparaître sur Google — Guide complet

Suivez ces étapes pour que **Soeurs Finds** apparaisse sur Google **comme n'importe quel site professionnel** : logo, nom, adresse web, titre cliquable et description.

> Utilisez l'URL de votre site en ligne :
> - **https://soeurs-finder.com** (si le domaine est connecté)
> - **OU** **https://soeurs-finds.onrender.com** (en attendant)

---

## À quoi ressemblera votre résultat Google

Quand quelqu'un cherche « Soeurs Finds » ou « boutique en ligne Canada », Google affiche :

| Élément | Exemple pour votre site | Déjà configuré ? |
|---------|-------------------------|------------------|
| **Logo (favicon)** | Votre logo Soeurs Finds | ✅ Oui (`/logo.png`) |
| **Nom du site** | Soeurs Finds | ✅ Oui |
| **Adresse web** | https://soeurs-finder.com | ⏳ Après connexion du domaine |
| **Titre (lien bleu/violet)** | Soeurs Finds — Boutique en ligne Canada \| Vos trouvailles, notre passion | ✅ Oui |
| **Description (2 lignes grises)** | Boutique en ligne au Canada. Cuisine, bien-être, lumière… | ✅ Oui |

> Google choisit parfois un autre extrait de texte. Les balises `title` et `description` du site guident ce qu'il affiche.

---

## Étape 1 — Vérifier que le site est en ligne

Ouvrez votre site dans le navigateur. La page d'accueil doit s'afficher sans erreur.

Testez aussi :
- `https://VOTRE-SITE/sitemap.xml` → doit afficher une liste de pages
- `https://VOTRE-SITE/robots.txt` → doit afficher « Allow: / »

---

## Étape 2 — Google Search Console (obligatoire)

1. Allez sur **[Google Search Console](https://search.google.com/search-console)**
2. Connectez-vous avec votre compte Google
3. Cliquez **Ajouter une propriété**
4. Choisissez **Préfixe d'URL** et entrez :
   ```
   https://soeurs-finder.com
   ```
   *(ou votre URL Render si le domaine n'est pas encore prêt)*

### Vérifier que le site vous appartient

Google propose plusieurs méthodes. La plus simple :

**Balise HTML :**
1. Google vous donne une balise `<meta name="google-site-verification" content="..." />`
2. Copiez le code `content="..."`
3. Ajoutez-le dans Render → **Environment** :
   ```
   GOOGLE_SITE_VERIFICATION = le-code-copié
   ```
4. *(Ou contactez-moi pour l'ajouter au site)*
5. Cliquez **Vérifier** dans Google Search Console

---

## Étape 3 — Soumettre le sitemap

1. Dans Search Console, menu **Sitemaps** (à gauche)
2. Dans « Ajouter un sitemap », entrez :
   ```
   sitemap.xml
   ```
3. Cliquez **Envoyer**

Google va parcourir toutes vos pages (accueil + catégories).

---

## Étape 4 — Demander l'indexation

1. Menu **Inspection de l'URL**
2. Collez : `https://soeurs-finder.com`
3. Cliquez **Demander une indexation**
4. Répétez pour les pages importantes :
   - `/categorie/cuisine`
   - `/categorie/bien-etre`
   - `/categorie/technologie`
   - etc.

---

## Étape 5 — Lier votre page Facebook

Sur votre page [Facebook](https://www.facebook.com/profile.php?id=61560521294412) :

1. Mettez le lien de votre site dans la section **Site web**
2. Publiez un post avec le lien de la boutique

Google découvre plus vite les sites partagés sur les réseaux sociaux.

---

## Étape 6 — Patience

| Délai | Ce qui se passe |
|-------|-----------------|
| 1–3 jours | Google commence à explorer votre site |
| 1–2 semaines | Votre site peut apparaître en cherchant « Soeurs Finds » |
| 1–3 mois | Meilleur référencement si vous ajoutez des produits régulièrement |

---

## Conseils pour mieux ranker sur Google

1. **Ajoutez des produits** avec de bons noms et descriptions (via Admin)
2. **Utilisez des mots-clés** dans les titres : ex. « Robot cuisine », « Lampe design »
3. **Gardez le site actif** — ajoutez des produits régulièrement
4. **Partagez le lien** sur Facebook, WhatsApp, Instagram
5. **Ne supprimez pas** l'URL du site une fois indexée

---

## Vérifier si Google vous a indexé

Tapez dans Google :
```
site:soeurs-finder.com
```
*(ou `site:soeurs-finds.onrender.com`)*

Si des pages apparaissent → **vous êtes sur Google** ✅

---

## Résumé rapide

```
1. Site en ligne ✓
2. Google Search Console → ajouter le site
3. Vérifier la propriété
4. Soumettre sitemap.xml
5. Demander l'indexation
6. Partager sur Facebook
7. Attendre quelques jours
```
