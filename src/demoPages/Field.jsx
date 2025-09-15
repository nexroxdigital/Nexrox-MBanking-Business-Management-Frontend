export function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      {children}
    </label>
  );
}

// export function Field({ label, children }) {
//   return (
//     <label className="block">
//       <div className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
//         <span className="inline-flex items-center gap-2">
//           <span className="h-3 w-1 rounded bg-gradient-to-r from-[#862C8A] to-[#009C91]" />
//           {label}
//         </span>
//       </div>
//       {children}
//     </label>
//   );
// }
