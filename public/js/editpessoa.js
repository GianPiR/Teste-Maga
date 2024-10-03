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

    document.getElementById("back-button").addEventListener("click", function() {
        window.location.href = "index.html";
    });
});

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

    createContato(pessoaId, tipo, descricao);
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
