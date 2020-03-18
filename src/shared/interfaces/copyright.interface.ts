interface IAuthor {
  name: string;
  contribution: string;
  authorship: string;
  dateOfBirth: string;
  dateOfDeath: string;
  nationality: string;
}

export interface ICopyrightInput {
  title: string;
  altTitles: string[];
  contributions: string[];
  authors: IAuthor[];
  creationDate: string;
  publicationDate: string;
}

export interface ICopyrightType {
  id: string;
  title: string;
  altTitles: string[];
  contributions: string[];
  authors: IAuthor[];
  creationDate: string;
  publicationDate: string;
}