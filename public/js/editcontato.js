document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const pessoaId = params.get('pessoa_id');

    if (id) {
        loadContato(id);
    }

    document.getElementById("edit-contato-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const tipo = document.getElementById("tipo").value;
        const descricao = document.getElementById("descricao").value;

        updateContato(id, tipo.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase(), descricao);
    });

    document.getElementById("tipo").addEventListener("input", function() {
        const tipo = this.value;
        const tipoFixed = tipo.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();

        const errorElement = document.getElementById("error-tipo");
        errorElement.style.display = "none";
        
        const saveButton = document.getElementById("save-button");

        if (tipoFixed !== 'telefone' && tipoFixed !== 'email') {
            errorElement.innerText = "O tipo deve ser 'telefone' ou 'email'";
            errorElement.style.display = "block";
            saveButton.disabled = true;
            
            return;
        }

        saveButton.disabled = false;
    });

    document.getElementById("back-button").addEventListener("click", function() {
        window.location.href = `editpessoa.html?id=${pessoaId}`;
    });
});

function loadContato(id) {
    fetch(`http://localhost:8081/get/contato/${id}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados do contato');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("contato-id").value = data.id;
        document.getElementById("tipo").value = data.tipo;
        document.getElementById("descricao").value = data.descricao;
    })
    .catch(error => {
        console.error('Erro ao buscar os dados do contato:', error);
    });
}

function updateContato(id, tipo, descricao) {
    const formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('descricao', descricao);

    fetch(`http://localhost:8081/update/contato/${id}`, {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar o contato');
        }
        return response.json();
    })
    .then(data => {
        console.log('Contato atualizada:', data);

        document.getElementById("tipo").value = data.tipo;
        document.getElementById("descricao").value = data.descricao;
    })
    .catch(error => {
        console.error('Erro ao atualizar o contato:', error);
    });
}