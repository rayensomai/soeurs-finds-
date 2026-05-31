# Garder vos produits sur Render (gratuit)

Sur **Render gratuit**, le disque est **temporaire**. À chaque redémarrage ou inactivité, tout est effacé :
- produits ajoutés
- produits supprimés
- commandes
- photos uploadées (fichiers locaux)

C’est normal pour l’hébergement gratuit — ce n’est **pas un bug** de votre site.

---

## Solution gratuite : Supabase (5 minutes)

Supabase stocke une **sauvegarde automatique** de vos produits et commandes dans le cloud.  
À chaque modification, le site sauvegarde. Au redémarrage, il restaure tout.

> **Photos :** utilisez des **liens URL** (Unsplash, Imgur, etc.) pour les images.  
> Les photos **uploadées depuis votre PC** ne survivent pas au redémarrage Render (limitation gratuite).

---

## Étape 1 — Créer un compte Supabase (gratuit)

1. Allez sur [supabase.com](https://supabase.com) → **Start your project**
2. Créez un compte (Google ou email)
3. **New project** → choisissez un nom (ex. `soeurs-finds`) et un mot de passe
4. Attendez ~2 minutes que le projet soit prêt

---

## Étape 2 — Créer le bucket de sauvegarde

1. Menu gauche → **Storage**
2. **New bucket**
3. Nom : `soeurs-finds`
4. Cochez **Private** (privé)
5. **Create bucket**

---

## Étape 3 — Copier les clés API

1. Menu **Project Settings** (engrenage en bas à gauche)
2. **API**
3. Copiez :
   - **Project URL** → ex. `https://abcdefgh.supabase.co`
   - **service_role** (clé secrète, pas la clé `anon`) → **Reveal** puis copier

⚠️ Ne partagez jamais la clé `service_role` publiquement.

---

## Étape 4 — Ajouter sur Render

1. [render.com](https://render.com) → service **soeurs-finds**
2. **Environment** → **Edit**
3. Ajoutez ces 3 variables :

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | `https://abcdefgh.supabase.co` |
| `SUPABASE_SERVICE_KEY` | la clé `service_role` |
| `SUPABASE_BUCKET` | `soeurs-finds` |

4. **Save Changes** (Render redéploie automatiquement)

---

## Étape 5 — Vérifier

1. Allez sur [https://soeurs-finds.onrender.com/admin](https://soeurs-finds.onrender.com/admin)
2. Ajoutez ou modifiez un produit
3. Attendez 1 minute, fermez le navigateur
4. Revenez plus tard (même le lendemain) → vos modifications doivent **rester**

Dans Supabase → **Storage** → bucket `soeurs-finds` → vous devez voir `backup.json`.

---

## En local (votre PC)

La sauvegarde locale dans `%LOCALAPPDATA%\SoeursFinds\data\` fonctionne déjà sans Supabase.  
Supabase est surtout nécessaire pour **Render**.

---

## Résumé

```
Render gratuit = disque temporaire → données perdues au redémarrage
Supabase gratuit = sauvegarde cloud → données restaurées automatiquement
```

Après configuration Supabase, vos produits et commandes **ne disparaîtront plus**.
