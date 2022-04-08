export type Parser<T, J = any> = (entry: J) => T | undefined;

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
    [key: string]: string | null;
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
