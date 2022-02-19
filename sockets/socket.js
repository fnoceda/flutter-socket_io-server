const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');


const bands = new Bands();
console.log('init');

bands.addBand( new Band('Queen') );
bands.addBand( new Band('Bon Jovi') );
bands.addBand( new Band('Ramsteim') );
bands.addBand( new Band('Metalica') );

console.log(bands);

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');



    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    });
    
    client.on('emitir-mensaje', (payload) => {
        console.log('Nuevo mensaje', payload);

        // io.emit( 'nuevo-mensaje', payload ); //emite a todos
        client.broadcast.emit( 'nuevo-mensaje', payload ); //emite a todos menos al que emitio

    });

    client.on('vote-band', (payload) => {
        console.log('Voto', payload);
        bands.voteBands( payload.id );
        io.emit('active-bands', bands.getBands());
    });
    
    client.on('add-band', (payload) => {
        console.log('Nueva banda', payload);
        bands.addBand( new Band( payload.name ) );
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        console.log('Borrar banda', payload);
        bands.deleteBand( payload.id ); 
        io.emit('active-bands', bands.getBands());
    });

});
