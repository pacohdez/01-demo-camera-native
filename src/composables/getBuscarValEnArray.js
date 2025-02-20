export const useGetBuscarValEnArray = () => {
    
    const existeValEnArray = (array, val) => {
        return array.includes(val)
    }

    return {
        existeValEnArray
    }
}