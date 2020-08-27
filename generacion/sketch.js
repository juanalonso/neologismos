// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
LSTM Generator example with p5.js
This uses a pre-trained model on a corpus of Virginia Woolf
For more models see: https://github.com/ml5js/ml5-data-and-training/tree/master/models/charRNN
=== */

let charRNN;
let tempSlider;
let button;
let revealElements;
let runningInference = false;

let temperatureText;

let resultNew1, resultNew2, resultExisting;
let verbArray;
let gerundio = "generando"

const textSeed = 'e';
const resultsLength = 384;


async function readFile() {
    try {
        const response = await fetch('./models/verbos.txt');
        const list = await response.text();
        return list;
    } catch (error) {
        console.error(error);
    }
}

async function readVerbs() {
    const verbos = await readFile();
    verbArray = verbos.split(/\r\n|\r|\n/g);
}

function setup() {

    // Create the LSTM Generator passing it the model directory
    charRNN = ml5.charRNN('./models/verbos/', modelReady);

    // Grab the DOM elements
    tempSlider = document.querySelector('#tempSlider');
    button = document.querySelector('#generate');
    temperatureText = document.querySelector('#temperature');
    resultNew1 = document.querySelector('#result-new-1');
    resultNew2 = document.querySelector('#result-new-2');
    resultExisting = document.querySelector('#result-existing');
    revealElements = document.querySelectorAll('.reveal');

    // DOM element events
    button.addEventListener('click', generate);
    tempSlider.addEventListener('input', updateSlider);

    readVerbs();
    //console.log(readVerbs());


}

setup();


// Update the slider values
function updateSlider() {
    temperatureText.innerHTML = parseFloat(tempSlider.value).toFixed(2);
}

function modelReady() {
    button.disabled = false;
    button.innerHTML = 'Generar verbos'
}

// Generate new text
function generate() {
    // prevent starting inference if we've already started another instance
    // TODO: is there better JS way of doing this?
    if (!runningInference) {
        runningInference = true;
        button.disabled = true;

        // Update status
        button.innerHTML = gerundio.charAt(0).toLocaleUpperCase() + gerundio.slice(1) + '...';

        // Grab the seed
        //const textSeed = textInput.value;
        // Make it to lower case
        //const txt = textSeed.toUpperCase();

        const data = {
            seed: textSeed,
            temperature: tempSlider.value,
            length: resultsLength
        };

        // Generate text with the charRNN
        charRNN.generate(data, gotData);

        // When it's done
        function gotData(err, result) {
            // Update status

            revealElements.forEach(function(userItem) {
                userItem.style.display = 'flex';
            });
            resultNew1.innerHTML = '';
            resultNew2.innerHTML = '';
            resultExisting.innerHTML = '';

            var verbs = result.sample.split(/\r\n|\r|\n/g);
            verbs.shift();
            verbs.pop();

            var existingVerbs = [],
                newVerbs = [];
            for (const verb of verbs) {
                if (verbArray.indexOf(verb) != -1) {
                    existingVerbs.push(verb)
                } else {
                    newVerbs.push(verb)
                }
            }

            var infinitivo;
            if (newVerbs.length == 0) {
                infinitivo = "generar";
            } else {
                infinitivo = newVerbs.shift();
            }
            if (infinitivo.slice(-2) == 'se') {
                infinitivo = infinitivo.slice(0, -2)
            }

            var participio, sustantivo;
            if (infinitivo.slice(-2, -1) == 'a') {
                participio = infinitivo.slice(0, -2) + "ado";
                gerundio = infinitivo.slice(0, -2) + "ando";
            } else {
                participio = infinitivo.slice(0, -2) + "ido";
                gerundio = infinitivo.slice(0, -2) + "iendo";
            }
            sustantivo = infinitivo.slice(0, -1) + "dor";

            var splitIndex = Math.ceil(newVerbs.length / 2);
            var firstHalf = newVerbs.splice(0, splitIndex);
            resultNew1.innerHTML = firstHalf.join("\n");
            resultNew2.innerHTML = newVerbs.join("\n");

            resultExisting.innerHTML = existingVerbs.join(", ");

            runningInference = false;
            button.disabled = false;
            button.innerHTML = '¡' + infinitivo.charAt(0).toLocaleUpperCase() + infinitivo.slice(1) + ' más verbos!';
            document.querySelector('#title-new').innerHTML = "La red ha " + participio + " los siguientes verbos nuevos:";
            document.querySelector('#title-existing').innerHTML = "También ha " + participio + " unos verbos que ya existían:";
            document.querySelector('#subtitle').innerHTML = "Un " + sustantivo + " de verbos usando una red neuronal LSTM.";
        }

    }
}