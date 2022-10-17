import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { ListItem, Avatar } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { db } from "../database/firebase.js";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import plus from "../assets/plus.png";
import MyModal from "../components/Modal.js";
import TouchableScale from "react-native-touchable-scale";
import { LinearGradient } from "expo-linear-gradient";

const VerAgenda = (props) => {
  const [persona, setPersona] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personainModal, setPersonainModal] = useState([]);
  const [ordenPrioridad, setordenPrioridad] = useState(true);

  useEffect(() => {
    const collectionRef = collection(db, "Personal");
    const q = ordenPrioridad ? 
      query(collectionRef, orderBy("Prioridad", "asc")) 
      : query(collectionRef, orderBy("Apellido", "asc"));
    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      setPersona(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          Apellido: doc.data().Apellido,
          Nombre: doc.data().Nombre,
          Telefono: doc.data().Telefono,
          Telefono2: doc.data().Telefono2,
          Prioridad: doc.data().Prioridad,
          Trabajando: doc.data().Trabajando,
          Comentario: doc.data().Comentario,
          createdAt: doc.data().createdAt,
        }))
      );
      setLoading(false);
    });
    return unsuscribe;
  }, [ordenPrioridad]);
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.text}
          onPress={() => setordenPrioridad(!ordenPrioridad) }
        >
          <Text>{ordenPrioridad ? "Ordenar por apellido" : "Ordenar por prioridad" }</Text>
        </TouchableOpacity>
        <ScrollView>
          {persona?.map((persona) => {
            return (
              <LinearGradient
                key={persona.id}
                colors={
                  !persona.Trabajando
                    ? ["green", "lightgreen"]
                    : ["rgb(221, 83, 83)", "rgb(237, 219, 192)"]
                }
                style={styles.button}
              >
                <ListItem
                  key={persona.id}
                  containerStyle={styles.lista}
                  onPress={() => {
                    setPersonainModal(persona);
                    setIsModalOpen(!isModalOpen);
                  }}
                  Component={TouchableScale}
                  friction={90}
                  tension={100}
                  activeScale={0.95}
                >
                  <Avatar
                    size={45}
                    rounded
                    title={persona.Prioridad}
                  />

                  <ListItem.Content>
                    <ListItem.Title style={styles.title}>
                      {persona.Apellido}, {persona.Nombre}
                    </ListItem.Title>
                    {persona.Comentario && (
                      <ListItem.Subtitle>
                        Comentario: {persona.Comentario}
                      </ListItem.Subtitle>
                    )}
                  </ListItem.Content>
                </ListItem>
              </LinearGradient>
            );
          })}
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate("NuevoContacto", {
            TotalPersonas: persona.length,
          })
        }
        style={styles.iconcontainer}
      >
        <View style={styles.icon}>
          <Image
            source={plus}
            style={{
              width: 22,
              height: 22,
              tintColor: "white",
            }}
          ></Image>
        </View>
      </TouchableOpacity>
      <MyModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        personainModal={personainModal}
        props={props}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    maxHeight: "85%",
  },
  lista: {
    marginTop: 0,
    alignContent: "center",
    marginStart: 10,
    marginEnd: 10,
    backgroundColor: "transparent",
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
  iconcontainer: {
    left: "83%",
    right: 10,
    top: "90%",
    bottom: 0,
    position: "absolute",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: 60,
    height: 80,
  },
  icon: {
    width: 55,
    height: 55,
    backgroundColor: "gray",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    bottom: 20,
  },
  text: {
    alignItems: "flex-end",
    width: "96%",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },

  button: {
    borderRadius: 35,
    marginTop: 5,
  },
});

export default VerAgenda;
