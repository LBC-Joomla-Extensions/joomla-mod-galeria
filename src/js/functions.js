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

module.exports = {
    imagenCargada: imagenCargada,
    cambiaPagina: cambiaPagina,
    popUpImagen: popUpImagen,
    cerrarOverlay: cerrarOverlay,
    disableScrolling: disableScrolling,
    enableScrolling: enableScrolling,
};