import {Application, Router} from 'https://deno.land/x/oak/mod.ts'

const app = new Application();
const router = new Router();


interface Perro {
    nombre: string
    edad: number

}
let perros : Array<Perro> = [
    {nombre: "Boby", edad: 1},
    {nombre: "Rafa", edad: 4},
    {nombre: "Rex", edad: 3},
    {nombre: "Mara", edad: 1}
];

export const getPerros = ({response}: {response: any}) =>{
    response.status = 200
    response.body = perros
    return
}

export const getPerro = ({
    params,
    response
}: {
    params:{
        nombre: string
    },
    response:any
}) => {
    const perro = perros.filter((perro) => perro.nombre === params.nombre)
    if (perro.length){
        response.status = 200
        response.body = perro[0]
        return
    }
    response.status = 400
    response.body = { msj: 'Perro no encontrado' }
}

app.use(router.routes());
app.use(router.allowedMethods());

router
    .get('/perros', getPerros)
    .get('/perros/:nombre', getPerro)
    // .post('/perros', addPerro)
    // .put('/perros/:nombre', updatePerro)
    // .delete('/perros/:nombre', removePerro);

const env = Deno.env.toObject();
const PORT = env.PORT || 4000
const HOST = env.HOST || '127.0.0.1';
console.log(`Escuchando en: http://localhost:${PORT}`)


await app.listen(`${HOST}:${PORT}`)