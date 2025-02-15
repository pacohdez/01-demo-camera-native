import { Filesystem, Directory } from '@capacitor/filesystem';

export const useGetConvertUriToBase64 = () => {
    
    const uriToBase64 = async (uri) => {
        try {
            const response = await fetch(uri);
            if (!response.ok) {
                throw new Error('No se pudo descargar el archivo desde el URI');
            }
            const blob = await response.blob();
            return await blobToBase64(blob);
        } catch (error) {
            console.error('Error al convertir URI a Base64 vía fetch:', error);
            return null;
        }
        /* let filePath = uri
        // Limpia el prefijo _capacitor_file_ si está presente
        if (uri.startsWith('http://') && uri.includes('_capacitor_file_')) {
            filePath = uri.replace('http://192.168.20.57:9500/_capacitor_file_/', 'file://');
        }
    
        // Elimina fragmentos o parámetros de la URI
        const hashIndex = filePath.indexOf('#');
        if (hashIndex !== -1) {
            filePath = filePath.substring(0, hashIndex);
        }
        console.log(filePath);
        if (filePath.startsWith('file://')) {
            filePath = filePath.slice(7);
        }

        const directories = [Directory.Cache, Directory.Data, Directory.Documents, Directory.External];
        for (const dir of directories) {
            try {
                const stat = await Filesystem.stat({
                    path: filePath,
                    directory: dir,
                });
                console.log(`Archivo encontrado en ${dir}:`, stat);
                break;
            } catch (error) {
                console.log(`Archivo no encontrado en ${dir}`);
            }
        } */


        /* try {
            // Lee el archivo como base64
            const file = await Filesystem.readFile({
              path: filePath,
              directory: Directory.Documents, // O Directory.Data, dependiendo de dónde se guarde la imagen
            });
        
            // Devuelve la imagen en formato base64
            return `data:image/jpeg;base64,${file.data}`;
        } catch (error) {
            console.error('Error al convertir URI a Base64:', error);
            return null;
        } */
    }

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(blob);
        });
    }

    return {
        uriToBase64
    }
}