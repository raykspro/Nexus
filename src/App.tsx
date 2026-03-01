import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./pages/dashboard";
import Transactions from "./pages/transactions";
import Layout from "./components/layout";

function Router() {
  return (
    <Layout>
      <Switch>
        {/* As rotas agora conversam com o link do GitHub Pages do Senhor */}
        <Route path="/" component={Dashboard} />
        <Route path="/transactions" component={Transactions} />
        <Route>404 - Mestre, esta página não existe.</Route>
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
