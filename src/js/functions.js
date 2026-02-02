//Variable para guardar el handler del click en la imagen
var auxFunc;

function imagenCargada(index){
    //Esperar a que la imagen se renderize->dos animationFrame
    requestAnimationFrame(nada);
    requestAnimationFrame(nada);

    var res=document.getElementById("galeria-item-preload-"+index);

    
    res.style.height="100%";
    res.style.display="block";
    
    
    document.getElementById("item-preload-imagen1-"+index).style.display="none";
    document.getElementById("item-preload-imagen2-"+index).style.display="none";
 
}

//Funcion para callback de requestAnimationFrame
function nada(){
}

function cambiaPagina(index){
    var ruta=document.getElementById("ruta-imagenes").value;
    var lista=JSON.parse(document.getElementById("nombres-imagenes").value);
    var maxImagenes=document.getElementById("max-imagenes").value;
    var indiceInicial=(index-1)*maxImagenes;

    var i=0;
    var res=[];
    var img;

    //Crear array con url de las nuevas imagenes
    while(i<maxImagenes){
        res[i]=ruta+lista[indiceInicial+i];
        i=i+1;
    }

    //Subir 
    window.scrollTo(0,0);

    //cambiar imagenes y onclick
    i=1;
    while(i<=maxImagenes){
        img=document.getElementById("galeria-item-imagen-"+i);
        img.setAttribute("data-url",res[i-1]);
        img.src=res[i-1];
        i++;        
    }

    //Cambiar boton de pagina activa
    var botones=document.getElementsByClassName("galeria-paginacion-boton");

    for(i=0;i<botones.length;i++){
        botones[i].classList.remove("activo");
        if(i+1==index){
            botones[i].classList.add("activo");
        }
    }
    
}




function popUpImagen(index){
    disableScrolling();
    
    var img=document.getElementById("galeria-item-imagen-"+index);
    var imagenParaMostrar=document.getElementsByClassName("galeria-overlay-imagen")[0];
    
    document.getElementsByClassName("galeria-overlay")[0].classList.add("galeria-overlay-abierto");
    var divInner=document.getElementsByClassName("galeria-overlay-inner")[0];
    

    imagenParaMostrar.onload=function(){

        if(imagenParaMostrar.naturalWidth>=imagenParaMostrar.naturalHeight){            
            //imagenParaMostrar.style.width="65%";
            //imagenParaMostrar.style.height="auto";
            divInner.classList.remove("ajuste-alto");
            divInner.classList.add("ajuste-ancho");
        }
        else{
            //imagenParaMostrar.style.width="auto";
            //imagenParaMostrar.style.height="90%";
            divInner.classList.remove("ajuste-ancho");
            divInner.classList.add("ajuste-alto");
        }

    };

    imagenParaMostrar.src=img.getAttribute("data-url");
    
}

function cerrarOverlay(){
    document.getElementsByClassName("galeria-overlay")[0].classList.remove("galeria-overlay-abierto");
    document.getElementsByClassName("galeria-overlay-imagen")[0].src="";
    enableScrolling();
}

function disableScrolling(){
    var x=window.scrollX;
    var y=window.scrollY;
    window.onscroll=function(){window.scrollTo(x, y);};
}

function enableScrolling(){
    window.onscroll=function(){};
}

// Variables globales para scroll infinito
var indiceImagenActual = 0;
var cargandoImagenes = false;
var scrollObserver = null;

// Inicializar scroll infinito
function initScrollInfinito() {
    var wrapper = document.querySelector('.galeria-outer-wrapper');
    // console.log('[Galeria] Inicializando scroll infinito...', wrapper);

    if (!wrapper) {
        // console.log('[Galeria] No se encontró wrapper');
        return;
    }

    var mode = wrapper.getAttribute('data-mode');
    // console.log('[Galeria] Modo detectado:', mode);

    if (mode !== 'infinito') {
        // console.log('[Galeria] No es modo infinito, saliendo');
        return; // No es modo infinito
    }

    var imagenesTotales = parseInt(wrapper.getAttribute('data-imagenes-totales'));
    var imagenesPorCarga = parseInt(wrapper.getAttribute('data-imagenes-por-carga'));
    // console.log('[Galeria] Total imágenes:', imagenesTotales, 'Por carga:', imagenesPorCarga);

    // Inicializar índice actual
    indiceImagenActual = imagenesPorCarga;

    // Si ya se cargaron todas las imágenes, no hacer nada
    if (indiceImagenActual >= imagenesTotales) {
        // console.log('[Galeria] Ya se cargaron todas las imágenes');
        return;
    }

    // Usar Intersection Observer para detectar cuando el usuario llega al final
    var sentinel = document.querySelector('.galeria-scroll-sentinel');
    // console.log('[Galeria] Sentinel encontrado:', sentinel);

    if (!sentinel) {
        // console.log('[Galeria] No se encontró sentinel');
        return;
    }

    if ('IntersectionObserver' in window) {
        // console.log('[Galeria] Creando IntersectionObserver...');
        scrollObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                // console.log('[Galeria] Sentinel intersecting:', entry.isIntersecting, 'Cargando:', cargandoImagenes);
                if (entry.isIntersecting && !cargandoImagenes) {
                    // console.log('[Galeria] Cargando más imágenes...');
                    cargarMasImagenes();
                }
            });
        }, {
            rootMargin: '200px' // Cargar cuando esté a 200px del sentinel
        });

        scrollObserver.observe(sentinel);
        // console.log('[Galeria] Observer activado');
    } else {
        // console.log('[Galeria] IntersectionObserver no disponible');
    }
}

