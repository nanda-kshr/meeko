# Meeko - A Learning-Focused Social Media Platform

Meeko is an open-source social media platform built with Next.js, designed to be a learning resource for developers interested in understanding modern web development practices, authentication flows, and social media features. This project intentionally contains some bugs and suboptimal practices to serve as a learning opportunity for developers to identify and fix common issues in web applications.

## 🎯 Purpose

Meeko serves multiple purposes:
- A practical example of a modern social media platform implementation
- A learning resource for identifying and fixing common web development issues
- A playground for experimenting with different web development patterns
- A starting point for developers to understand authentication, real-time updates, and social features

## 🚀 Features

- User authentication (Email & Google Sign-in)
- Personalized story feed
- Story creation and sharing
- User profiles
- Real-time updates
- Responsive design
- Dark/Light mode support

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **State Management**: React Context
- **Animations**: Framer Motion
- **AI Integration**: Google's Gemini AI

## 🐛 Known Issues & Learning Opportunities

This project intentionally contains several issues and suboptimal practices that serve as learning opportunities:

1. **Authentication Flow**
   - Inconsistent navigation after sign-in
   - Potential race conditions in auth state management
   - Cookie management improvements needed

2. **State Management**
   - Over-reliance on context for global state
   - Potential performance issues with frequent re-renders
   - Missing proper loading states

3. **Code Organization**
   - Inconsistent file structure
   - Mixed usage of client and server components
   - Missing proper error boundaries

4. **Performance**
   - Unoptimized image loading
   - Missing proper caching strategies
   - Potential memory leaks in real-time listeners

## 🤝 Contributing

We welcome contributions! This is a perfect project for:
- Developers learning Next.js
- Those wanting to understand social media platform architecture
- Anyone interested in fixing real-world bugs
- Developers looking to improve their code review skills

### How to Contribute

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Open a Pull Request

### Areas for Contribution

1. **Bug Fixes**
   - Fix authentication flow issues
   - Resolve navigation problems
   - Address state management inconsistencies

2. **Feature Improvements**
   - Add proper error handling
   - Implement better loading states
   - Improve performance optimizations

3. **Code Quality**
   - Add proper TypeScript types
   - Implement proper testing
   - Improve code organization

4. **Documentation**
   - Add inline code comments
   - Improve README sections
   - Create contribution guidelines

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/nanda-kshr/meeko.git
   ```

2. Install dependencies:
   ```bash
   cd meeko
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   AI_KEY=your_gemini_ai_key
   ADMIN_PASS=your_admin_password
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase team for the powerful backend services
- All contributors who help improve this project

---

Remember: This project is intentionally imperfect to serve as a learning resource. Every bug is an opportunity to learn, and every contribution helps make the project better for everyone!
