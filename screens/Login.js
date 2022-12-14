import React, { useState, useContext, useEffect } from "react";
import {
  Image,
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import fondo from "../assets/fondo3.jpg";
import { auth } from "../database/firebase";
import { UserContext } from "../context/UserContext";

const heightY = Dimensions.get("window").height;
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, loading, setLoading } = useContext(UserContext);
  useEffect(() => {
    setLoading(true);
    const unsubscribe = auth.onAuthStateChanged((data) => {
      if (data) {
        setUser(data.uid);
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleSignIn = () => {
    if (!email) {return Alert.alert("", "Ingrese el e-mail")}
    if (!password) {return Alert.alert("", "Ingrese la contraseña")}
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Signed in!");
        const user = userCredential.user;
        setUser(user.uid);
      })
      .catch((error) => {
        setLoading(false);
        let errorMessage = error.toString();
        console.log(errorMessage);
        if (
          errorMessage == "FirebaseError: Firebase: Error (auth/invalid-email)."
        ) {
          Alert.alert("", "Escriba correctamente el e-mail");
        } else if (
          errorMessage ==
          "FirebaseError: Firebase: Error (auth/user-not-found)."
        ) {
          Alert.alert("", "Usuario no encontrado");
        } else if (
          errorMessage ==
          "FirebaseError: Firebase: Error (auth/wrong-password)."
        ) {
          Alert.alert("", "Contraseña incorrecta");
        } else if (
          errorMessage ==
          "FirebaseError: Firebase: Error (auth/internal-error)."
        ) {
          Alert.alert("", "Se encontró un error inesperado. Por favor reintente");
        } else if (
          errorMessage ==
          "FirebaseError: Firebase: Error (auth/network-request-failed)."
        ) {
          Alert.alert("", "No se pudo conectar al servidor. Chequee su conexión a internet y reintente");
        } else {
          Alert.alert(errorMessage);
        }
      });
  };
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Image source={fondo} style={[styles.image, StyleSheet.absoluteFill]} />
      <ScrollView contentContainerStyle={styles.blurview}>
        <View style={styles.login}>
          <View>
            <Text style={styles.titulo}>Agenda personal Educativo</Text>
          </View>
          <View>
            <Text style={styles.tituloinput}>E-mail</Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text.trim())}
              style={styles.input}
              placeholder="E-mail"
              autoCapitalize="none"
            />
          </View>
          <View>
            <Text style={styles.tituloinput}>Contraseña</Text>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry={true}
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity onPress={handleSignIn} style={styles.button}>
            <Text style={styles.textbutton}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  blurview: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    fontSize: heightY * 0.04,
    fontWeight: "400",
    color: "black",
    marginBottom: 50,
    textAlign: "center",
  },
  tituloinput: {
    fontSize: heightY * 0.027,
    fontWeight: "400",
    color: "black",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.3,
  },
  login: {
    width: 350,
    height: 500,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#E5EBB230",
  },
  input: {
    width: 250,
    height: 40,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#ffffff90",
    marginBottom: 20,
    fontSize: heightY * 0.023,
  },
  button: {
    width: 250,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "#7c917f",
  },
  textbutton: {
    fontSize: heightY * 0.026,
    fontWeight: "400",
    color: "white",
  },
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});
