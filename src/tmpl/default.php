<?php

defined("_JEXEC") or die;

$doc=JFactory::getDocument();

$doc->addStyleSheet(JURI::base() . "./modules/mod_galeria/css/main.css");
$doc->addScript(JURI::base() . "./modules/mod_galeria/js/main.js","text/javascript");

//$idCategoria=$params['categoria'];
require_once __DIR__ . "/../helper.php";

$lista=Galeria::getURLImagenes($params);

$i=1;
echo "<div class='galeria-outer-wrapper'>
        <h3 class='galeria-header'></h3>
        <p class='galeria-text'></p>
        <div class='galeria-inner-wrapper'>";
        foreach($lista as $l){
          echo "<div class='galeria-item'>
                  <div id='galeria-item-preload-" . $i . "' class='galeria-item-preload'>
                    <img id='item-preload-imagen1-" . $i ."' class='galeria-item-preload-imagen' src='" . JURI::base() . "modules/mod_galeria/css/images/loading-2.gif' />
                    <img id='item-preload-imagen2-" . $i ."'class='galeria-item-preload-imagen' src='" . JURI::base() . "modules/mod_galeria/css/images/logo-mini-verde.png' />
                    <img src='" . $l . "' id='galeria-item-imagen-" . $i . "' 
                          class='galeria-item-imagen' 
                          data-url='" . $l . "' 
                          onload=\"imagenCargada(" . $i . ")\" 
                          onclick=\"popUpImagen(" . $i . ")\" 
                          />
                  </div>
                </div>";
          if($i==$params['imagenesPorPagina']){
            break;
          }
          else{
            $i++;
          }
        }  

$i=1;
echo "  </div> 
        <div class='galeria-paginacion-wrapper'>";
        
        $numPaginas=intdiv(count($lista),$params['imagenesPorPagina']);        

        while($i<$numPaginas){
          if($i==1){
            $clase=" activo";
          }
          else{
            $clase="";
          }
          echo "<button class='galeria-paginacion-boton" . $clase ."' onclick='cambiaPagina(" . $i .")'>" . $i . "</button>";
          $i++;
        }

$listaNombres=json_encode(Galeria::getNombreImagenes($params));

echo "  <input type='hidden' value='" . $listaNombres . "' id='nombres-imagenes' >  
        <input type='hidden' value='" . $params['imagenesPorPagina'] . "' id='max-imagenes' >
        <input type='hidden' value='" . Galeria::getPathImagenes($params) . "' id='ruta-imagenes' >
        </div>
        <div class='galeria-overlay ajuste-padding' onclick='cerrarOverlay()'>
          <div class='galeria-overlay-inner'>
            <img class='galeria-overlay-imagen' src='' />
            <div class='galeria-overlay-imagen-social'></div>
          </div>
        </div>
      </div>
    ";


?>
