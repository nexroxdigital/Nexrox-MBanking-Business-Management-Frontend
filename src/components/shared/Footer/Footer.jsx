function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 dark:border-t dark:border-gray-700">
      <div className="container mx-auto  p-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center">
        {/* Logo / Brand */}
        {/* <div className="text-lg font-semibold text-white">S.N It Point</div> */}

        {/* Copyright */}
        <div className="mt-4 md:mt-0 text-sm text-gray-400">
          © {new Date().getFullYear()} S.N It Point. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
