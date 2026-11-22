
const formatarMoeda = (valor) => {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
};


// 1. CALCULADORA DE DESCONTOS

function calcularDesconto(preco, percentual) {
    const economia = preco * percentual / 100;
    const precoFinal = preco - economia;

    return {
        economia: economia,
        precoFinal: precoFinal
    };
}

document.getElementById("formDesconto").addEventListener("submit", function(event) {
    event.preventDefault();

    const preco = Number(document.getElementById("precoOriginal").value);
    const percentual = Number(document.getElementById("percentualDesconto").value);

    const resultado = document.getElementById("resultadoDesconto");

    if (!Number.isFinite(preco) || !Number.isFinite(percentual) ||
        preco <= 0 || percentual < 0 || percentual > 100) {
        resultado.textContent = "Informe um preço válido e um desconto entre 0 e 100%.";
        return;
    }

    const calculo = calcularDesconto(preco, percentual);

    resultado.innerHTML = `
        <strong>Resultado:</strong><br>
        Preço original: ${formatarMoeda(preco)}<br>
        Desconto: ${percentual}%<br>
        Valor economizado: ${formatarMoeda(calculo.economia)}<br>
        <strong>Preço final: ${formatarMoeda(calculo.precoFinal)}</strong>
    `;
});


// 2. CALCULADORA DE PARCELAS

function calcularParcelas(valorTotal, quantidade) {
    return valorTotal / quantidade;
}

document.getElementById("formParcelas").addEventListener("submit", function(event) {
    event.preventDefault();

    const valorTotal = Number(document.getElementById("valorCompra").value);
    const quantidade = Number(document.getElementById("quantidadeParcelas").value);

    const resultado = document.getElementById("resultadoParcelas");

    if (!Number.isFinite(valorTotal) || !Number.isFinite(quantidade) ||
        valorTotal <= 0 || !Number.isInteger(quantidade) || quantidade <= 0) {
        resultado.textContent = "Informe um valor de compra válido e uma quantidade inteira de parcelas maior que zero.";
        return;
    }

    const valorParcela = calcularParcelas(valorTotal, quantidade);

    resultado.innerHTML = `
        <strong>Resultado:</strong><br>
        Valor total: ${formatarMoeda(valorTotal)}<br>
        Quantidade de parcelas: ${quantidade}<br>
        <strong>Valor de cada parcela: ${formatarMoeda(valorParcela)}</strong>
    `;
});


// 3. SIMULADOR DE INVESTIMENTOS

function simularInvestimento(inicial, aporte, taxa, meses) {
    let saldo = inicial;

    for (let mes = 1; mes <= meses; mes++) {
        saldo = saldo + (saldo * taxa / 100);
        saldo = saldo + aporte;
    }

    const totalInvestido = inicial + (aporte * meses);
    const rendimento = saldo - totalInvestido;

    return {
        saldoFinal: saldo,
        totalInvestido: totalInvestido,
        rendimento: rendimento
    };
}

document.getElementById("formInvestimento").addEventListener("submit", function(event) {
    event.preventDefault();

    const inicial = Number(document.getElementById("investimentoInicial").value);
    const aporte = Number(document.getElementById("aporteMensal").value);
    const taxa = Number(document.getElementById("taxaRendimento").value);
    const meses = Number(document.getElementById("periodoInvestimento").value);

    const resultado = document.getElementById("resultadoInvestimento");

    if (!Number.isFinite(inicial) || !Number.isFinite(aporte) ||
        !Number.isFinite(taxa) || !Number.isFinite(meses) ||
        inicial < 0 || aporte < 0 || taxa < 0 ||
        !Number.isInteger(meses) || meses <= 0 ||
        inicial + aporte <= 0) {
        resultado.textContent = "Informe valores válidos. O período deve ser um número inteiro maior que zero.";
        return;
    }

    const simulacao = simularInvestimento(inicial, aporte, taxa, meses);

    resultado.innerHTML = `
        <strong>Resultado da simulação:</strong><br>
        Saldo final: ${formatarMoeda(simulacao.saldoFinal)}<br>
        Total investido: ${formatarMoeda(simulacao.totalInvestido)}<br>
        Rendimento obtido: ${formatarMoeda(simulacao.rendimento)}
    `;
});


// 4. DIVISOR DE DESPESAS

const despesas = [];

function calcularTotalDespesas(lista) {
    let total = 0;
    let indice = 0;

    if (lista.length > 0) {
        do {
            total = total + lista[indice].valor;
            indice++;
        } while (indice < lista.length);
    }

    return total;
}

function atualizarDespesas() {
    const lista = document.getElementById("listaDespesas");
    const resultado = document.getElementById("resultadoDespesas");
    const quantidadePessoas = Number(document.getElementById("quantidadePessoas").value);

    lista.innerHTML = "";

    despesas.forEach(function(despesa, indice) {
        const item = document.createElement("li");

        const texto = document.createElement("span");
        texto.textContent = despesa.descricao + " - " + formatarMoeda(despesa.valor);

        const botao = document.createElement("button");
        botao.type = "button";
        botao.textContent = "Remover";
        botao.dataset.indice = indice;

        item.appendChild(texto);
        item.appendChild(botao);

        lista.appendChild(item);
    });

    const total = calcularTotalDespesas(despesas);

    if (!Number.isInteger(quantidadePessoas) || quantidadePessoas <= 0) {
        resultado.textContent = "Informe uma quantidade de pessoas inteira e maior que zero.";
        return;
    }

    const valorPorPessoa = total / quantidadePessoas;

    resultado.innerHTML = `
        <strong>Resultado:</strong><br>
        Total das despesas: ${formatarMoeda(total)}<br>
        Quantidade de pessoas: ${quantidadePessoas}<br>
        <strong>Valor por pessoa: ${formatarMoeda(valorPorPessoa)}</strong>
    `;
}


// Adicionar despesas

document.getElementById("formDespesa").addEventListener("submit", function(event) {
    event.preventDefault();

    const descricao = document.getElementById("descricaoDespesa").value.trim();
    const valor = Number(document.getElementById("valorDespesa").value);

    if (descricao === "" || !Number.isFinite(valor) || valor <= 0) {
        alert("Informe uma descrição e um valor válido para a despesa.");
        return;
    }

    const novaDespesa = {
        descricao: descricao,
        valor: valor
    };

    despesas.push(novaDespesa);

    this.reset();

    atualizarDespesas();
});


// Remover despesas

document.getElementById("listaDespesas").addEventListener("click", function(event) {
    if (event.target.tagName === "BUTTON") {
        const indice = Number(event.target.dataset.indice);

        despesas.splice(indice, 1);

        atualizarDespesas();
    }
});


// Atualizar quando mudar a quantidade de pessoas

document.getElementById("quantidadePessoas").addEventListener("input", function() {
    atualizarDespesas();
});


// Apresentar o resultado inicial

atualizarDespesas();
