import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  Dimensions,
} from "react-native";
import { ListItem, Avatar } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { db } from "../database/firebase.js";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import plus from "../assets/plus.png";
import MyModal from "../components/Modal.js";
import TouchableScale from "react-native-touchable-scale";
import { LinearGradient } from "expo-linear-gradient";
import fondo from "../assets/fondo3.jpg";
import { UserContext } from "../context/UserContext";
import { Button } from "@rneui/base";
import { auth } from "../database/firebase.js";
import { signOut } from "firebase/auth";
import Dialog from "react-native-dialog";

const heightY = Dimensions.get("window").height;
const VerAgenda = (props) => {
  const { user, setUser, loading, setLoading } = useContext(UserContext);
  const [persona, setPersona] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personainModal, setPersonainModal] = useState([]);
  const [ordenPrioridad, setordenPrioridad] = useState(true);
  const [alertVisible, setalertVisible] = useState(false);
  const [textAlert, settextAlert] = useState(false);

  useEffect(() => {
    const collectionRef = collection(db, user);
    const q = ordenPrioridad
      ? query(collectionRef, orderBy("Prioridad", "asc"))
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
  const handleDelete = async () => {
    if (textAlert == "confirmar") {
      try {
        settextAlert("");
        persona.map(async (persona) => {
          const docRef = doc(db, user, persona.id);
          await deleteDoc(docRef);
          console.log("Confirmado");
        });
        setLoading(false);
        setalertVisible(false);
      } catch (error) {
        Alert.alert(error);
        setLoading(false);
        setalertVisible(false);
      }
    }
  };

  const alertaConfirmacion = () => {
    Alert.alert(
      "Cerrando sesión",
      "¿Esta seguro?",
      [
        {
          text: "Confirmar",
          onPress: () => {
            setLoading(true);
            setUser(null);
            signOut(auth)
              .then(() => {
                setLoading(false);
                console.log("Sign-out successful");
              })
              .catch((error) => {
                setLoading(false);
                console.log(error);
              });
          },
        },
        { text: "Cancelar", onPress: () => console.log("canceled") },
      ],
      {
        cancelable: true,
      }
    );
  };
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
      <View style={styles.alertContainer}>
      <Dialog.Container
        visible={alertVisible}
        contentStyle={{ borderRadius: 20 }}
      >
        <Dialog.Title
        style={{fontSize: heightY * 0.030, color: 'black'}}
        >Reinicio de datos</Dialog.Title>
        <Dialog.Description
        style={{fontSize: heightY * 0.022, color: 'black'}}
        >
          Se borrarán todos los datos. Esta acción no se puede deshacer. Si está
          seguro escriba: confirmar
        </Dialog.Description>
        <Dialog.Input
          autoCapitalize="none"
          style={{ fontSize: heightY * 0.026, color: 'black' }}
          onChangeText={(value) => settextAlert(value.trim())}
        ></Dialog.Input>
        <Dialog.Button
          label="Cancelar"
          onPress={() => setalertVisible(false)}
        />
        <Dialog.Button label="Borrar" onPress={handleDelete} />
      </Dialog.Container>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.text}
          onPress={() => setordenPrioridad(!ordenPrioridad)}
        >
          <Text>
            {ordenPrioridad ? "Ordenar por apellido" : "Ordenar por prioridad"}
          </Text>
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
                style={styles.listacontainer}
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
                  <Avatar size={45} rounded title={persona.Prioridad} />

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
        <View style={styles.iconview}>
          <Image source={plus} style={styles.icon}></Image>
        </View>
      </TouchableOpacity>
      <Button
        containerStyle={styles.button}
        color="rgb(221, 83, 83)"
        onPress={() => alertaConfirmacion()}
      >
        {" "}
        Cerrar sesión{" "}
      </Button>
      <Button
        containerStyle={styles.button2}
        color="rgb(221, 83, 83)"
        onPress={() => setalertVisible(true)}
      >
        {" "}
        Reiniciar{" "}
      </Button>
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
    maxHeight: "87%",
    backgroundColor: "transparent",
  },
  alertContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
    bottom: 0,
    position: "absolute",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  iconview: {
    width: 55,
    height: 55,
    backgroundColor: "gray",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    bottom: 14,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: "white",
  },
  text: {
    alignItems: "flex-end",
    width: "96%",
  },
  title: {
    fontSize: heightY * 0.026,
    fontWeight: "500",
  },
  listacontainer: {
    borderRadius: 35,
    marginTop: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  button: {
    left: 10,
    right: 0,
    top: "91%",
    bottom: 0,
    position: "absolute",
    borderRadius: 50,
    width: "33%",
    height: 46,
    backgroundColor: "rgb(221, 83, 83)",
    alignContent: "center",
    alignSelf: "center",
    textAlignVertical: "center",
    alignItems: "center",
  },
  button2: {
    left: "43.5%",
    right: 0,
    top: "91%",
    bottom: 0,
    position: "absolute",
    borderRadius: 50,
    width: "33%",
    height: 46,
    backgroundColor: "rgb(221, 83, 83)",
  },
});

export default VerAgenda;
