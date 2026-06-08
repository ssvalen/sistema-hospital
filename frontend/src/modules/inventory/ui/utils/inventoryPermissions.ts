export const INVENTORY_PERMISSIONS = {
    MODULE_ACCESS: 'inventory.module',
    INVENTORY_CREATE: 'inventory.create',
    INVENTORY_EDIT: 'inventory.edit',
    STORE_CREATE: 'store.create',
    STORE_EDIT: 'store.edit'
} as const

export type InventoryPermission =
    typeof INVENTORY_PERMISSIONS[keyof typeof INVENTORY_PERMISSIONS]