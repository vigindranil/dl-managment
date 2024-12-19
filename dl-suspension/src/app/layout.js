"use client";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "react-redux";
import store from "@/redux/store";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><title>RTO suspension recommandations</title></head>
      <body className={`antialiased`}>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
