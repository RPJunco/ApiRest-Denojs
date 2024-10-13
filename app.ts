import {Application, Router} from "https://deno.land/x/oak@v12.6.1/mod.ts"
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";


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

export const addPerro = async ({
    request,
    response
}: {
    request: any,
    response: any
}) => {
    try {
        const body = await request.body();
        
        // Assuming body.type is 'json' if JSON is sent
        if (body.type !== "json") {
            response.status = 400;
            response.body = { msj: "Cuerpo JSON requerido" };
            return;
        }

        const perro: Perro = await body.value;
        
        // Check for valid 'nombre' and 'edad'
        if (!perro.nombre || typeof perro.edad !== "number") {
            response.status = 400;
            response.body = {
                msj: "Datos de perro inválidos. Se requieren 'nombre' y 'edad'."
            };
            return;
        }
        
        perros.push(perro);
        response.status = 201;
        response.body = {
            msj: "Perro añadido con éxito",
            perro: perro
        };
    } catch (error) {
        console.error(error);
        response.status = 500;
        response.body = { msj: "Error al procesar la solicitud" };
    }
};


export const updatePerro = async ({
    params,
    request,
    response
}: {
    params: {
        nombre: string
    },
    request: any,
    response: any
}) => {
    try {
        // Leer el cuerpo como texto y luego intentar parsearlo a JSON
        const rawBody = await request.body({ type: "text" });
        const bodyText = await rawBody.value;
        const parsedBody = JSON.parse(bodyText);

        // Validar que tenga 'edad' y que sea un número válido
        const edad = parsedBody.edad;
        if (typeof edad !== 'number' || isNaN(edad)) {
            response.status = 400;
            response.body = { msj: "La edad proporcionada no es válida" };
            return;
        }

        const perroIndex = perros.findIndex((perro) => perro.nombre === params.nombre);
        
        if (perroIndex !== -1) {
            perros[perroIndex].edad = edad;
            response.status = 200;
            response.body = { 
                msj: 'Perro actualizado con éxito',
                perro: perros[perroIndex]
            };
        } else {
            response.status = 404;
            response.body = { msj: 'Perro no encontrado' };
        }
    } catch (error) {
        console.error("Error en updatePerro:", error);
        response.status = 400;
        response.body = {
            msj: 'Error al actualizar el perro',
            error: error.message
        };
    }
};

export const removePerro = ({
    params,
    response
}: {
    params: {
        nombre: string
    },
    response: any
}) => {
    try {
        const perroIndex = perros.findIndex((perro) => perro.nombre === params.nombre);
        
        if (perroIndex !== -1) {
            const perroEliminado = perros.splice(perroIndex, 1)[0];
            response.status = 200;
            response.body = { 
                msj: 'Perro eliminado con éxito',
                perro: perroEliminado
            };
        } else {
            response.status = 404;
            response.body = { msj: 'Perro no encontrado' };
        }
    } catch (error) {
        console.error("Error en removePerro:", error);
        response.status = 500;
        response.body = {
            msj: 'Error al eliminar el perro',
            error: error.message
        };
    }
}


app.use(oakCors()); // 
app.use(router.routes());
app.use(router.allowedMethods());

router
    .get('/perros', getPerros)
    .get('/perros/:nombre', getPerro)
    .post('/perros', addPerro)
    .put('/perros/:nombre', updatePerro)
    .delete('/perros/:nombre', removePerro);

const env = Deno.env.toObject();
const PORT = env.PORT || 4000
const HOST = env.HOST || '127.0.0.1';
console.log(`Escuchando en: http://localhost:${PORT}`)


await app.listen(`${HOST}:${PORT}`)