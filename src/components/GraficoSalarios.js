import React, { useRef } from 'react';
import { View, Button, Alert, StyleSheet, Dimensions } from 'react-native';
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system'; // Manejo de archivos
import * as Sharing from 'expo-sharing'; // Para compartir archivos
import { BarChart } from "react-native-chart-kit";
import { captureRef } from 'react-native-view-shot'; // Para capturar la vista

export default function GraficoSalarios({ dataSalarios }) {
  const chartRef = useRef(); // Referencia al gráfico

  const generarPDF = async () => {
    try {
      // Capturar el gráfico como imagen
      const uri = await captureRef(chartRef, {
        format: "png",
        quality: 1
      });

      // Crear una instancia de jsPDF
      const doc = new jsPDF();

      // Agregar título al PDF
      doc.text("Reporte de Salarios", 10, 10);

      // Agregar los datos al PDF
      dataSalarios.labels.forEach((label, index) => {
        const salario = dataSalarios.datasets[0].data[index];
        doc.text(`${label}: C$${salario}`, 10, 20 + index * 10); // Formato de los datos
      });

      // Salto de página para el gráfico (opcional)
      doc.addPage(); // Si quieres que el gráfico esté en una nueva página

      // Convertir la URI de la imagen a base64
      const imageBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64
      });

      // Agregar la imagen (gráfico) al PDF
      doc.addImage(`data:image/png;base64,${imageBase64}`, 'PNG', 10, 20, 180, 180); // Ajusta las coordenadas y tamaño de la imagen

      // Generar el PDF como base64
      const pdfBase64 = doc.output('datauristring').split(',')[1];

      // Definir la ruta temporal para el archivo PDF en el sistema de archivos del dispositivo
      const fileUri = `${FileSystem.documentDirectory}reporte_salarios.pdf`;

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
      <View ref={chartRef} style={styles.chartContainer}>
        <BarChart
          data={dataSalarios}
          width={screenWidth - (screenWidth * 0.1)}
          height={300}
          yAxisLabel="C$"
          chartConfig={{
            backgroundGradientFrom: "#00FFFF",
            backgroundGradientFromOpacity: 0.1,
            backgroundGradientTo: "#FFFFFF",
            backgroundGradientToOpacity: 1,
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            strokeWidth: 1,
            barPercentage: 0.5,
          }}
          style={{
            borderRadius: 10
          }}
          verticalLabelRotation={45}
          withHorizontalLabels={true}
          showValuesOnTopOfBars={true}
        />
      </View>

      {/* Botón para generar y compartir PDF */}
      <Button title="Generar y Compartir PDF" onPress={generarPDF} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 10
  },
  chartContainer: {
    borderRadius: 10,
    overflow: 'hidden'
  }
});
