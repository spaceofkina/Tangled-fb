import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "JSONPlaceholder",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Check for admin first
        if (credentials.email === 'admin@admin.com' && 
            credentials.password === 'admin123') {
          return {
            id: 'admin-1',
            name: 'Admin User',
            email: 'admin@admin.com',
            isAdmin: true
          };
        }

        // 2. Check JSONPlaceholder users
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/users');
          if (!response.ok) throw new Error('Failed to fetch users');
          
          const users = await response.json();
          const user = users.find(u => 
            u.email.toLowerCase() === credentials.email.toLowerCase() && 
            u.username.toLowerCase() === credentials.password.toLowerCase()
          );

          if (!user) return null;
          
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            isAdmin: false
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],

  callbacks: {
    async session({ session, token, user }) {
      // For Google users
      if (token.provider === 'google') {
        session.user.tag = session.user.name.split(" ").join("").toLocaleLowerCase();
        session.user.uid = token.sub;
        session.user.isAdmin = false;
      }
      
      // For credential users
      if (token.isAdmin !== undefined) {
        session.user.isAdmin = token.isAdmin;
      }
      
      return session;
    },
    
    async jwt({ token, user, account }) {
      // Persist provider and admin status
      if (account) {
        token.provider = account.provider;
      }
      if (user?.isAdmin !== undefined) {
        token.isAdmin = user.isAdmin;
      }
      
      return token;
    }
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);