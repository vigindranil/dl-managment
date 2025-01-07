// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export function useTokenAuthentication() {
//   const router = useRouter();
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const encryptedToken = sessionStorage.getItem("token");

//       if (!encryptedToken) {
//         router.push("/logout");
//       }
//     }
//   }, [router]);
// }
