import {Application, Router} from 'https://deno.land/x/oak/mod.ts'

const app = new Application();
const router = new Router();

app.use(router.routes());
app.use(router.allowedMethods());

// router
//     .get('/perros', getPerros)
//     .get('/perros/:nombre', getPerros)
//     .post('/perros', addPerro)
//     .put('/perros/:nombre', updatePerro)
//     .delete('/perros/:nombre', removePerro);

const env = Deno.env.toObject();
const PORT = env.PORT || 4000
const HOST = env.HOST || '127.0.0.1';
console.log(`Escuchando en: http://localhost:${PORT}`)


await app.listen(`${HOST}:${PORT}`)