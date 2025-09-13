document.addEventListener('DOMContentLoaded', function() {

    // 1. Seleciona os elementos do HTML
    const quantiaInput = document.getElementById('quantia');
    const quantiaResultInput = document.getElementById('quantia1');
    const moedaOrigemSelect = document.getElementById('moedaorigem');
    const moedaDestinoSelect = document.getElementById('moedadestino');
    const swapButton = document.getElementById('botao-troca');

    // Impedir que o usuário digite no campo de resultado
    quantiaResultInput.readOnly = true;
    quantiaResultInput.type = 'text';

    // 2. Adiciona os "escutadores" de eventos automáticos
    // A conversão acontece ao digitar ou ao mudar as moedas.
    quantiaInput.addEventListener('input', converter);
    moedaOrigemSelect.addEventListener('change', converter);
    moedaDestinoSelect.addEventListener('change', converter);
    swapButton.addEventListener('click', inverter);

    // 3. Define a função principal de conversão
    async function converter() {
        const quantia = Number(quantiaInput.value) || 1;
        const origem = moedaOrigemSelect.value.toUpperCase();
        const destino = moedaDestinoSelect.value.toUpperCase();

        if (isNaN(quantia) || quantia <= 0) {
            quantiaResultInput.value = "";
            return;
        }

        if (origem === destino) {
            quantiaResultInput.value = quantia.toFixed(2).replace('.', ',');
            return;
        }

        quantiaResultInput.value = "Convertendo...";
        
        const url = `https://api.frankfurter.app/latest?from=${origem}&to=${destino}&amount=${quantia}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Erro de rede ao buscar dados.');
            }
            const data = await response.json();

            const resultado = data.rates[destino];
            if (!resultado) {
                quantiaResultInput.value = "Erro: Moeda";
                return;
            }
            
            quantiaResultInput.value = resultado.toFixed(2).replace('.', ',');

        } catch (error) {
            console.error("Erro na chamada da API:", error);
            quantiaResultInput.value = "Erro";
        }
    }

    // 4. Definir a função para inverter as moedas
    function inverter() {
        const temp = moedaOrigemSelect.value;
        moedaOrigemSelect.value = moedaDestinoSelect.value;
        moedaDestinoSelect.value = temp;
        converter();
    }

    // 5. Faz uma conversão inicial quando a página carrega
    if (quantiaInput.value) {
        converter();
    }
});