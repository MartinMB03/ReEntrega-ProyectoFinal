import fs from "fs";
import path from "path";

const validateFilePathAndName = (filepath, filename) => {
    if (!filepath) throw new Error(`La ruta del archivo ${filename} no fue proporcionada.`);
    if (!filename) throw new Error(`El nombre del archivo ${filename} no fue proporcionado.`);
};

export const readJsonFile = async (filepath, filename) => {
    validateFilePathAndName(filepath, filename);

    try {
        const filePath = path.join(filepath, filename);
        const content = await fs.promises.readFile(filePath, "utf8");
        return JSON.parse(content || "[]");
    } catch (error) {
        throw new Error(`Error al leer el archivo ${filename} en la ruta ${filepath}: ${error.message}`);
    }
};

export const writeJsonFile = async (filepath, filename, content) => {
    validateFilePathAndName(filepath, filename);

    if (!content) throw new Error("El contenido no fue proporcionado.");

    try {
        const filePath = path.join(filepath, filename);
        await fs.promises.writeFile(filePath, JSON.stringify(content, null, "\t"), "utf8");
    } catch (error) {
        throw new Error(`Error al escribir en el archivo ${filename} en la ruta ${filepath}: ${error.message}`);
    }
};

export const deleteFile = async (filepath, filename) => {
    validateFilePathAndName(filepath, filename);

    try {
        const filePath = path.join(filepath, filename); // Unificar la ruta
        await fs.promises.unlink(filePath); // Eliminar el archivo
    } catch (error) {
        if (error.code === "ENOENT") {
            console.warn(`El archivo ${filename} no existe en la ruta ${filepath}.`);
        } else {
            throw new Error(`Error al eliminar el archivo ${filename} en la ruta ${filepath}: ${error.message}`);
        }
    }
};