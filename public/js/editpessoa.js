document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        loadContatos(id);
        loadPessoa(id);
    }

    document.getElementById("edit-pessoa-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf").value;

        updatePessoa(id, nome, cpf);
    });
    
    document.getElementById("cpf").addEventListener("input", function() {
        const cpf = this.value;
        const errorElement = document.getElementById("error-message");
        errorElement.style.display = "none";
        
        const saveButton = document.getElementById("save-button");

        if (!validarCPF(cpf)) {
            saveButton.disabled = true;
            errorElement.innerText = "CPF inválido";
            errorElement.style.display = "block";
            
            return;
        }

        saveButton.disabled = false;
    });

    
    document.getElementById("tipo").addEventListener("input", function() {
        const tipo = this.value;
        const tipoFixed = tipo.replace(/[^a-zA-Z0-9 ]/g, '');

        const errorElement = document.getElementById("error-tipo");
        errorElement.style.display = "none";
        
        const saveButton = document.getElementById("save-button-contato");

        if (tipoFixed !== 'telefone' && tipoFixed !== 'email') {
            errorElement.innerText = "O tipo deve ser 'telefone' ou 'email'";
            errorElement.style.display = "block";
            saveButton.disabled = true;
            
            return;
        }

        saveButton.disabled = false;
    });

    document.getElementById("back-button").addEventListener("click", function() {
        window.location.href = "index.html";
    });
});

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11) {
        return false;
    }

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }

    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    
    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;
}

function loadPessoa(id) {
    fetch(`http://localhost:8081/get/pessoa/${id}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados da pessoa');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("pessoa-id").value = data.id;
        document.getElementById("nome").value = data.nome;
        document.getElementById("cpf").value = data.cpf;
        document.getElementById("pessoa-id-contato").value = data.id;
        document.getElementById("titulo-editar").textContent = `Editar ${data.nome}`;
    })
    .catch(error => {
        console.error('Erro ao buscar os dados da pessoa:', error);
    });
}

function updatePessoa(id, nome, cpf) {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('cpf', cpf);

    fetch(`http://localhost:8081/update/pessoa/${id}`, {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar a pessoa');
        }
        return response.json();
    })
    .then(data => {
        loadPessoa(data.id)
        document.getElementById("nome").value = data.nome;
        document.getElementById("cpf").value = data.cpf;
    })
    .catch(error => {
        console.error('Erro ao atualizar a pessoa:', error);
    });
}

document.getElementById("contato-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const pessoaId = document.getElementById("pessoa-id").value;
    const tipo = document.getElementById("tipo").value;
    const descricao = document.getElementById("descricao").value;

    createContato(pessoaId, tipo.replace(/[^a-zA-Z0-9 ]/g, ''), descricao);
});


function loadContatos(id) {
    fetch(`http://localhost:8081/list/contato/${id}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar os contatos');
        }
        return response.json();
    })
    .then(contatos => {
        renderContatos(contatos);
    })
    .catch(error => {
        console.error('Erro ao carregar contatos:', error);
    });
}

function createContato(pessoaId, tipo, descricao) {
    const formData = new FormData();

    formData.append('pessoa_id', pessoaId);
    formData.append('tipo', tipo);
    formData.append('descricao', descricao);

    fetch(`http://localhost:8081/create/contato`, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Contato adicionado:', data);
        loadContatos(pessoaId);
    })
    .catch(error => {
        console.error('Erro ao adicionar contato:', error);
    });
}

function renderContatos(contatos) {
    const contatoList = document.getElementById('contato-list');
    contatoList.innerHTML = '';

    contatos.forEach(contato => {
        const listItem = document.createElement('li');
        listItem.textContent = `${contato.tipo} - ${contato.descricao}`;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const editButton = createEditButton(contato.id, contato.pessoa_id);
        const deleteButton = createDeleteButton(contato.id, contato.pessoa_id);

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        listItem.appendChild(buttonContainer);
        contatoList.appendChild(listItem);
    });
}

function createEditButton(id, pessoa_id) {
    const button = document.createElement("button");
    button.textContent = "Editar";
    button.onclick = () => {
        window.location.href = `editcontato.html?id=${id}&pessoa_id=${pessoa_id}`;
    };
    return button;
}

function createDeleteButton(id, pessoa_id) {
    const button = document.createElement('button');
    button.textContent = 'Excluir';
    button.onclick = () => deleteContato(id, pessoa_id);
    return button;
}

function deleteContato(id, pessoa_id) {
    fetch(`http://localhost:8081/delete/contato/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao excluir contato');
        }
        loadContatos(pessoa_id);
    })
    .catch(error => {
        console.error('Erro ao excluir contato:', error);
    });
}
