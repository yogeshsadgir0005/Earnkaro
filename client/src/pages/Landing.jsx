import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <>
      <header className="bg-black p-4 border-b border-gray-800 flex justify-between items-center transition-all duration-300 ease-in-out">
        <div className="text-white text-xl font-bold">
          Skill<span className="text-blue-500">Mint</span>
        </div>
        <nav className="hidden md:flex gap-6 text-white text-sm font-medium">
          <Link to="/home" className="hover:text-blue-400 transition duration-200">Home</Link>
          <Link to="/earn" className="hover:text-blue-400 transition duration-200">Earn</Link>
          <Link to="/leaderboard" className="hover:text-blue-400 transition duration-200">Leaderboard</Link>
          <Link to="/referrals" className="hover:text-blue-400 transition duration-200">Referrals</Link>
        </nav>
        <Link to="/profile">
          <button className="bg-blue-600 hover:bg-blue-700 transition duration-300 text-white rounded-full px-4 py-1 text-sm font-medium">
            👤 Profile
          </button>
        </Link>
      </header>

      <div className="bg-yellow-300 text-black text-center font-semibold p-2 text-sm transition-all duration-300 ease-in-out">
        Join a platform where students and graduates find real tasks, land internships, and earn while building valuable skills
      </div>

      <main className="bg-black text-white min-h-screen p-6 grid md:grid-cols-2 gap-10 items-center transition-all duration-300 ease-in-out">
        <div>
          <p className="text-blue-400 uppercase text-xs tracking-wide font-semibold mb-2 transition-all duration-300">
            Make your time worth something
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 transition-all duration-300">
            YOUR SKILLS <br />
            <span className="inline-block border-b-4 border-yellow-400 pb-1">
              DESERVE A PAYCHECK
            </span>
          </h1>
          <p className="text-gray-300 mb-6 text-sm transition-opacity duration-300 ease-in-out">
            One platform. Endless opportunities. Explore paid tasks and internships made for you.
          </p>
          <Link to="/signup">
            <button className="bg-yellow-400 hover:bg-yellow-300 transition duration-300 text-black font-bold px-6 py-2 rounded-full shadow-lg">
              🚀 Get Started
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden bg-blue-600 h-36 shadow-md transition-transform duration-500 hover:scale-105"></div>
          <div className="rounded-2xl overflow-hidden bg-red-500 h-36 shadow-md transition-transform duration-500 hover:scale-105"></div>
          <div className="rounded-2xl overflow-hidden bg-yellow-400 h-36 shadow-md transition-transform duration-500 hover:scale-105"></div>
          <div className="rounded-2xl overflow-hidden bg-gray-700 h-36 shadow-md transition-transform duration-500 hover:scale-105"></div>
        </div>
      </main>
    </>
  );
}
