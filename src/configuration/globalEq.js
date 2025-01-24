var Global = {
    baseUrlAxios(){
        try{
            if(javaObj.springActiveProfile == 'dev'){
                return 'http://192.168.20.57:8181'
            }else{
                return "http://192.168.100.18:8181"
            }
        }catch(e){
            return 'http://192.168.20.57:8181'
        }
    },
    baseUrlKeycloak() {
        try{
            if(javaObj.springActiveProfile == 'dev'){
                return 'http://192.168.20.241:8180'
            }else {
                return 'http://192.168.100.18:8180'
            }
        }catch(e){
            return 'http://192.168.20.241:8180'
        }
    }
}

export default Global;