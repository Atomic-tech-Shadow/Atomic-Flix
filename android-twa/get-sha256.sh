#!/bin/bash
# Script pour obtenir l'empreinte SHA256 d'un APK

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <path-to-apk>"
    exit 1
fi

APK_PATH="$1"

echo "🔍 Extraction de l'empreinte SHA256 de l'APK..."

# Extraire le certificat
unzip -p "$APK_PATH" META-INF/*.RSA | keytool -printcert -inform DER | grep "SHA256:" | cut -d' ' -f3

echo "📋 Copiez cette empreinte dans assetlinks.json"
