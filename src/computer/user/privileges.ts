/**
 * @file Declares privileges for the computer class
 */

/**
 * Represents privileges for the computer class. 0 is the lowest, etc
 */
export enum Privileges {
    User = 0,
    Admin = 1,
    Root = 2,
}

/**
 * Checks if a privilege is greater than or equal to another
 * @param privilege - The privilege to check
 * @param required - The required privilege
 * @returns If the privilege is greater than or equal to the required
 */
export function checkPrivilege(privilege: Privileges, required: Privileges): boolean {
    return privilege >= required;
}
