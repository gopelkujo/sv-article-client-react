import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AddNewPage } from '@/pages/AddNewPage';
import { AllPostsPage } from '@/pages/AllPostsPage';
import { EditPostPage } from '@/pages/EditPostPage';
import { PreviewPage } from '@/pages/PreviewPage';

/**
 * Root application: providers, router, and page routes.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/posts" replace />} />
          <Route path="posts" element={<AllPostsPage />} />
          <Route path="posts/new" element={<AddNewPage />} />
          <Route path="posts/:id/edit" element={<EditPostPage />} />
          <Route path="preview" element={<PreviewPage />} />
          <Route path="*" element={<Navigate to="/posts" replace />} />
        </Route>
      </Routes>
      <Toaster richColors closeButton position="bottom-right" />
    </BrowserRouter>
  );
}
