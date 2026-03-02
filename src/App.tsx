import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/layout";
import Dashboard from "./pages/dashboard";
import Transactions from "./pages/transactions";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Ajustado para o novo repositório Nexus */}
      <Router base="/Nexus">
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/transactions" component={Transactions} />
          </Switch>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}
