# ATOMIC FLIX - Palette de Couleurs Cohérente

## Couleurs Primaires

### Cyan (Couleur principale)
- **Hex**: `#00F0FF` - Cyan électrique
- **HSL**: `hsl(188, 100%, 50%)`
- **Usage**: Logo, texte principal, boutons primaires, éléments interactifs

### Magenta/Violet (Couleur secondaire)
- **Hex**: `#A855F7` - Violet moderne
- **HSL**: `hsl(316, 100%, 49%)`
- **Usage**: Gradients, accents, éléments décoratifs

## Couleurs de Fond

### Fond Principal
- **Hex**: `#0A0A1A` - Noir profond
- **HSL**: `hsl(240, 43%, 5%)`
- **Usage**: Arrière-plan principal de l'application

### Fond Secondaire
- **Hex**: `#1A1A2E` - Gris foncé
- **HSL**: `hsl(240, 3.7%, 15.9%)`
- **Usage**: Cartes, modales, éléments superposés

## Gradients

### Gradient Principal
- **CSS**: `linear-gradient(90deg, #00F0FF, #A855F7)`
- **Usage**: Barres de progression, éléments décoratifs

### Gradient Texte
- **CSS**: `bg-gradient-to-r from-cyan-400 to-purple-500`
- **Usage**: Titres, texte de marque "ATOMIC FLIX"

## Classes CSS Utilitaires

### Texte
- `.atomic-primary` - Texte cyan
- `.atomic-secondary` - Texte violet
- `.atomic-gradient-text` - Texte avec gradient cyan vers violet

### Arrière-plan
- `.atomic-bg-primary` - Fond cyan
- `.atomic-bg-secondary` - Fond violet
- `.atomic-bg-gradient` - Fond avec gradient cyan vers violet

### Bordures
- `.atomic-border-primary` - Bordure cyan transparente
- `.atomic-border-glow` - Bordure cyan avec effet de glow

### Animations
- `.atomic-hover-glow` - Effet de glow au survol
- `.atomic-glow-animation` - Animation de glow continue

## Cohérence des Couleurs

### Remplacements Effectués
- Tous les `blue-600` remplacés par `purple-600`
- Tous les `blue-500` remplacés par `purple-500`
- Système de notifications harmonisé avec cyan pour l'état actif
- Animations et effets utilisent les couleurs cohérentes

### Variables CSS
- `--primary: hsl(188, 100%, 50%)` - Cyan pour les thèmes light et dark
- `--atomic-cyan: hsl(188, 100%, 50%)` - Cyan atomique
- `--atomic-purple: hsl(316, 100%, 49%)` - Violet atomique
- `--atomic-gradient-start: hsl(188, 100%, 50%)` - Début du gradient
- `--atomic-gradient-end: hsl(316, 100%, 49%)` - Fin du gradient

## Maintenance

Pour maintenir la cohérence des couleurs :
1. Toujours utiliser les classes utilitaires `.atomic-*`
2. Éviter les couleurs codées en dur
3. Utiliser les variables CSS pour les couleurs personnalisées
4. Tester sur tous les appareils, y compris iPhone
5. Vérifier la cohérence dans les états hover, focus, et active