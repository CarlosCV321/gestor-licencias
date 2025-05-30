const fetch = require("node-fetch");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = "CarlosCV321/licencias-data"; // ← reemplaza con tu repositorio
const FILE_PATH = "licencias.json";
const PASSWORD = "Siadco21";

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Método no permitido" };
    }

    try {
        const { empresa, clave, fecha, password } = JSON.parse(event.body);
        if (password !== PASSWORD) {
            return { statusCode: 403, body: JSON.stringify({ error: "Contraseña incorrecta" }) };
        }

        // 1. Obtener el archivo actual
        const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        const fileData = await getRes.json();
        const sha = fileData.sha;
        const licencias = JSON.parse(Buffer.from(fileData.content, 'base64').toString());

        // 2. Actualizar licencias
        licencias[empresa] = { clave, fecha };

        const updatedContent = Buffer.from(JSON.stringify(licencias, null, 2)).toString('base64');

        // 3. Guardar cambios con commit
        const updateRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json"
            },
            body: JSON.stringify({
                message: `Actualizar licencia: ${empresa}`,
                content: updatedContent,
                sha
            })
        });

        if (!updateRes.ok) throw new Error("No se pudo guardar");

        return {
            statusCode: 200,
            body: JSON.stringify({ mensaje: "Licencia actualizada con éxito" })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error guardando licencia", detalle: error.message })
        };
    }
};
