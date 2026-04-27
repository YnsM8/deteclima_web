import { DatabasePort } from '@/application/ports/output/DatabasePort';
import { supabaseAdmin } from '@/lib/supabase/server';

export class SupabaseAdapter implements DatabasePort {
  async saveWeatherQuery(data: {
    lat: number;
    lon: number;
    locationName: string;
    dataJson: object;
  }): Promise<void> {
    const { error } = await supabaseAdmin.from('weather_queries').insert({
      lat: data.lat,
      lon: data.lon,
      location_name: data.locationName,
      data_json: data.dataJson,
    });

    if (error) throw new Error(`Supabase error: ${error.message}`);
  }

  async saveChatMessage(data: {
    sessionId: string;
    role: string;
    content: string;
    weatherContext?: string;
  }): Promise<void> {
    const { error } = await supabaseAdmin.from('chat_messages').insert({
      session_id: data.sessionId,
      role: data.role,
      content: data.content,
      weather_context: data.weatherContext,
    });

    if (error) throw new Error(`Supabase error: ${error.message}`);
  }

  async savePrediction(data: {
    lat: number;
    lon: number;
    predictedData: object;
    metricsJson: object;
    modelVersion: string;
  }): Promise<void> {
    const { error } = await supabaseAdmin.from('predictions').insert({
      lat: data.lat,
      lon: data.lon,
      predicted_data: data.predictedData,
      metrics_json: data.metricsJson,
      model_version: data.modelVersion,
    });

    if (error) throw new Error(`Supabase error: ${error.message}`);
  }
}
