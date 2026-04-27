export interface DatabasePort {
  saveWeatherQuery(data: {
    lat: number;
    lon: number;
    locationName: string;
    dataJson: object;
  }): Promise<void>;

  saveChatMessage(data: {
    sessionId: string;
    role: string;
    content: string;
    weatherContext?: string;
  }): Promise<void>;

  savePrediction(data: {
    lat: number;
    lon: number;
    predictedData: object;
    metricsJson: object;
    modelVersion: string;
  }): Promise<void>;
}
