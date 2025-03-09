#!/bin/sh
echo $Path
# Verifica se o FNM está instalado
if command -v fnm >/dev/null 2>&1; then
  # Carrega as variáveis de ambiente do FNM
  eval "$(fnm env)"
fi