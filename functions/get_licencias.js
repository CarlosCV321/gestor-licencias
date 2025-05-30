const fetch = require("node-fetch");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = "CarlosCV321/licencias-data"; // ← reemplaza con tu repositorio
const FILE_PATH = "licencias.json";

exports.handler = async () => {
    try {
        const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3.raw"
            }
        });

        if (!res.ok) throw new Error("Error leyendo desde GitHub");

        const licencias = await res.json();

        return {
            statusCode: 200,
            body: JSON.stringify(licencias)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error leyendo licencias", detalle: error.message })
        };
    }
};