// Cargar más imágenes en modo scroll infinito
function cargarMasImagenes() {
    // console.log('[Galeria] cargarMasImagenes llamada. Cargando:', cargandoImagenes);

    if (cargandoImagenes) {
        // console.log('[Galeria] Ya se están cargando imágenes, saliendo');
        return;
    }

    var wrapper = document.querySelector('.galeria-outer-wrapper');
    var imagenesTotales = parseInt(wrapper.getAttribute('data-imagenes-totales'));
    var imagenesPorCarga = parseInt(wrapper.getAttribute('data-imagenes-por-carga'));
    // console.log('[Galeria] Índice actual:', indiceImagenActual, 'Total:', imagenesTotales);

    // Verificar si hay más imágenes para cargar
    if (indiceImagenActual >= imagenesTotales) {
        // console.log('[Galeria] No hay más imágenes para cargar');
        // Ocultar el sentinel y el indicador de carga
        var sentinel = document.querySelector('.galeria-scroll-sentinel');
        var loadingIndicator = document.querySelector('.galeria-loading-indicator');
        if (sentinel) sentinel.style.display = 'none';
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        return;
    }

    cargandoImagenes = true;
    // console.log('[Galeria] Iniciando carga de imágenes...');

    // Mostrar indicador de carga
    var loadingIndicator = document.querySelector('.galeria-loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }

    // Obtener datos de las imágenes
    var ruta = document.getElementById('ruta-imagenes').value;
    var lista = JSON.parse(document.getElementById('nombres-imagenes').value);
    var innerWrapper = document.querySelector('.galeria-inner-wrapper');
    var sentinel = document.querySelector('.galeria-scroll-sentinel');

    // Calcular cuántas imágenes cargar
    var imagenesToCargar = Math.min(imagenesPorCarga, imagenesTotales - indiceImagenActual);

    // Crear elementos de imagen
    for (var i = 0; i < imagenesToCargar; i++) {
        var indiceImagen = indiceImagenActual + i;
        var urlImagen = ruta + lista[indiceImagen];
        var indiceElemento = indiceImagen + 1; // +1 porque los índices empiezan en 1

        var itemDiv = document.createElement('div');
        itemDiv.className = 'galeria-item';
        itemDiv.innerHTML =
            "<div id='galeria-item-preload-" + indiceElemento + "' class='galeria-item-preload'>" +
            "  <img id='item-preload-imagen1-" + indiceElemento + "' class='galeria-item-preload-imagen' " +
            "       src='/modules/mod_galeria/css/images/loading-2.gif' />" +
            "  <img id='item-preload-imagen2-" + indiceElemento + "' class='galeria-item-preload-imagen' " +
            "       src='/modules/mod_galeria/css/images/logo-mini-verde.png' />" +
            "  <img src='" + urlImagen + "' id='galeria-item-imagen-" + indiceElemento + "' " +
            "       class='galeria-item-imagen' data-url='" + urlImagen + "' " +
            "       onload='Galeria.imagenCargada(" + indiceElemento + ")' " +
            "       onclick='Galeria.popUpImagen(" + indiceElemento + ")' loading='lazy' />" +
            "</div>";

        // Insertar antes del sentinel
        innerWrapper.insertBefore(itemDiv, sentinel);
    }

    // Actualizar índice
    indiceImagenActual += imagenesToCargar;

    // Ocultar indicador de carga después de un breve delay
    setTimeout(function() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        cargandoImagenes = false;
    }, 500);
}

module.exports = {
    imagenCargada: imagenCargada,
    cambiaPagina: cambiaPagina,
    popUpImagen: popUpImagen,
    cerrarOverlay: cerrarOverlay,
    disableScrolling: disableScrolling,
    enableScrolling: enableScrolling,
    initScrollInfinito: initScrollInfinito,
    cargarMasImagenes: cargarMasImagenes
};