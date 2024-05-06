
/**
 * 
 * @param address 
 * @param index 
 * @returns 
 */
export const getMaskedAddress = (address: string, index = 6) => {
    return `${address.slice(0, index)}...${address.slice(-index)}`
}