// Interfaces de modelos de datos para Rick and Morty

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  api_id: number;
  created_at: Date;
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode_code: string;
  api_id: number;
  created_at: Date;
}

export interface Character {
  id: number;
  api_id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin_id: number;
  location_id: number;
  image_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface CharacterComplete extends Character {
  origin: Location;
  location: Location;
  episodes: Episode[];
}

export interface CreateCharacterDTO {
  api_id?: number;
  name: string;
  status: string;
  species: string;
  type?: string;
  gender: string;
  origin: {
    name: string;
    type?: string;
    dimension?: string;
  };
  location: {
    name: string;
    type?: string;
    dimension?: string;
  };
  image_url?: string;
  episodes?: number[]; // Array de api_ids de episodios
}

export interface UpdateCharacterDTO {
  name?: string;
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
  image_url?: string;
}

export interface CharacterFilters {
  status?: string;
  species?: string;
  gender?: string;
  name?: string;
}
