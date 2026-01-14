import { useSearchParams } from "react-router";

import { useAuthTokenQuery } from "@/hooks/queries/useAuthTokenQuery";

export const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  useAuthTokenQuery(code);

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto" />
        <p className="text-gray-600">로그인 중...</p>
      </div>
    </div>
  );
};
