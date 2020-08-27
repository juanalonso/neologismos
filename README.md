# Neologismos
**Neologismos** es una red neuronal LSTM que genera verbos del castellano y corre en el navegador sin necesidad de instalar ningún tipo de software ni GPU.  

# TL;DR

Si queréis probar el generador sin instalar nada, ni ver el código ni saber cómo está hecho, id directamente a  [https://neuronasmuertas.com/neologismos/](https://neuronasmuertas.com/neologismos/).

# Datos
Para entrenar el modelo he combinado dos lemarios de verbos en castellano, el [lemario de Ismael Olea](https://github.com/olea/lemarios) y el [lemario de Igancio Mario Morales](https://www.cpimario.com/cm_util.html). El resultado es una lista de 11348 verbos diferentes, incluida en la carpeta `datos`.

# Entrenamiento

Si queréis usar la red sin entrenarla, podéis saltar directamente a la sección "**Generación**".

👉🏼 Todos los ficheros de esta sección se encuentran en la carpeta `entrenamiento`.

Para entrenar la red neuronal uso el script de Python [training-charRNN](https://github.com/ml5js/training-charRNN). Necesita Python y TensorFlow 1.15. Lamentablemente, instalé TensorFlow hace casi un año y no me acuerdo exactamente de cómo lo hice, salvo que fue creando un entorno con anaconda. 

El entrenamiento empieza al ejecutar el script `run.sh`. Va a tardar unas horas, porque realmente entrena 27 modelos, cada uno con diferentes parámetros, para luego eleegir el mejor. Si no queréis entrenar o elegir, los ficheros resultantes están en la carpeta `generacion/models/verbos`. 

# Generación

👉🏼 Todos los ficheros de esta sección se encuentran en la carpeta `generacion`.

La chicha de la generación está en el fichero `sketch.js`.  Básicamente, carga los ficheros que hay en la carpeta `generacion/models` y llama a la red neuronal cada vez que se pulsa el botón. La página divide los verbos generados entre nuevos y existentes, consultando el lemario original, para facilitar la identificación.

Además del botón, hay un slider para ajustar la temperatura de los resultados, es decir, lo conservadores u osados que van a ser. Si se selecciona un valor cercano a 0, la red neuronal se embucla y saca siempre los mismos resultados. Si se selecciona un valor cercano a 1, los resultados son más variados, pero a veces obtiene combinaciones de letras no válidas.

🌡Temperatura de 0.15

```
calofrar
caramear
aperrarar
arranar
encaprecer
sangar
dramalitrar
apalanar
cernar
drimar
```

🌡Temperatura de 1.00

```
golfar
rehinglar
osgular
percalentar
membrar
cualternar
flematizar
bajoquear
accidar
tuntuar
```

Si queréis ejecutar el código en local, basta con levantar un servidor web en la carpeta `generacion`. Para ello hay que abrir una ventana de terminal, ir a la carpeta y teclear alguno de estos comandos (naturalmente, tienes que tener Python o PHP instalado en tu equipo)

**Python 2.x**

```python
python -m SimpleHTTPServer 8000
```

**Python 3.x**

```python
python -m http.server 8000 --bind 127.0.0.1
```

**PHP**

```php
php -S localhost:8000
