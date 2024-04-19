
function obterInformacoes() {
    var informacoes = {};
    var nome = document.getElementById('nome').value;
    var idade = document.getElementById('idade').value;
    var cidade = document.getElementById('cidade').value;

    informacoes['nome'] = nome;
    informacoes['idade'] = idade;
    informacoes['cidade'] = cidade;

    return informacoes; 
}

function verificarCamposVazios(informacoes) {
    for (var chave in informacoes) {
        if (informacoes[chave] === "") {
            return true; 
        }
    }
    return false; 
}

function enviarFormulario() {
    var informacoes = obterInformacoes(); 
    var camposVazios = verificarCamposVazios(informacoes); 

    if (camposVazios) {
        alert("Por favor, preencha todos os campos!"); 
    } else {
        fetch('/informacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(informacoes)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar dados para o servidor.');
            }
            return response.json();
        })
        .then(data => {
            console.log("Resposta do servidor:", data);
            // Aqui você pode atualizar a interface do usuário conforme necessário
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }
}
