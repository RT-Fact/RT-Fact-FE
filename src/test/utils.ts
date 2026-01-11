import type { ReactElement, ReactNode } from "react";
import { createElement } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

const AllProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = createTestQueryClient();
  return createElement(QueryClientProvider, { client: queryClient }, children);
};

export const renderWithProviders = (ui: ReactElement) => {
  return render(ui, { wrapper: AllProviders });
};

export { createTestQueryClient };
