#!/bin/bash

# Script de pré-commit para garantir qualidade do código

echo "🔍 Executando verificações de pré-commit..."

# Verificar tipos TypeScript
echo "📝 Verificando tipos TypeScript..."
if ! pnpm run type:check; then
    echo "❌ Erro na verificação de tipos!"
    exit 1
fi

# Executar linter
echo "🔧 Executando linter..."
if ! pnpm run lint; then
    echo "❌ Erro no linter!"
    echo "💡 Tente executar 'pnpm run lint:fix' para corrigir automaticamente"
    exit 1
fi

# Executar testes
echo "🧪 Executando testes..."
if ! pnpm run test; then
    echo "❌ Testes falharam!"
    exit 1
fi

# Build
echo "🔨 Fazendo build..."
if ! pnpm run build; then
    echo "❌ Build falhou!"
    exit 1
fi

echo "✅ Todas as verificações passaram!"
echo "🎉 Pronto para commit!"