# 🌸 Soeurs Finds

Application e-commerce complète pour vendre vos produits en ligne. Les clients choisissent un produit, remplissent leurs coordonnées, et vous recevez une notification pour les rappeler.

## Catégories

- 🍳 **Cuisine**
- 🌿 **Bien-être**
- ✨ **Lumière**
- ⚽ **Sport & Divertissement**
- 💻 **Technologie**
- 🌱 **Jardinage**

## Fonctionnalités

- Interface moderne et attractive
- Navigation par catégories
- Bouton **Acheter** → formulaire (prénom, nom, téléphone)
- **Panel Admin** avec notifications en temps réel des nouvelles commandes
- **Gestion des produits** : ajouter et supprimer des articles depuis l'admin
- Bouton **Appeler** direct depuis l'admin
- Lien vers votre page [Facebook](https://www.facebook.com/profile.php?id=61560521294412)

## Démarrage rapide

### Prérequis

- [Node.js](https://nodejs.org/) version 18 ou plus

### Installation

```bash
npm install
npm run install:all
```

### Lancer l'application

```bash
npm run dev
```

- **Site client** : http://localhost:5173
- **API backend** : http://localhost:3001
- **Panel Admin** : http://localhost:5173/admin (mot de passe : `admin123`)

## Structure

```
soeurs-finds/
├── backend/          # API Express + SQLite
│   ├── server.js
│   └── database.js
├── frontend/         # React + Tailwind CSS
│   └── src/
└── package.json
```

## Admin — Recevoir les notifications

1. Allez sur `/admin`
2. Connectez-vous avec le mot de passe admin
3. Autorisez les notifications du navigateur
4. Les nouvelles commandes apparaissent avec un badge rouge et une alerte navigateur

### Changer le mot de passe admin

Modifiez `ADMIN_PASSWORD` dans `backend/.env`

## Personnalisation

- **Produits** : modifiez les données dans `backend/database.js`
- **Couleurs / design** : `frontend/tailwind.config.js`
- **Prix** : affichés en CAD (dollars canadiens, format fr-CA)

## Production

```bash
npm run build
npm start
```

Pour la production, servez le dossier `frontend/dist` via le backend ou un hébergeur (Vercel, Netlify, etc.).
