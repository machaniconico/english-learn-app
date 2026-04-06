import { lazy } from 'react'
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
const ErrorCorrectionPage = lazy(() => import('./pages/ErrorCorrectionPage'))
const DictationPage = lazy(() => import('./pages/DictationPage'))
const ProgressPage = lazy(() => import('./pages/ProgressPage'))
const StudyGuide = lazy(() => import('./pages/StudyGuide'))
const ScoreEstimator = lazy(() => import('./pages/ScoreEstimator'))
const MatchingGamePage = lazy(() => import('./pages/MatchingGamePage'))
const ReorderPage = lazy(() => import('./pages/ReorderPage'))
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'))
const DailyChallengePage = lazy(() => import('./pages/DailyChallengePage'))
const Part1Page = lazy(() => import('./pages/Part1Page'))
const Part2Page = lazy(() => import('./pages/Part2Page'))
const Part3Page = lazy(() => import('./pages/Part3Page'))
const Part4Page = lazy(() => import('./pages/Part4Page'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const WeakPointsPage = lazy(() => import('./pages/WeakPointsPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const SRSPage = lazy(() => import('./pages/SRSPage'))
const WeeklyReport = lazy(() => import('./pages/WeeklyReport'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/toeic-practice" element={<FillInBlankPage />} />
        <Route path="/toeic-practice/:setId" element={<FillInBlankPage />} />
        <Route path="/reading-practice" element={<ReadingPracticePage />} />
        <Route path="/reading-practice/:passageId" element={<ReadingPracticePage />} />
        <Route path="/error-correction" element={<ErrorCorrectionPage />} />
        <Route path="/error-correction/:setId" element={<ErrorCorrectionPage />} />
        <Route path="/dictation" element={<DictationPage />} />
        <Route path="/dictation/:setId" element={<DictationPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/study-guide" element={<StudyGuide />} />
        <Route path="/score" element={<ScoreEstimator />} />
        <Route path="/matching" element={<MatchingGamePage />} />
        <Route path="/matching/:sectionId/:categoryId" element={<MatchingGamePage />} />
        <Route path="/reorder" element={<ReorderPage />} />
        <Route path="/reorder/:setId" element={<ReorderPage />} />
        <Route path="/part1-listening" element={<Part1Page />} />
        <Route path="/part1-listening/:setId" element={<Part1Page />} />
        <Route path="/part2-listening" element={<Part2Page />} />
        <Route path="/part2-listening/:setId" element={<Part2Page />} />
        <Route path="/part3-listening" element={<Part3Page />} />
        <Route path="/part4-listening" element={<Part4Page />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/weak-points" element={<WeakPointsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/srs" element={<SRSPage />} />
        <Route path="/weekly-report" element={<WeeklyReport />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/daily" element={<DailyChallengePage />} />
        <Route path="/section/:sectionId" element={<CategoryList />} />
        <Route path="/section/:sectionId/:categoryId" element={<LessonList />} />
        <Route path="/section/:sectionId/:categoryId/:lessonId" element={<LessonPage />} />
        <Route path="/section/:sectionId/:categoryId/:lessonId/flashcard" element={<FlashcardPage />} />
        <Route path="/section/:sectionId/:categoryId/:lessonId/quiz" element={<QuizPage />} />
      </Route>
    </Routes>
  )
}
