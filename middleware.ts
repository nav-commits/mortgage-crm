// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token }) {
      // If token exists, user is authenticated
      return !!token;
    },
  },
});

// Protect all routes under /dashboard
export const config = { matcher: ["/dashboard/:path*"] };
