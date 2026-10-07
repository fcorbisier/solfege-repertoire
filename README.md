# Répertoire de solfège

Site statique (PWA) : liste des exercices, lecteur audio (vitesse ×0,5 à ×1,25, boucle, boucle A–B), mode hors ligne.
Aucune dépendance, aucun build.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | La page et le lecteur |
| `morceaux.json` | La liste des exercices et pistes (c'est le seul fichier à éditer pour ajouter/renommer) |
| `audio/` | Les enregistrements (`.m4a`, AAC) |
| `sw.js`, `manifest.webmanifest`, `icon*` | Installation sur l'écran d'accueil + hors ligne |

## Mise en ligne privée (gratuit)

1. **GitHub** : créer un dépôt **privé** (ex. `solfege-repertoire`) et y pousser tout ce dossier.
2. **Cloudflare Pages** : Workers & Pages → Create → Pages → Connect to Git → choisir le dépôt.
   Framework : *None*, commande de build : *(vide)*, dossier de sortie : `/`.
3. **Cloudflare Access** : Zero Trust → Access → Applications → Add → *Self-hosted*.
   Domaine : celui du projet Pages (`xxx.pages.dev`). Règle *Allow* → *Emails* → ton adresse.
   Connexion par code à usage unique reçu par e-mail.
4. Ouvrir l'adresse sur le téléphone, se connecter, puis « Ajouter à l'écran d'accueil ».
   Appuyer sur **Télécharger pour hors ligne** pour garder les 43 enregistrements sur l'appareil.

Pour que les fichiers audio soient protégés aussi, l'application Access doit couvrir tout le domaine (pas seulement la page d'accueil).

## Modifier la liste

Dans `morceaux.json`, chaque exercice a une liste de `pistes` :

```json
{ "label": "Lecture", "role": "lecture", "fichier": "audio/3b.m4a", "duree": 45 }
```

- `role` : `lecture`, `variante`, `accompagnement` ou `autre`.
- `duree` en secondes (affichage uniquement ; le lecteur lit la vraie durée).
- Pour ajouter un enregistrement : déposer le `.m4a` (ou `.mp3`) dans `audio/` et ajouter une ligne.
- Les enregistrements « Enregistrement du JJ/MM à HHhMM » (section *Autres*) ont des titres provisoires : renomme-les dans le JSON (`autres.pistes[].label`) ou déplace-les dans l'exercice correspondant.

## Mises à jour hors ligne

La page et le JSON se mettent à jour dès qu'il y a du réseau. Les audio téléchargés restent en cache ; si tu remplaces un fichier audio en gardant le même nom, change son nom (ex. `3b-v2.m4a`) pour que l'appareil le retélécharge.
