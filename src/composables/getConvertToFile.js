export const useGetConvertDataUrlToFile = () => {
    
    const dataUrlToFile = (dataurl, filename) => {
        var arr = dataurl.split(','), 
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        var file = new File([u8arr], filename, {type: mime});
        return file;
    }

    return {
        dataUrlToFile
    }
}