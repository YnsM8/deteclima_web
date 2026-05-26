import { DatabasePort } from '@/application/ports/output/DatabasePort';
import { supabaseAdmin } from '@/infrastructure/adapters/out/persistence/supabase/server';

export class SupabaseAdapter implements DatabasePort {
  async saveWeatherQuery(data: {
    lat: number;
    lon: number;
    locationName: string;
    dataJson: object;
  }): Promise<void> {
    // Demostración de procedimiento almacenado (Stored Procedure) desde el código GitHub
    const { error } = await supabaseAdmin.rpc('save_weather_query_sp', {
      p_lat: data.lat,
      p_lon: data.lon,
      p_location_name: data.locationName,
      p_data_json: data.dataJson,
    });

    if (error) throw new Error(`Supabase RPC error: ${error.message}`);
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
