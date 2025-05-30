const fs = require('fs');
const path = require('path');

exports.handler = async () => {
    try {
        const dataPath = path.join(__dirname, 'licencias.json');
        if (!fs.existsSync(dataPath)) {
            fs.writeFileSync(dataPath, '{}');
        }
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const licencias = JSON.parse(rawData);

        return {
            statusCode: 200,
            body: JSON.stringify(licencias)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error leyendo las licencias', detalle: error.message })
        };
    }
};
