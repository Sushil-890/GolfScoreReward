export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-4 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-500">
        <div>
          &copy; {new Date().getFullYear()} Digital Heroes. Built for Impact.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-green-600 transition">Terms</a>
          <a href="#" className="hover:text-green-600 transition">Privacy</a>
          <a href="#" className="hover:text-green-600 transition">Contact</a>
        </div>
      </div>
    </footer>
  );
}
