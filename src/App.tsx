import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

const Home = lazy(() => import('./pages/Home'))
const Dictionary = lazy(() => import('./pages/Dictionary'))
const CategoryList = lazy(() => import('./pages/CategoryList'))
const LessonList = lazy(() => import('./pages/LessonList'))
const LessonPage = lazy(() => import('./pages/LessonPage'))
const FlashcardPage = lazy(() => import('./pages/FlashcardPage'))
const QuizPage = lazy(() => import('./pages/QuizPage'))
const FillInBlankPage = lazy(() => import('./pages/FillInBlankPage'))
const ReadingPracticePage = lazy(() => import('./pages/ReadingPracticePage'))
const ProgressPage = lazy(() => import('./pages/ProgressPage'))
const StudyGuide = lazy(() => import('./pages/StudyGuide'))

function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Suspense fallback={<Loading />}>
          <Route path="/" element={<Home />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/toeic-practice" element={<FillInBlankPage />} />
          <Route path="/toeic-practice/:setId" element={<FillInBlankPage />} />
          <Route path="/reading-practice" element={<ReadingPracticePage />} />
          <Route path="/reading-practice/:passageId" element={<ReadingPracticePage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/study-guide" element={<StudyGuide />} />
          <Route path="/section/:sectionId" element={<CategoryList />} />
          <Route path="/section/:sectionId/:categoryId" element={<LessonList />} />
          <Route path="/section/:sectionId/:categoryId/:lessonId" element={<LessonPage />} />
          <Route path="/section/:sectionId/:categoryId/:lessonId/flashcard" element={<FlashcardPage />} />
          <Route path="/section/:sectionId/:categoryId/:lessonId/quiz" element={<QuizPage />} />
        </Suspense>
      </Route>
    </Routes>
  )
}
