# Solution payante — Les Soeurs Finds

Site officiel : **https://www.lessoeurs-finds.com**  
*(Les domaines ne distinguent pas les majuscules : `lesSoeurs-finds.com` = `lessoeurs-finds.com`)*

Objectifs :
- ✅ Toutes vos modifications **enregistrées pour toujours** (produits, commandes, photos)
- ✅ Site **visible sur Google** avec votre vrai nom de domaine
- ✅ Site **toujours en ligne** (pas de mise en veille)

---

## Coût mensuel estimé

| Service | Prix | Rôle |
|---------|------|------|
| **Nom de domaine** `lessoeurs-finds.com` | ~15 $ / an | Votre adresse web officielle |
| **Render Starter** | 7 $ US / mois | Hébergement toujours actif |
| **Disque Render 1 Go** | ~0,25 $ US / mois | Base de données + photos permanentes |
| **Google Search Console** | Gratuit | Référencement Google |
| **Total** | **~8 $ US / mois** + domaine | |

---

## ÉTAPE 1 — Acheter le domaine

1. Allez sur [Namecheap](https://www.namecheap.com) ou [GoDaddy](https://www.godaddy.com)
2. Recherchez : **`lessoeurs-finds.com`**
   - Si indisponible, essayez : `les-soeurs-finds.com` ou `lessoeursfinds.com`
3. Achetez le domaine (~15 $ / an)
4. Activez la **protection WHOIS** (souvent gratuite)

> **Courriel professionnel (optionnel)** : avec Namecheap/GoDaddy vous pouvez ajouter  
> `contact@lessoeurs-finds.com` (~1–5 $ / mois). Ce n'est pas obligatoire pour le site.

---

## ÉTAPE 2 — Passer Render en plan payant + disque permanent

C'est la clé pour **ne plus jamais perdre vos modifications**.

### 2a. Passer au plan Starter

1. [render.com](https://render.com) → service **soeurs-finds**
2. **Settings** → **Instance Type**
3. Choisissez **Starter** (7 $ / mois)
4. Confirmez le paiement (carte de crédit)

### 2b. Ajouter un disque permanent

1. **Settings** → **Disks** → **Add Disk**
2. Configurez :
   - **Name** : `soeurs-finds-data`
   - **Mount Path** : `/var/data`
   - **Size** : 1 Go
3. **Save**

### 2c. Variables d'environnement

**Environment** → **Edit** :

| Variable | Valeur |
|----------|--------|
| `SITE_URL` | `https://www.lessoeurs-finds.com` |
| `SOEURS_FINDS_DATA` | `/var/data` |
| `ADMIN_PASSWORD` | `RaniaKamikaze` *(ou votre mot de passe)* |

Supprimez les variables Supabase si vous les aviez ajoutées (plus nécessaires avec le disque).

**Save Changes** → Render redéploie.

### 2d. Déployer le code

```powershell
cd "c:\Users\Rayen Somai\OneDrive\Desktop\soeurs-finds-"
git add .
git commit -m "Plan payant Render + domaine lessoeurs-finds.com"
git push
```

### 2e. Vérifier la sauvegarde

1. Allez sur `https://soeurs-finds.onrender.com/admin`
2. Bandeau vert : **« Sauvegarde automatique activée »**
3. Ajoutez un produit → attendez 1 h → le produit est toujours là ✅
4. Les **photos uploadées** depuis l'admin sont aussi conservées ✅

---

## ÉTAPE 3 — Connecter www.lessoeurs-finds.com

### 3a. Sur Render

1. **Settings** → **Custom Domains**
2. **Add Custom Domain** → `www.lessoeurs-finds.com`
3. **Add Custom Domain** → `lessoeurs-finds.com` *(sans www)*
4. Render affiche les enregistrements DNS — gardez cette page ouverte

### 3b. Chez votre registrar (Namecheap, GoDaddy…)

Allez dans **DNS** / **Gestion DNS** :

| Type | Nom | Valeur |
|------|-----|--------|
| **CNAME** | `www` | `soeurs-finds.onrender.com` |
| **A** | `@` | IP indiquée par Render *(ex. 216.24.57.1)* |

⏳ Propagation : 15 min à 48 h.

### 3c. HTTPS

Render active le **cadenas HTTPS** automatiquement.  
Attendez **Verified** ✅ à côté de chaque domaine dans Render.

### 3d. Redirection (recommandé)

Dans Render **Custom Domains** : activez **Redirect** pour que  
`lessoeurs-finds.com` → redirige vers `https://www.lessoeurs-finds.com`

---

## ÉTAPE 4 — Google (Search Console)

### 4a. Ajouter le site

1. [Google Search Console](https://search.google.com/search-console)
2. **Ajouter une propriété** → **Préfixe d'URL**
3. Entrez : `https://www.lessoeurs-finds.com`
4. Validez (fichier HTML ou balise meta — voir GOOGLE.md)

> Ajoutez aussi `https://lessoeurs-finds.com` si vous utilisez les deux.

### 4b. Soumettre le sitemap

Menu **Sitemaps** → entrez :
```
sitemap.xml
```
→ **Envoyer**

### 4c. Demander l'indexation

**Inspection de l'URL** → `https://www.lessoeurs-finds.com` → **Demander une indexation**

### 4d. Facebook

Sur votre [page Facebook](https://www.facebook.com/profile.php?id=61560521294412) :
- Site web : `https://www.lessoeurs-finds.com`
- Publiez un post avec le lien

### 4e. Vérifier (après 1–2 semaines)

Dans Google, tapez :
```
site:www.lessoeurs-finds.com
```
ou
```
Les Soeurs Finds
```

---

## Résultat final

Quand tout est configuré :

| Élément | Résultat |
|---------|----------|
| **Adresse web** | https://www.lessoeurs-finds.com |
| **Modifications admin** | Enregistrées à vie (disque Render) |
| **Photos uploadées** | Conservées |
| **Google** | Site indexé avec logo, titre, description |
| **Disponibilité** | 24h/24, pas de mise en veille |

---

## Checklist

```
□ Domaine lessoeurs-finds.com acheté
□ Render → plan Starter (7 $/mois)
□ Render → Disque 1 Go monté sur /var/data
□ SOEURS_FINDS_DATA=/var/data sur Render
□ SITE_URL=https://www.lessoeurs-finds.com
□ git push
□ Custom Domains ajoutés sur Render
□ DNS configuré chez le registrar
□ HTTPS Verified sur Render
□ Google Search Console → propriété ajoutée
□ sitemap.xml soumis
□ Indexation demandée
□ Lien sur Facebook
```

---

## Support

Si une étape bloque, dites-moi où vous en êtes (domaine acheté ? Render Starter ? DNS ?) et je vous guide pas à pas.
