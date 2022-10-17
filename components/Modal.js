import * as React from "react";
import {
  Text,
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import llamada from "../assets/llamada.png";

export default function MyModal({
  isModalOpen,
  setIsModalOpen,
  personainModal,
  props,
}) {
  return (
    <Modal visible={isModalOpen} transparent={true} animationType={"slide"}>
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <Text style={styles.text2}>
            {personainModal.Apellido}, {personainModal.Nombre}
          </Text>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => Linking.openURL(`tel:${personainModal.Telefono}`)}
          >
            <Image source={llamada} style={styles.image} />
            <Text style={styles.text}>Tel fijo: {personainModal.Telefono}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => Linking.openURL(`tel:${personainModal.Telefono2}`)}
          >
            <Image source={llamada} style={styles.image} />
            <Text style={styles.text}>
              Tel celular: {personainModal.Telefono2}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsModalOpen(!setIsModalOpen);
              props.navigation.navigate("ContactoDetalle", {
                personaId: personainModal.id,
              });
            }}
          >
            <Text style={styles.text}>Actualizar/Eliminar </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsModalOpen(!setIsModalOpen)}>
            <Text style={styles.text3}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "gray",
    alignItems: "center",
    margin: 20,
    borderRadius: 16,
    paddingHorizontal: 30,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  text: {
    fontSize: 16,
    marginTop: 10,
    color: "white",
  },
  text2: {
    fontSize: 26,
    marginTop: 10,
    fontWeight: "500",
    marginBottom: 10,
    color: "white",
  },
  text3: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "500",
    marginBottom: 10,
    color: "white",
    width: "100%",
  },
  image: {
    width: 30,
    height: 30,
    marginTop: 10,
  },
});
