
<?php 
/*Este archivo puede considerarse el modelo (MVC) del módulo*/

defined("_JEXEC") or die; 

require_once __DIR__ . "/vendor/autoload.php";

use Dickinsonjl\Lorum\Lorum;

class Galeria{
    public static function getURLImagenes($params){
        $res=array();

        //solo funciona con ruta relativa(empieza por ./)
        $aux="./images/" . $params['dir'];
        $files=scandir($aux);

        foreach($files as $f){
            if($f!="." && $f!=".."){
                array_push($res,JURI::base() . "images/" . $params['dir'] . "/" . $f);
            }            
        }

        return $res;
    }

    public static function getPathImagenes($params){
        return JURI::base() . "images/" . $params['dir'] . "/";
    }

    public static function getNombreImagenes($params){
        $res=array();

        $aux="./images/" . $params['dir'];
        $files=scandir($aux);

        foreach($files as $f){
            if($f!="." && $f!=".."){
                array_push($res,$f);
            }
        }

        return $res;
    }
}
?>