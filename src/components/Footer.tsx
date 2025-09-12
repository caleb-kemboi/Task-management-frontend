export default function Footer() {
  return (
    <footer className="bg-white border-t py-4 px-6 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} TaskManager. All rights reserved.
    </footer>
  );
}
