import React from 'react';
import { View, Button, Alert, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from "react-native-chart-kit";
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system'; // Manejo de archivos
import * as Sharing from 'expo-sharing'; // Para compartir archivos

export default function GraficoGeneros({ dataGeneros }) {

  const generarPDF = async () => {
    try {
      // Crear una instancia de jsPDF
      const doc = new jsPDF();

      // Agregar título al PDF
      doc.text("Reporte de Géneros", 10, 10);

      // Agregar los datos al PDF
      dataGeneros.forEach((item, index) => {
        const { name, population } = item;
        doc.text(`${name}: ${population}`, 10, 20 + index * 10); // Formato de los datos
      });

      // Generar el PDF como base64
      const pdfBase64 = doc.output('datauristring').split(',')[1];

      // Definir la ruta temporal para el archivo PDF en el sistema de archivos del dispositivo
      const fileUri = `${FileSystem.documentDirectory}reporte_generos.pdf`;

      // Guardar el archivo PDF
      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64
      });

      // Compartir el archivo PDF
      await Sharing.shareAsync(fileUri);
      
    } catch (error) {
      console.error("Error al generar o compartir el PDF: ", error);
      Alert.alert('Error', 'No se pudo generar o compartir el PDF.');
    }
  };

  let screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <PieChart
        data={dataGeneros}
        width={screenWidth - (screenWidth * 0.1)}
        height={300}
        chartConfig={{
          backgroundColor: "#fff",  // Color de fondo (no afecta los cuadrados)
          backgroundGradientFrom: "#f0f0f0",  // Color inicial del gradiente
          backgroundGradientTo: "#f0f0f0",    // Color final del gradiente
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,  // Cambia los cuadrados del gráfico
        }}
        accessor={"population"}
        paddingLeft={45}
        backgroundColor={"transparent"}
        style={{
          borderRadius: 10
        }}
      />

      <View style={styles.button}>
        {/* Botón para generar y compartir PDF */}
        <Button title="Generar y Compartir PDF" onPress={generarPDF} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10
  },
  button: {
    marginTop: 10
  },
});
