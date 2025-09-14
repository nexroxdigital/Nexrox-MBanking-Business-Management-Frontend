function GradientButton({ label, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-6 py-3 text-white font-medium shadow-md transition-all duration-300 bg-[linear-gradient(270deg,#862C8A_0%,#009C91_100%)] hover:bg-[linear-gradient(270deg,#bd0b76_0%,#862C8A_100%)] hover:scale-105"
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}

export default GradientButton;
