export type Parser<T, J = any> = (
  entry: J,
  index: number,
  originalArr: J[]
) => T;

export interface System {
  id: string;
  label: string | null;
  description: string | null;
  extra?: {
    [key: string]: string;
  };
}

export interface Discussion {
  id: string;
  label: string | null;
  system: string;
  description: string | null;
  extra?: {
    [key: string]: string;
  };
}

export interface Comment {
  id: string;
  discussionId: string;
  system: string;
  date: string | null;
  content: string;
  extra?: {
    [key: string]: string;
  };
}
