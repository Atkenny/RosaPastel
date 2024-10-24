import React from 'react';
import { View, Button, Alert, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { ContributionGraph } from "react-native-chart-kit";
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system'; // Manejo de archivos
import * as Sharing from 'expo-sharing'; // Para compartir archivos

export default function GraficoReporteEnfermedades({ dataReporteEnfermedades }) {

  const screenWidth = Dimensions.get("window").width;
  const squareSize = 30;
  const numDays = 365;

  // Función para personalizar las etiquetas de los meses en el gráfico
  const getMonthLabel = (monthIndex) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months[monthIndex];
  };

  // Función que maneja el evento de presionar un cuadrado en el gráfico (un día específico)
  const handleDayPress = (day) => {
    Alert.alert(`Reportes`, `Fecha: ${day.date}\nCantidad: ${day.count}`);
  };

  // Función para generar y compartir el PDF
  const generarPDF = async () => {
    try {
      const doc = new jsPDF();
      doc.text("Reporte de Enfermedades", 10, 10);

      // Agregar datos al PDF
      dataReporteEnfermedades.forEach((dato, index) => {
        doc.text(`Fecha: ${dato.date} - Cantidad: ${dato.count}`, 10, 20 + index * 10);
      });

      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const fileUri = `${FileSystem.documentDirectory}reporte_enfermedades.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64
      });

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error al generar o compartir el PDF: ", error);
      Alert.alert('Error', 'No se pudo generar o compartir el PDF.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <ContributionGraph
          values={dataReporteEnfermedades}
          endDate={new Date("2017-12-30")}
          numDays={numDays}
          width={1680}
          height={300}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#f0f0f0",
            backgroundGradientTo: "#f0f0f0",
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            strokeWidth: 2,
          }}
          gutterSize={0.4}
          bgColor={"transparent"}
          squareSize={squareSize} 
          getMonthLabel={getMonthLabel} 
          onDayPress={handleDayPress}
          style={{
            borderRadius: 10,
          }}
        />
      </ScrollView>

      {/* Botón para generar y compartir el PDF */}
      <View style={styles.button}>
        <Button title="Generar y Compartir PDF" onPress={generarPDF} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  button: {
    marginTop: 10,
  },
});