import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/layout";
import Dashboard from "./pages/dashboard";
import Transactions from "./pages/transactions";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router base="/EZwallet">
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/transactions" component={Transactions} />
            <Route>
              <div className="flex items-center justify-center min-h-[50vh] text-slate-500">
                Página não encontrada, mestre.
              </div>
            </Route>
          </Switch>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}
