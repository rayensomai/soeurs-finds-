# Guide complet — Google + sauvegarde permanente

Deux objectifs pour **Soeurs Finds** :
1. **Apparaître sur Google** quand quelqu'un cherche votre boutique
2. **Garder toutes vos modifications** (produits, commandes) pour toujours

---

## PARTIE A — Sauvegarder vos modifications (priorité)

> Sans cette étape, vos produits **disparaissent** quand Render redémarre.

### 1. Créer Supabase (gratuit)
1. [supabase.com](https://supabase.com) → compte gratuit
2. **New project** → nom : `soeurs-finds`
3. **Storage** → **New bucket** → nom : `soeurs-finds` (privé)

### 2. Copier les clés
**Settings → API** :
- **Project URL** → ex. `https://xxxxx.supabase.co`
- **service_role** (clé secrète) → copier

### 3. Ajouter sur Render
Render → **Environment** → **Edit** :

| Variable | Valeur |
|----------|--------|
| `SUPABASE_URL` | votre Project URL |
| `SUPABASE_SERVICE_KEY` | clé service_role |
| `SUPABASE_BUCKET` | `soeurs-finds` |
| `SITE_URL` | `https://soeurs-finds.onrender.com` |

**Save Changes**

### 4. Déployer le code
```powershell
git add .
git commit -m "Sauvegarde cloud + Google SEO"
git push
```

### 5. Vérifier
1. Allez sur `/admin` → vous devez voir : **« Sauvegarde automatique activée »** (bandeau vert)
2. Ajoutez un produit → fermez le site → revenez demain → le produit est toujours là ✅

---

## PARTIE B — Apparaître sur Google

### Déjà fait ✅
- Site validé dans Google Search Console
- Fichier de vérification Google
- Balises SEO (titre, description, logo)
- Sitemap automatique

### À faire maintenant

#### 1. Corriger le sitemap
Render → `SITE_URL` = `https://soeurs-finds.onrender.com`  
*(pas soeurs-finder.com tant que le domaine n'est pas connecté)*

Search Console → **Sitemaps** → renvoyer `sitemap.xml`

#### 2. Demander l'indexation
Search Console → **Inspection de l'URL** :
```
https://soeurs-finds.onrender.com
```
→ **Demander une indexation**

#### 3. Partager sur Facebook
Mettez le lien sur votre [page Facebook](https://www.facebook.com/profile.php?id=61560521294412) → Google découvre plus vite.

#### 4. Vérifier dans Google (après 1–2 semaines)
Tapez :
```
site:soeurs-finds.onrender.com
```
ou
```
Soeurs Finds
```

---

## PARTIE C — Domaine soeurs-finder.com (plus tard)

Quand vous achetez le domaine :
1. Render → **Custom Domains** → ajouter `soeurs-finder.com`
2. Configurer DNS chez votre registrar
3. Changer `SITE_URL` → `https://soeurs-finder.com`
4. Ajouter le domaine dans Google Search Console

---

## Checklist rapide

```
□ Supabase créé + bucket soeurs-finds
□ 3 variables Supabase sur Render
□ SITE_URL = https://soeurs-finds.onrender.com
□ git push (code déployé)
□ Admin → bandeau vert « Sauvegarde activée »
□ Search Console → sitemap.xml renvoyé
□ Search Console → indexation demandée
□ Lien partagé sur Facebook
```

Quand tout est coché → votre site est **sur Google** et vos modifications **restent enregistrées** 🎉
