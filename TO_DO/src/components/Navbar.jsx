export default function Navbar() {
  return (
    <nav className="bg-black p-4 w-full select-none">
      <div className=" flex justify-between items-center">
        <div className="text-white text-lg font-bold">ITask</div>
        <div className="flex gap-2.5">
          <a href="" className="text-gray-300 hover:text-white hover:font-bold mx-2 transition-all duration-75">Home</a>
          <a href="" className="text-gray-300 hover:text-white hover:font-bold mx-2 transition-all duration-75">Your Tasks</a>
        </div>
      </div>
    </nav>
  );
}