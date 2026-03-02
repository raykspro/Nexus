import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/layout";
import Dashboard from "./pages/dashboard";
import Transactions from "./pages/transactions";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* CORREÇÃO: A base deve ser exatamente igual à definida no vite.config.ts */}
      <Router base="/Nexus">
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/transactions" component={Transactions} />
            {/* Rota de segurança: se o Senhor digitar algo errado, ele volta para a Home */}
            <Route>
               <Dashboard />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}
