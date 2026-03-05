import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Sincronia Total: Base ajustada para o padrão do repositório */}
      <Router base="/Nexus">
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/transactions" component={Transactions} />
            
            {/* Rota de Extração: Se o Senhor se perder, o Nexus o traz de volta à Home */}
            <Route>
              <Dashboard />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}
