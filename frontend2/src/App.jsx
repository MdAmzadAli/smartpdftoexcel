
import React from "react";
import PdfToExcelPage from "./pdfToExcel";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import AdminLogin from './AdminLogin'


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
       <Router>
        <Routes>
          <Route path='/' element={<PdfToExcelPage />} />
          <Route path='/admin' element={<AdminLogin />} />
          {/* <Route path='/admin/dashboard' element={<AdminRoute><AdminDashboard /></AdminRoute>} /> */}
          {/* Add more routes as needed */}
        </Routes>
       </Router>
      </main>

      <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600">
        © 2025 Doc2Excel. All rights reserved.
      </footer>
    </div>
  );
}

export default App;