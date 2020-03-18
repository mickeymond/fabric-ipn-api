
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface AuthorType {
    name: string;
    contribution: string;
    authorship: string;
    dateOfBirth: string;
    dateOfDeath: string;
    nationality: string;
}

export interface CopyrightType {
    id: string;
    title: string;
    altTitles: string[];
    authors: AuthorType[];
    creationDate: string;
    publicationDate: string;
}

export interface IQuery {
    copyrights(): CopyrightType[] | Promise<CopyrightType[]>;
}
