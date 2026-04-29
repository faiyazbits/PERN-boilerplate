import { allRoles } from '@haber/shared';

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

export { roleRights, roles };
