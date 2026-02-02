<?php

defined("_JEXEC") or die;

$doc = JFactory::getDocument();

$doc->addStyleSheet(JURI::base() . "./modules/mod_galeria/css/main.css");
$doc->addScript(JURI::base() . "./modules/mod_galeria/js/main.js?v=" . time(), "text/javascript");

//$idCategoria=$params['categoria'];
require_once __DIR__ . "/../helper.php";

$lista = Galeria::getURLImagenes($params);

// Detectar modo de visualización
$modoVisualizacion = isset($params['modoVisualizacion']) ? $params['modoVisualizacion'] : 'paginado';
$imagenesPorCarga = isset($params['imagenesPorPagina']) && $params['imagenesPorPagina'] > 0 ? $params['imagenesPorPagina'] : 12;
$imagenesTotales = count($lista);

// Si no num positivo entonces no hay paginación
$paginacion = $modoVisualizacion === 'paginado' && $imagenesPorCarga > 0;

$i = 1;

// Atributos data para JavaScript
$dataMode = $modoVisualizacion === 'infinito' ? 'data-mode="infinito"' : 'data-mode="paginado"';

echo "<div class='galeria-outer-wrapper' $dataMode data-imagenes-totales='$imagenesTotales' data-imagenes-por-carga='$imagenesPorCarga'>
        <h3 class='galeria-header'></h3>
        <p class='galeria-text'></p>
        <div class='galeria-inner-wrapper'>";
foreach ($lista as $l) {
  echo
  "<div class='galeria-item'>
              <div id='galeria-item-preload-" . $i . "' class='galeria-item-preload'>
                <img 
                  id='item-preload-imagen1-" . $i . "' 
                  class='galeria-item-preload-imagen' 
                  src='" . JURI::base() . "modules/mod_galeria/css/images/loading-2.gif' 
                />

                <img 
                  id='item-preload-imagen2-" . $i . "' 
                  class='galeria-item-preload-imagen' 
                  src='" . JURI::base() . "modules/mod_galeria/css/images/logo-mini-verde.png' 
                />

                <img src='" . $l . "' id='galeria-item-imagen-" . $i . "'
                  class='galeria-item-imagen'
                  data-url='" . $l . "'
                  onload=\"Galeria.imagenCargada(" . $i . ")\"
                  onclick=\"Galeria.popUpImagen(" . $i . ")\"
                  loading='lazy'
                  />
              </div>
            </div>";

  if ($paginacion) {
    if ($i == $imagenesPorCarga) {
      break;
    }
  }

  // En modo scroll infinito, cargar solo las primeras imágenes
  if ($modoVisualizacion === 'infinito' && $i >= $imagenesPorCarga) {
    break;
  }

  $i++;
}

// Añadir sentinel para scroll infinito
if ($modoVisualizacion === 'infinito' && $imagenesTotales > $imagenesPorCarga) {
  echo "<div class='galeria-scroll-sentinel' style='width:100%; height:1px;'></div>";
}

echo "</div>";

// Inputs hidden necesarios para ambos modos
$listaNombres = json_encode(Galeria::getNombreImagenes($params));
echo "  <input type='hidden' value='" . $listaNombres . "' id='nombres-imagenes' >
        <input type='hidden' value='" . $imagenesPorCarga . "' id='max-imagenes' >
        <input type='hidden' value='" . Galeria::getPathImagenes($params) . "' id='ruta-imagenes' >";

if ($paginacion) {
  $i = 1;
  echo "
          <div class='galeria-paginacion-wrapper'>";

  $numPaginas = intdiv(count($lista), $imagenesPorCarga);

  while ($i < $numPaginas) {
    if ($i == 1) {
      $clase = " activo";
    } else {
      $clase = "";
    }
    echo "<button class='galeria-paginacion-boton" . $clase . "' onclick='Galeria.cambiaPagina(" . $i . ")'>" . $i . "</button>";
    $i++;
  }

  echo "  </div>";
}

// Indicador de carga para scroll infinito
if ($modoVisualizacion === 'infinito') {
  echo "
        <div class='galeria-loading-indicator' style='display:none;'>
          <img src='" . JURI::base() . "modules/mod_galeria/css/images/loading-2.gif' alt='Cargando...' />
        </div>";
}

echo "</div>"; // Cierre de galeria-outer-wrapper

echo "
  <div class='galeria-overlay ajuste-padding' onclick='Galeria.cerrarOverlay()'>
    <div class='galeria-overlay-inner'>
      <img class='galeria-overlay-imagen' src='' />
      <div class='galeria-overlay-imagen-social'></div>
    </div>
  </div>
";
