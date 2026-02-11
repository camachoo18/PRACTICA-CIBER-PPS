/**
 * Middleware para verificar roles
 * @param {string|array} allowedRoles - Rol(es) permitido(s)
 */
function authorize(allowedRoles) {
    return (req, res, next) => {
        if (!req.userId) {
            return res.status(401).json({ 
                success: false, 
                error: 'Token requerido' 
            });
        }

        // Importar db aquí para evitar circular dependency
        const db = require('../database/db');

        db.get(
            'SELECT role FROM users WHERE id = ?',
            [req.userId],
            (err, user) => {
                if (err || !user) {
                    return res.status(401).json({ 
                        success: false, 
                        error: 'Usuario no encontrado' 
                    });
                }

                // Verificar si el rol está permitido
                const rolesArray = Array.isArray(allowedRoles) 
                    ? allowedRoles 
                    : [allowedRoles];

                if (!rolesArray.includes(user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Acceso denegado: permisos insuficientes',
                        requiredRole: rolesArray,
                        userRole: user.role
                    });
                }

                req.userRole = user.role;
                next();
            }
        );
    };
}

module.exports = authorize;