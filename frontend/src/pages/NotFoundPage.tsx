import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="section-shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-5xl font-bold">Page not found</h1>
      <p className="mt-4 text-slate-300">The page you are looking for does not exist.</p>
      <Link to="/" className="primary-button mt-8">Back to home</Link>
    </div>
  );
};

export default NotFoundPage;
