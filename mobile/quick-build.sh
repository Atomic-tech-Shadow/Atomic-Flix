#!/bin/bash

echo "🚀 ATOMIC FLIX - Build rapide Android"
echo "======================================"

# Vérifier si on est dans le bon dossier
if [ ! -f "app.json" ]; then
    echo "❌ Erreur: Exécutez ce script depuis le dossier mobile/"
    exit 1
fi

echo "📱 Méthode 1: Build local (recommandé)"
echo "npx eas build --platform android --profile preview --local"
echo ""

echo "⚡ Méthode 2: Build cloud sans GitHub"
echo "npx eas build --platform android --profile development --non-interactive"
echo ""

echo "🔄 Méthode 3: Nouveau build cloud"
echo "npx eas build --platform android --profile preview --clear-cache --non-interactive"
echo ""

echo "Choisissez une méthode (1, 2, ou 3):"
read -r choice

case $choice in
    1)
        echo "🔨 Lancement du build local..."
        npx eas build --platform android --profile preview --local
        ;;
    2)
        echo "☁️ Lancement du build cloud development..."
        npx eas build --platform android --profile development --non-interactive
        ;;
    3)
        echo "🔄 Nouveau build cloud avec cache nettoyé..."
        npx eas build --platform android --profile preview --clear-cache --non-interactive
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac