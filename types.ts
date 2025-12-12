export enum ArtistType {
  MALE = '男歌手',
  FEMALE = '女歌手',
  BAND = '樂隊/組合'
}

export enum Era {
  EIGHTIES = '80s',
  NINETIES = '90s',
  TWO_THOUSANDS = '00s'
}

export interface Song {
  title: string;
  artist: string;
  year: string;
  album: string;
  duration: string;
  coverDescription?: string;
  coverUrl?: string; // Added for real album art
}

export interface RadioState {
  artistType: ArtistType;
  era: Era;
  isOn: boolean;
  isTuning: boolean;
}
