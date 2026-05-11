#!/bin/bash

# 🤖 Script de ejecución rápida para Ansible Playbook
# Este script facilita la ejecución del playbook con opciones comunes

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
INVENTORY="$SCRIPT_DIR/hosts"
PLAYBOOK="$SCRIPT_DIR/playbook.yml"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar help
show_help() {
    cat << EOF
${BLUE}🤖 Ansible Playbook Execution Script${NC}

Uso: ./run.sh [OPCIONES]

Opciones:
    -h, --help              Mostrar esta ayuda
    -c, --check             Ejecutar en modo dry-run (sin hacer cambios)
    -v, --verbose           Modo verbose (más detalles)
    -vv                     Modo muy verbose (aún más detalles)
    -p, --ping              Solo verificar conectividad SSH
    -s, --syntax            Verificar sintaxis del playbook
    -d, --debug             Modo debug (máximo detalle)
    -e, --extra-vars        Pasar variables extra (ej: -e "app_port=8080")

Ejemplos:
    ./run.sh                      # Ejecución normal
    ./run.sh --check              # Verificar sin aplicar cambios
    ./run.sh --verbose            # Con más detalles
    ./run.sh --ping               # Verificar conectividad
    ./run.sh -e "app_port=8080"   # Con variable personalizada

EOF
}

# Función para verificar que existe el inventario
check_inventory() {
    if [ ! -f "$INVENTORY" ]; then
        echo -e "${RED}❌ Error: No se encontró el archivo de inventario: $INVENTORY${NC}"
        echo -e "${YELLOW}⚠️  Por favor configura el archivo 'hosts' con la IP de tu VM${NC}"
        exit 1
    fi
}

# Función para verificar que Ansible existe
check_ansible() {
    if ! command -v ansible-playbook &> /dev/null; then
        echo -e "${RED}❌ Error: Ansible no está instalado${NC}"
        echo -e "${YELLOW}⚠️  Instálalo con: pip install ansible${NC}"
        exit 1
    fi
}

# Función principal
main() {
    check_ansible
    check_inventory
    
    local cmd="ansible-playbook -i $INVENTORY $PLAYBOOK"
    
    # Procesar argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -c|--check)
                cmd="$cmd --check"
                shift
                ;;
            -v|--verbose)
                cmd="$cmd -v"
                shift
                ;;
            -vv)
                cmd="$cmd -vv"
                shift
                ;;
            -vvv)
                cmd="$cmd -vvv"
                shift
                ;;
            -p|--ping)
                cmd="ansible all -i $INVENTORY -m ping"
                shift
                ;;
            -s|--syntax)
                cmd="ansible-playbook -i $INVENTORY $PLAYBOOK --syntax-check"
                shift
                ;;
            -d|--debug)
                cmd="$cmd -vvv"
                shift
                ;;
            -e|--extra-vars)
                cmd="$cmd -e \"$2\""
                shift 2
                ;;
            *)
                echo -e "${RED}❌ Opción desconocida: $1${NC}"
                show_help
                exit 1
                ;;
        esac
    done
    
    echo -e "${BLUE}════════════════════════════════════════════${NC}"
    echo -e "${GREEN}🚀 Ejecutando AWS Playbook...${NC}"
    echo -e "${BLUE}════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}📋 Inventario: $INVENTORY${NC}"
    echo -e "${YELLOW}📄 Playbook: $PLAYBOOK${NC}"
    echo -e "${BLUE}════════════════════════════════════════════${NC}"
    echo ""
    
    # Ejecutar el comando
    eval $cmd
    
    echo ""
    echo -e "${BLUE}════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ ¡Playbook completado!${NC}"
    echo -e "${BLUE}════════════════════════════════════════════${NC}"
}

# Ejecutar
main "$@"
