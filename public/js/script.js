document.addEventListener("DOMContentLoaded", function() {
    loadPessoas();

    document.getElementById("pessoa-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const id = document.getElementById("pessoa-id").value;
        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf").value;

        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('cpf', cpf);

        createPessoa(formData);
    });
});

function createPessoa(data) {
    fetch('http://localhost:8081/create/pessoa', {
        method: 'POST',
        body: data,
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Erro desconhecido');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.status && data.status === 'Erro') {
            throw new Error(data.message || 'Erro desconhecido');
        }
        console.log('Pessoa criada:', data);
        loadPessoas();
    })
    .catch((error) => {
        console.error('Erro ao criar a pessoa:', error);

        const errorElement = document.getElementById("error-message");
        errorElement.innerText = error.message;
        errorElement.style.display = "block";
    });
}

function loadPessoas() {
    fetch('http://localhost:8081/list/pessoa', {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao carregar a lista de pessoas');
        }
        return response.json();
    })
    .then(data => {
        console.log('Lista de pessoas:', data);
        renderPessoas(data);
    })
    .catch((error) => {
        console.error('Erro ao carregar pessoas:', error);
    });
}

function renderPessoas(pessoas) {
    const pessoaList = document.getElementById('pessoa-list');
    if (pessoaList) {
        pessoaList.innerHTML = '';

        pessoas.forEach(pessoa => {
            const listItem = document.createElement('li');

            listItem.textContent = `${pessoa.nome} - ${pessoa.cpf}`;

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            const editButton = createEditButton(pessoa.id);
            const deleteButton = createDeleteButton(pessoa.id);

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);
            listItem.appendChild(buttonContainer);
            pessoaList.appendChild(listItem);
        });
    } else {
        console.error("Elemento 'pessoa-list' não encontrado.");
    }
}

function createEditButton(id) {
    const button = document.createElement("button");
    button.textContent = "Editar";
    button.onclick = () => {
        window.location.href = `editpessoa.html?id=${id}`;
    };
    return button;
}


function createDeleteButton(id) {
    const button = document.createElement("button");
    button.textContent = "Deletar";
    button.onclick = () => deletePessoa(id);
    return button;
}

function deletePessoa(id) {
    fetch(`http://localhost:8081/delete/pessoa/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log('Pessoa deletada');
            loadPessoas();
        } else {
            console.error('Erro ao deletar a pessoa');
        }
    })
    .catch((error) => {
        console.error('Erro ao deletar a pessoa:', error);
    });
}
