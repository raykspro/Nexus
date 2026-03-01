import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Dashboard from "./pages/dashboard";
import Transactions from "./pages/transactions";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/ezwallet/" component={Dashboard} />
        <Route path="/ezwallet/transactions" component={Transactions} />
        <Route>404 - Página não encontrada</Route>
      </Switch>
    </QueryClientProvider>
  );
}

export default App;
