# EZwallet
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finanças do Mestre</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root { --primary: #6366f1; --income: #10b981; --expense: #f43f5e; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; }
        body { font-family: 'Inter', system-ui, sans-serif; background-color: var(--bg); color: var(--text); display: flex; justify-content: center; padding: 20px; margin: 0; }
        .container { background: var(--card); padding: 2rem; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); width: 100%; max-width: 450px; }
        h2 { text-align: center; margin-bottom: 1.5rem; font-weight: 300; }
        .balance-card { background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 25px; border: 1px solid rgba(255, 255, 255, 0.1); }
        .balance-card h3 { margin: 0; font-size: 0.8rem; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; }
        .balance-card p { margin: 10px 0 0; font-size: 2rem; font-weight: 700; color: #fff; }
        canvas { margin-bottom: 25px; max-height: 180px; }
        .form-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 25px; }
        input, select { padding: 12px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; font-size: 1rem; }
        .btn-container { display: flex; gap: 10px; }
        .btn-action { flex: 1; padding: 12px; border-radius: 8px; border: none; cursor: pointer; font-weight: 700; color: white; }
        .btn-income { background-color: var(--income); }
        .btn-expense { background-color: var(--expense); }
        .transaction-list { margin-top: 20px; max-height: 250px; overflow-y: auto; }
        .item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; margin-bottom: 8px; border-left: 4px solid transparent; }
        .item.income { border-left-color: var(--income); }
        .item.expense { border-left-color: var(--expense); }
        .item-info { display: flex; flex-direction: column; }
        .item-desc { font-weight: 500; font-size: 0.95rem; }
        .item-details { font-size: 0.7rem; color: #94a3b8; margin-top: 2px; }
        .item-val { font-size: 0.9rem; font-weight: bold; }
        .del-btn { background: none; border: none; color: #475569; cursor: pointer; font-size: 1.2rem; padding-left: 10px; }
        .type-income { color: var(--income); }
        .type-expense { color: var(--expense); }
    </style>
</head>
<body>
<div class="container">
    <h2>Carteira do Mestre</h2>
    <div class="balance-card"><h3>Saldo Disponível</h3><p id="totalBalance">R$ 0,00</p></div>
    <canvas id="financeChart"></canvas>
    <div class="form-group">
        <input type="text" id="description" placeholder="Descrição">
        <input type="number" id="amount" placeholder="Valor R$">
        <select id="category">
            <option value="Pix">Pix</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Cartão de Débito">Cartão de Débito</option>
        </select>
        <div class="btn-container">
            <button class="btn-action btn-income" onclick="addTransaction('income')">RECEITA</button>
            <button class="btn-action btn-expense" onclick="addTransaction('expense')">DESPESA</button>
        </div>
    </div>
    <div class="transaction-list" id="list"></div>
</div>
<script>
    let transactions = JSON.parse(localStorage.getItem('mestre_finance_v4')) || [];
    let myChart = null;
    function updateApp() {
        const listEl = document.getElementById('list');
        const balanceEl = document.getElementById('totalBalance');
        listEl.innerHTML = '';
        let inc = 0, exp = 0;
        transactions.slice().reverse().forEach((t, i) => {
            const realIdx = transactions.length - 1 - i;
            if (t.type === 'income') inc += t.amount; else exp += t.amount;
            const div = document.createElement('div');
            div.className = `item ${t.type}`;
            div.innerHTML = `<div class="item-info"><span class="item-desc">${t.description}</span><span class="item-details">${t.date} | ${t.category}</span></div><div style="display:flex;align-items:center;gap:5px;"><span class="item-val ${t.type === 'income' ? 'type-income' : 'type-expense'}">${t.type === 'income' ? '+' : '-'} R$ ${t.amount.toFixed(2)}</span><button class="del-btn" onclick="removeTransaction(${realIdx})">×</button></div>`;
            listEl.appendChild(div);
        });
        const bal = inc - exp;
        balanceEl.innerText = `R$ ${bal.toFixed(2)}`;
        updateChart(inc, exp);
        localStorage.setItem('mestre_finance_v4', JSON.stringify(transactions));
    }
    function addTransaction(type) {
        const d = document.getElementById('description'), a = document.getElementById('amount'), c = document.getElementById('category');
        if (!d.value || !a.value) return alert("Preencha os campos!");
        const now = new Date();
        transactions.push({ description: d.value, amount: parseFloat(a.value), type: type, category: c.value, date: now.toLocaleDateString('pt-BR') });
        d.value = ''; a.value = ''; updateApp();
    }
    function removeTransaction(i) { if(confirm("Remover?")) { transactions.splice(i, 1); updateApp(); } }
    function updateChart(inc, exp) {
        const ctx = document.getElementById('financeChart').getContext('2d');
        if (myChart) myChart.destroy();
        myChart = new Chart(ctx, { type: 'doughnut', data: { labels: ['Receitas', 'Despesas'], datasets: [{ data: [inc, exp], backgroundColor: ['#10b981', '#f43f5e'], borderWidth: 0 }] }, options: { plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }, cutout: '75%' } });
    }
    updateApp();
</script>
</body>
</html>
