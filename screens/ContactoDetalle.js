import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../database/firebase.js";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Button } from "@rneui/themed";
import Formulario from "../components/Formulario.js";

const ContactoDetalle = (props) => {
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
    const docRef = doc(db, "Personal", id);
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
      const docRef = doc(db, "Personal", props.route.params.personaId);
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
        const docRef = doc(db, "Personal", props.route.params.personaId);
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
  const { height, width } = useWindowDimensions();
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>DETALLE CONTACTO</Text>
        <Formulario 
        persona={persona}
        setPersona={setPersona} />
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
  fechaDb: {
    position: "absolute",
    marginTop: 0,
    textAlign: "right",
    width: "100%",
    fontSize: 16,
  },
  titulo: {
    marginTop: 20,
    alignItems: "center",
    fontSize: 30,
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
  formulario: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    width: "49%",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
    minHeight: 60,
  },

  input2: {
    height: 50,
    borderWidth: 0.5,
    padding: 10,
    minWidth: "49%",
    fontSize: 15,
    borderRadius: 10,
    textAlign: "center",
  },
  input3: {
    height: 60,
    borderWidth: 0.5,
    padding: 10,
    width: "49%",
    fontSize: 15,
    borderRadius: 10,
    marginTop: 10,
    textAlign: "center",
  },
  buttton: {
    width: "88%",
    alignContent: "center",
    marginTop: 10,
    marginStart: 25,
    borderRadius: 15,
  },
  dropdown: {
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#444",
    borderRadius: 10,
    width: "49%",
    alignContent: "center",
    marginTop: 10,
  },
});

export default ContactoDetalle;
