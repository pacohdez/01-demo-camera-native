import { Notify } from 'quasar'

export const useGetNotify = () => {
    
    const notify = (mensaje, tipo, posicion, icono) => {
        Notify.create({
            type: tipo,
            position: posicion,
            message: mensaje,
            icon: icono,
            actions: [
                { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
            ]
        })
    }

    return {
        notify
    }
}