import React from 'react';
import Index from 'screens/index';
import QuizCards from 'screens/quizCards';
import SignIn from 'screens/signIn';
import SignUp from 'screens/signUp';
import NotFound from 'screens/notFound';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:license" element={<QuizCards />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
