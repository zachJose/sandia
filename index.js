const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
      }
});
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/inicio_app.html');//ri¡uta de node js
});
var arreglo = {};
const connections= new Set();
io.on('connection', (socket) => { 
    connections.add(socket);
    socket.once('disconnect', function () {
       connections.delete(socket); //ELIMINA EL SOCKET
       if(socket.disconnected){
        let encontro=false;
        let prop='';
        let prop2='';
        for (const key in arreglo) {
            let rom= arreglo[key];
            for(const key2 in rom){
                if(rom[key2]==socket.id){
                    encontro=rom[key2]==socket.id;
                    prop=key
                    prop2=key2
                }
            }
        }
        if(encontro){
            Reflect.deleteProperty(arreglo[prop], prop2);//ELIMINA EL ARREGLO SOCKET
        }
        io.emit('en_linea', ['salio',[prop,prop2], arreglo[prop]]);
       }
    });
    socket.on ('en_linea',function(data){
        io.to(data).emit('en_linea', arreglo[data]);
    });
    socket.on('login', () => {
        io.emit('login', 'conectado');
    });
    socket.on('mi_id', (data) => {
      /*   if(Reflect.has(arreglo,data.id_empresa)){
             / *socket.join(data.id_cargo);
            socket.join(data.id_perfil);* /
            if(Reflect.has(arreglo[data.id_empresa],data.user)){
                let empresa=data.id_empresa;
                let id=data.id;
                //io.to(arreglo[data.id_empresa][data.user]).emit('cerrar_sesion', {id, empresa});
            }
            Reflect.set(arreglo[data.id_empresa],data.user,socket.id)
        }else{
            socket.join(data.id_empresa);
            Reflect.set(arreglo,data.id_empresa,{});
            Reflect.set(arreglo[data.id_empresa],data.user,socket.id)
        }
        
        io.to(data.id_empresa).emit('en_linea',['entro',[data.id_empresa,data.user], arreglo[data.id_empresa]]);
        io.to(socket.id).emit('alerta', {texto:`Bienvenido ${data.user}`,io:JSON.stringify(io.sockets.sockets)});
        io.emit('mi_id', {id_empresa: data.id_empresa, id:data.id, user:data.user, id_socket:socket.id});
  */});

});
server.listen(3001, () => {
    console.log('Servidor corriendo');
});