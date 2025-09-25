const API_URL = "http://localhost:3000/reservas";

const cursosMaterias = {
    "Engenharia de Software": ["Programação", "Banco de Dados", "Estrutura de Dados", "Redes", "Desenvolvimento Web", "IA", "Segurança"],
    "Administração": ["Administração Financeira", "Gestão de Pessoas", "Marketing", "Planejamento Estratégico", "Contabilidade", "Empreendedorismo", "Logística"],
    "Enfermagem": ["Anatomia", "Farmacologia", "Saúde Pública", "Cuidados", "Práticas Clínicas", "Ética"],
    "Matemática": ["Cálculo", "Álgebra Linear", "Estatística", "Geometria", "Matemática Aplicada", "Probabilidade"],
    "Química": ["Química Orgânica", "Química Inorgânica", "Físico-Química", "Química Analítica", "Laboratório", "Segurança"],
    "Filosofia": ["Filosofia Contemporânea", "Ética", "Lógica", "História", "Política", "Ciência"],
    "Direito": ["Constitucional", "Penal", "Civil", "Administrativo", "Trabalhista", "Empresarial"],
    "Medicina": ["Anatomia Humana", "Fisiologia", "Patologia", "Farmacologia", "Clínica", "Cirurgia", "Saúde Pública"],
    "Arquitetura": ["Desenho Técnico", "História da Arquitetura", "Materiais", "Planejamento Urbano", "Sustentabilidade", "Projeto"],
    "Ciências da Computação": ["Machine Learning", "IA", "Redes Neurais", "Ciência de Dados", "Nuvem", "Algoritmos"],
    "Psicologia": ["Clínica", "Desenvolvimento", "Psicopatologia", "Neuropsicologia", "Social", "Organizacional"]
};

const cursoSelect = document.getElementById("curso");
const materiaSelect = document.getElementById("materia");
const salaSelect = document.getElementById("sala");
const reservasTabela = document.getElementById("reservasTabela");
const formReserva = document.getElementById("formReserva");
const relatorioResultado = document.getElementById("relatorioResultado");

const salas = ["Laboratório 1", "Laboratório 2", "Sala 101", "Sala 102", "Laboratório Química", "Laboratório Física"];

function carregarCursos() {
    cursoSelect.innerHTML = "<option value=''>Selecione o curso</option>";
    Object.keys(cursosMaterias).forEach(curso => {
        let option = document.createElement("option");
        option.value = curso;
        option.textContent = curso;
        cursoSelect.appendChild(option);
    });
}

cursoSelect.addEventListener("change", () => {
    materiaSelect.innerHTML = "<option value=''>Selecione a matéria</option>";
    if (cursoSelect.value && cursosMaterias[cursoSelect.value]) {
        cursosMaterias[cursoSelect.value].forEach(materia => {
            let option = document.createElement("option");
            option.value = materia;
            option.textContent = materia;
            materiaSelect.appendChild(option);
        });
    }
});

function carregarSalas() {
    salaSelect.innerHTML = "<option value=''>Selecione a sala</option>";
    salas.forEach(sala => {
        let option = document.createElement("option");
        option.value = sala;
        option.textContent = sala;
        salaSelect.appendChild(option);
    });
}

async function mostrarReservas() {
    reservasTabela.innerHTML = "";
    const response = await fetch(API_URL);
    const reservas = await response.json();

    reservas.forEach((reserva, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${reserva.nome}</td>
            <td>${reserva.curso}</td>
            <td>${reserva.materia}</td>
            <td>${reserva.turma}</td>
            <td>${reserva.professor}</td>
            <td>${reserva.sala}</td>
            <td>${reserva.data}</td>
            <td>${reserva.hora}</td>
            <td><button onclick="removerReserva(${index})">Remover</button></td>
        `;
        reservasTabela.appendChild(tr);
    });
}

formReserva.addEventListener("submit", async (e) => {
    e.preventDefault();
    const novaReserva = {
        nome: document.getElementById("nome").value,
        curso: cursoSelect.value,
        materia: materiaSelect.value,
        turma: document.getElementById("turma").value,
        professor: document.getElementById("professor").value,
        sala: salaSelect.value,
        data: document.getElementById("data").value,
        hora: document.getElementById("hora").value
    };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaReserva)
    });

    mostrarReservas();
    formReserva.reset();
});

async function removerReserva(index) {
    await fetch(`${API_URL}/${index}`, { method: "DELETE" });
    mostrarReservas();
}

document.getElementById("gerarRelatorio").addEventListener("click", async () => {
    const response = await fetch(API_URL);
    const reservas = await response.json();

    let relatorio = {};
    reservas.forEach(r => {
        const chave = `${r.curso} - ${r.materia}`;
        relatorio[chave] = (relatorio[chave] || 0) + 1;
    });

    let html = "<ul>";
    for (let chave in relatorio) {
        html += `<li>${chave}: ${relatorio[chave]} reserva(s)</li>`;
    }
    html += "</ul>";
    relatorioResultado.innerHTML = html;

    const labels = Object.keys(relatorio);
    const dados = Object.values(relatorio);

    if (window.graficoRelatorio) window.graficoRelatorio.destroy();

    const ctx = document.getElementById("graficoRelatorio").getContext("2d");
    window.graficoRelatorio = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Reservas por Matéria",
                data: dados,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: "Reservas por Matéria" }
            },
            scales: { y: { beginAtZero: true } }
        }
    });
});

carregarCursos();
carregarSalas();
mostrarReservas();

