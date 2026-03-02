import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/layout";
import Dashboard from "./pages/dashboard";
import Transactions from "./pages/transactions";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* O segredo para o Senhor acessar o app pelo link do GitHub Pages */}
      <Router base="/EZwallet">
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/transactions" component={Transactions} />
            {/* Rota de fallback caso o Senhor tente acessar um caminho inexistente */}
            <Route>
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 gap-4">
                <span className="text-4xl">⚠️</span>
                <p className="font-bold">Página não encontrada, mestre.</p>
              </div>
            </Route>
          </Switch>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}
