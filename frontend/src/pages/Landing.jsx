import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-green-600 text-white p-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Play Golf. Support Causes. Win Big.</h1>
        <p className="text-xl mb-8">
          Join the premier subscription platform combining your golf performance tracking 
          with monthly charitable giving and a robust draw-based reward engine.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-gray-100 transition">
            Start Your Journey
          </Link>
          <Link to="/login" className="bg-green-700 text-white px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-green-800 transition">
            Login
          </Link>
        </div>
      </div>
      
      <div className="p-12 grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="bg-green-100 text-green-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
          <h3 className="text-xl font-bold mb-2">Subscribe</h3>
          <p className="text-gray-600">Choose a monthly or yearly plan. A portion goes directly to the prize pool.</p>
        </div>
        <div className="text-center">
          <div className="bg-green-100 text-green-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
          <h3 className="text-xl font-bold mb-2">Track & Give</h3>
          <p className="text-gray-600">Log your latest 5 Stableford scores. Minimum 10% of your sub supports your chosen charity.</p>
        </div>
        <div className="text-center">
          <div className="bg-green-100 text-green-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
          <h3 className="text-xl font-bold mb-2">Win Prizes</h3>
          <p className="text-gray-600">Enter monthly draws. Match 3, 4, or 5 of your scores to win part of the growing prize pool!</p>
        </div>
      </div>
    </div>
  );
}
