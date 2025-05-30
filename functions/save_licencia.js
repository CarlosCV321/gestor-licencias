const fs = require('fs');
const path = require('path');

const PASSWORD = "Siadco21";

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Método no permitido',
        };
    }

    try {
        const { empresa, clave, fecha, password } = JSON.parse(event.body);

        if (password !== PASSWORD) {
            return {
                statusCode: 403,
                body: JSON.stringify({ error: 'Contraseña incorrecta' })
            };
        }

        const dataPath = path.join(__dirname, 'licencias.json');

        let licencias = {};
        if (fs.existsSync(dataPath)) {
            const rawData = fs.readFileSync(dataPath, 'utf8');
            licencias = JSON.parse(rawData);
        }

        licencias[empresa] = { clave, fecha };

        fs.writeFileSync(dataPath, JSON.stringify(licencias, null, 2));

        return {
            statusCode: 200,
            body: JSON.stringify({ mensaje: 'Licencia actualizada con éxito' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error guardando la licencia', detalle: error.message })
        };
    }
};
