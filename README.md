# Répertoire de solfège

Site statique (PWA) : liste des exercices, lecteur audio avec le choix entre l'**enregistrement d'origine** et la version à **deux pistes (piano / voix) avec un volume réglable pour chacune**, vitesse ×0,5 à ×1,25, boucle, boucle A–B, mode hors ligne.
Aucune dépendance, aucun build.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | La page et le lecteur |
| `morceaux.json` | La liste des exercices et pistes (c'est le seul fichier à éditer pour ajouter/renommer) |
| `audio/audio_*.m4a` | Les enregistrements, dans le dossier `audio/`, **tous préfixés `audio_`** : `audio_xxx.m4a` (original, sans perte) + `audio_xxx.piano.m4a` et `audio_xxx.voix.m4a` (séparés par IA, mono AAC 96 kbps) |
| `sw.js`, `manifest.webmanifest`, `icon*` | Installation sur l'écran d'accueil + hors ligne |

## Mise en ligne privée (gratuit)

1. **GitHub** : créer un dépôt **privé** (ex. `solfege-repertoire`) et y pousser tout ce dossier.
2. **Cloudflare Pages** : Workers & Pages → Create → Pages → Connect to Git → choisir le dépôt.
   Framework : *None*, commande de build : *(vide)*, dossier de sortie : `/`.
3. **Cloudflare Access** : Zero Trust → Access → Applications → Add → *Self-hosted*.
   Domaine : celui du projet Pages (`xxx.pages.dev`). Règle *Allow* → *Emails* → ton adresse.
   Connexion par code à usage unique reçu par e-mail.
4. Ouvrir l'adresse sur le téléphone, se connecter, puis « Ajouter à l'écran d'accueil ».
   Appuyer sur **Télécharger pour hors ligne** pour garder les enregistrements (piano + voix) sur l'appareil, environ 105 Mo (original + piano + voix).

Pour que les fichiers audio soient protégés aussi, l'application Access doit couvrir tout le domaine (pas seulement la page d'accueil).

## Modifier la liste

Dans `morceaux.json`, chaque exercice a une liste de `pistes` :

```json
{ "label": "Lecture", "role": "lecture", "original": "audio/audio_3b.m4a", "piano": "audio/audio_3b.piano.m4a", "voix": "audio/audio_3b.voix.m4a", "duree": 45 }
```

- `role` : `lecture`, `variante`, `accompagnement` ou `autre`.
- `duree` en secondes (affichage uniquement ; le lecteur lit la vraie durée).
- Pour ajouter un enregistrement : déposer le(s) fichier(s) dans `audio/`, avec le préfixe `audio_` (le service worker s'en sert pour reconnaître les fichiers audio), et ajouter une ligne. `original` et `voix` sont facultatifs : sans `voix`, le lecteur masque le choix Original / Piano + voix et le curseur de voix, et ne joue que `piano` (utile pour un enregistrement déjà sans voix).
- Les curseurs vont de 0 à 150 % (piano 100 %, voix 40 % au départ). Le réglage est mémorisé sur l'appareil.
- Les enregistrements « Enregistrement du JJ/MM à HHhMM » (section *Autres*) ont des titres provisoires : renomme-les dans le JSON (`autres.pistes[].label`) ou déplace-les dans l'exercice correspondant.

## Mises à jour hors ligne

La page et le JSON se mettent à jour dès qu'il y a du réseau. Les audio téléchargés restent en cache ; si tu remplaces un fichier audio en gardant le même nom, change son nom (ex. `3b-v2.piano.m4a`) pour que l'appareil le retélécharge.
