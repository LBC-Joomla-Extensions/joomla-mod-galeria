import '../styles/main.scss';
import {imagenCargada, cambiaPagina, popUpImagen, cerrarOverlay, disableScrolling, enableScrolling, initScrollInfinito, cargarMasImagenes} from './functions.js';

// Envolver todo en un IIFE para aislar de errores externos
(function() {
    try {
        // console.log('[Galeria] Script cargado');

        // Crear namespace protegido para evitar conflictos con el template
        // Usar Object.defineProperty para que no pueda ser sobrescrito
        if (!window.Galeria) {
            Object.defineProperty(window, 'Galeria', {
                value: {},
                writable: false,
                configurable: false
            });
        }

        // Exportar funciones en el namespace
        window.Galeria.imagenCargada = imagenCargada;
        window.Galeria.cambiaPagina = cambiaPagina;
        window.Galeria.popUpImagen = popUpImagen;
        window.Galeria.cerrarOverlay = cerrarOverlay;
        window.Galeria.disableScrolling = disableScrolling;
        window.Galeria.enableScrolling = enableScrolling;
        window.Galeria.initScrollInfinito = initScrollInfinito;
        window.Galeria.cargarMasImagenes = cargarMasImagenes;

        // También mantener compatibilidad con código antiguo (pero pueden ser sobrescritas)
        window.imagenCargada = imagenCargada;
        window.cambiaPagina = cambiaPagina;
        window.popUpImagen = popUpImagen;
        window.cerrarOverlay = cerrarOverlay;

        // Inicializar scroll infinito cuando el DOM esté listo
        function inicializarGaleria() {
            try {
                // console.log('[Galeria] inicializarGaleria llamada, readyState:', document.readyState);
                // Pequeño delay para asegurar que todo el DOM de Joomla esté cargado
                setTimeout(function() {
                    try {
                        // console.log('[Galeria] Ejecutando initScrollInfinito después del delay');
                        window.Galeria.initScrollInfinito();
                    } catch (e) {
                        console.error('[Galeria] Error en initScrollInfinito:', e);
                    }
                }, 500); // Aumentado a 500ms
            } catch (e) {
                console.error('[Galeria] Error en inicializarGaleria:', e);
            }
        }

        // console.log('[Galeria] Verificando readyState:', document.readyState);
        if (document.readyState === 'loading') {
            // console.log('[Galeria] DOM aún cargando, agregando listener');
            document.addEventListener('DOMContentLoaded', inicializarGaleria);
        } else {
            // console.log('[Galeria] DOM ya listo, inicializando inmediatamente');
            inicializarGaleria();
        }

        // También intentar inicializar en window.load como fallback
        window.addEventListener('load', function() {
            try {
                // console.log('[Galeria] window.load event, intentando inicializar de nuevo');
                setTimeout(window.Galeria.initScrollInfinito, 1000);
            } catch (e) {
                console.error('[Galeria] Error en window.load:', e);
            }
        });
    } catch (e) {
        console.error('[Galeria] Error fatal al cargar el módulo:', e);
    }
})();