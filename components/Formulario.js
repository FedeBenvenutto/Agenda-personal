import React from "react";
import {
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Switch } from "react-native-switch";

const Formulario = ({persona, setPersona}) => {
    return (
    <>
    <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Apellido</Text>
          <TextInput
            style={styles.input2}
            name="Apellido"
            value={persona.Apellido}
            onChangeText={(value) =>
              setPersona({ ...persona, Apellido: value })
            }
          ></TextInput>
        </SafeAreaView>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Nombre</Text>
          <TextInput
            style={styles.input2}
            name="Nombre"
            value={persona.Nombre}
            onChangeText={(value) => setPersona({ ...persona, Nombre: value })}
          ></TextInput>
        </SafeAreaView>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Tel fijo</Text>
          <TextInput
            style={styles.input2}
            keyboardType="phone-pad"
            name="Telefono"
            value={persona.Telefono}
            onChangeText={(value) =>
              setPersona({ ...persona, Telefono: value })
            }
          ></TextInput>
        </SafeAreaView>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Tel celular </Text>
          <TextInput
            style={styles.input2}
            keyboardType="phone-pad"
            name="Telefono2"
            value={persona.Telefono2}
            onChangeText={(value) =>
              setPersona({ ...persona, Telefono2: value })
            }
          ></TextInput>
        </SafeAreaView>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Prioridad</Text>
          <TextInput
            style={styles.input2}
            keyboardType="numeric"
            name="Prioridad"
            value={persona.Prioridad}
            onChangeText={(value) =>
              setPersona({ ...persona, Prioridad: value })
            }
          ></TextInput>
        </SafeAreaView>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Trabajando</Text>
          <Switch
            value={persona.Trabajando}
            onValueChange={(value) =>
              setPersona({ ...persona, Trabajando: value })
            }
            activeText={"SI"}
            inActiveText={"NO"}
            circleSize={30}
            barHeight={30}
            circleBorderWidth={3}
            backgroundActive={"#7c917f"}
            backgroundInactive={"gray"}
            circleActiveColor={"#30a566"}
            circleInActiveColor={"#000000"}
            changeValueImmediately={true}
            renderActiveText={true}
            renderInActiveText={true}
            switchLeftPx={1}
            switchRightPx={1}
            switchWidthMultiplier={4}
            switchBorderRadius={30}
          />
        </SafeAreaView>
        <SafeAreaView style={styles.formulario}>
          <Text style={styles.text}> Comentario</Text>
          <TextInput
            style={styles.input3}
            multiline
            value={persona.Comentario}
            onChangeText={(value) =>
              setPersona({ ...persona, Comentario: value })
            }
          ></TextInput>
        </SafeAreaView>
        </>)
    }

    const styles = StyleSheet.create({
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
      });

    export default Formulario