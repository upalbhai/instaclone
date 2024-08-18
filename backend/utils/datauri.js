import DataUriParser from 'datauri/parser.js';
import path from 'path';

const parser = new DataUriParser();

const getDataUri = (file) => {
    const extName = path.extname(file.originalname).toString();
    const dataUri = parser.format(extName, file.buffer);
    return dataUri.content; // Ensure this returns the content of the Data URI
};

export default getDataUri;
