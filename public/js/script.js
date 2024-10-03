document.addEventListener("DOMContentLoaded", function() {
    loadPessoas();

    document.getElementById("pessoa-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf").value;

        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('cpf', cpf);

        createPessoa(formData);
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

    document.getElementById("search-input").addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        loadPessoas(searchTerm)
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

function loadPessoas(nome) {
    fetch(nome ? `http://localhost:8081/list/pessoa?nome=${nome}` : 'http://localhost:8081/list/pessoa', {
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
