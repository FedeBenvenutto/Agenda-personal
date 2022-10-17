import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Button } from "@rneui/themed";
import { db } from "../database/firebase.js";
import { addDoc, collection } from "firebase/firestore";
import Toast from "react-native-toast-message";
import Formulario from "../components/Formulario.js";

const NuevoContacto = (props) => {
  const { height, width } = useWindowDimensions();
  const [TotalPersona, setTotalPersona] = useState(
    Number(props.route.params.TotalPersonas) + 1
  );
  const [persona, setPersona] = useState({
    Apellido: "",
    Nombre: "",
    Telefono: "",
    Telefono2: "",
    Prioridad: `${TotalPersona}`,
    Trabajando: false,
    Comentario: "",
  });
  const [loading, setLoading] = useState(false);
  const showToast = (nuevaPersona) => {
    Toast.show({
      type: "success",
      text1: `${nuevaPersona.Apellido}, ${nuevaPersona.Nombre} fue agregado!`,
    });
  };
  const saveNewPersona = async () => {
    let prioridad = Number(persona.Prioridad);
    let nuevaPersona = persona;
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
        setTotalPersona(TotalPersona + 1);
        setPersona({
          Apellido: "",
          Nombre: "",
          Telefono: "",
          Telefono2: "",
          Prioridad: `${TotalPersona + 1}`,
          Trabajando: false,
          Comentario: "",
        });
        const docRef = await addDoc(collection(db, "Personal"), {
          Apellido: nuevaPersona.Apellido,
          Nombre: nuevaPersona.Nombre,
          Telefono: nuevaPersona.Telefono,
          Telefono2: nuevaPersona.Telefono2,
          Prioridad: prioridad,
          Trabajando: nuevaPersona.Trabajando,
          Comentario: nuevaPersona.Comentario,
          createdAt: new Date(),
        });
        setLoading(false);
        showToast(nuevaPersona);
      } catch (e) {
        setLoading(false);
        alert(e);
      }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>INGRESO NUEVO CONTACTO</Text>
        <Formulario 
        persona={persona}
        setPersona={setPersona} />
        <View style={styles.buttton}>
          {loading ? (
            <Button
              containerStyle={styles.buttton}
              loading
              disabled
            />
          ) : (
            <Button
              containerStyle={styles.buttton}
              title="Agregar"
              onPress={() => saveNewPersona()}
              color="#8FBC8F"
            />
          )}
        </View>
        <View style={styles.buttton}></View>
      </ScrollView>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  titulo: {
    marginTop: 20,
    alignItems: "center",
    fontSize: 30,
    justifyContent: "center",
    textAlign: "center",
    color: "#7c917f",
    marginBottom: 30,
    fontWeight: "bold",
  },
  container: {},
  buttton: {
    width: "88%",
    alignContent: "center",
    marginTop: 20,
    marginStart: 25,
    borderRadius: 15,
  },
});

export default NuevoContacto;
