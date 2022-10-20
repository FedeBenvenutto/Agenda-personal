import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../database/firebase.js";
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { Button } from "@rneui/themed";
import Formulario from "../components/Formulario.js";
import { UserContext } from "../context/UserContext";
import fondo from "../assets/fondo3.jpg";

const heightY = Dimensions.get("window").height;
const ContactoDetalle = (props) => {
  const { user, setUser } = useContext(UserContext);
  const [persona, setPersona] = useState({
    Apellido: "",
    Nombre: "",
    Telefono: "",
    Telefono2: "",
    Prioridad: 0,
    Trabajando: true,
    Comentario: "",
  });

  const [loading, setLoading] = useState(true);

  const getPersonaById = async (id) => {
    const docRef = doc(db, user, id);
    await getDoc(docRef).then((doc) => {
      const persona = doc.data();
      setPersona({
        ...persona,
        Prioridad: String(persona.Prioridad),
        id: doc.id,
      });
      setLoading(false);
    });
  };

  const borrarPersona = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, user, props.route.params.personaId);
      await deleteDoc(docRef);
      setLoading(false);
      Alert.alert("", "Borrado");
      props.navigation.navigate("VerAgenda");
    } catch (e) {
      alert(e);
    }
  };

  const alertaConfirmacion = () => {
    Alert.alert(
      "Eliminando persona",
      "¿Esta seguro?",
      [
        { text: "Confirmar", onPress: () => borrarPersona() },
        { text: "Cancelar", onPress: () => console.log("canceled") },
      ],
      {
        cancelable: true,
      }
    );
  };

  const actualizarPersona = async () => {
    let prioridad = Number(persona.Prioridad);
    if (!prioridad || prioridad < -99 || prioridad > 999) {
      Alert.alert(
        "",
        "El número de prioridad no es correcto, debe ser mayor a -100 y menor a 1000"
      );
    } else if (!persona.Apellido || !persona.Nombre) {
      Alert.alert("", "Complete todos los campos");
    } else
      try {
        setLoading(true);
        const docRef = doc(db, user, props.route.params.personaId);
        const data = {
          Apellido: persona.Apellido,
          Nombre: persona.Nombre,
          Telefono: persona.Telefono,
          Telefono2: persona.Telefono2,
          Prioridad: prioridad,
          Trabajando: persona.Trabajando,
          Comentario: persona.Comentario,
          createdAt: new Date(),
        };
        await setDoc(docRef, data);
        setLoading(false);
        Alert.alert("", "Actualizado");
        props.navigation.navigate("VerAgenda");
      } catch (e) {
        alert(e);
      }
  };

  useEffect(() => {
    getPersonaById(props.route.params.personaId);
  }, []);
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <>
      <Image source={fondo} style={[styles.image, StyleSheet.absoluteFill]} />
      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>DETALLE CONTACTO</Text>
        <Formulario persona={persona} setPersona={setPersona} />
        <View style={styles.buttton}>
          <Button
            containerStyle={styles.buttton}
            title="Actualizar"
            onPress={() => actualizarPersona()}
            color="#8FBC8F"
          />
        </View>
        <View style={styles.buttton}>
          <Button
            containerStyle={styles.buttton}
            title="Eliminar"
            buttonStyle={{ backgroundColor: "orangered" }}
            onPress={() => {
              alertaConfirmacion();
            }}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.3,
  },
  titulo: {
    marginTop: 20,
    alignItems: "center",
    fontSize: heightY * 0.04,
    justifyContent: "center",
    textAlign: "center",
    color: "blue",
    marginBottom: 50,
    fontWeight: "bold",
    color: "#7c917f",
  },
  container: {},
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  buttton: {
    width: "88%",
    alignContent: "center",
    marginTop: 10,
    marginStart: 25,
    borderRadius: 15,
  },
});

export default ContactoDetalle;
