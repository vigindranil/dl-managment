"use client";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><title>RTO suspension recommandations</title></head>
      <body className={`antialiased`}>

        <Provider store={store}>
          {children}
          <Toaster/>
        </Provider>
      </body>
    </html>
  );
}
