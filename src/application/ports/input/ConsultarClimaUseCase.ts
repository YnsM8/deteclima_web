import { Clima } from '@/domain/entities';

export interface ConsultarClimaUseCase {
  execute(lat: number, lon: number): Promise<Clima>;
}
