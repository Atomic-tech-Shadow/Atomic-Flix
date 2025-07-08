#!/bin/bash

echo "🤖 ATOMIC FLIX - Validation Termux"
echo "================================="

# Fonction de vérification
check_requirement() {
  local name="$1"
  local command="$2"
  local expected="$3"
  
  if command -v "$command" &> /dev/null; then
    local version=$($command --version 2>/dev/null | head -n 1)
    echo "✅ $name: $version"
    return 0
  else
    echo "❌ $name: Non installé"
    return 1
  fi
}

# Vérifier l'environnement Termux
echo "📱 Environnement:"
if [ -d "/data/data/com.termux" ]; then
  echo "✅ Termux détecté"
  echo "📁 Répertoire: $(pwd)"
  echo "💾 Espace disque: $(df -h . | tail -1 | awk '{print $4}') disponible"
else
  echo "❌ Pas dans Termux"
fi

echo ""
echo "🔧 Outils système:"
check_requirement "Node.js" "node" "18+"
check_requirement "npm" "npm" "9+"
check_requirement "Python" "python" "3.x"
check_requirement "Git" "git" "latest"

echo ""
echo "📦 Outils Expo:"
check_requirement "Expo CLI" "expo" "latest"
check_requirement "EAS CLI" "eas" "latest"

echo ""
echo "📋 Configuration projet:"
if [ -f "package.json" ]; then
  echo "✅ package.json trouvé"
  
  # Vérifier les dépendances clés
  if grep -q "\"expo\".*53" package.json; then
    echo "✅ Expo SDK 53 configuré"
  else
    echo "❌ Expo SDK 53 manquant"
  fi
  
  if grep -q "\"react\".*19" package.json; then
    echo "✅ React 19 configuré"
  else
    echo "❌ React 19 manquant"
  fi
else
  echo "❌ package.json manquant"
fi

if [ -f "eas.json" ]; then
  echo "✅ eas.json configuré"
  
  if grep -q "\"buildType\".*\"apk\"" eas.json; then
    echo "✅ Build APK configuré"
  else
    echo "❌ Build APK non configuré"
  fi
else
  echo "❌ eas.json manquant"
fi

if [ -f "app.json" ]; then
  echo "✅ app.json trouvé"
else
  echo "❌ app.json manquant"
fi

echo ""
echo "🔑 Authentification:"
if expo whoami &> /dev/null; then
  local user=$(expo whoami 2>/dev/null)
  echo "✅ Connecté à Expo: $user"
else
  echo "❌ Non connecté à Expo (expo login requis)"
fi

echo ""
echo "🌐 Connectivité:"
if ping -c 1 expo.dev &> /dev/null; then
  echo "✅ Connexion Expo.dev OK"
else
  echo "❌ Connexion Expo.dev échouée"
fi

echo ""
echo "📊 Résumé de la validation:"
if [ -f "package.json" ] && [ -f "eas.json" ] && [ -f "app.json" ]; then
  if command -v expo &> /dev/null && command -v eas &> /dev/null; then
    if expo whoami &> /dev/null; then
      echo "🎉 Configuration Termux COMPLÈTE!"
      echo "🚀 Prêt pour: ./termux-build-apk.sh"
    else
      echo "⚠️  Presque prêt - login Expo requis: expo login"
    fi
  else
    echo "⚠️  CLI Expo manquants - exécutez: ./termux-setup.sh"
  fi
else
  echo "❌ Configuration incomplète"
fi

echo ""
echo "💡 Commandes utiles Termux:"
echo "   termux-wake-lock     # Éviter interruptions"
echo "   termux-wake-unlock   # Libérer verrou"
echo "   df -h               # Vérifier espace disque"
echo "   npm cache clean --force  # Nettoyer cache"