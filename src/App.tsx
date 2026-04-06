import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CategoryList from './pages/CategoryList'
import LessonList from './pages/LessonList'
import LessonPage from './pages/LessonPage'
import FlashcardPage from './pages/FlashcardPage'
import QuizPage from './pages/QuizPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/section/:sectionId" element={<CategoryList />} />
        <Route path="/section/:sectionId/:categoryId" element={<LessonList />} />
        <Route path="/section/:sectionId/:categoryId/:lessonId" element={<LessonPage />} />
        <Route path="/section/:sectionId/:categoryId/:lessonId/flashcard" element={<FlashcardPage />} />
        <Route path="/section/:sectionId/:categoryId/:lessonId/quiz" element={<QuizPage />} />
      </Route>
    </Routes>
  )
}
