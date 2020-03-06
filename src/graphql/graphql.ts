
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CopyrightType {
    id: string;
    name: string;
    owner: string;
}

export interface IQuery {
    copyrights(): CopyrightType[] | Promise<CopyrightType[]>;
}
