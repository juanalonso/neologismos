#!/bin/bash

arr_rnn_size=(64 128 256)
arr_seq_length=(16 32 64)
arr_output_keep_prob=(0.4 0.75 0.995)
contador=1

for f in "${arr_rnn_size[@]}"
do
    for g in "${arr_seq_length[@]}"
    do
        for h in "${arr_output_keep_prob[@]}"
        do
            echo -e "-----------------------------------------------------------------------"
            echo -e "$contador: rnn_size:$f    seq_length:$g    output_keep_prob:$h"
            echo -e "-----------------------------------------------------------------------"

            python train.py --data_path=../datos/verbos.txt \
            --rnn_size $f \
            --num_layers 2 \
            --seq_length $g \
            --batch_size 32 \
            --num_epochs 20 \
            --output_keep_prob $h \
            --model lstm \
            --save_checkpoints ./checkpoints \
            --save_model ./models \
            --print_every 100 

            mv ./models/verbos ./models/verbos_$contador

            contador=$((contador+1))

        done
    done
done




#--model: rnn, gru, lstm, nas


#rm -r ../generacion/models/verbos
#cp -r ./models/verbos ../generacion/models/verbos