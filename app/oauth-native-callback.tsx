// import { useAuth } from "@clerk/clerk-expo";
// import { useRouter } from "expo-router";
// import { ActivityIndicator, View } from "react-native";
// import { useEffect } from "react";

// export default function OAuthNativeCallback() {
//   const { isLoaded, isSignedIn } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoaded) return; // Wait until Clerk is fully ready

//     if (isSignedIn) {
//       // Now safe to navigate
//       router.replace("/");
//     } else {
//       // Not signed in: maybe show error or redirect to login
//       router.replace("/LoginScreen");
//     }
//   }, [isLoaded, isSignedIn]);

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <ActivityIndicator size="large" />
//     </View>
//   );
// }

import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";

export default function OAuthNativeCallback() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.replace("/");
    } else {
      router.replace("/LoginScreen");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
